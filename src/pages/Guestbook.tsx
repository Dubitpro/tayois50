import React from 'react';
import SEO from '../components/SEO';
import { PenTool } from 'lucide-react';
import GuestbookForm from '../components/guestbook/GuestbookForm';
import { useGuestbook } from '../hooks/useGuestbook';
import WishCard from '../components/guestbook/WishCard';
import { Link } from 'react-router-dom';

export default function Guestbook() {
  const { wishes, loading, error, handleLike } = useGuestbook();
  
  // Show only top 3 most recent wishes on the guestbook page to encourage visiting the Wish Wall
  const recentWishes = wishes.slice(0, 3);

  return (
    <>
      <SEO title="Message of Love" description="Leave a congratulatory message on her Golden Jubilee." />
      
      <div className="bg-soft-ivory py-24 min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          
          <div className="text-center mb-16">
            <PenTool className="w-12 h-12 text-luxury-gold mx-auto mb-6" />
            <h1 className="font-cormorant text-5xl md:text-7xl text-elegant-black mb-6">Message of Love</h1>
            <div className="w-24 h-[2px] bg-luxury-gold mx-auto mb-8"></div>
            <p className="font-serif text-xl italic text-elegant-black/70">Leave a congratulatory message.</p>
          </div>

          <GuestbookForm />

          {/* Recent Entries */}
          <div className="mt-24 space-y-8">
            <h3 className="font-cormorant text-3xl text-center text-elegant-black mb-10">Recent Messages</h3>
            
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-luxury-gold"></div>
              </div>
            )}
            
            {error && (
              <div className="text-center text-red-500 font-sans text-sm p-4 bg-red-50 rounded">
                Could not load recent messages. Please try again later.
              </div>
            )}

            {!loading && !error && recentWishes.length === 0 && (
              <div className="text-center text-elegant-black/60 font-serif italic py-8">
                Be the first to leave a message.
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              {recentWishes.map((wish, idx) => (
                <WishCard 
                  key={wish.id || idx} 
                  wish={wish} 
                  onLike={handleLike} 
                  index={idx} 
                />
              ))}
            </div>
            
            {!loading && wishes.length > 3 && (
              <div className="text-center mt-12">
                <Link to="/wishes" className="inline-block border border-luxury-gold text-elegant-black hover:bg-luxury-gold hover:text-white transition-colors px-8 py-3 font-sans text-sm uppercase tracking-widest">
                  View All Messages
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
