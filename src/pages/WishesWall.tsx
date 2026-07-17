import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface Wish {
  id: string;
  name: string;
  country: string;
  message: string;
}

export default function WishesWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const response = await fetch('/api/wishes');
        if (response.ok) {
          const data = await response.json();
          setWishes(data);
        }
      } catch (error) {
        console.error("Error fetching wishes", error);
      }
    };
    fetchWishes();
  }, []);

  return (
    <>
      <SEO title="Wishes Wall" description="Heartfelt messages from dignitaries, royal families, and admirers across the globe." />
        
      

      <div className="bg-soft-ivory py-24 min-h-screen">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="text-center mb-20">
            <h1 className="font-cormorant text-5xl md:text-7xl text-elegant-black mb-6">Wishes from the World</h1>
            <div className="w-24 h-[2px] bg-luxury-gold mx-auto mb-8"></div>
            <p className="font-serif text-xl italic text-elegant-black/70 max-w-2xl mx-auto">
              Heartfelt messages from dignitaries, royal families, and admirers across the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishes.map((wish, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-pearl-white p-10 border border-luxury-gold/20 shadow-sm relative group hover:shadow-md transition-shadow duration-300"
              >
                <Quote className="w-8 h-8 text-luxury-gold/30 absolute top-8 left-8" />
                <p className="font-serif text-lg leading-relaxed text-elegant-black/80 mt-6 mb-8 relative z-10 italic">
                  "{wish.message}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-soft-ivory border border-luxury-gold flex items-center justify-center text-luxury-gold font-cormorant text-xl">
                    {wish.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-elegant-black text-sm uppercase tracking-widest">{wish.name}</h4>
                    <p className="font-sans text-xs text-elegant-black/50 uppercase tracking-widest">{wish.country}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
