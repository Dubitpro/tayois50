import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, ListMusic, X, Music } from 'lucide-react';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';
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

const FALLBACK_TRACKS: Track[] = [
  {
    id: 't1',
    title: 'Dansaki',
    artist: 'Lara George',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Placeholder: Requires direct .mp3 link
  },
  {
    id: 't2',
    title: 'Ore Òfé Shá',
    artist: 'Rotimikeys',
    coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' // Placeholder: Requires direct .mp3 link
  },
  {
    id: 't3',
    title: 'Gratitude',
    artist: 'Brandon Lake',
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' // Placeholder: Requires direct .mp3 link
  },
  {
    id: 't4',
    title: "Kos'oba Bi Re",
    artist: 'Psalmos Ft. Tope Alabi',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' // Placeholder: Requires direct .mp3 link
  },
  {
    id: 't5',
    title: 'All',
    artist: 'Chandler Moore',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?auto=format&fit=crop&q=80&w=200',
    audioUrl: '/all-chandler-moore.mp3'
  }
];

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const q = query(collection(db, 'playlist'), where('active', '==', true), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const fetchedTracks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Track[];
        
        if (fetchedTracks.length > 0) {
          setTracks(fetchedTracks);
        } else {
          setTracks(FALLBACK_TRACKS);
        }
      } catch (err) {
        console.error("Failed to fetch playlist", err);
        setTracks(FALLBACK_TRACKS);
      }
    };
    fetchTracks();
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
      audioRef.current.play();
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
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
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

  if (tracks.length === 0) return null;

  const currentTrack = tracks[currentTrackIndex];

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
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
