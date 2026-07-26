import { useState, useEffect, useCallback } from 'react';
import { onSnapshot, query, collection, orderBy, limit, where, DocumentData, Query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Message } from '../types/message';
import { MESSAGES_COLLECTION } from '../services/messageService';

export const useRealtimeMessages = (pageSize: number = 20) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [currentLimit, setCurrentLimit] = useState(pageSize);
  const [hasMore, setHasMore] = useState(true);
  
  const [filterBy, setFilterBy] = useState('Newest'); // Newest, Oldest, Most Loved, Pinned
  const [searchQuery, setSearchQuery] = useState('');

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setCurrentLimit(prev => prev + pageSize);
    }
  }, [hasMore, loading, pageSize]);

  useEffect(() => {
    setLoading(true);
    let q: Query<DocumentData>;
    const messagesRef = collection(db, MESSAGES_COLLECTION);
    
    // Applying filter
    if (filterBy === 'Oldest') {
      q = query(messagesRef, orderBy('createdAtUnix', 'asc'), limit(currentLimit));
    } else if (filterBy === 'Most Loved') {
      q = query(messagesRef, orderBy('heartReactions', 'desc'), limit(currentLimit));
    } else if (filterBy === 'Pinned') {
      q = query(messagesRef, where('isPinned', '==', true), orderBy('createdAtUnix', 'desc'), limit(currentLimit));
    } else {
      // Default: Newest
      q = query(messagesRef, orderBy('createdAtUnix', 'desc'), limit(currentLimit));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newMessages: Message[] = [];
        snapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() } as Message);
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
  
  // Client-side search implementation since Firestore doesn't support full-text search easily without extensions
  const filteredMessages = messages.filter(msg => {
    if (!searchQuery.trim()) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      (msg.fullName && msg.fullName.toLowerCase().includes(lowerQuery)) ||
      (msg.country && msg.country.toLowerCase().includes(lowerQuery)) ||
      (msg.message && msg.message.toLowerCase().includes(lowerQuery))
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
