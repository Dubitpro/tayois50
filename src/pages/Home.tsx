import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import SEO from '../components/SEO';
import { ChevronDown, Sparkles, Clock, PenTool, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const calculateTimeLeft = () => {
  // Let's set a date in the future for the Jubilee (August 9th)
  const difference = +new Date("2026-08-09T00:00:00") - +new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  return timeLeft;
};

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  
  // Hero Images State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    "https://i.pinimg.com/736x/77/ad/26/77ad26768f809a4206f189ed9bbe7799.jpg",
    "https://i.pinimg.com/736x/74/40/da/7440da71cf7f8fe433f39e62977c8f5a.jpg",
    "https://i.pinimg.com/736x/f1/e1/12/f1e112e87f4f46e64423d088fc0d1c8f.jpg"
  ];
  const heroCaptions = [
    "A legacy of elegance and strength.",
    "Grace that transcends time.",
    "Radiance in every moment."
  ];

  // AI Generator State
  const [aiName, setAiName] = useState('');
  const [aiCountry, setAiCountry] = useState('');
  const [aiTone, setAiTone] = useState('respectful, royal, and poetic');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateTribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiName || !aiCountry) return;
    
    setAiGenerating(true);
    setAiResult('');

    try {
      const response = await fetch('/api/generate-tribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: aiName, country: aiCountry, tone: aiTone }),
      });
      const data = await response.json();
      if (data.message) {
        setAiResult(data.message);
      } else {
        setAiResult("The royal scribes are currently unavailable. Please try again later.");
      }
    } catch (error) {
      setAiResult("An error occurred while crafting your tribute.");
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <>
      <SEO title="Home" description="Celebrating the 50th Golden Jubilee of our beloved Queen with an elegant, royal tribute." />
        
        
      

      {/* Hero Section */}
      <section className="relative h-[80svh] md:h-auto md:min-h-[100svh] lg:min-h-[120vh] flex items-center justify-center overflow-hidden -mt-24 pt-24">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0 bg-elegant-black">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          
          {/* Mobile Hero Image (Static) */}
          <div className="absolute inset-0 w-full h-full md:hidden">
            <img 
              src="https://i.pinimg.com/736x/4b/62/ca/4b62caa88760bc422fa59197ed1fb1d8.jpg" 
              alt="Royal Portrait Mobile" 
              className="absolute inset-0 w-full h-full object-cover object-[center_top]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Hero Images (Slideshow) */}
          <div className="absolute inset-0 w-full h-full hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <motion.img 
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  src={heroImages[currentImageIndex]} 
                  alt="Royal Portrait" 
                  className="absolute inset-0 w-full h-full object-cover object-[center_10%]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="container relative z-20 mx-auto px-6 text-left text-pearl-white -translate-y-8 md:translate-y-0">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-sans text-sm md:text-lg tracking-[0.3em] uppercase text-luxury-gold mb-4"
          >
            Celebrating 50 <br className="md:hidden" /> Glorious Years
          </motion.h2>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-cormorant text-6xl md:text-8xl lg:text-9xl font-medium mb-6 drop-shadow-lg"
          >
            Golden Jubilee
          </motion.h1>
          
          <div className="h-12 md:h-20 mb-2 md:mb-4 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentImageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
                className="font-serif text-base md:text-2xl font-light italic text-pearl-white/90"
              >
                {heroCaptions[currentImageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col items-start gap-2 md:gap-5"
          >
            {/* Countdown */}
            <div className="flex gap-2 md:gap-6 justify-start border-y border-luxury-gold/30 py-2 md:py-3 w-full max-w-xl backdrop-blur-sm bg-elegant-black/20">
              {Object.entries(timeLeft).map(([unit, value], idx) => (
                <div key={unit} className="flex flex-col items-center px-2 md:px-4">
                  <span className="font-cormorant text-xl md:text-4xl text-luxury-gold">{value.toString().padStart(2, '0')}</span>
                  <span className="font-sans text-[8px] md:text-[10px] uppercase tracking-widest text-pearl-white/70 mt-1">{unit}</span>
                </div>
              ))}
            </div>

            <Link 
              to="/guestbook" 
              className="inline-block border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-elegant-black transition-all duration-500 px-4 py-2 md:px-6 md:py-3 uppercase tracking-[0.2em] text-[10px] md:text-xs font-medium"
            >
              Sign the Guestbook
            </Link>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8 text-luxury-gold/70" />
        </motion.div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-soft-ivory relative overflow-hidden">
        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
          <h3 className="font-cormorant text-4xl md:text-5xl leading-tight text-elegant-black mb-8">
            "To live a life of purpose is to leave a legacy of love, compassion, and unwavering strength."
          </h3>
          <div className="w-16 h-[2px] bg-luxury-gold mx-auto mb-6"></div>
          <p className="font-sans uppercase tracking-widest text-sm text-elegant-black/60 mb-8">
            Her Majesty The Queen
          </p>
          <div className="flex justify-center opacity-80">
            <svg width="250" height="80" viewBox="0 0 250 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform scale-125">
              <motion.path 
                d="M30,50 C40,20 50,10 60,40 C65,60 75,70 85,50 C95,20 100,10 110,30 C115,45 125,50 140,40 C160,25 170,10 180,40 C185,55 195,60 210,50 C220,40 230,30 240,50"
                stroke="#C5A059" 
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.path 
                d="M45,45 L75,45 M95,35 L125,35"
                stroke="#C5A059" 
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, ease: "easeInOut", delay: 3 }}
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Highlights / Features */}
      <section className="py-24 bg-pearl-white border-t border-b border-luxury-gold/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "The Legacy", desc: "Explore fifty years of outstanding achievements and global impact.", link: "/biography" },
              { title: "Royal Gallery", desc: "A curated collection of unforgettable moments in time.", link: "/gallery" },
              { title: "Wishes Wall", desc: "Read heartfelt messages from dignitaries and citizens worldwide.", link: "/wishes" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-soft-ivory p-12 text-center shadow-sm border border-luxury-gold/10 group"
              >
                <h4 className="font-cormorant text-3xl text-elegant-black mb-4 group-hover:text-luxury-gold transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="font-sans text-elegant-black/70 mb-8 leading-relaxed">
                  {item.desc}
                </p>
                <Link to={item.link} className="text-sm uppercase tracking-widest text-luxury-gold font-medium hover:underline underline-offset-4">
                  Discover
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tribute Generator */}
      <section className="py-24 bg-soft-ivory relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <PenTool className="w-8 h-8 text-luxury-gold mx-auto mb-6" />
            <h2 className="font-cormorant text-4xl md:text-5xl text-elegant-black mb-6">Draft a Royal Tribute</h2>
            <div className="w-16 h-[2px] bg-luxury-gold mx-auto mb-6"></div>
            <p className="font-serif italic text-elegant-black/70 text-lg">
              Allow our royal scribes (AI) to craft a beautifully articulated message on your behalf.
            </p>
          </div>

          <div className="bg-pearl-white p-8 md:p-12 border border-luxury-gold/30 shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
            
            <form onSubmit={handleGenerateTribute} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2">Your Name</label>
                  <input 
                    type="text"
                    required
                    value={aiName}
                    onChange={(e) => setAiName(e.target.value)}
                    className="w-full bg-transparent border-b border-luxury-gold/40 py-2 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg"
                    placeholder="e.g. Lord Harrington"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2">Your Country</label>
                  <input 
                    type="text"
                    required
                    value={aiCountry}
                    onChange={(e) => setAiCountry(e.target.value)}
                    className="w-full bg-transparent border-b border-luxury-gold/40 py-2 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg"
                    placeholder="e.g. United Kingdom"
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/60 mb-2">Desired Tone</label>
                <select 
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="w-full bg-transparent border-b border-luxury-gold/40 py-2 focus:outline-none focus:border-luxury-gold transition-colors font-serif text-lg appearance-none cursor-pointer"
                >
                  <option value="respectful, royal, and poetic">Respectful & Poetic</option>
                  <option value="grand, historic, and celebratory">Grand & Celebratory</option>
                  <option value="warm, heartfelt, and graceful">Warm & Heartfelt</option>
                </select>
              </div>

              <div className="text-center pt-6">
                <button 
                  type="submit" 
                  disabled={aiGenerating}
                  className="inline-flex items-center justify-center gap-2 bg-elegant-black text-luxury-gold px-12 py-4 font-sans text-sm uppercase tracking-widest hover:bg-elegant-black/90 transition-colors disabled:opacity-70"
                >
                  {aiGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Draft Tribute"}
                </button>
              </div>
            </form>

            <AnimatePresence>
              {aiResult && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-10 pt-10 border-t border-luxury-gold/20 text-center"
                >
                  <Sparkles className="w-6 h-6 text-luxury-gold/50 mx-auto mb-4" />
                  <p className="font-serif text-xl italic text-elegant-black/80 leading-relaxed mb-8">
                    "{aiResult}"
                  </p>
                  <Link 
                    to="/guestbook" 
                    className="text-xs uppercase tracking-widest text-luxury-gold font-bold hover:underline underline-offset-4"
                  >
                    Copy to Guestbook
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
