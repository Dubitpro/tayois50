import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { Crown, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // For preview environments without Firebase Config
    if (import.meta.env.VITE_FIREBASE_API_KEY === undefined) {
      setTimeout(() => {
        setError('Firebase is not configured. This is a preview environment.');
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Secure access for administration." />
        
      
      <div className="min-h-screen bg-elegant-black flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-pearl-white p-10 border border-luxury-gold shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-luxury-gold via-[#F7E7CE] to-luxury-gold"></div>
          
          <div className="text-center mb-10">
            <Crown className="w-12 h-12 text-luxury-gold mx-auto mb-4" />
            <h1 className="font-cormorant text-3xl text-elegant-black">Quarters</h1>
            <p className="font-sans text-xs uppercase tracking-widest text-elegant-black/50 mt-2">Authorized Personnel Only</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 text-sm text-center font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/70 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-soft-ivory border border-luxury-gold/30 px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors font-sans"
              />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/70 mb-2">Passcode</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-soft-ivory border border-luxury-gold/30 px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors font-sans"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-elegant-black text-luxury-gold py-4 font-sans text-sm uppercase tracking-widest hover:bg-elegant-black/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Access Dashboard"}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <a href="/" className="font-sans text-xs uppercase tracking-widest text-elegant-black/50 hover:text-luxury-gold transition-colors">Return to Palace</a>
          </div>
        </div>
      </div>
    </>
  );
}
