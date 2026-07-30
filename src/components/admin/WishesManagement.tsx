import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { POSTS_COLLECTION, WishPost } from '../../services/wishPostsService';
import { Trash2, Eye, EyeOff, Pin, Loader2 } from 'lucide-react';

export default function WishesManagement() {
  const [wishes, setWishes] = useState<WishPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, text, video

  useEffect(() => {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAtUnix', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedWishes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WishPost[];
      setWishes(fetchedWishes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'hidden' ? 'approved' : 'hidden';
    await updateDoc(doc(db, POSTS_COLLECTION, id), { status: newStatus });
  };

  const handleTogglePin = async (id: string, currentPin: boolean) => {
    await updateDoc(doc(db, POSTS_COLLECTION, id), { isPinned: !currentPin });
  };

  const handleDelete = async (id: string, publicId?: string) => {
    if (window.confirm("Are you sure you want to delete this wish? This action cannot be undone.")) {
      if (publicId) {
        // delete from cloudinary
        try {
          await fetch('/api/delete-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId })
          });
        } catch (err) {
          console.error("Failed to delete video from cloudinary", err);
        }
      }
      await deleteDoc(doc(db, POSTS_COLLECTION, id));
    }
  };

  const filteredWishes = wishes.filter(w => {
    if (filter === 'all') return true;
    return w.type === filter;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-luxury-gold" /></div>;
  }

  return (
    <div className="bg-pearl-white border border-luxury-gold/20 shadow-sm rounded overflow-hidden">
      <div className="p-6 border-b border-luxury-gold/10 flex justify-between items-center">
        <h2 className="font-cormorant text-2xl text-elegant-black">Wishes & Messages</h2>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="bg-soft-ivory border border-luxury-gold/30 px-4 py-2 font-sans text-xs uppercase tracking-widest outline-none focus:border-luxury-gold text-elegant-black"
        >
          <option value="all">All</option>
          <option value="text">Text Only</option>
          <option value="video">Videos</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-soft-ivory border-b border-luxury-gold/20 text-elegant-black/60 uppercase tracking-widest text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Guest</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Content / Caption</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-luxury-gold/10">
            {filteredWishes.map(wish => (
              <tr key={wish.id} className={wish.isPinned ? "bg-luxury-gold/5" : "hover:bg-soft-ivory/30"}>
                <td className="px-6 py-4">
                  <p className="font-serif text-lg text-elegant-black">{wish.fullName}</p>
                  <p className="text-xs text-elegant-black/50">{wish.country}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${wish.type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {wish.type}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs truncate text-elegant-black/80">
                  {wish.message || wish.caption || "(No text)"}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${wish.status === 'hidden' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {wish.status === 'hidden' ? 'Hidden' : 'Published'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button 
                    onClick={() => handleTogglePin(wish.id!, wish.isPinned || false)}
                    className={`p-2 transition-colors ${wish.isPinned ? 'text-luxury-gold' : 'text-gray-400 hover:text-luxury-gold'}`}
                    title={wish.isPinned ? "Unpin" : "Pin"}
                  >
                    <Pin size={18} />
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(wish.id!, wish.status)}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    title={wish.status === 'hidden' ? 'Show' : 'Hide'}
                  >
                    {wish.status === 'hidden' ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(wish.id!, wish.publicId)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredWishes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-elegant-black/50 font-serif italic">
                  No wishes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
