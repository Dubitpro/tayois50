import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Biography', path: '/biography' },
  { title: 'Gallery', path: '/gallery' },
  { title: 'Wishes Wall', path: '/wishes' },
  { title: 'Guestbook', path: '/guestbook' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled ? "bg-soft-ivory/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <Crown className={cn("w-8 h-8 transition-colors duration-300", isScrolled ? "text-luxury-gold" : "text-luxury-gold md:text-pearl-white")} />
          <span className={cn(
            "font-cormorant text-2xl font-bold tracking-widest transition-colors duration-300 lowercase",
            isScrolled ? "text-elegant-black" : "text-elegant-black md:text-pearl-white"
          )}>
            tayois50
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.title}
              to={link.path}
              className={({ isActive }) => cn(
                "text-sm uppercase tracking-widest font-medium transition-all duration-300 hover:text-luxury-gold relative",
                isScrolled ? "text-elegant-black/80" : "text-pearl-white/90",
                isActive && "!text-luxury-gold"
              )}
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-luxury-gold z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-soft-ivory/95 backdrop-blur-lg shadow-xl py-6 px-6 flex flex-col gap-6 md:hidden border-t border-luxury-gold/20"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.title}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "text-lg font-cormorant uppercase tracking-widest transition-all duration-300",
                    isActive ? "text-luxury-gold font-bold" : "text-elegant-black"
                  )}
                >
                  {link.title}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
