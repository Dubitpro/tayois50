import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="relative max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-luxury-gold/50" />
      </div>
      <input
        type="text"
        className="block w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-luxury-gold/20 rounded-full leading-5 focus:outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold transition-all font-sans text-sm placeholder-elegant-black/30 text-elegant-black shadow-sm"
        placeholder="Search messages by name, country, or content..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
