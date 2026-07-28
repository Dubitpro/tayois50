import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import SEO from '../components/SEO';
import { ChevronDown, Sparkles, Clock, PenTool, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const calculateTimeLeft = (targetDate: string = "2026-08-09T00:00:00") => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft: { [key: string]: number } = {};

  if (difference > 0) {
    timeLeft = {
      Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    };
  } else {
    timeLeft = { Days: 0, Hours: 0 };
  }

  return timeLeft;
};

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  
  const [config, setConfig] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setTimeLeft(calculateTimeLeft(data.countdownDate));
      })
      .catch(console.error);
  }, []);
  
  // Hero Images State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    "https://i.pinimg.com/736x/d5/28/e7/d528e7797473d9d66b478f8cdc230dab.jpg",
    "https://i.pinimg.com/originals/92/89/9f/92899fb2d805df463febd6444206c987.jpg",
    "https://i.pinimg.com/originals/4f/0e/52/4f0e522bbe0f27794e91c25d66df7cb7.jpg",
    "https://i.pinimg.com/originals/73/ec/4a/73ec4a429e49beed3817641432a00c3a.jpg",
    "https://i.pinimg.com/originals/3e/a4/8c/3ea48cf9823f9e95a18c1787fa955f38.jpg"
  ];

  const sliderImages = [
    "https://i.pinimg.com/736x/52/81/2f/52812fdad4390e7e95c8509f91421644.jpg",
    "https://i.pinimg.com/736x/c6/e6/2b/c6e62b69ce27ce96c9af48d3d256441d.jpg",
    "https://i.pinimg.com/736x/db/ab/b1/dbabb170e17873422934ac3831359853.jpg",
    "https://i.pinimg.com/736x/88/a9/53/88a95334b962aeff0763c7b9566dd502.jpg",
    "https://i.pinimg.com/736x/23/d9/99/23d999fa8581fbbca9712f42eb172d60.jpg",
    "https://i.pinimg.com/736x/73/c1/06/73c10644ca72c6454f5a43de93756ef5.jpg"
  ];

  const mobileHeroImages = [
    "https://i.pinimg.com/736x/fb/f1/43/fbf14334f94186ecd1077639da4c768c.jpg",
    "https://i.pinimg.com/736x/b9/f0/38/b9f038fd9134e960488ba976fb172a92.jpg",
    "https://i.pinimg.com/736x/49/49/11/4949114018c15a5e6fa2067e94e266a1.jpg",
    "https://i.pinimg.com/736x/68/9f/53/689f531d57dd0f4630e5ad26fbfc5b9c.jpg",
    "https://i.pinimg.com/736x/6a/3b/55/6a3b55253d419f3f3b08ea9c1bd731ec.jpg"
  ];
  
  // Preload hero images for seamless transitions
  useEffect(() => {
    [...heroImages, ...mobileHeroImages].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const heroCaptions = config?.heroCaptions || [
    "A life beautified by God’s mercy",
    "Vessel of divine brilliance",
    "Demonstration of his unconditional love",
    "Evidence of heaven’s gentle touch.",
    "Living proof that God still does wonders"
  ];

  // AI Generator State
  const [aiName, setAiName] = useState('');
  const [aiCountry, setAiCountry] = useState('');
  const [aiTone, setAiTone] = useState('respectful,, and poetic');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(config?.countdownDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 12000);
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
        setAiResult("The scribes are currently unavailable. Please try again later.");
      }
    } catch (error) {
      setAiResult("An error occurred while crafting your tribute.");
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <>
      <SEO title="Home" description="Celebrating the 50th Golden Jubilee of our beloved Queen with an elegant, tribute." />
        
        
      

      {/* Hero Section */}
      <section className="relative h-[80svh] md:h-auto md:min-h-[100svh] lg:min-h-[120vh] flex items-center justify-center overflow-hidden -mt-24 pt-24">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0 bg-elegant-black">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          
          {/* Mobile Hero Images (Slideshow) */}
          <div className="absolute inset-0 w-full h-full md:hidden landscape:hidden">
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
                  src={mobileHeroImages[currentImageIndex]} 
                  alt="Portrait Mobile" 
                  className="absolute inset-0 w-full h-full object-cover object-[center_top]"
                  referrerPolicy="no-referrer"
                  fetchPriority="high"
                  decoding="async"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop & Landscape Hero Images (Slideshow) */}
          <div className="absolute inset-0 w-full h-full hidden md:block landscape:block">
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
                  alt="Portrait" 
                  className="absolute inset-0 w-full h-full object-cover object-[center_10%]"
                  referrerPolicy="no-referrer"
                  fetchPriority="high"
                  decoding="async"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="container relative z-20 mx-auto px-6 text-center md:text-left text-pearl-white translate-y-24 md:translate-y-0">
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-sans text-xs md:text-lg tracking-[0.3em] uppercase text-luxury-gold mb-4 whitespace-nowrap mx-auto md:mx-0"
          >
            {config?.heroTitleTop || "Celebrating 50 Glorious Years"}
          </motion.h2>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-cormorant text-5xl md:text-7xl lg:text-8xl font-medium mb-6 drop-shadow-lg"
          >
            {config?.heroTitleMain || "Golden Jubilee"}
          </motion.h1>
          
          <div className="h-12 md:h-20 mb-2 md:mb-4 max-w-2xl mx-auto md:mx-0">
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentImageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="font-serif text-sm md:text-2xl font-light italic text-pearl-white/90"
              >
                {heroCaptions[currentImageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Desktop Countdown (Small, no frame, below text) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.9 }}
            className="hidden md:flex justify-start w-full max-w-xl mx-0 mb-6"
          >
            <div className="flex gap-6">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center px-1">
                  <span className="font-cormorant text-2xl text-luxury-gold">{value.toString().padStart(2, '0')}</span>
                  <span className="font-sans text-[9px] uppercase tracking-widest text-pearl-white/70 mt-1">{unit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col items-center md:items-start gap-2 md:gap-5"
          >
            <Link 
              to="/guestbook" 
              className="mt-2 md:mt-0 inline-flex items-center justify-center md:justify-start gap-2 bg-luxury-gold text-elegant-black hover:bg-white transition-all duration-500 px-6 py-3 md:px-8 md:py-4 rounded shadow-[0_0_20px_rgba(212,175,55,0.4)] w-full sm:w-auto self-center md:self-start mx-auto md:mx-0"
            >
              <PenTool className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.1em]">
                Drop a Wish
              </span>
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

      {/* Sliding Photos Gallery */}
      <section className="py-24 bg-elegant-black overflow-hidden border-t border-b border-luxury-gold/20">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="font-cormorant text-4xl md:text-5xl text-luxury-gold mb-6">A Journey Through Time</h2>
          <div className="w-16 h-[1px] bg-luxury-gold/50 mx-auto mb-6"></div>
          <p className="font-serif text-lg italic text-soft-ivory/80 max-w-2xl mx-auto">
            A curated collection of unforgettable moments in time.
          </p>
        </div>
        
        {/* Infinite Slider */}
        <div className="w-full flex relative overflow-hidden group">
          <motion.div
            className="flex gap-8 px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ width: "max-content" }}
          >
            {[...sliderImages, ...sliderImages].map((img, idx) => (
              <div 
                key={idx} 
                className="w-[280px] h-[350px] md:w-[350px] md:h-[450px] flex-shrink-0 relative border border-luxury-gold/30 p-2 bg-soft-ivory/10"
              >
                <div className="w-full h-full relative overflow-hidden">
                  <img 
                    src={img} 
                    alt="Gallery Memory" 
                    className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Highlights / Features */}
      <section className="py-24 bg-pearl-white border-t border-b border-luxury-gold/20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {[
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
            <h2 className="font-cormorant text-4xl md:text-5xl text-elegant-black mb-6">Heartfelt Wishes</h2>
            <div className="w-16 h-[2px] bg-luxury-gold mx-auto mb-6"></div>
            <p className="font-serif italic text-elegant-black/70 text-lg">
              Allow our scribes (AI) to craft a beautifully articulated message on your behalf.
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
                  <option value="respectful,, and poetic">Respectful & Poetic</option>
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
                  {aiGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Heartfelt Wishes"}
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
                    Copy to Message of Love
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Floating CTA for Elder Users */}
    </>
  );
}
