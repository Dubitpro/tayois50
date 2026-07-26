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
  const tenMinsAgo = Date.now() - 10 * 60 * 1000;
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where('anonymousId', '==', anonymousId),
    where('createdAtUnix', '>=', tenMinsAgo)
  );
  const snapshot = await getDocs(q);
  return snapshot.size < 3;
};

export const submitMessage = async (data: { fullName: string; country: string; message: string }, anonymousId: string) => {
  const isAllowed = await canSubmitMessage(anonymousId);
  if (!isAllowed) {
    throw new Error('Rate limit exceeded. Please wait before posting again.');
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

  return await addDoc(collection(db, MESSAGES_COLLECTION), newMessage);
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
