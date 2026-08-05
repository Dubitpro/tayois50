import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface CoverflowCarouselProps {
  images: string[];
}

export default function CoverflowCarousel({ images }: CoverflowCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -50 || velocity < -500) {
      handleNext();
    } else if (offset > 50 || velocity > 500) {
      handlePrev();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" ref={containerRef}>
      <div className="w-full h-full relative flex items-center justify-center perspective-[1200px]">
        <motion.div 
          className="relative flex items-center justify-center w-full h-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x }}
        >
          {images.map((img, i) => {
            const offset = (i - currentIndex + images.length) % images.length;
            const absoluteOffset = offset > images.length / 2 ? offset - images.length : offset;
            
            const isActive = absoluteOffset === 0;
            const zIndex = images.length - Math.abs(absoluteOffset);
            
            let translateX = 0;
            let translateZ = 0;
            let rotateY = 0;
            let opacity = 1;
            let scale = 1;

            if (absoluteOffset === 0) {
              translateX = 0;
              translateZ = 0;
              rotateY = 0;
              opacity = 1;
              scale = 1;
            } else if (absoluteOffset === 1) {
              translateX = 30; // % of container width
              translateZ = -200;
              rotateY = -25;
              opacity = 0.8;
              scale = 0.8;
            } else if (absoluteOffset === -1) {
              translateX = -30;
              translateZ = -200;
              rotateY = 25;
              opacity = 0.8;
              scale = 0.8;
            } else if (absoluteOffset === 2) {
              translateX = 50;
              translateZ = -400;
              rotateY = -40;
              opacity = 0.5;
              scale = 0.6;
            } else if (absoluteOffset === -2) {
              translateX = -50;
              translateZ = -400;
              rotateY = 40;
              opacity = 0.5;
              scale = 0.6;
            } else {
              translateX = absoluteOffset > 0 ? 60 : -60;
              translateZ = -600;
              rotateY = absoluteOffset > 0 ? -50 : 50;
              opacity = 0;
              scale = 0.4;
            }

            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  x: `${translateX}vw`,
                  z: translateZ,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={cn(
                  "absolute w-[280px] h-[380px] md:w-[350px] md:h-[480px] lg:w-[400px] lg:h-[550px]",
                  "rounded-xl overflow-hidden shadow-2xl border border-luxury-gold/30 bg-soft-ivory",
                  isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                )}
                style={{ zIndex }}
                onClick={() => !isActive && setCurrentIndex(i)}
              >
                <img
                  src={img}
                  alt={`Memory ${i + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="absolute bottom-4 flex items-center justify-center gap-6 z-30">
        <button
          onClick={handlePrev}
          className="text-luxury-gold/70 hover:text-luxury-gold hover:scale-110 transition-all p-2"
        >
          <ChevronLeft size={32} />
        </button>
        
        <div className="flex gap-2 items-center">
          {images.map((_, i) => {
            const isActive = i === currentIndex;
            // Only show dots near current index if there are many
            const offset = Math.abs((i - currentIndex + images.length) % images.length);
            const offsetReverse = Math.abs((currentIndex - i + images.length) % images.length);
            const dist = Math.min(offset, offsetReverse);
            
            if (images.length > 15 && dist > 3) {
                if (dist === 4) return <span key={i} className="text-luxury-gold/30 text-[8px]">•</span>;
                return null;
            }

            return (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  isActive ? "w-8 h-2 bg-luxury-gold" : "w-2 h-2 bg-luxury-gold/30 hover:bg-luxury-gold/60"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="text-luxury-gold/70 hover:text-luxury-gold hover:scale-110 transition-all p-2"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
}
