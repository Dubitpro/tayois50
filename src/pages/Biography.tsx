import React, { useState } from 'react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Heart, Globe, Plus, Minus } from 'lucide-react';

export default function Biography() {
  const [activeTimelineIdx, setActiveTimelineIdx] = useState<number | null>(null);

  const timeline = [
    { year: "1976", title: "Early Life", desc: "Born into a legacy of grace and leadership, showing early signs of compassion and brilliance.", details: "Her early years were marked by a profound curiosity for global cultures and an innate desire to serve her community. Mentored by prominent leaders, she developed the foundational values that would guide her life's work." },
    { year: "1998", title: "Global Philanthropy", desc: "Established the first foundation dedicated to education and women's empowerment across continents.", details: "The foundation quickly grew to support over 500 schools globally, providing scholarships to thousands of young women and creating sustainable community programs." },
    { year: "2010", title: "Business Empire", desc: "Expanded the royal enterprise into a global lifestyle and luxury conglomerate.", details: "Under her visionary leadership, the enterprise diversified into sustainable luxury, ethical fashion, and eco-friendly real estate, setting new standards for corporate responsibility." },
    { year: "2026", title: "Golden Jubilee", desc: "Celebrating 50 years of an extraordinary life, marked by global recognition and unwavering devotion to her people.", details: "A momentous occasion celebrating half a century of unbroken service, cultural preservation, and a legacy that will inspire generations to come." }
  ];

  return (
    <>
      <SEO title="Biography" description="Discover the extraordinary journey and 50-year legacy of Her Majesty The Queen." />
        
      

      <div className="bg-soft-ivory py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          
          <div className="text-center mb-20">
            <h1 className="font-cormorant text-5xl md:text-7xl text-elegant-black mb-6">Her Majesty's Journey</h1>
            <div className="w-24 h-[2px] bg-luxury-gold mx-auto mb-8"></div>
            <p className="font-serif text-xl italic text-elegant-black/70">A life dedicated to service, elegance, and global impact.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative p-4 border-2 border-luxury-gold">
                <img 
                  src="https://i.pinimg.com/736x/1d/50/60/1d50608f161ad14553b1bd4c7dd7abd3.jpg" 
                  alt="Portrait" 
                  className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="font-cormorant text-4xl text-elegant-black">A Visionary Leader</h2>
              <p className="font-sans text-elegant-black/80 leading-relaxed text-lg">
                For half a century, Her Majesty has been a beacon of hope and a symbol of unwavering elegance. Through visionary leadership and a profound commitment to humanity, she has transformed the landscape of global philanthropy and business.
              </p>
              <p className="font-sans text-elegant-black/80 leading-relaxed text-lg">
                Her royal legacy is not merely defined by titles, but by the countless lives touched through her foundations, her pioneering spirit in entrepreneurship, and her timeless grace that continues to inspire generations.
              </p>
            </motion.div>
          </div>

          <div className="mb-32">
            <h3 className="font-cormorant text-4xl text-center text-elegant-black mb-16">The Golden Timeline</h3>
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-luxury-gold/50 before:to-transparent">
              {timeline.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group cursor-pointer"
                  onClick={() => setActiveTimelineIdx(activeTimelineIdx === idx ? null : idx)}
                >
                  <motion.div 
                    animate={{ scale: activeTimelineIdx === idx ? 1.2 : 1 }}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${activeTimelineIdx === idx ? 'border-luxury-gold bg-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.6)]' : 'border-luxury-gold bg-soft-ivory shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:bg-luxury-gold/20'}`}
                  >
                    <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${activeTimelineIdx === idx ? 'bg-pearl-white' : 'bg-luxury-gold group-hover:bg-luxury-gold'}`}></div>
                  </motion.div>
                  <motion.div 
                    className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-pearl-white border transition-all duration-300 shadow-sm rounded ${activeTimelineIdx === idx ? 'border-luxury-gold shadow-md scale-[1.02]' : 'border-luxury-gold/20 hover:border-luxury-gold/50 hover:shadow-md'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-sans font-bold text-luxury-gold tracking-widest uppercase text-sm block">{item.year}</span>
                      {activeTimelineIdx === idx ? <Minus className="w-5 h-5 text-luxury-gold opacity-70" /> : <Plus className="w-5 h-5 text-luxury-gold opacity-50" />}
                    </div>
                    <h4 className="font-cormorant text-2xl text-elegant-black mb-2">{item.title}</h4>
                    <p className="font-sans text-elegant-black/70 leading-relaxed">{item.desc}</p>
                    <AnimatePresence>
                      {activeTimelineIdx === idx && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="w-8 h-[1px] bg-luxury-gold/30 mb-4"></div>
                          <p className="font-sans text-sm text-elegant-black/80 leading-relaxed italic">{item.details}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 border border-luxury-gold/20 bg-pearl-white">
              <Award className="w-10 h-10 text-luxury-gold mx-auto mb-4" />
              <h4 className="font-cormorant text-2xl mb-2">50+ Honors</h4>
              <p className="text-sm text-elegant-black/60">Global Awards & Recognitions</p>
            </div>
            <div className="p-8 border border-luxury-gold/20 bg-pearl-white">
              <Heart className="w-10 h-10 text-luxury-gold mx-auto mb-4" />
              <h4 className="font-cormorant text-2xl mb-2">1M+ Lives</h4>
              <p className="text-sm text-elegant-black/60">Impacted through charity</p>
            </div>
            <div className="p-8 border border-luxury-gold/20 bg-pearl-white">
              <Globe className="w-10 h-10 text-luxury-gold mx-auto mb-4" />
              <h4 className="font-cormorant text-2xl mb-2">120 Countries</h4>
              <p className="text-sm text-elegant-black/60">Global influence and reach</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
