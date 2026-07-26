import React, { useState } from 'react';
import { toggleReaction } from '../services/messageService';
import { Message, ReactionType } from '../types/message';

interface ReactionBarProps {
  message: Message;
  currentUserId: string | null;
}

export default function ReactionBar({ message, currentUserId }: ReactionBarProps) {
  const [error, setError] = useState<string | null>(null);

  const handleReaction = async (type: ReactionType) => {
    if (!currentUserId || !message.id) return;
    
    try {
      setError(null);
      await toggleReaction(message.id, type, currentUserId);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const hasReacted = (type: ReactionType) => {
    if (!message.id) return false;
    return localStorage.getItem(`reacted_${message.id}_${type}`) === 'true';
  };

  return (
    <div className="pt-5 border-t border-luxury-gold/10 mt-auto">
      <div className="flex gap-2 items-center">
        <button 
          onClick={() => handleReaction('heartReactions')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-sans transition-all ${
            hasReacted('heartReactions') 
              ? 'bg-red-50 text-red-600 border border-red-100' 
              : 'bg-white hover:bg-red-50 text-elegant-black/60 hover:text-red-600 border border-luxury-gold/20'
          }`}
          aria-label="Heart reaction"
        >
          <span>❤️</span>
          <span className="font-medium">{message.heartReactions || 0}</span>
        </button>

        <button 
          onClick={() => handleReaction('smileReactions')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-sans transition-all ${
            hasReacted('smileReactions') 
              ? 'bg-orange-50 text-orange-600 border border-orange-100' 
              : 'bg-white hover:bg-orange-50 text-elegant-black/60 hover:text-orange-600 border border-luxury-gold/20'
          }`}
          aria-label="Smile reaction"
        >
          <span>😊</span>
          <span className="font-medium">{message.smileReactions || 0}</span>
        </button>

        <button 
          onClick={() => handleReaction('celebrateReactions')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-sans transition-all ${
            hasReacted('celebrateReactions') 
              ? 'bg-blue-50 text-blue-600 border border-blue-100' 
              : 'bg-white hover:bg-blue-50 text-elegant-black/60 hover:text-blue-600 border border-luxury-gold/20'
          }`}
          aria-label="Celebrate reaction"
        >
          <span>🎉</span>
          <span className="font-medium">{message.celebrateReactions || 0}</span>
        </button>
      </div>
      
      {error && <p className="text-red-500 text-[10px] mt-2 absolute">{error}</p>}
    </div>
  );
}
