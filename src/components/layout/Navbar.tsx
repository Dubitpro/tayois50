import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Biography', path: '/biography' },
  { title: 'Gallery', path: '/gallery' },
  { title: 'Wishes Wall', path: '/wishes' },
  { title: 'Message of Love', path: '/guestbook' },
];

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

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check in case page is already scrolled
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  // On non-home pages, we might always want a background so text is readable
  const needsBackground = !isHome || isScrolled;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      needsBackground ? "bg-soft-ivory shadow-md border-b border-luxury-gold/10 py-4" : "bg-transparent py-4 md:py-6"
    )}>
      <div className="container mx-auto px-4 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <Crown className={cn("w-6 h-6 md:w-8 md:h-8 transition-colors duration-300", needsBackground ? "text-luxury-gold" : "text-luxury-gold md:text-pearl-white")} />
          <span className={cn(
            "font-cormorant text-xl md:text-2xl font-bold tracking-widest transition-colors duration-300",
            needsBackground ? "text-elegant-black" : "text-pearl-white"
          )}>
            Tayois50
          </span>
        </Link>

        {/* Mobile Countdown (Only Days and Hours) */}
        <div className="md:hidden flex items-center gap-2 md:gap-3 ml-auto mr-4">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <span className={cn("font-cormorant text-base leading-none font-semibold", needsBackground ? "text-elegant-black" : "text-pearl-white")}>{value.toString().padStart(2, '0')}</span>
              <span className={cn("font-sans text-[8px] uppercase tracking-wider mt-0.5", needsBackground ? "text-elegant-black/70" : "text-pearl-white/70")}>{unit}</span>
            </div>
          ))}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.title}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => cn(
                "text-sm uppercase tracking-widest font-medium transition-all duration-300 hover:text-luxury-gold relative",
                needsBackground ? "text-elegant-black" : "text-white",
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
                  end={link.path === '/'}
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
