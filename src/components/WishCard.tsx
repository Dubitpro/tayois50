import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Play, Pause, Trash2 } from 'lucide-react';
import { WishPost, incrementViewCount, deletePost } from '../services/wishPostsService';
import { timeAgo } from '../utils/timeAgo';
import ReactionBar from './ReactionBar';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

interface WishCardProps {
  post: WishPost;
  index: number;
}

const VideoPlayer = ({ url, poster }: { url: string, poster?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative w-full overflow-hidden bg-black rounded-xl">
      <video 
        ref={videoRef}
        src={url}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="w-full h-auto max-h-[75vh] object-contain"
      />
    </div>
  );
};

const renderVideoUrl = (url: string, poster?: string) => {
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
        <iframe 
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
        <iframe 
          className="absolute inset-0 w-full h-full"
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
          title="Vimeo video player"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return <VideoPlayer url={url} poster={poster} />;
};

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

  const isAdmin = user?.uid === 'mock-admin' || user?.email === 'admin@palace.com';
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this wish?')) {
      setIsDeleting(true);
      try {
        await deletePost(post.id!, post.publicId);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-luxury-gold/20 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 flex flex-col h-full relative group"
    >
      {isAdmin && (
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-white/50 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
          title="Delete Post"
        >
          <Trash2 size={16} />
        </button>
      )}
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
        <div className="mb-4 relative rounded-xl overflow-hidden bg-black/5 flex flex-col">
          <div className="w-full relative">
            {renderVideoUrl(post.videoUrl, post.thumbnailUrl)}
          </div>
          {post.caption && (
            <p className="font-sans text-sm mt-3 px-2 pb-2 text-elegant-black/80">{post.caption}</p>
          )}
        </div>
      ) : (
        <div className="relative mb-6">
          <Quote className="w-6 h-6 text-luxury-gold/10 absolute -top-2 -left-2" />
          <p className="font-cormorant text-lg leading-relaxed text-elegant-black/80 whitespace-pre-wrap pl-4">
            "{post.message}"
          </p>
        </div>
      )}
      
      <ReactionBar post={post} currentUserId={user?.uid || null} />
    </motion.div>
  );
});
