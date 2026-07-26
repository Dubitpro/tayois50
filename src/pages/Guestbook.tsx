import React from 'react';
import SEO from '../components/SEO';
import { PenTool, ArrowRight } from 'lucide-react';
import MessageForm from '../components/MessageForm';
import { Link } from 'react-router-dom';

export default function Guestbook() {
  return (
    <>
      <SEO title="Message of Love" description="Leave a congratulatory message on her Golden Jubilee." />
      
      <div className="bg-soft-ivory py-24 min-h-screen relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-luxury-gold rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-luxury-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          
          <div className="text-center mb-16">
            <PenTool className="w-12 h-12 text-luxury-gold mx-auto mb-6" />
            <h1 className="font-cormorant text-5xl md:text-7xl text-elegant-black mb-6">Message of Love</h1>
            <div className="w-24 h-[2px] bg-luxury-gold mx-auto mb-8"></div>
            <p className="font-serif text-xl italic text-elegant-black/70">Leave a congratulatory message.</p>
          </div>

          <MessageForm />

          <div className="text-center mt-16">
            <Link 
              to="/wishes" 
              className="inline-flex items-center gap-3 border border-luxury-gold text-elegant-black hover:bg-luxury-gold hover:text-white transition-all px-8 py-4 font-sans text-sm uppercase tracking-widest rounded-full group"
            >
              Visit the Wish Wall
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
