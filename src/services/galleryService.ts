import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const GALLERY_COLLECTION = 'gallery';

export interface GalleryImage {
  id?: string;
  url: string;
  publicId?: string;
  caption?: string;
  description?: string;
  order: number;
  isPinned: boolean;
  isHidden: boolean;
  createdAt: any;
}

export const subscribeToGallery = (callback: (images: GalleryImage[]) => void) => {
  const q = query(collection(db, GALLERY_COLLECTION), orderBy('order', 'asc'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const images: GalleryImage[] = [];
    snapshot.forEach((doc) => {
      images.push({ id: doc.id, ...doc.data() } as GalleryImage);
    });
    // Further sort pinned to front if desired, but typically we just do it in JS
    callback(images.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    }));
  });
};

export const addGalleryImage = async (data: Omit<GalleryImage, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, GALLERY_COLLECTION), {
    ...data,
    createdAt: serverTimestamp()
  });
};

export const updateGalleryImage = async (id: string, data: Partial<GalleryImage>) => {
  await updateDoc(doc(db, GALLERY_COLLECTION, id), data);
};

export const deleteGalleryImage = async (id: string, publicId?: string) => {
  if (publicId) {
    try {
      await fetch('/api/delete-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, type: 'image' }) // assuming the endpoint handles 'image' type if we update it
      });
    } catch (e) {
      console.error(e);
    }
  }
  await deleteDoc(doc(db, GALLERY_COLLECTION, id));
};
