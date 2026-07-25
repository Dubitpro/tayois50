import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { submitWish } from '../../services/guestbookService';

const guestbookSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name is too long.").trim(),
  location: z.string().max(100, "Location is too long.").trim().optional(),
  message: z.string().min(10, "Message must be at least 10 characters.").max(1000, "Message is too long.").trim()
});

type GuestbookForm = z.infer<typeof guestbookSchema>;

export default function GuestbookForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GuestbookForm>({
    resolver: zodResolver(guestbookSchema)
  });

  const onSubmit = async (data: GuestbookForm) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const device = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
      await submitWish({ ...data, device });
      
      setSubmitSuccess(true);
      reset();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error("Error submitting guestbook entry:", error);
      setSubmitError("Failed to sign the guestbook. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-pearl-white p-8 md:p-12 border border-luxury-gold/30 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
      
      {submitSuccess && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 font-sans text-sm text-center rounded">
          Your message has been graciously received and is now on the Wish Wall.
        </div>
      )}
      
      {submitError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 font-sans text-sm text-center rounded">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2">Full Name</label>
            <input 
              {...register("fullName")}
              className="w-full bg-transparent border-b border-luxury-gold/40 py-2 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg text-elegant-black"
              placeholder="e.g. Lord Harrington"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2">Location (Optional)</label>
            <input 
              {...register("location")}
              className="w-full bg-transparent border-b border-luxury-gold/40 py-2 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg text-elegant-black"
              placeholder="e.g. United Kingdom"
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
        </div>
        
        <div>
          <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2">Your Message</label>
          <textarea 
            {...register("message")}
            rows={4}
            className="w-full bg-transparent border-b border-luxury-gold/40 py-2 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg resize-none text-elegant-black"
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
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}
