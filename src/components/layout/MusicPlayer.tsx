import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, ListMusic, X, Music, Loader2 } from 'lucide-react';
import { collection, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { cn } from '../../lib/utils';

interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  duration?: number;
}

export default function MusicPlayer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoplayFailed, setAutoplayFailed] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoplayAttempted = useRef(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'music'), where('published', '==', true), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTracks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Unknown Title',
          artist: data.artist || 'Unknown Artist',
          coverImage: data.coverUrl || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=200',
          audioUrl: data.audioUrl || '',
          duration: data.duration || 0,
        };
      }).filter(track => track.audioUrl !== '') as Track[];
      
      setTracks(fetchedTracks);
      setLoading(false);
      
      if (fetchedTracks.length > 0) {
        setCurrentTrackIndex(prev => Math.min(prev, fetchedTracks.length - 1));
        
        setTimeout(() => {
          if (!autoplayAttempted.current && audioRef.current) {
            autoplayAttempted.current = true;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                setIsPlaying(true);
                setAutoplayFailed(false);
              }).catch(err => {
                console.error("Initial autoplay prevented by browser:", err);
                setIsPlaying(false);
                setAutoplayFailed(true);
              });
            }
          }
        }, 100);
      }
    }, (err) => {
      console.error("Failed to fetch music", err);
      setError("Failed to load music.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || tracks.length === 0) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Play prevented", e));
      setAutoplayFailed(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  const nextTrack = () => {
    if (isShuffle) {
      setCurrentTrackIndex(Math.floor(Math.random() * tracks.length));
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
    setIsPlaying(true);
    setAutoplayFailed(false);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
    setAutoplayFailed(false);
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Play prevented", e));
      }
    } else {
      nextTrack();
    }
  };

  const handleError = () => {
    console.error("Error playing audio track:", tracks[currentTrackIndex]?.audioUrl);
    if (isPlaying) {
      nextTrack();
    }
  };

  const handleCanPlay = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Autoplay prevented:", err);
        setIsPlaying(false);
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-elegant-black/95 rounded-full shadow-2xl border border-luxury-gold/50">
        <Loader2 className="w-5 h-5 text-luxury-gold animate-spin" />
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-elegant-black/95 backdrop-blur-xl border border-luxury-gold/50 rounded-full shadow-2xl flex items-center px-4 py-2">
           <Music className="text-luxury-gold/50 w-5 h-5 mr-3" />
           <p className="text-white/60 text-xs uppercase tracking-wider font-sans">No music available</p>
        </div>
      </div>
    );
  }

  const currentTrack = tracks[currentTrackIndex];

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
        onError={handleError}
      />
      
      <div className="fixed bottom-6 right-6 z-50 flex items-end">
        {/* Playlist Drawer */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-full right-0 mb-4 w-72 bg-white/90 backdrop-blur-xl border border-luxury-gold/30 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-luxury-gold/10 flex justify-between items-center bg-soft-ivory">
                <h3 className="font-cormorant font-bold text-lg text-elegant-black">Playlist</h3>
                <button onClick={() => setShowPlaylist(false)} className="text-elegant-black/60 hover:text-elegant-black">
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {tracks.map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      setCurrentTrackIndex(idx);
                      setIsPlaying(true);
                      setAutoplayFailed(false);
                    }}
                    className={cn(
                      "w-full text-left p-3 flex items-center gap-3 transition-colors hover:bg-soft-ivory",
                      idx === currentTrackIndex ? "bg-luxury-gold/10" : ""
                    )}
                  >
                    <img src={track.coverImage} alt={track.title} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium truncate", idx === currentTrackIndex ? "text-luxury-gold" : "text-elegant-black")}>
                        {track.title}
                      </p>
                      <p className="text-xs text-elegant-black/60 truncate">{track.artist}</p>
                    </div>
                    {idx === currentTrackIndex && isPlaying && (
                      <div className="w-4 h-4 flex items-end gap-[2px]">
                        <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-luxury-gold rounded-full" />
                        <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 bg-luxury-gold rounded-full" />
                        <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 bg-luxury-gold rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap to Play Prompt (Autoplay failed) */}
        <AnimatePresence>
          {autoplayFailed && !isPlaying && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="absolute right-[115%] bottom-2 bg-luxury-gold text-elegant-black font-sans text-xs font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap flex items-center gap-2 cursor-pointer"
              onClick={() => {
                 setAutoplayFailed(false);
                 togglePlay();
              }}
            >
              <span>Tap to Play</span>
              <Play size={12} className="fill-current" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Container */}
        <motion.div 
          className={cn(
            "bg-elegant-black/95 backdrop-blur-xl border border-luxury-gold/50 rounded-full shadow-2xl flex items-center transition-all duration-500",
            isExpanded ? "p-2 pr-4" : "p-2"
          )}
          layout
        >
          {/* Cover & Expand Button */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-luxury-gold flex-shrink-0 group"
          >
            <img src={currentTrack.coverImage} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Music className="text-white w-5 h-5" />
            </div>
          </button>

          {/* Expanded Controls */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden flex items-center pl-4 pr-2"
              >
                <div className="mr-6 w-32">
                  <p className="text-white text-sm font-medium truncate">{currentTrack.title}</p>
                  <p className="text-luxury-gold text-xs truncate">{currentTrack.artist}</p>
                </div>

                <div className="flex items-center gap-4 text-white">
                  <button onClick={() => setIsShuffle(!isShuffle)} className={cn("transition-colors", isShuffle ? "text-luxury-gold" : "text-white/50 hover:text-white")}>
                    <Shuffle size={16} />
                  </button>
                  <button onClick={prevTrack} className="text-white/80 hover:text-white transition-colors">
                    <SkipBack size={20} />
                  </button>
                  <button 
                    onClick={togglePlay} 
                    className="w-10 h-10 rounded-full bg-luxury-gold text-elegant-black flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
                  </button>
                  <button onClick={nextTrack} className="text-white/80 hover:text-white transition-colors">
                    <SkipForward size={20} />
                  </button>
                  <button onClick={() => setIsRepeat(!isRepeat)} className={cn("transition-colors", isRepeat ? "text-luxury-gold" : "text-white/50 hover:text-white")}>
                    <Repeat size={16} />
                  </button>
                </div>

                <div className="h-8 w-[1px] bg-white/20 mx-4" />

                <div className="flex items-center gap-3">
                  <button onClick={() => setShowPlaylist(!showPlaylist)} className={cn("transition-colors", showPlaylist ? "text-luxury-gold" : "text-white/50 hover:text-white")}>
                    <ListMusic size={18} />
                  </button>
                  <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white">
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <div className="w-16 h-1 bg-white/20 rounded-full cursor-pointer relative group" onClick={(e) => {
                    const bounds = e.currentTarget.getBoundingClientRect();
                    setVolume(Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width)));
                    setIsMuted(false);
                  }}>
                    <div className="absolute inset-y-0 left-0 bg-luxury-gold rounded-full group-hover:bg-luxury-gold/80" style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Progress Bar (Visible even when collapsed if expanded is false? No, let's keep it clean) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div className="h-full bg-luxury-gold" style={{ width: `${progress}%` }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
