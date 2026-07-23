import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PenTool, Loader2 } from 'lucide-react';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const guestbookSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  country: z.string().min(2, "Country is required."),
  message: z.string().min(10, "Message must be at least 10 characters.")
});

type GuestbookForm = z.infer<typeof guestbookSchema>;

interface GuestbookEntry {
  id: string;
  name: string;
  country: string;
  message: string;
  createdAt: string;
  likes?: number;
}

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GuestbookForm>({
    resolver: zodResolver(guestbookSchema)
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      // First try to fetch from Firebase
      try {
        const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data: GuestbookEntry[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as GuestbookEntry);
        });
        
        if (data.length > 0) {
          setEntries(data);
          return;
        }
      } catch (fbError) {
        console.warn("Firebase fetch failed, falling back to local API", fbError);
      }

      // Fallback to local API for development if Firebase is not configured
      const response = await fetch('/api/wishes');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Error fetching guestbook entries:", error);
    }
  };

  const onSubmit = async (data: GuestbookForm) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      try {
        // Try Firebase first
        await addDoc(collection(db, 'wishes'), {
          ...data,
          createdAt: serverTimestamp(),
          likes: 0
        });
      } catch (fbError) {
        console.warn("Firebase save failed, falling back to local API", fbError);
        // Fallback to local API
        const response = await fetch('/api/wishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error("Failed to post");
      }
      
      setSubmitSuccess(true);
      reset();
      fetchEntries();
    } catch (error) {
      console.error("Error adding document: ", error);
      setSubmitError("Failed to sign the guestbook. Please try again. Ensure Firebase Environment Variables are set in Netlify.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Royal Guestbook" description="Leave a congratulatory message for Her Majesty on her Golden Jubilee." />
        
      

      <div className="bg-soft-ivory py-24 min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          
          <div className="text-center mb-16">
            <PenTool className="w-12 h-12 text-luxury-gold mx-auto mb-6" />
            <h1 className="font-cormorant text-5xl md:text-7xl text-elegant-black mb-6">The Royal Guestbook</h1>
            <div className="w-24 h-[2px] bg-luxury-gold mx-auto mb-8"></div>
            <p className="font-serif text-xl italic text-elegant-black/70">Leave a congratulatory message for Her Majesty.</p>
          </div>

          {/* Form */}
          <div className="bg-pearl-white p-8 md:p-12 border border-luxury-gold/30 shadow-sm mb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
            
            {submitSuccess && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 font-sans text-sm text-center">
                Your message has been graciously received in the Royal Guestbook.
              </div>
            )}
            
            {submitError && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 font-sans text-sm text-center">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2">Full Name</label>
                  <input 
                    {...register("name")}
                    className="w-full bg-transparent border-b border-luxury-gold/40 py-2 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg"
                    placeholder="e.g. Lord Harrington"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2">Country</label>
                  <input 
                    {...register("country")}
                    className="w-full bg-transparent border-b border-luxury-gold/40 py-2 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg"
                    placeholder="e.g. United Kingdom"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                </div>
              </div>
              
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2">Your Message</label>
                <textarea 
                  {...register("message")}
                  rows={4}
                  className="w-full bg-transparent border-b border-luxury-gold/40 py-2 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg resize-none"
                  placeholder="Your birthday wishes..."
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <div className="text-center pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 bg-elegant-black text-luxury-gold px-12 py-4 font-sans text-sm uppercase tracking-widest hover:bg-elegant-black/90 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Guestbook"}
                </button>
              </div>
            </form>
          </div>

          {/* Entries */}
          <div className="space-y-8">
            <h3 className="font-cormorant text-3xl text-center text-elegant-black mb-10">Recent Signatures</h3>
            {entries.map((entry, idx) => (
              <motion.div 
                key={entry.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 border-l-4 border-luxury-gold bg-pearl-white/50"
              >
                <p className="font-serif text-lg italic text-elegant-black/80 mb-4 leading-relaxed">
                  "{entry.message}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-[1px] bg-luxury-gold/50"></div>
                  <div>
                    <span className="font-sans font-bold text-elegant-black uppercase tracking-widest text-xs block">
                      {entry.name}
                    </span>
                    <span className="font-sans text-elegant-black/50 text-xs">
                      {entry.country}
                    </span>
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
