import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

export interface GuestbookMessage {
  id?: string;
  fullName: string;
  location?: string;
  message: string;
  createdAt: any;
  updatedAt: any;
  approved: boolean;
  likes: number;
  device?: string;
  avatarColor: string;
}

export const GUESTBOOK_COLLECTION = 'guestbook_messages';

const COLORS = ['#D4AF37', '#1A1A1A', '#4A4A4A', '#8B7355', '#A67C00', '#2C3E50', '#8E44AD', '#27AE60', '#C0392B'];

export const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export const submitWish = async (data: { fullName: string; location?: string; message: string; device?: string }) => {
  if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
  
  const newWish: Omit<GuestbookMessage, 'id'> = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    approved: true,
    likes: 0,
    avatarColor: getRandomColor()
  };

  return await addDoc(collection(db, GUESTBOOK_COLLECTION), newWish);
};

export const subscribeToWishes = (callback: (wishes: GuestbookMessage[]) => void, onError: (error: Error) => void) => {
  if (!isFirebaseConfigured) {
    onError(new Error("Firebase is not configured."));
    return () => {};
  }
  const q = query(collection(db, GUESTBOOK_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const wishes: GuestbookMessage[] = [];
    snapshot.forEach((doc) => {
      wishes.push({ id: doc.id, ...doc.data() } as GuestbookMessage);
    });
    callback(wishes);
  }, (error) => {
    onError(error);
  });
};

export const likeWish = async (id: string) => {
  if (!isFirebaseConfigured) return;
  const wishRef = doc(db, GUESTBOOK_COLLECTION, id);
  await updateDoc(wishRef, {
    likes: increment(1)
  });
};
