import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import MusicPlayer from './MusicPlayer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-soft-ivory relative">
      <Navbar />
      
      <MusicPlayer />

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
