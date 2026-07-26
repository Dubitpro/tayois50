import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Pin } from 'lucide-react';
import { Message } from '../types/message';
import { timeAgo } from '../utils/timeAgo';
import ReactionBar from './ReactionBar';
import { useAuth } from '../hooks/useAuth';

interface WishCardProps {
  message: Message;
  index: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(i * 0.05, 0.5),
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

export default React.memo(function WishCard({ message, index }: WishCardProps) {
  const { user } = useAuth();
  
  const displayTime = timeAgo(message.createdAtUnix);

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      layoutId={message.id}
      className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-luxury-gold/20 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 flex flex-col h-full relative group"
    >
      {message.isPinned && (
        <div className="absolute -top-3 -right-3 bg-luxury-gold text-white p-2 rounded-full shadow-md z-10" title="Pinned Message">
          <Pin className="w-4 h-4" />
        </div>
      )}

      <Quote className="w-8 h-8 text-luxury-gold/10 absolute top-8 right-8" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-luxury-gold to-[#A67C00] flex items-center justify-center text-white font-cormorant text-xl shadow-sm shrink-0">
          {message.fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="font-sans font-bold text-elegant-black text-sm uppercase tracking-widest line-clamp-1">
            {message.fullName}
          </h4>
          <div className="flex items-center gap-2 text-xs font-sans text-elegant-black/50 mt-1">
            <span>🌍 {message.country}</span>
            <span>•</span>
            <span className="italic">{displayTime ? `Posted ${displayTime}` : ''}</span>
          </div>
        </div>
      </div>
      
      <p className="font-serif text-lg leading-relaxed text-elegant-black/80 mb-8 flex-grow whitespace-pre-wrap">
        "{message.message}"
      </p>
      
      <ReactionBar message={message} currentUserId={user?.uid || null} />
    </motion.div>
  );
});
