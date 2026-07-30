import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { FrontendConfigData, getConfig, saveConfig } from '../../services/configService';

export default function FrontendConfig() {
  const [config, setConfig] = useState<FrontendConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getConfig()
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await saveConfig(config);
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handleCaptionChange = (index: number, value: string) => {
    if (!config) return;
    const newCaptions = [...config.heroCaptions];
    newCaptions[index] = value;
    setConfig({ ...config, heroCaptions: newCaptions });
  };

  const handleGalleryImageChange = (index: number, value: string) => {
    if (!config) return;
    const newImages = [...(config.galleryImages || [])];
    newImages[index] = value;
    setConfig({ ...config, galleryImages: newImages });
  };

  const handleAddGalleryImage = () => {
    if (!config) return;
    setConfig({ ...config, galleryImages: [...(config.galleryImages || []), ""] });
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (!config) return;
    const newImages = [...(config.galleryImages || [])];
    newImages.splice(index, 1);
    setConfig({ ...config, galleryImages: newImages });
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-luxury-gold" /></div>;
  }

  if (!config) {
    return <div className="p-8 text-red-500">Failed to load configuration.</div>;
  }

  return (
    <div className="bg-pearl-white border border-luxury-gold/20 shadow-sm rounded overflow-hidden">
      <div className="p-6 border-b border-luxury-gold/10 flex justify-between items-center">
        <h2 className="font-cormorant text-2xl text-elegant-black">Frontend Configuration</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-luxury-gold text-elegant-black px-4 py-2 rounded text-xs font-sans uppercase tracking-widest hover:bg-opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/70 mb-2">Countdown Target Date (YYYY-MM-DDTHH:mm:ss)</label>
          <input 
            type="text" 
            value={config.countdownDate || ''} 
            onChange={(e) => setConfig({ ...config, countdownDate: e.target.value })}
            className="w-full bg-transparent border-b border-luxury-gold/30 focus:border-luxury-gold outline-none py-2 font-serif text-lg text-elegant-black"
          />
        </div>
        
        <div>
          <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/70 mb-2">Hero Title Top</label>
          <input 
            type="text" 
            value={config.heroTitleTop || ''} 
            onChange={(e) => setConfig({ ...config, heroTitleTop: e.target.value })}
            className="w-full bg-transparent border-b border-luxury-gold/30 focus:border-luxury-gold outline-none py-2 font-serif text-lg text-elegant-black"
          />
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/70 mb-2">Hero Title Main</label>
          <input 
            type="text" 
            value={config.heroTitleMain || ''} 
            onChange={(e) => setConfig({ ...config, heroTitleMain: e.target.value })}
            className="w-full bg-transparent border-b border-luxury-gold/30 focus:border-luxury-gold outline-none py-2 font-serif text-lg text-elegant-black"
          />
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-widest text-elegant-black/70 mb-2">Hero Captions</label>
          {config.heroCaptions?.map((caption: string, idx: number) => (
            <div key={idx} className="mb-3 flex gap-2">
              <span className="font-sans text-xs text-elegant-black/50 py-3">{idx + 1}.</span>
              <input 
                type="text" 
                value={caption} 
                onChange={(e) => handleCaptionChange(idx, e.target.value)}
                className="w-full bg-transparent border-b border-luxury-gold/30 focus:border-luxury-gold outline-none py-2 font-serif text-lg text-elegant-black"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
