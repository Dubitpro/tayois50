import React, { useState } from 'react';
import { togglePostReaction, WishPost } from '../services/wishPostsService';
import { Heart, MessageCircle, Share2, Eye } from 'lucide-react';

interface ReactionBarProps {
  post: WishPost;
  currentUserId: string | null;
}

export default function ReactionBar({ post, currentUserId }: ReactionBarProps) {
  const [error, setError] = useState<string | null>(null);

  const handleReaction = async (type: 'likes' | 'hearts') => {
    if (!currentUserId || !post.id) return;
    try {
      setError(null);
      await togglePostReaction(post.id, type, currentUserId);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const hasReacted = (type: 'likes' | 'hearts') => {
    if (!post.id) return false;
    return localStorage.getItem(`reacted_post_${post.id}_${type}`) === 'true';
  };

  const handleShare = () => {
    if (navigator.share && post.id) {
      navigator.share({
        title: `${post.fullName}'s Wish on Tayo's Golden Jubilee`,
        text: post.type === 'text' ? post.message : post.caption,
        url: window.location.origin + `/wishes?post=${post.id}`
      }).catch(console.error);
    }
  };

  return (
    <div className="pt-4 border-t border-luxury-gold/10 mt-auto">
      <div className="flex justify-between items-center text-elegant-black/60">
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => handleReaction('hearts')}
            className={`flex items-center gap-1.5 transition-all ${
              hasReacted('hearts') 
                ? 'text-red-500' 
                : 'hover:text-red-500'
            }`}
            aria-label="Heart reaction"
          >
            <Heart size={18} className={hasReacted('hearts') ? "fill-current" : ""} />
            <span className="font-medium text-xs">{post.hearts || 0}</span>
          </button>
          
          <button className="flex items-center gap-1.5 hover:text-elegant-black transition-all">
            <MessageCircle size={18} />
            <span className="font-medium text-xs">{post.comments || 0}</span>
          </button>
          
          <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-elegant-black transition-all">
            <Share2 size={18} />
            <span className="font-medium text-xs">{post.shares || 0}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs">
          <Eye size={16} />
          <span>{post.views || 0}</span>
        </div>
      </div>
      
      {error && <p className="text-red-500 text-[10px] mt-2 absolute">{error}</p>}
    </div>
  );
}
