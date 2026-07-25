import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Heart } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { GuestbookMessage } from '../../services/guestbookService';

interface WishCardProps {
  key?: React.Key;
  wish: GuestbookMessage;
  onLike: (id: string) => void;
  index: number;
}

export default function WishCard({ wish, onLike, index }: WishCardProps) {
  let timeAgo = '';
  let exactDate = '';
  
  if (wish.createdAt) {
    try {
      const date = wish.createdAt.toDate();
      timeAgo = formatDistanceToNow(date, { addSuffix: true });
      exactDate = format(date, 'MMMM d, yyyy');
    } catch (e) {
      // Handle timestamp edge cases
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 1) }} // cap delay
      className="bg-pearl-white p-8 md:p-10 border border-luxury-gold/20 shadow-sm relative group hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      <Quote className="w-8 h-8 text-luxury-gold/20 absolute top-8 left-8 transform -scale-x-100" />
      
      <p className="font-serif text-lg leading-relaxed text-elegant-black/80 mt-8 mb-8 relative z-10 italic flex-grow whitespace-pre-wrap">
        "{wish.message}"
      </p>
      
      <div className="flex items-start gap-4 mt-auto pt-6 border-t border-luxury-gold/10">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-cormorant text-2xl shrink-0 shadow-sm"
          style={{ backgroundColor: wish.avatarColor || '#D4AF37' }}
        >
          {wish.fullName.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-sans font-bold text-elegant-black text-sm uppercase tracking-widest truncate" title={wish.fullName}>
            {wish.fullName}
          </h4>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
            {wish.location && (
              <p className="font-sans text-[10px] text-elegant-black/60 uppercase tracking-wider truncate" title={wish.location}>
                {wish.location}
              </p>
            )}
            {wish.location && timeAgo && <span className="hidden sm:inline text-luxury-gold/40">•</span>}
            {timeAgo && (
              <p className="font-sans text-[10px] text-elegant-black/50 tracking-wider" title={exactDate}>
                {timeAgo}
              </p>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => wish.id && onLike(wish.id)}
          className="flex flex-col items-center justify-center gap-1 group/btn shrink-0 ml-2"
          aria-label="Like this wish"
        >
          <Heart className={`w-5 h-5 transition-colors ${wish.likes > 0 ? 'text-red-500 fill-red-500' : 'text-luxury-gold/50 group-hover/btn:text-red-400'}`} />
          <span className="font-sans text-[10px] text-elegant-black/60 font-bold">{wish.likes || 0}</span>
        </button>
      </div>
    </motion.div>
  );
}
