import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import ShareWidget from '../components/ShareWidget';
import WishList from '../components/WishList';

export default function WishesWall() {
  return (
    <>
      <SEO title="Wishes Wall" description="Heartfelt messages from family, friends & admirers across the globe" />
      
      <div className="bg-soft-ivory py-24 min-h-screen relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 right-10 w-96 h-96 bg-luxury-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-40 left-10 w-80 h-80 bg-luxury-gold rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          
          <div className="text-center mb-20">
            <h1 className="font-cormorant text-5xl md:text-7xl text-elegant-black mb-6">Wishes from the World</h1>
            <div className="w-24 h-[2px] bg-luxury-gold mx-auto mb-8"></div>
            <p className="font-serif text-xl italic text-elegant-black/70 max-w-2xl mx-auto mb-8">
              Heartfelt messages from family, friends & admirers across the globe
            </p>
            <Link 
              to="/guestbook" 
              className="inline-block bg-luxury-gold text-white font-sans text-xs uppercase tracking-widest px-8 py-4 hover:bg-elegant-black hover:shadow-lg transition-all rounded-full"
            >
              Drop a Wish
            </Link>
          </div>

          <WishList />

        </div>
      </div>

      <ShareWidget />
    </>
  );
}
