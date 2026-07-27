import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Heart, X, ChevronDown, Clock, History, Trash2 } from 'lucide-react';

export const FilterBar = ({
  filters,
  onFilterChange,
  onResetFilters,
  makes = [],
  totalResults = 0,
  showFavoritesOnly = false,
  onToggleFavorites,
  savedCount = 0,
  user = null
}) => {
  const priceRanges = [
    { label: 'All Price Ranges', min: 0, max: 1000000000 },
    { label: 'Under ₹2.5 Crores', min: 0, max: 25000000 },
    { label: '₹2.5 Cr – ₹5 Crores', min: 25000000, max: 50000000 },
    { label: '₹5 Cr – ₹10 Crores', min: 50000000, max: 100000000 },
    { label: '₹10 Crores+', min: 100000000, max: 1000000000 }
  ];

  const bodyTypes = ['All', 'Coupe', 'Convertible', 'Sedan', 'Electric'];

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('cariusx_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveQuery = (query) => {
    const trimmed = (query || '').trim();
    if (!trimmed || trimmed.length < 2) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('cariusx_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent search query', e);
      }
      return updated;
    });
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('cariusx_recent_searches');
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveRecentSearch = (e, searchToRemove) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s.toLowerCase() !== searchToRemove.toLowerCase());
      try {
        localStorage.setItem('cariusx_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const selectedPriceKey = priceRanges.find(
    p => p.min === filters.minPrice && p.max === filters.maxPrice
  ) ? `${filters.minPrice}-${filters.maxPrice}` : '0-1000000000';

  const handlePriceSelect = (e) => {
    const val = e.target.value;
    const match = priceRanges.find(p => `${p.min}-${p.max}` === val);
    if (match) {
      onFilterChange({ minPrice: match.min, maxPrice: match.max });
    }
  };

  const hasActiveFilters = 
    filters.searchQuery || 
    (filters.make && filters.make !== 'All') || 
    (filters.bodyType && filters.bodyType !== 'All') || 
    filters.minPrice > 0 || 
    filters.maxPrice < 10000000 ||
    showFavoritesOnly;

  return (
    <div id="inventory-grid" className="mb-6 font-sans">
      
      {/* Top Filter Container with Light Warm Luxury Theme */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5DCCF] shadow-lg space-y-4">
        
        {/* Row 1: Search Bar & Primary Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search Input Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-[#8B5A2B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by make, model, or year..."
              value={filters.searchQuery || ''}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveQuery(filters.searchQuery);
                }
              }}
              onBlur={() => {
                if (filters.searchQuery) {
                  saveQuery(filters.searchQuery);
                }
              }}
              className="w-full pl-10 pr-8 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-2xl text-xs font-medium text-[#1F1813] placeholder-[#6B5E52]/60 focus:outline-none focus:border-[#8B5A2B] transition-all"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B5E52] hover:text-[#1F1813]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Make Filter Dropdown */}
          <div className="lg:col-span-3 relative">
            <select
              value={filters.make || 'All'}
              onChange={(e) => onFilterChange({ make: e.target.value })}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-2xl text-xs font-bold text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] cursor-pointer"
            >
              <option value="All">All Makes & Brands</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#8B5A2B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Price Range Dropdown */}
          <div className="lg:col-span-3 relative">
            <select
              value={selectedPriceKey}
              onChange={handlePriceSelect}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-2xl text-xs font-bold text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] cursor-pointer"
            >
              {priceRanges.map((p) => (
                <option key={`${p.min}-${p.max}`} value={`${p.min}-${p.max}`}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#8B5A2B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="lg:col-span-2 relative">
            <select
              value={filters.sortBy || 'price-asc'}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-2xl text-xs font-bold text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] cursor-pointer"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Newest Year First</option>
              <option value="horsepower-desc">Highest Horsepower</option>
              <option value="mileage-asc">Lowest Mileage</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#8B5A2B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </div>

        {/* Recent Searches Strip */}
        {recentSearches.length > 0 && (
          <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs border-t border-[#F2EBE1]/60">
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#8B5A2B] shrink-0 font-mono">
              <History className="w-3.5 h-3.5" />
              <span>Recent Searches:</span>
            </span>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {recentSearches.map((term, idx) => (
                <button
                  key={`${term}-${idx}`}
                  type="button"
                  onClick={() => onFilterChange({ searchQuery: term })}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
                    filters.searchQuery?.toLowerCase() === term.toLowerCase()
                      ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] font-bold'
                      : 'bg-[#F8F4EC] text-[#1F1813] border-[#E5DCCF] hover:bg-[#F2EBE1] hover:border-[#8B5A2B]'
                  }`}
                >
                  <Search className="w-3 h-3 text-[#8B5A2B]" />
                  <span>{term}</span>
                  <span
                    onClick={(e) => handleRemoveRecentSearch(e, term)}
                    className="hover:text-red-500 transition-colors p-0.5 rounded-full"
                    title="Remove term"
                  >
                    <X className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleClearRecentSearches}
              className="text-[10px] font-bold text-[#6B5E52] hover:text-[#B2543C] underline shrink-0 ml-auto cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {/* Row 2: Active Filters & Favorites Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F2EBE1]">
          
          {/* Left: Results Counter & Reset Filter Button */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#1F1813]">
              <span className="text-[#8B5A2B]">{totalResults}</span> vehicles found
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-3 py-1 rounded-xl bg-[#FBEAE5] text-[#B2543C] hover:bg-[#F5D8D0] text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Right: Bookmarks Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Bookmarks / Favorites Toggle Button (Only shown when user is logged in) */}
            {user && onToggleFavorites && (
              <button
                type="button"
                onClick={onToggleFavorites}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  showFavoritesOnly
                    ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] shadow-md'
                    : 'bg-[#F8F4EC] text-[#1F1813] border-[#E5DCCF] hover:border-[#8B5A2B]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-white text-white' : 'text-[#8B5A2B]'}`} />
                <span>SAVED ({savedCount})</span>
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default FilterBar;
