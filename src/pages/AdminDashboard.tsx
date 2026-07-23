import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { Crown, LogOut, Image, BookOpen, Settings, Users, LayoutDashboard } from 'lucide-react';
import FrontendConfig from '../components/admin/FrontendConfig';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <>
      <SEO title="Admin | Dashboard" description="Manage the Golden Jubilee celebrations." />
        
      
      <div className="min-h-screen bg-soft-ivory flex">
        {/* Sidebar */}
        <aside className="w-64 bg-elegant-black text-pearl-white flex flex-col hidden md:flex">
          <div className="p-8 text-center border-b border-luxury-gold/20">
            <Crown className="w-10 h-10 text-luxury-gold mx-auto mb-4" />
            <h2 className="font-cormorant text-xl text-luxury-gold">Admin</h2>
          </div>
          <nav className="flex-1 py-8">
            <ul className="space-y-2 px-4">
              <li>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded font-sans text-sm tracking-widest uppercase transition-colors ${activeTab === 'dashboard' ? 'bg-luxury-gold/10 text-luxury-gold' : 'text-pearl-white/70 hover:text-luxury-gold hover:bg-luxury-gold/5'}`}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('frontend')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded font-sans text-sm tracking-widest uppercase transition-colors ${activeTab === 'frontend' ? 'bg-luxury-gold/10 text-luxury-gold' : 'text-pearl-white/70 hover:text-luxury-gold hover:bg-luxury-gold/5'}`}
                >
                  <Settings size={18} /> Frontend
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-pearl-white/70 hover:text-luxury-gold hover:bg-luxury-gold/5 rounded transition-colors font-sans text-sm tracking-widest uppercase">
                  <BookOpen size={18} /> Guestbook
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-pearl-white/70 hover:text-luxury-gold hover:bg-luxury-gold/5 rounded transition-colors font-sans text-sm tracking-widest uppercase">
                  <Image size={18} /> Gallery
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-pearl-white/70 hover:text-luxury-gold hover:bg-luxury-gold/5 rounded transition-colors font-sans text-sm tracking-widest uppercase">
                  <Users size={18} /> Wishes
                </button>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-luxury-gold/20">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm tracking-widest uppercase font-sans text-pearl-white/50 hover:text-pearl-white transition-colors"
            >
              <LogOut size={16} /> Secure Exit
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden bg-elegant-black text-luxury-gold p-4 flex justify-between items-center">
            <Crown size={24} />
            <span className="font-cormorant text-xl">Admin</span>
            <button onClick={handleLogout}><LogOut size={20} /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            {activeTab === 'dashboard' ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h1 className="font-cormorant text-4xl text-elegant-black">Welcome to the Quarters</h1>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/sync-social", { method: "POST" });
                        const data = await res.json();
                        alert(data.message || data.error);
                      } catch(e) {
                        alert("Failed to sync comments");
                      }
                    }}
                    className="bg-elegant-black text-luxury-gold px-4 py-2 text-xs uppercase tracking-widest hover:bg-elegant-black/90 transition-colors"
                  >
                    Sync Social Comments
                  </button>
                </div>
                <p className="font-sans text-elegant-black/60 mb-10">Manage the Golden Jubilee celebrations and content.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-pearl-white p-6 border border-luxury-gold/20 shadow-sm">
                    <h3 className="font-sans text-xs uppercase tracking-widest text-elegant-black/50 mb-2">Total Guests</h3>
                    <p className="font-cormorant text-4xl text-elegant-black">1,248</p>
                  </div>
                  <div className="bg-pearl-white p-6 border border-luxury-gold/20 shadow-sm">
                    <h3 className="font-sans text-xs uppercase tracking-widest text-elegant-black/50 mb-2">Pending Wishes</h3>
                    <p className="font-cormorant text-4xl text-elegant-black">42</p>
                  </div>
                  <div className="bg-pearl-white p-6 border border-luxury-gold/20 shadow-sm">
                    <h3 className="font-sans text-xs uppercase tracking-widest text-elegant-black/50 mb-2">Gallery Assets</h3>
                    <p className="font-cormorant text-4xl text-elegant-black">156</p>
                  </div>
                </div>
                <div className="bg-pearl-white border border-luxury-gold/20 shadow-sm rounded overflow-hidden">
                  <div className="p-6 border-b border-luxury-gold/10 flex justify-between items-center">
                    <h2 className="font-cormorant text-2xl text-elegant-black">Recent Guestbook Signatures</h2>
                    <button className="text-xs font-sans uppercase tracking-widest text-luxury-gold hover:underline">View All</button>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-elegant-black/60 italic font-serif">Awaiting Firebase connection to load real-time signatures...</p>
                  </div>
                </div>
              </>
            ) : activeTab === 'frontend' ? (
              <FrontendConfig />
            ) : null}
          </div>
        </main>
      </div>
    </>
  );
}
