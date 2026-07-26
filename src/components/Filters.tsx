import React from 'react';
import { Filter } from 'lucide-react';

interface FiltersProps {
  filterBy: string;
  setFilterBy: (filter: string) => void;
}

const FILTER_OPTIONS = ['Newest', 'Oldest', 'Most Loved', 'Pinned'];

export default function Filters({ filterBy, setFilterBy }: FiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center gap-1.5 text-elegant-black/50 pr-2">
        <Filter className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest font-sans font-medium">Sort</span>
      </div>
      
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option}
          onClick={() => setFilterBy(option)}
          className={`px-4 py-2 rounded-full text-xs font-sans whitespace-nowrap transition-all ${
            filterBy === option
              ? 'bg-luxury-gold text-white shadow-md'
              : 'bg-white/80 backdrop-blur-sm text-elegant-black/60 hover:bg-luxury-gold/10 border border-luxury-gold/20'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
