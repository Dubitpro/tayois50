import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, where, startAfter, DocumentData, QueryDocumentSnapshot, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Message, ReactionType } from '../types/message';

export const MESSAGES_COLLECTION = 'messages';

export const getMessagesQuery = (pageSize: number, lastDoc: QueryDocumentSnapshot<DocumentData> | null, filterBy: string) => {
  let q;
  const messagesRef = collection(db, MESSAGES_COLLECTION);
  
  // Base queries depending on filter
  if (filterBy === 'Oldest') {
    q = query(messagesRef, orderBy('createdAtUnix', 'asc'), limit(pageSize));
  } else if (filterBy === 'Most Loved') {
    q = query(messagesRef, orderBy('heartReactions', 'desc'), limit(pageSize));
  } else if (filterBy === 'Pinned') {
    q = query(messagesRef, where('isPinned', '==', true), orderBy('createdAtUnix', 'desc'), limit(pageSize));
  } else {
    // Default: Newest
    q = query(messagesRef, orderBy('createdAtUnix', 'desc'), limit(pageSize));
  }

  // Add pagination if lastDoc exists
  if (lastDoc) {
    if (filterBy === 'Oldest') {
      q = query(messagesRef, orderBy('createdAtUnix', 'asc'), startAfter(lastDoc), limit(pageSize));
    } else if (filterBy === 'Most Loved') {
      q = query(messagesRef, orderBy('heartReactions', 'desc'), startAfter(lastDoc), limit(pageSize));
    } else if (filterBy === 'Pinned') {
      q = query(messagesRef, where('isPinned', '==', true), orderBy('createdAtUnix', 'desc'), startAfter(lastDoc), limit(pageSize));
    } else {
      q = query(messagesRef, orderBy('createdAtUnix', 'desc'), startAfter(lastDoc), limit(pageSize));
    }
  }

  return q;
};

// Rate limiting checking
export const canSubmitMessage = async (anonymousId: string): Promise<boolean> => {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where('anonymousId', '==', anonymousId)
  );
  const snapshot = await getDocs(q);
  const tenMinsAgo = Date.now() - 10 * 60 * 1000;
  let count = 0;
  snapshot.forEach((doc) => {
    if (doc.data().createdAtUnix >= tenMinsAgo) {
      count++;
    }
  });
  return count < 3;
};

export const submitMessage = async (data: { fullName: string; country: string; message: string }, anonymousId: string) => {
  // We can do rate limiting locally to avoid blocking the optimistic update
  const storageKey = `last_submit_${anonymousId}`;
  const lastSubmitStr = localStorage.getItem(storageKey);
  if (lastSubmitStr) {
    const lastSubmit = parseInt(lastSubmitStr, 10);
    if (Date.now() - lastSubmit < 3 * 60 * 1000) {
      throw new Error('Please wait a few minutes before posting again.');
    }
  }

  const newMessage: Omit<Message, 'id'> = {
    ...data,
    createdAt: serverTimestamp(),
    createdAtUnix: Date.now(),
    status: 'approved',
    likes: 0,
    heartReactions: 0,
    smileReactions: 0,
    celebrateReactions: 0,
    anonymousId,
    isPinned: false,
    isEdited: false,
  };

  const promise = addDoc(collection(db, MESSAGES_COLLECTION), newMessage);
  
  // Record submission time
  localStorage.setItem(storageKey, Date.now().toString());
  
  await promise;
  return;
};

export const toggleReaction = async (messageId: string, reactionType: ReactionType, currentUserId: string) => {
  const storageKey = `reacted_${messageId}_${reactionType}`;
  if (localStorage.getItem(storageKey)) {
    throw new Error('You have already reacted with this emoji to this message.');
  }

  const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
  await updateDoc(messageRef, {
    [reactionType]: increment(1)
  });
  
  localStorage.setItem(storageKey, 'true');
};
