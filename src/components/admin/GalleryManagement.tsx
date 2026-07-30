import React, { useState, useEffect, useRef } from 'react';
import { GalleryImage, subscribeToGallery, addGalleryImage, deleteGalleryImage, updateGalleryImage } from '../../services/galleryService';
import { Loader2, Trash2, Pin, Eye, EyeOff, Upload } from 'lucide-react';

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToGallery((data) => {
      setImages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Upload to cloudinary directly or via server?
        // Since we don't have a secure client-side upload for images out of the box, we can use unsigned presets OR signed upload.
        // Wait, earlier the user had signature endpoint for videos. It can also be used for images!
        const res = await fetch("/api/cloudinary-signature");
        const sigData = await res.json();
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp);
        formData.append("signature", sigData.signature);
        formData.append("folder", sigData.folder); // We can just use the same folder

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.secure_url) {
          await addGalleryImage({
            url: uploadData.secure_url,
            publicId: uploadData.public_id,
            order: images.length + i,
            isPinned: false,
            isHidden: false
          });
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string, publicId?: string) => {
    if (window.confirm("Delete this image?")) {
      await deleteGalleryImage(id, publicId);
    }
  };

  const handleTogglePin = async (id: string, currentPin: boolean) => {
    await updateGalleryImage(id, { isPinned: !currentPin });
  };

  const handleToggleStatus = async (id: string, currentHidden: boolean) => {
    await updateGalleryImage(id, { isHidden: !currentHidden });
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-luxury-gold" /></div>;
  }

  return (
    <div className="bg-pearl-white border border-luxury-gold/20 shadow-sm rounded overflow-hidden">
      <div className="p-6 border-b border-luxury-gold/10 flex justify-between items-center">
        <h2 className="font-cormorant text-2xl text-elegant-black">Gallery Management</h2>
        
        <div>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-luxury-gold text-elegant-black px-4 py-2 rounded text-xs font-sans uppercase tracking-widest hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Upload Images
          </button>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className={`relative group border ${img.isPinned ? 'border-luxury-gold border-2' : 'border-transparent'} rounded overflow-hidden aspect-square`}>
            <img src={img.url} className={`w-full h-full object-cover ${img.isHidden ? 'opacity-50 grayscale' : ''}`} alt="Gallery item" />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button onClick={() => handleTogglePin(img.id!, img.isPinned)} className={`p-2 rounded-full ${img.isPinned ? 'bg-luxury-gold text-elegant-black' : 'bg-white/20 text-white hover:bg-luxury-gold hover:text-elegant-black'} transition-colors`} title="Pin to top">
                <Pin size={18} />
              </button>
              <button onClick={() => handleToggleStatus(img.id!, img.isHidden)} className="p-2 rounded-full bg-white/20 text-white hover:bg-blue-500 transition-colors" title={img.isHidden ? "Show" : "Hide"}>
                {img.isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button onClick={() => handleDelete(img.id!, img.publicId)} className="p-2 rounded-full bg-white/20 text-white hover:bg-red-500 transition-colors" title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
            
            {img.isPinned && (
              <div className="absolute top-2 left-2 bg-luxury-gold text-elegant-black px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm shadow">
                Featured
              </div>
            )}
            {img.isHidden && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm shadow">
                Hidden
              </div>
            )}
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full py-12 text-center text-elegant-black/50 font-serif italic">
            No images in gallery. Upload some memories!
          </div>
        )}
      </div>
    </div>
  );
}
