import React, { useState, useEffect } from 'react';
import { togglePostReaction, WishPost, submitComment, getComments, PostComment } from '../services/wishPostsService';
import { Heart, MessageCircle, Share2, Eye, Send, Loader2 } from 'lucide-react';
import { timeAgo } from '../utils/timeAgo';

interface ReactionBarProps {
  post: WishPost;
  currentUserId: string | null;
}

export default function ReactionBar({ post, currentUserId }: ReactionBarProps) {
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [localCommentCount, setLocalCommentCount] = useState(post.comments || 0);
  const [localHeartCount, setLocalHeartCount] = useState(post.hearts || 0);

  const handleReaction = async (type: 'likes' | 'hearts') => {
    if (!post.id) return;
    try {
      setError(null);
      await togglePostReaction(post.id, type, currentUserId || 'anonymous');
      if (type === 'hearts') setLocalHeartCount(prev => prev + 1);
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
  
  const toggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && post.id && comments.length === 0) {
      setLoadingComments(true);
      try {
        const fetched = await getComments(post.id);
        setComments(fetched);
      } catch (err) {
        console.error("Failed to load comments", err);
      } finally {
        setLoadingComments(false);
      }
    }
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim() || !post.id) return;
    
    setSubmittingComment(true);
    try {
      await submitComment(post.id, commentName.trim(), newComment.trim());
      setNewComment('');
      setLocalCommentCount(prev => prev + 1);
      // Reload comments
      const fetched = await getComments(post.id);
      setComments(fetched);
    } catch (err) {
      console.error("Failed to submit comment", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="pt-4 border-t border-luxury-gold/10 mt-auto flex flex-col">
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
            <span className="font-medium text-xs">{localHeartCount}</span>
          </button>
          
          <button 
            onClick={toggleComments}
            className={`flex items-center gap-1.5 transition-all ${showComments ? 'text-luxury-gold' : 'hover:text-elegant-black'}`}
          >
            <MessageCircle size={18} />
            <span className="font-medium text-xs">{localCommentCount}</span>
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
      
      {error && <p className="text-red-500 text-[10px] mt-2">{error}</p>}
      
      {showComments && (
        <div className="mt-4 pt-4 border-t border-luxury-gold/5 flex flex-col gap-3">
          {loadingComments ? (
            <div className="flex justify-center p-2">
              <Loader2 className="w-4 h-4 text-luxury-gold animate-spin" />
            </div>
          ) : comments.length > 0 ? (
            <div className="flex flex-col gap-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-black/5 rounded-lg p-2 text-sm">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-elegant-black text-xs uppercase tracking-wider">{comment.fullName}</span>
                    <span className="text-[9px] text-elegant-black/50">{timeAgo(comment.createdAtUnix)}</span>
                  </div>
                  <p className="text-elegant-black/80 text-xs">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-elegant-black/40 italic py-2">No comments yet. Be the first!</p>
          )}
          
          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2 mt-2">
            <input 
              type="text"
              placeholder="Your Name"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              className="w-full text-xs bg-transparent border-b border-luxury-gold/20 py-1 focus:outline-none focus:border-luxury-gold transition-colors"
              required
            />
            <div className="flex items-center gap-2">
              <input 
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 text-xs bg-black/5 rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-luxury-gold/50 transition-shadow"
                required
              />
              <button 
                type="submit" 
                disabled={submittingComment || !newComment.trim() || !commentName.trim()}
                className="w-7 h-7 rounded-full bg-luxury-gold flex items-center justify-center text-white disabled:opacity-50 shrink-0"
              >
                {submittingComment ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
