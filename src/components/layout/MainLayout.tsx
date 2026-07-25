import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Music, VolumeX } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function MainLayout() {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen flex flex-col bg-soft-ivory relative">
      <Navbar />

      {/* Floating Music Controller */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-elegant-black/80 backdrop-blur-md border border-luxury-gold/50 rounded-full flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-elegant-black transition-all duration-300 shadow-lg"
        aria-label="Toggle Background Music"
      >
        {isPlaying ? <VolumeX size={20} /> : <Music size={20} />}
      </button>

      {/* Audiomack background music */}
      {isPlaying && (
        <iframe
          src="https://audiomack.com/embed/song/donbenny/ore-ofe-sha-live?background=1&autoplay=1"
          scrolling="no"
          width="1px"
          height="1px"
          scrollbars="no"
          frameBorder="0"
          allow="autoplay"
          className="absolute pointer-events-none opacity-0"
          title="Background Music"
        ></iframe>
      )}

      <motion.main 
        className="flex-grow pt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
