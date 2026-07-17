import React, { useState } from 'react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const images = [
  "https://i.pinimg.com/736x/5b/fe/d7/5bfed7298601ac9c981fd5cb03a46fa5.jpg",
  "https://i.pinimg.com/736x/f6/3a/a3/f63aa3c3206dfd2baf03eb4782110437.jpg",
  "https://i.pinimg.com/736x/34/d0/fb/34d0fb4b34acbdb6bb12783d90cf52bf.jpg",
  "https://i.pinimg.com/736x/18/33/4d/18334d4c223e87552566d28216d713c1.jpg",
  "https://i.pinimg.com/736x/58/ea/81/58ea81c3aa505de6b5fd63e2a408b56f.jpg",
  "https://i.pinimg.com/736x/f2/9e/12/f29e12626f56a6378a98fb6c2b8fb04f.jpg",
  "https://i.pinimg.com/736x/1f/9d/99/1f9d9970b2625b05ce20e5f7010c2bf8.jpg",
  "https://i.pinimg.com/736x/ed/bc/cc/edbccc2010e98c50d5cc013e7f7ad146.jpg",
  "https://i.pinimg.com/736x/1d/50/60/1d50608f161ad14553b1bd4c7dd7abd3.jpg",
];

export default function Gallery() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <SEO title="Royal Gallery" description="A curated collection of golden memories from the 50th Golden Jubilee." />
        
      

      <div className="bg-soft-ivory py-24 min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="text-center mb-16">
            <h1 className="font-cormorant text-5xl md:text-7xl text-elegant-black mb-6">Royal Gallery</h1>
            <div className="w-24 h-[2px] bg-luxury-gold mx-auto mb-8"></div>
            <p className="font-serif text-xl italic text-elegant-black/70">A curated collection of golden memories.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden group cursor-pointer aspect-square border border-luxury-gold/20"
                onClick={() => {
                  setSelectedImg(src);
                  setIsZoomed(false);
                }}
              >
                <div className="absolute inset-0 bg-elegant-black/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                <img 
                  src={src} 
                  alt={`Royal Memory ${index + 1}`} 
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-elegant-black/95 flex items-center justify-center p-4 md:p-12 overflow-hidden"
            onClick={() => {
              setSelectedImg(null);
              setIsZoomed(false);
            }}
          >
            <button 
              className="absolute top-6 right-6 text-pearl-white hover:text-luxury-gold transition-colors z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImg(null);
                setIsZoomed(false);
              }}
            >
              <X size={36} />
            </button>
            <motion.div
              className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              animate={{ scale: isZoomed ? 1.5 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag={isZoomed}
              dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
            >
              <motion.img 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={selectedImg} 
                alt="Enlarged Royal Memory"
                className="max-w-[90vw] max-h-[90vh] object-contain border-4 border-luxury-gold/50 shadow-2xl"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
