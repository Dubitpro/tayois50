import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const defaultImages = [
  "https://i.pinimg.com/originals/0b/5f/13/0b5f13ee309e4aa2e9b3d7d864a235d0.jpg",
  "https://i.pinimg.com/originals/21/eb/ca/21ebcaaad4d28a822e9e149c166428d1.jpg",
  "https://i.pinimg.com/originals/2b/00/ab/2b00abecb4527f39e493600010d73c21.jpg",
  "https://i.pinimg.com/originals/3a/c4/23/3ac4237586ca6f6287e076e4a67a95f9.jpg",
  "https://i.pinimg.com/originals/3c/91/1f/3c911fb1d8d2c01addc7b05267f3eb83.jpg",
  "https://i.pinimg.com/originals/79/68/6c/79686c6940d1dbaab2cec8f8edeeef8e.jpg",
  "https://i.pinimg.com/originals/84/f1/b0/84f1b0c535be0b1ca9746f8f37312e5f.jpg",
  "https://i.pinimg.com/originals/b0/56/35/b05635f79a1ed01406ea1d0c7dea1741.jpg",
  "https://i.pinimg.com/originals/cb/46/01/cb4601f1a7763f83069120039c5199aa.jpg",
  "https://i.pinimg.com/originals/db/d8/d2/dbd8d22ef61d0b9d4786ed5708640568.jpg",
  "https://i.pinimg.com/originals/e6/6e/70/e66e7002bd1476084ddb834e1f3d1783.jpg",
  "https://i.pinimg.com/originals/e8/e0/4a/e8e04ad75b29e2cf0918a4100eedce1d.jpg"
];

export default function Gallery() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [images, setImages] = useState<string[]>(defaultImages);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.galleryImages && data.galleryImages.length > 0) {
          const filteredImages = data.galleryImages.filter((img: string) => 
            !["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"].includes(img)
          );
          setImages(filteredImages.length > 0 ? filteredImages : defaultImages);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <SEO title="Gallery" description="A curated collection of golden memories from the 50th Golden Jubilee." />
        
      

      <div className="bg-soft-ivory py-24 min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="text-center mb-16">
            <h1 className="font-cormorant text-5xl md:text-7xl text-elegant-black mb-6">Gallery</h1>
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
                  alt={`Memory ${index + 1}`} 
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                  decoding="async"
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
                alt="Enlarged Memory"
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
