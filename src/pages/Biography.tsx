import React, { useState } from 'react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Heart, Globe, Plus, Minus } from 'lucide-react';

export default function Biography() {
  const [activeTimelineIdx, setActiveTimelineIdx] = useState<number | null>(null);

  const timeline = [
    { year: "1976–1989", title: "Early Life", desc: "Dr. Omotayo Oluseyi Osinaike was born on August 9, 1976, in Lagos, Nigeria, to Bamidele Dania of Iku Akoko and Christiana Dania of Ode Omu. Her childhood unfolded between Lagos and Ode Omu, giving her a rich blend of urban exposure and deep cultural grounding. She completed her primary education at Command Children School, Lagos, in 1989.", details: "During these formative years, she was shaped by the moral and spiritual guidance of Reverend and Mrs. Agbelusi and the nurturing environment of Dansol Tutorial Centre—communities that helped establish her early godly character and disciplined outlook. Growing up within a well connected extended family, she enjoyed many short and long stays with relatives, experiences that broadened her worldview and strengthened her interpersonal warmth." },
    { year: "1990 - 1994", title: "Adolescence & Faith Formation", desc: "Her secondary school years at the Federal Government Girls College, Akure, were pivotal.", details: "It was here that she embraced her Christian faith and became a devoted follower of Jesus Christ—a commitment that would anchor her life’s direction. These years reinforced her values, strengthened her sense of identity, and prepared her for the demanding journey ahead." },
    { year: "1995–2006", title: "Medical Pursuit & Character Refinement", desc: "In 1995, she began her pursuit of a medical career—a journey that lasted longer than originally planned and became a true test of character, tenacity, and resilience.", details: "She graduated from the University of Ibadan/University College Hospital in 2005 and completed her housemanship at UCH in 2006. This period was marked not only by academic rigor but by personal milestones: she married Ademola Osinaike in 2005, and together they welcomed their first child, Toluwanimi, in 2006. Abimifoluwa followed in 2008, and Iranlowooluwa in 2015, each child adding joy, purpose, and depth to her life." },
    { year: "2007 - 2017", title: "Professional Growth & Radiology Specialization", desc: "Her early professional years as a Medical Officer with the Lagos State Health Service Commission (2007–2011) strengthened her clinical intuition and broadened her experience across diverse patient populations.", details: "In 2011, she began her Radiology Residency at LASUTH, a demanding program that refined her diagnostic reasoning and technical expertise across CT, MRI, ultrasound, and radiography. She completed her residency in 2017 and earned her Fellowship of the West African College of Surgeons (Radiology), marking her entry into senior clinical leadership." },
    { year: "2017–2021", title: "Consultant Practice & Clinical Excellence", desc: "From 2017 to 2021, Dr. Osinaike served as a Consultant Radiologist at General Hospital Gbagada, Lagos. Here, she delivered comprehensive imaging services, supported multidisciplinary teams, and contributed to workflow optimization and quality improvement initiatives. Her work was characterized by precision, clarity, and a deep commitment to patient centered care. Relocation & New Horizons in the UAE (2021–Present) In 2021, she moved with her family to the United Arab Emirates, marking a new chapter of growth and opportunity.", details: "Shortly after relocating, she joined Accuread Radiology Nigeria Ltd as a Consultant Radiologist, interpreting high volumes of CT, MRI, X ray, and ultrasound studies within digital healthcare platforms. Her ability to deliver timely, clinically actionable reports has made her a trusted partner to physicians across multiple specialties. Her passion for innovation led her to pursue advanced training in AI in Healthcare at Johns Hopkins University (2026), positioning her at the forefront of clinical AI integration, imaging workflow optimization, and digital health transformation.\n\nFaith, Family & Community Service (Nigeria & UAE)\nFaith has remained a constant thread throughout her life. In Nigeria, she was a committed member of Daystar Christian Centre, actively participating in church life and community service. After relocating to the UAE in 2021, she joined c, where she serves faithfully on the Welcome Team and in the Women Connect group. Her nurturing spirit earned her the affectionate title “Mummy wa” among close friends—a reflection of her consistent love, support, and presence in the lives of many families.\n\nShe is passionate about the holistic development of single ladies and has mentored many young women, guiding them toward purpose, confidence, and godly living. Equally devoted to strengthening family values, she advocates for the establishment of Christ centered homes and continues to inspire others through her example.\n\nCurrent Focus & Continuing Impact\nToday, Dr. Osinaike blends her clinical expertise, her heart for people, and her faith driven purpose as she expands her work into Medical Approval and Utilization Management. She brings diagnostic insight, analytical strength, and compassion into the health insurance sector, ensuring that care remains appropriate, evidence based, and patient focused.\n\nHer life remains a testament to dedication—professionally, personally, and spiritually—reflecting a woman who leads with skill, serves with compassion, and continues to grow with purpose." }
  ];

  return (
    <>
      <SEO title="Biography" description="Discover the extraordinary journey and 50-year legacy of The Queen." />
        
      

      <div className="bg-soft-ivory py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          
          <div className="text-center mb-20">
            <h1 className="font-cormorant text-5xl md:text-7xl text-elegant-black mb-6">Dr. Omotayo Oluseyi Osinaike's Journey</h1>
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
                  src="https://i.pinimg.com/originals/3d/d3/c2/3dd3c2f1bfbb73aeacd85704d505e69e.jpg" 
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
                Dr. Omotayo Oluseyi Osinaike, born in Lagos in 1976, grew up between Lagos and Ode Omu, shaped by strong family values, spiritual guidance, and disciplined academic foundations. Her faith deepened during her time at Federal Government Girls College, Akure, becoming the anchor for her identity. She pursued medicine at the University of Ibadan/UCH, a journey that strengthened her resilience. During this period, she married Ademola Osinaike and began building her family, welcoming three children between 2006 and 2015.
              </p>
              <p className="font-sans text-elegant-black/80 leading-relaxed text-lg mt-4">
                Her career progressed from medical officer roles into Radiology, culminating in her Fellowship of the West African College of Surgeons in 2017. She served as Consultant Radiologist and Head of Department at General Hospital Gbagada before relocating to the UAE in 2021, where she continues to practice through Accuread Radiology Nigeria Ltd. Active in church communities and mentoring young women, she now integrates her clinical expertise with medical approval and utilization management, exemplifying excellence, compassion, and purpose.
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
