import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote, Play } from 'lucide-react';
import { WishPost, incrementViewCount } from '../services/wishPostsService';
import { timeAgo } from '../utils/timeAgo';
import ReactionBar from './ReactionBar';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

interface WishCardProps {
  post: WishPost;
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

export default React.memo(function WishCard({ post, index }: WishCardProps) {
  const { user } = useAuth();
  const displayTime = timeAgo(post.createdAtUnix);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Track view when the card is mounted/visible
  useEffect(() => {
    if (post.id) {
      incrementViewCount(post.id).catch(console.error);
    }
  }, [post.id]);

  // Lazy loading video handling could be added here via IntersectionObserver on videoRef

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      layoutId={post.id}
      className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-luxury-gold/20 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 flex flex-col h-full relative group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-luxury-gold to-[#A67C00] flex items-center justify-center text-white font-cormorant text-lg shadow-sm shrink-0">
          {post.fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="font-sans font-bold text-elegant-black text-sm uppercase tracking-widest line-clamp-1">
            {post.fullName}
          </h4>
          <div className="flex items-center gap-2 text-[10px] font-sans text-elegant-black/50 mt-1">
            <span>🌍 {post.country}</span>
            <span>•</span>
            <span className="italic">{displayTime ? displayTime : 'Just now'}</span>
          </div>
        </div>
      </div>
      
      {post.type === 'video' && post.videoUrl ? (
        <div className="mb-4 relative rounded-xl overflow-hidden bg-black/5 aspect-[4/5] sm:aspect-[9/16] lg:aspect-[4/5]">
          <video 
            ref={videoRef}
            src={post.videoUrl} 
            poster={post.thumbnailUrl}
            controls
            preload="metadata"
            className="w-full h-full object-cover"
          />
          {post.caption && (
            <p className="font-sans text-sm mt-3 text-elegant-black/80">{post.caption}</p>
          )}
        </div>
      ) : (
        <div className="relative mb-6 flex-grow">
          <Quote className="w-6 h-6 text-luxury-gold/10 absolute -top-2 -left-2" />
          <p className="font-serif text-lg leading-relaxed text-elegant-black/80 whitespace-pre-wrap pl-4">
            "{post.message}"
          </p>
        </div>
      )}
      
      <ReactionBar post={post} currentUserId={user?.uid || null} />
    </motion.div>
  );
});
