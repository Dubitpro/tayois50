import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Heart, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { messageSchema, MessageFormData } from '../utils/validators';
import { submitMessage } from '../services/messageService';
import { useAuth } from '../hooks/useAuth';

export default function MessageForm() {
  const { user, error: authError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema)
  });

  const messageText = watch('message') || '';
  const charsRemaining = 500 - messageText.length;

  const onSubmit = async (data: MessageFormData) => {
    if (!user) {
      setSubmitError("You must be connected to submit a message.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await submitMessage(data, user.uid);
      
      setSubmitSuccess(true);
      reset();
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Failed to submit message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-luxury-gold/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
      
      <AnimatePresence>
        {submitSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-8 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200 text-green-800 font-sans text-sm flex items-center justify-center gap-2 rounded-xl"
            role="alert"
          >
            <CheckCircle className="w-4 h-4" />
            Your message has been beautifully placed on the Wish Wall.
          </motion.div>
        )}
      </AnimatePresence>
      
      {submitError && (
        <div className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-800 font-sans text-sm text-center rounded-xl" role="alert">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2 font-medium">Full Name</label>
            <input 
              id="fullName"
              {...register("fullName")}
              aria-invalid={errors.fullName ? "true" : "false"}
              className={`w-full bg-transparent border-b ${errors.fullName ? 'border-red-400' : 'border-luxury-gold/30'} py-3 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg text-elegant-black placeholder:text-elegant-black/30`}
              placeholder="e.g. Lord Harrington"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-2" role="alert">{errors.fullName.message}</p>}
          </div>
          <div>
            <label htmlFor="country" className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2 font-medium">Country</label>
            <input 
              id="country"
              {...register("country")}
              aria-invalid={errors.country ? "true" : "false"}
              className={`w-full bg-transparent border-b ${errors.country ? 'border-red-400' : 'border-luxury-gold/30'} py-3 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg text-elegant-black placeholder:text-elegant-black/30`}
              placeholder="e.g. United Kingdom"
            />
            {errors.country && <p className="text-red-500 text-xs mt-2" role="alert">{errors.country.message}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="message" className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2 font-medium">Your Message</label>
          <textarea 
            id="message"
            {...register("message")}
            rows={5}
            aria-invalid={errors.message ? "true" : "false"}
            className={`w-full bg-transparent border-b ${errors.message ? 'border-red-400' : 'border-luxury-gold/30'} py-3 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg resize-none text-elegant-black placeholder:text-elegant-black/30 leading-relaxed`}
            placeholder="Write your heartfelt wishes here..."
          ></textarea>
          
          <div className="flex justify-between items-center mt-2">
            {errors.message ? (
              <p className="text-red-500 text-xs" role="alert">{errors.message.message}</p>
            ) : (
              <span className="text-transparent">Placeholder</span>
            )}
            <span className={`text-xs font-sans ${charsRemaining < 0 ? 'text-red-500' : 'text-elegant-black/40'}`}>
              {charsRemaining} remaining
            </span>
          </div>
        </div>

        <div className="text-center pt-8">
          <button 
            type="submit" 
            disabled={isSubmitting || !user}
            className="inline-flex items-center justify-center gap-3 bg-elegant-black text-luxury-gold px-12 py-4 font-sans text-sm uppercase tracking-widest hover:bg-elegant-black/90 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Send Message <Heart className="w-4 h-4" />
              </>
            )}
          </button>
          {!user && !authError && (
            <p className="text-xs text-elegant-black/50 mt-4">Connecting securely...</p>
          )}
          {authError && (
            <p className="text-xs text-red-500 mt-4 max-w-sm mx-auto">{authError}</p>
          )}
        </div>
      </form>
    </div>
  );
}
