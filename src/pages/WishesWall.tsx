import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import ShareWidget from '../components/ShareWidget';
import { useGuestbook } from '../hooks/useGuestbook';
import WishCard from '../components/guestbook/WishCard';

export default function WishesWall() {
  const { wishes, loading, error, handleLike } = useGuestbook();

  return (
    <>
      <SEO title="Wishes Wall" description="Heartfelt messages from family, friends & admirers across the globe" />
      
      <div className="bg-soft-ivory py-24 min-h-screen">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="text-center mb-20">
            <h1 className="font-cormorant text-5xl md:text-7xl text-elegant-black mb-6">Wishes from the World</h1>
            <div className="w-24 h-[2px] bg-luxury-gold mx-auto mb-8"></div>
            <p className="font-serif text-xl italic text-elegant-black/70 max-w-2xl mx-auto mb-8">
              Heartfelt messages from family, friends & admirers across the globe
            </p>
            <Link 
              to="/guestbook" 
              className="inline-block bg-luxury-gold text-white font-sans text-xs uppercase tracking-widest px-8 py-3 hover:bg-elegant-black transition-colors"
            >
              Click here to Drop A Wish
            </Link>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-gold"></div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 font-sans text-sm p-4 bg-red-50 rounded max-w-2xl mx-auto">
              Could not load messages. Please try again later.
            </div>
          )}

          {!loading && !error && wishes.length === 0 && (
            <div className="text-center text-elegant-black/60 font-serif text-xl italic py-20">
              The wish wall is currently empty. Be the first to leave a message!
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishes.map((wish, idx) => (
                <WishCard 
                  key={wish.id || idx} 
                  wish={wish} 
                  onLike={handleLike} 
                  index={idx} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ShareWidget />
    </>
  );
}
