import React from 'react';
import { FilterState } from '../types/vehicle';
import { Search, RotateCcw, ArrowUpDown, Download, Heart } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  makes: string[];
  totalResults: number;
  onExportCSV: () => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  savedCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  makes,
  totalResults,
  onExportCSV,
  showFavoritesOnly,
  onToggleFavorites,
  savedCount
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-2xl space-y-5 mb-8 print:hidden backdrop-blur-xl">
      
      {/* Search & Export Row */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search make, model, VIN, or feature (e.g. Porsche, Carbon, 911)..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800/80 px-2.5 py-1 rounded-md transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sorting & Export Buttons */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[190px]">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="w-full pl-9 pr-8 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer appearance-none shadow-inner"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest First</option>
              <option value="power-desc">Horsepower: Highest</option>
              <option value="mileage-asc">Mileage: Lowest First</option>
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={onExportCSV}
            className="px-4 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
            title="Export filtered vehicle inventory to CSV file"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline font-display">Export CSV</span>
          </button>

          <button
            onClick={onResetFilters}
            className="px-4 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border border-slate-700/50"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Filter Select Controls Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80">
        
        {/* Make Filter */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5 font-bold">Make / Brand</label>
          <select
            value={filters.make}
            onChange={(e) => onFilterChange({ make: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer shadow-inner font-medium"
          >
            <option value="All">All Makes</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Body Type Filter */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5 font-bold">Body Style</label>
          <select
            value={filters.bodyType}
            onChange={(e) => onFilterChange({ bodyType: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer shadow-inner font-medium"
          >
            <option value="All">All Styles</option>
            <option value="Coupe">Coupe</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Convertible">Convertible</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* Fuel Type Filter */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5 font-bold">Drivetrain / Fuel</label>
          <select
            value={filters.fuelType}
            onChange={(e) => onFilterChange({ fuelType: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer shadow-inner font-medium"
          >
            <option value="All">All Powertrains</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Twin-Turbo V8">Twin-Turbo V8</option>
          </select>
        </div>

        {/* Price Slider */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Max Price</label>
            <span className="text-[11px] font-bold text-amber-400 font-mono">
              ${filters.maxPrice >= 300000 ? '300k+' : `${Math.round(filters.maxPrice / 1000)}k`}
            </span>
          </div>
          <input
            type="range"
            min={30000}
            max={300000}
            step={10000}
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Stock Checkbox & Favorites Filter Toggle */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-center justify-between gap-3 pt-2 lg:pt-0">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
            />
            <span className="font-semibold">In Stock Only</span>
          </label>

          {/* Favorites Filter Button */}
          <button
            onClick={onToggleFavorites}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showFavoritesOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Saved ({savedCount})</span>
          </button>
        </div>

      </div>

      {/* Results Count Footer */}
      <div className="flex items-center justify-between pt-1 text-xs text-slate-400 font-mono">
        <div>
          Showing <span className="text-amber-400 font-bold">{totalResults}</span> verified vehicles on lot
          {showFavoritesOnly && <span className="text-rose-400 font-bold ml-1 border-l border-slate-700 pl-2">Favorites Only</span>}
        </div>
      </div>

    </div>
  );
};
