import { useState, useEffect, useCallback } from 'react';
import { onSnapshot, query, collection, orderBy, limit, DocumentData, Query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { WishPost, POSTS_COLLECTION } from '../services/wishPostsService';

export const useRealtimeMessages = (pageSize: number = 20) => {
  const [messages, setMessages] = useState<WishPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [currentLimit, setCurrentLimit] = useState(pageSize);
  const [hasMore, setHasMore] = useState(true);
  
  const [filterBy, setFilterBy] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setCurrentLimit(prev => prev + pageSize);
    }
  }, [hasMore, loading, pageSize]);

  useEffect(() => {
    setLoading(true);
    let q: Query<DocumentData>;
    const postsRef = collection(db, POSTS_COLLECTION);
    
    // Applying filter
    if (filterBy === 'Oldest') {
      q = query(postsRef, orderBy('createdAtUnix', 'asc'), limit(currentLimit));
    } else if (filterBy === 'Most Loved') {
      q = query(postsRef, orderBy('hearts', 'desc'), limit(currentLimit));
    } else {
      // Default: Newest
      q = query(postsRef, orderBy('createdAtUnix', 'desc'), limit(currentLimit));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newMessages: WishPost[] = [];
        snapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() } as WishPost);
        });
        
        setMessages(newMessages);
        setHasMore(snapshot.docs.length === currentLimit);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching realtime messages:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentLimit, filterBy]);
  
  const filteredMessages = messages.filter(msg => {
    if (!searchQuery.trim()) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      (msg.fullName && msg.fullName.toLowerCase().includes(lowerQuery)) ||
      (msg.country && msg.country.toLowerCase().includes(lowerQuery)) ||
      (msg.message && msg.message.toLowerCase().includes(lowerQuery)) ||
      (msg.caption && msg.caption.toLowerCase().includes(lowerQuery))
    );
  });

  return { 
    messages: filteredMessages, 
    loading, 
    error, 
    loadMore, 
    hasMore,
    filterBy,
    setFilterBy,
    searchQuery,
    setSearchQuery
  };
};
