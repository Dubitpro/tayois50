import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, where, startAfter, DocumentData, QueryDocumentSnapshot, updateDoc, doc, increment, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

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
  publicId?: string;
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
    publicId?: string;
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
): Promise<{ secureUrl: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `https://api.cloudinary.com/v1_1/oanujycn/video/upload`;
    
    xhr.open("POST", url, true);
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            secureUrl: response.secure_url,
            publicId: response.public_id
          });
        } catch (error) {
          reject(new Error(`Failed to parse upload response (Status: ${xhr.status}): ${xhr.responseText.substring(0, 100)}`));
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          reject(new Error(response.error?.message || "Upload failed"));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };
    
    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };
    
    xhr.onabort = () => {
      reject(new Error("Upload aborted"));
    };
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "wishwallvideos");
    
    xhr.send(formData);
  });
};

export const uploadThumbnail = async (
  file: File | Blob,
  userId: string
): Promise<string> => {
  // Not used anymore if Cloudinary generates thumbnails automatically,
  // but kept for compatibility.
  return "";
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

export const deletePost = async (postId: string, publicId?: string) => {
  if (publicId) {
    try {
      await fetch('/api/delete-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId })
      });
    } catch (error) {
      console.error('Failed to delete video from Cloudinary', error);
    }
  }
  await deleteDoc(doc(db, POSTS_COLLECTION, postId));
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
