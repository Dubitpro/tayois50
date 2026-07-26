import React from 'react';
import { motion } from 'framer-motion';

export default function SkeletonCard() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-luxury-gold/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] h-full flex flex-col gap-6"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-elegant-black/5 animate-pulse"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-elegant-black/5 rounded animate-pulse w-1/3"></div>
          <div className="h-3 bg-elegant-black/5 rounded animate-pulse w-1/4"></div>
        </div>
      </div>
      
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-elegant-black/5 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-elegant-black/5 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-elegant-black/5 rounded animate-pulse w-3/4"></div>
      </div>

      <div className="pt-4 border-t border-luxury-gold/5 flex gap-4">
        <div className="h-8 bg-elegant-black/5 rounded-full animate-pulse w-16"></div>
        <div className="h-8 bg-elegant-black/5 rounded-full animate-pulse w-16"></div>
        <div className="h-8 bg-elegant-black/5 rounded-full animate-pulse w-16"></div>
      </div>
    </motion.div>
  );
}
