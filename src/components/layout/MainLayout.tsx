import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Music, VolumeX } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function MainLayout() {
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleEnter = () => {
    setLoading(false);
    setIsPlaying(true);
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen flex flex-col bg-soft-ivory relative">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="curtain"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-elegant-black flex flex-col items-center justify-center border-b-[12px] border-luxury-gold"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center flex flex-col items-center"
            >
              <Crown className="w-20 h-20 text-luxury-gold mx-auto mb-6" />
              <h1 className="font-cormorant text-4xl md:text-6xl text-luxury-gold tracking-widest uppercase">
                Golden Jubilee
              </h1>
              <div className="mt-8 mb-12 w-px h-16 bg-gradient-to-b from-luxury-gold to-transparent mx-auto"></div>
              
              <button
                onClick={handleEnter}
                className="px-8 py-3 border border-luxury-gold text-luxury-gold font-sans text-sm uppercase tracking-widest hover:bg-luxury-gold hover:text-elegant-black transition-colors duration-300"
              >
                Enter Celebration
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      {/* Floating Music Controller */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-elegant-black/80 backdrop-blur-md border border-luxury-gold/50 rounded-full flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-elegant-black transition-all duration-300 shadow-lg"
        aria-label="Toggle Background Music"
      >
        {isPlaying ? <Music size={20} /> : <VolumeX size={20} />}
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
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: loading ? 2.5 : 0 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
