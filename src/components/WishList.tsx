import React, { useEffect, useRef } from 'react';
import { useRealtimeMessages } from '../hooks/useRealtimeMessages';
import WishCard from './WishCard';
import SkeletonCard from './SkeletonCard';
import SearchBar from './SearchBar';
import Filters from './Filters';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishList() {
  const { 
    messages, 
    loading, 
    error, 
    loadMore, 
    hasMore,
    filterBy,
    setFilterBy,
    searchQuery,
    setSearchQuery
  } = useRealtimeMessages(20);

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Filters filterBy={filterBy} setFilterBy={setFilterBy} />
      </div>

      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-800 p-4 rounded-xl mb-8 text-center text-sm font-sans" role="alert">
          We couldn't load the messages right now. Please try again later.
        </div>
      )}

      {loading && messages.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <AnimatePresence>
          {messages.length === 0 && !loading && !error ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-luxury-gold/10"
            >
              <p className="font-cormorant text-2xl italic text-elegant-black/60 mb-2">No wishes have been posted yet.</p>
              <p className="font-sans text-sm text-luxury-gold uppercase tracking-widest">Be the first person to celebrate.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {messages.map((msg, idx) => (
                <WishCard key={msg.id} post={msg} index={idx % 20} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div ref={loaderRef} className="py-12 flex justify-center">
        {loading && messages.length > 0 && (
          <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
        )}
        {!hasMore && messages.length > 0 && (
          <p className="font-sans text-xs uppercase tracking-widest text-elegant-black/40">You've reached the end of the wishes</p>
        )}
      </div>
    </div>
  );
}
