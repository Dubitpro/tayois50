import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Heart, CheckCircle, Video, Type, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { wishPostSchema, WishPostFormData } from '../utils/validators';
import { submitWishPost, uploadVideo } from '../services/wishPostsService';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export default function MessageForm() {
  const { user, error: authError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [postType, setPostType] = useState<'text' | 'video'>('text');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch, formState: { errors }, setValue } = useForm<WishPostFormData>({
    resolver: zodResolver(wishPostSchema),
    defaultValues: {
      type: 'text'
    }
  });

  const messageText = watch('message') || '';
  const charsRemaining = 2000 - messageText.length;
  
  const captionText = watch('caption') || '';
  const captionCharsRemaining = 500 - captionText.length;

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
      if (!validTypes.includes(file.type)) {
        setSubmitError("Unsupported format. Please upload MP4, MOV, or WebM videos.");
        return;
      }
      
      // Limit to 100MB
      if (file.size > 100 * 1024 * 1024) {
        setSubmitError("Video file size must be less than 100MB");
        return;
      }
      setVideoFile(file);
      setSubmitError(null);
    }
  };

  const onSubmit = async (data: WishPostFormData) => {
    if (!user) {
      setSubmitError("You must be connected to submit a message.");
      return;
    }
    
    if (postType === 'video' && !videoFile) {
      setSubmitError("Please select a video file to upload.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      let videoUrl = '';
      if (postType === 'video' && videoFile) {
        videoUrl = await uploadVideo(videoFile, user.uid, (progress) => {
          setUploadProgress(progress);
        });
      }

      await submitWishPost({
        ...data,
        type: postType,
        videoUrl: videoUrl || undefined,
      }, user.uid);
      
      setSubmitSuccess(true);
      reset();
      setPostType('text');
      setVideoFile(null);
      setUploadProgress(0);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Failed to submit post. Please try again.");
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
            Your {postType === 'video' ? 'video wish' : 'message'} has been beautifully placed on the Wish Wall.
          </motion.div>
        )}
      </AnimatePresence>
      
      {submitError && (
        <div className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-800 font-sans text-sm text-center rounded-xl" role="alert">
          {submitError}
        </div>
      )}

      {/* Type Selector */}
      <div className="flex gap-4 mb-8">
        <button
          type="button"
          onClick={() => { setPostType('text'); setValue('type', 'text'); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all",
            postType === 'text' 
              ? "border-luxury-gold bg-luxury-gold/10 text-elegant-black font-semibold" 
              : "border-gray-200 bg-white/50 text-gray-500 hover:bg-gray-50"
          )}
        >
          <Type size={18} />
          Text Message
        </button>
        <button
          type="button"
          onClick={() => { setPostType('video'); setValue('type', 'video'); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all",
            postType === 'video' 
              ? "border-luxury-gold bg-luxury-gold/10 text-elegant-black font-semibold" 
              : "border-gray-200 bg-white/50 text-gray-500 hover:bg-gray-50"
          )}
        >
          <Video size={18} />
          Video Wish
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2 font-medium">Full Name</label>
            <input 
              id="fullName"
              {...register("fullName")}
              aria-invalid={errors.fullName ? "true" : "false"}
              className={`w-full bg-transparent border-b ${errors.fullName ? 'border-red-400' : 'border-luxury-gold/30'} py-3 focus:outline-none focus:border-luxury-gold transition-colors font-cormorant text-lg text-elegant-black placeholder:text-elegant-black/30`}
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
              className={`w-full bg-transparent border-b ${errors.country ? 'border-red-400' : 'border-luxury-gold/30'} py-3 focus:outline-none focus:border-luxury-gold transition-colors font-cormorant text-lg text-elegant-black placeholder:text-elegant-black/30`}
              placeholder="e.g. United Kingdom"
            />
            {errors.country && <p className="text-red-500 text-xs mt-2" role="alert">{errors.country.message}</p>}
          </div>
        </div>

        {postType === 'text' ? (
          <div>
            <label htmlFor="message" className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2 font-medium">Your Message</label>
            <textarea 
              id="message"
              {...register("message")}
              rows={5}
              aria-invalid={errors.message ? "true" : "false"}
              className={`w-full bg-transparent border-b ${errors.message ? 'border-red-400' : 'border-luxury-gold/30'} py-3 focus:outline-none focus:border-luxury-gold transition-colors font-cormorant text-lg resize-none text-elegant-black placeholder:text-elegant-black/30 leading-relaxed`}
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
        ) : (
          <div className="space-y-6">
            <div>
              <label htmlFor="caption" className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2 font-medium">Caption (Optional)</label>
              <textarea 
                id="caption"
                {...register("caption")}
                rows={2}
                aria-invalid={errors.caption ? "true" : "false"}
                className={`w-full bg-transparent border-b ${errors.caption ? 'border-red-400' : 'border-luxury-gold/30'} py-3 focus:outline-none focus:border-luxury-gold transition-colors font-cormorant text-lg resize-none text-elegant-black placeholder:text-elegant-black/30 leading-relaxed`}
                placeholder="Add a short caption..."
              ></textarea>
              <div className="flex justify-end mt-2">
                <span className={`text-xs font-sans ${captionCharsRemaining < 0 ? 'text-red-500' : 'text-elegant-black/40'}`}>
                  {captionCharsRemaining} remaining
                </span>
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2 font-medium">Upload Video</label>
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                  videoFile ? "border-luxury-gold bg-luxury-gold/5" : "border-gray-300 hover:border-luxury-gold hover:bg-gray-50"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  accept="video/mp4,video/quicktime,video/webm" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleVideoSelect}
                />
                
                {videoFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <Video className="w-8 h-8 text-luxury-gold" />
                    <p className="text-elegant-black font-medium">{videoFile.name}</p>
                    <p className="text-sm text-gray-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <button type="button" className="text-xs text-luxury-gold uppercase tracking-wider mt-2 hover:underline" onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Upload className="w-8 h-8 mb-2 opacity-50" />
                    <p className="font-medium text-elegant-black">Click to upload video</p>
                    <p className="text-sm">MP4, WebM (Max 100MB)</p>
                  </div>
                )}
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-elegant-black/60 mb-1">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-luxury-gold h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
                Post Wish <Heart className="w-4 h-4" />
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
