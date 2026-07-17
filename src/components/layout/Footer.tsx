import React from 'react';
import { Crown } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-elegant-black text-pearl-white py-12 border-t-4 border-luxury-gold">
      <div className="container mx-auto px-6 text-center">
        <Crown className="w-12 h-12 text-luxury-gold mx-auto mb-6 opacity-80" />
        <h2 className="font-cormorant text-3xl font-light mb-4 text-luxury-gold">
          The 50th Golden Jubilee
        </h2>
        <p className="font-sans text-sm tracking-widest text-pearl-white/60 uppercase mb-8">
          A Royal Celebration of Excellence & Grace
        </p>
        
        <div className="flex justify-center gap-8 mb-8">
          <a href="#" className="hover:text-luxury-gold transition-colors duration-300">Facebook</a>
          <a href="#" className="hover:text-luxury-gold transition-colors duration-300">Instagram</a>
          <a href="#" className="hover:text-luxury-gold transition-colors duration-300">Twitter</a>
        </div>

        <div className="w-24 h-[1px] bg-luxury-gold/50 mx-auto mb-8"></div>
        
        <p className="text-xs text-pearl-white/40">
          &copy; {new Date().getFullYear()} Royal Golden Jubilee Celebration. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
