import React, { useState } from 'react';
import { Search, SlidersHorizontal, Check, X, RotateCcw, ChevronDown, ChevronUp, Sparkles, Filter } from 'lucide-react';

export const SidebarFilterPanel = ({
  filters,
  onFilterChange,
  onResetFilters,
  makes = [],
  totalResults = 0,
  position = 'right', // 'right' or 'left'
  onTogglePosition
}) => {
  const [brandSearch, setBrandSearch] = useState('');
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(true);
  const [isBodyTypesExpanded, setIsBodyTypesExpanded] = useState(true);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);

  // Filter makes by search
  const filteredMakes = makes.filter((mk) =>
    mk.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const handleMakeToggle = (selectedMake) => {
    if (filters.make === selectedMake) {
      onFilterChange({ make: 'All' });
    } else {
      onFilterChange({ make: selectedMake });
    }
  };

  const bodyTypes = [
    { label: 'All Types', value: 'All' },
    { label: 'Coupe', value: 'Coupe' },
    { label: 'Convertible', value: 'Convertible' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Sedan', value: 'Sedan' }
  ];

  const fuelTypes = [
    { label: 'All Power', value: 'All' },
    { label: 'Gasoline', value: 'Gasoline' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'Electric', value: 'Electric' }
  ];

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-[#120D12] border border-red-950/80 rounded-3xl p-5 shadow-2xl text-slate-100 font-sans space-y-6 h-fit sticky top-24">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-red-950/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-950/80 border border-red-500/40 text-amber-400">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black font-display text-white uppercase tracking-tight">
              FILTER INVENTORY
            </h3>
            <span className="text-[11px] font-mono text-red-400 font-bold">
              {totalResults} VEHICLES MATCH
            </span>
          </div>
        </div>

        {/* Reset Filters Button */}
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-mono font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Reset All Filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>
      </div>

      {/* 1. Search Query Box */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider block">
          SEARCH MODEL
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Porsche, GT3, V12..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 bg-[#1A131B] border border-red-900/40 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Price Range Slider & Presets */}
      <div className="space-y-3 pt-2 border-t border-red-950/60">
        <div
          className="flex items-center justify-between cursor-pointer py-1"
          onClick={() => setIsPriceExpanded(!isPriceExpanded)}
        >
          <span className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">
            PRICE RANGE
          </span>
          <span className="text-slate-400">
            {isPriceExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>

        {isPriceExpanded && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">MIN: €0</span>
              <span className="text-amber-300 font-extrabold">
                {filters.maxPrice >= 10000000
                  ? 'MAX: €10M+'
                  : `UNDER €${(filters.maxPrice || 10000000).toLocaleString()}`}
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={100000}
              max={10000000}
              step={100000}
              value={filters.maxPrice || 10000000}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-full accent-red-500 cursor-pointer h-2 bg-red-950 rounded-lg"
            />

            {/* Preset Buttons */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => onFilterChange({ maxPrice: 200000 })}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                  filters.maxPrice === 200000
                    ? 'bg-red-600 text-white border-red-400 font-bold'
                    : 'bg-[#1A131B] text-slate-300 border-red-950 hover:border-red-600'
                }`}
              >
                Under €200k
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ maxPrice: 500000 })}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                  filters.maxPrice === 500000
                    ? 'bg-red-600 text-white border-red-400 font-bold'
                    : 'bg-[#1A131B] text-slate-300 border-red-950 hover:border-red-600'
                }`}
              >
                Under €500k
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ maxPrice: 1000000 })}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                  filters.maxPrice === 1000000
                    ? 'bg-red-600 text-white border-red-400 font-bold'
                    : 'bg-[#1A131B] text-slate-300 border-red-950 hover:border-red-600'
                }`}
              >
                Under €1M
              </button>

              <button
                type="button"
                onClick={() => onFilterChange({ maxPrice: 10000000 })}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                  filters.maxPrice >= 10000000
                    ? 'bg-red-600 text-white border-red-400 font-bold'
                    : 'bg-[#1A131B] text-slate-300 border-red-950 hover:border-red-600'
                }`}
              >
                All Prices
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Brands & Models Checkbox List */}
      <div className="space-y-3 pt-2 border-t border-red-950/60">
        <div
          className="flex items-center justify-between cursor-pointer py-1"
          onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
        >
          <span className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">
            BRANDS & MANUFACTURERS
          </span>
          <span className="text-slate-400">
            {isBrandsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>

        {isBrandsExpanded && (
          <div className="space-y-2">
            {/* Quick Filter Brand Input */}
            <input
              type="text"
              placeholder="Filter brand name..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#1A131B] border border-red-950 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              <button
                type="button"
                onClick={() => onFilterChange({ make: 'All' })}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                  !filters.make || filters.make === 'All'
                    ? 'bg-red-950/90 text-amber-300 border border-red-500/50 font-bold'
                    : 'text-slate-300 hover:bg-[#1A131B]'
                }`}
              >
                <span>ALL BRANDS</span>
                {!filters.make || filters.make === 'All' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : null}
              </button>

              {filteredMakes.map((mk) => {
                const isSelected = filters.make === mk;
                return (
                  <button
                    key={mk}
                    type="button"
                    onClick={() => handleMakeToggle(mk)}
                    className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white font-extrabold shadow-md'
                        : 'text-slate-300 hover:bg-[#1A131B]'
                    }`}
                  >
                    <span>{mk}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Body Type Selection */}
      <div className="space-y-3 pt-2 border-t border-red-950/60">
        <div
          className="flex items-center justify-between cursor-pointer py-1"
          onClick={() => setIsBodyTypesExpanded(!isBodyTypesExpanded)}
        >
          <span className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">
            BODY STYLE
          </span>
          <span className="text-slate-400">
            {isBodyTypesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>

        {isBodyTypesExpanded && (
          <div className="grid grid-cols-2 gap-1.5">
            {bodyTypes.map((bt) => {
              const isSelected = (filters.bodyType || 'All') === bt.value;
              return (
                <button
                  key={bt.value}
                  type="button"
                  onClick={() => onFilterChange({ bodyType: bt.value })}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-red-400 shadow-md'
                      : 'bg-[#1A131B] text-slate-300 border-red-950 hover:border-red-600'
                  }`}
                >
                  {bt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Sort By Option */}
      <div className="space-y-2 pt-2 border-t border-red-950/60">
        <label className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider block">
          SORT VEHICLES BY
        </label>
        <select
          value={filters.sortBy || 'price-asc'}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          className="w-full px-3 py-2.5 bg-[#1A131B] border border-red-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="year-desc">Model Year: Newest First</option>
          <option value="power-desc">Horsepower: High to Low</option>
        </select>
      </div>

      {/* 6. In-Stock Switch */}
      <div className="pt-2 border-t border-red-950/60 flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-red-300 uppercase">
          IN STOCK ONLY
        </span>
        <button
          type="button"
          onClick={() => onFilterChange({ inStockOnly: !filters.inStockOnly })}
          className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
            filters.inStockOnly ? 'bg-red-600 justify-end' : 'bg-slate-800 justify-start'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-white shadow-md" />
        </button>
      </div>

      {/* Position Toggle Switcher (Left vs Right Sidebar) */}
      {onTogglePosition && (
        <div className="pt-3 border-t border-red-950/60 text-center">
          <button
            type="button"
            onClick={onTogglePosition}
            className="text-[10px] font-mono font-bold text-slate-400 hover:text-amber-300 transition-colors"
          >
            SWITCH FILTER POSITION ({position.toUpperCase()} SIDEBAR)
          </button>
        </div>
      )}

    </aside>
  );
};

export default SidebarFilterPanel;
