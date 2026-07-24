import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { Quote, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, increment, query, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import ShareWidget from '../components/ShareWidget';

interface Wish {
  id: string;
  name: string;
  country: string;
  message: string;
  likes?: number;
}

const withTimeout = <T,>(promise: Promise<T>, ms: number = 3000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Firebase operation timed out')), ms))
  ]);
};

export default function WishesWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        if (isFirebaseConfigured) {
          try {
            const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
            const querySnapshot = await withTimeout(getDocs(q));
            const data: Wish[] = [];
            querySnapshot.forEach((doc) => {
              data.push({ id: doc.id, ...doc.data() } as Wish);
            });
            
            if (data.length > 0) {
              setWishes(data);
              return;
            }
          } catch (fbError) {
            console.warn("Firebase fetch failed", fbError);
          }
        }

        try {
          const response = await fetch('/api/wishes');
          if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
            const data = await response.json();
            setWishes(data);
            return;
          }
        } catch (apiError) {
          console.warn("API fetch failed", apiError);
        }

        // Fallback to localStorage for Netlify without Firebase
        const localWishes = localStorage.getItem('wishes');
        if (localWishes) {
          setWishes(JSON.parse(localWishes));
        } else {
          // Default mock data
          setWishes([
            { id: '1', name: "Oluwaseun Adeyemi", country: "Nigeria", message: "A truly magnificent milestone for an extraordinary leader. Happy Golden Jubilee! Your wisdom and grace continue to inspire us all.", likes: 12 },
            { id: '2', name: "Sarah Jenkins", country: "United Kingdom", message: "Wishing you an unforgettable 50th birthday surrounded by those you love. Here’s to many more years of joy and prosperity.", likes: 5 },
            { id: '3', name: "David Osei", country: "Ghana", message: "Fifty years of excellence and counting. May this special day bring you immense happiness and peace.", likes: 8 },
            { id: '4', name: "Elena Rodriguez", country: "Spain", message: "Feliz cumpleaños! Thank you for the incredible impact you have made over the last five decades. Enjoy your celebration.", likes: 3 },
            { id: '5', name: "Michael Chang", country: "Canada", message: "A golden milestone for a heart of gold. Wishing you the happiest of birthdays and a wonderful year ahead.", likes: 20 },
            { id: '6', name: "Amina Bello", country: "Nigeria", message: "Your journey so far has been nothing short of inspiring. Cheers to 50 years of greatness and a future filled with even more blessings.", likes: 15 }
          ]);
        }
      } catch (error) {
        console.error("Error fetching wishes", error);
      }
    };

    fetchWishes();
  }, []);

  const handleLike = async (id: string) => {
    try {
      let isUpdated = false;

      if (isFirebaseConfigured) {
        try {
          const wishRef = doc(db, 'wishes', id);
          await withTimeout(updateDoc(wishRef, {
            likes: increment(1)
          }));
          isUpdated = true;
        } catch (fbError) {
          console.warn("Firebase update failed", fbError);
        }
      }

      if (!isUpdated) {
        try {
          const response = await fetch(`/api/wishes/${id}/like`, { method: 'POST' });
          if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
            isUpdated = true;
          }
        } catch (apiError) {
          console.warn("API update failed", apiError);
        }
      }

      if (!isUpdated) {
        // Fallback to localStorage
        try {
          const localWishes = localStorage.getItem('wishes');
          if (localWishes) {
            const parsedWishes = JSON.parse(localWishes);
            const updated = parsedWishes.map((w: Wish) => w.id === id ? { ...w, likes: (w.likes || 0) + 1 } : w);
            localStorage.setItem('wishes', JSON.stringify(updated));
            isUpdated = true;
          }
        } catch (storageError) {
          console.warn("LocalStorage update failed", storageError);
        }
      }

      if (isUpdated) {
        setWishes(wishes.map(w => w.id === id ? { ...w, likes: (w.likes || 0) + 1 } : w));
      }
    } catch (error) {
      console.error("Error liking wish", error);
    }
  };

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishes.map((wish, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-pearl-white p-10 border border-luxury-gold/20 shadow-sm relative group hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                <Quote className="w-8 h-8 text-luxury-gold/30 absolute top-8 left-8" />
                <p className="font-serif text-lg leading-relaxed text-elegant-black/80 mt-6 mb-8 relative z-10 italic flex-grow">
                  "{wish.message}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-soft-ivory border border-luxury-gold flex items-center justify-center text-luxury-gold font-cormorant text-xl shrink-0">
                    {wish.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-sans font-bold text-elegant-black text-sm uppercase tracking-widest">{wish.name}</h4>
                    <p className="font-sans text-xs text-elegant-black/50 uppercase tracking-widest">{wish.country}</p>
                  </div>
                  <button 
                    onClick={() => handleLike(wish.id)}
                    className="flex flex-col items-center justify-center gap-1 group/btn shrink-0"
                    aria-label="Like this wish"
                  >
                    <Heart className={`w-5 h-5 transition-colors ${wish.likes && wish.likes > 0 ? 'text-red-500 fill-red-500' : 'text-luxury-gold group-hover/btn:text-red-400'}`} />
                    <span className="font-sans text-[10px] text-elegant-black/60 font-bold">{wish.likes || 0}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
      <ShareWidget />
    </>
  );
}
