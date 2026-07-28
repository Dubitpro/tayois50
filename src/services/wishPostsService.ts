import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, where, startAfter, DocumentData, QueryDocumentSnapshot, updateDoc, doc, increment } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

export const POSTS_COLLECTION = 'wishPosts';

export type PostType = 'text' | 'video';

export interface WishPost {
  id?: string;
  type: PostType;
  fullName: string;
  country: string;
  message?: string;
  caption?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt: any;
  createdAtUnix: number;
  likes: number;
  hearts: number;
  comments: number;
  shares: number;
  views: number;
  anonymousId: string;
  status: 'approved' | 'pending' | 'rejected';
}

export const getWishPostsQuery = (pageSize: number, lastDoc: QueryDocumentSnapshot<DocumentData> | null, filterBy: string) => {
  let q;
  const postsRef = collection(db, POSTS_COLLECTION);
  
  // Base queries depending on filter
  if (filterBy === 'Oldest') {
    q = query(postsRef, orderBy('createdAtUnix', 'asc'), limit(pageSize));
  } else if (filterBy === 'Most Loved') {
    q = query(postsRef, orderBy('hearts', 'desc'), limit(pageSize));
  } else {
    // Default: Newest
    q = query(postsRef, orderBy('createdAtUnix', 'desc'), limit(pageSize));
  }

  // Add pagination if lastDoc exists
  if (lastDoc) {
    if (filterBy === 'Oldest') {
      q = query(postsRef, orderBy('createdAtUnix', 'asc'), startAfter(lastDoc), limit(pageSize));
    } else if (filterBy === 'Most Loved') {
      q = query(postsRef, orderBy('hearts', 'desc'), startAfter(lastDoc), limit(pageSize));
    } else {
      q = query(postsRef, orderBy('createdAtUnix', 'desc'), startAfter(lastDoc), limit(pageSize));
    }
  }

  return q;
};

export const canSubmitPost = async (anonymousId: string): Promise<boolean> => {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where('anonymousId', '==', anonymousId)
  );
  const snapshot = await getDocs(q);
  
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  let count = 0;
  snapshot.forEach((doc) => {
    if (doc.data().createdAtUnix >= oneHourAgo) {
      count++;
    }
  });

  return count < 3; // Allow max 3 posts per hour
};

export const submitWishPost = async (
  data: { 
    type: PostType; 
    fullName: string; 
    country: string; 
    message?: string; 
    caption?: string; 
    videoUrl?: string; 
    thumbnailUrl?: string;
    duration?: number;
  }, 
  anonymousId: string
) => {
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );

  const newPost: Omit<WishPost, 'id'> = {
    ...cleanData,
    createdAt: serverTimestamp(),
    createdAtUnix: Date.now(),
    status: 'approved',
    likes: 0,
    hearts: 0,
    comments: 0,
    shares: 0,
    views: 0,
    anonymousId,
  } as Omit<WishPost, 'id'>;

  const promise = addDoc(collection(db, POSTS_COLLECTION), newPost);
  await promise;
  return;
};

export const uploadVideo = async (
  file: File,
  userId: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Generate unique filename: wish-wall/videos/{timestamp}-{random}-{originalFilename}
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const safeFilename = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : 'upload.mp4';
    const filePath = `wish-wall/videos/${timestamp}-${random}-${safeFilename}`;
    
    const storageRef = ref(storage, filePath);
    
    // Create the file metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        userId: userId
      }
    };
    
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        reject(new Error(`Upload failed: ${error.message}`));
      },
      async () => {
        // Handle successful uploads on complete
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error: any) {
          reject(new Error(`Failed to get download URL: ${error.message}`));
        }
      }
    );
  });
};

export const uploadThumbnail = async (
  file: File | Blob,
  userId: string
): Promise<string> => {
  const fileName = `${userId}_${Date.now()}_thumb.jpg`;
  const storageRef = ref(storage, `wish-thumbnails/${userId}/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  await uploadTask;
  return getDownloadURL(storageRef);
};

export const togglePostReaction = async (postId: string, reactionType: 'likes' | 'hearts', currentUserId: string) => {
  const storageKey = `reacted_post_${postId}_${reactionType}`;
  if (localStorage.getItem(storageKey)) {
    throw new Error('You have already reacted to this post.');
  }

  const postRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(postRef, {
    [reactionType]: increment(1)
  });
  
  localStorage.setItem(storageKey, 'true');
};

export const incrementViewCount = async (postId: string) => {
  const storageKey = `viewed_post_${postId}`;
  if (localStorage.getItem(storageKey)) return;

  const postRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(postRef, {
    views: increment(1)
  });
  
  localStorage.setItem(storageKey, 'true');
};
