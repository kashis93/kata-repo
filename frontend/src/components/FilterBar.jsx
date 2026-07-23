import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export const FilterBar = ({
  filters,
  onFilterChange,
  onResetFilters,
  makes = [],
  totalResults
}) => {
  return (
    <div id="inventory-grid" className="mb-6 space-y-4 font-sans">
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Search Input Box */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#6B5E52] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Make, Model, or Year..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F6F0E6] border border-[#E5DCCF] rounded-xl text-xs font-medium text-[#1F1813] placeholder-[#6B5E52] focus:outline-none focus:border-[#8B5A2B]"
          />
        </div>

        {/* Dropdown: Vehicle Type */}
        <div className="relative">
          <select
            value={filters.bodyType || 'All'}
            onChange={(e) => onFilterChange({ bodyType: e.target.value })}
            className="appearance-none px-4 py-2.5 pr-8 bg-[#F6F0E6] border border-[#E5DCCF] rounded-xl text-xs font-medium text-[#1F1813] cursor-pointer focus:outline-none focus:border-[#8B5A2B]"
          >
            <option value="All">Vehicle Type</option>
            <option value="Sedan">Sedan</option>
            <option value="Coupe">Coupe</option>
            <option value="SUV">SUV</option>
            <option value="Convertible">Convertible</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#6B5E52] pointer-events-none">▼</span>
        </div>

        {/* Dropdown: Make */}
        <div className="relative">
          <select
            value={filters.make || 'All'}
            onChange={(e) => onFilterChange({ make: e.target.value })}
            className="appearance-none px-4 py-2.5 pr-8 bg-[#F6F0E6] border border-[#E5DCCF] rounded-xl text-xs font-medium text-[#1F1813] cursor-pointer focus:outline-none focus:border-[#8B5A2B]"
          >
            <option value="All">Make</option>
            {makes.map((mk) => (
              <option key={mk} value={mk}>{mk}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#6B5E52] pointer-events-none">▼</span>
        </div>

        {/* Dropdown: Price Range */}
        <div className="relative">
          <select
            value={filters.maxPrice || 300000}
            onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
            className="appearance-none px-4 py-2.5 pr-8 bg-[#F6F0E6] border border-[#E5DCCF] rounded-xl text-xs font-medium text-[#1F1813] cursor-pointer focus:outline-none focus:border-[#8B5A2B]"
          >
            <option value={300000}>Price Range</option>
            <option value={100000}>Under $100,000</option>
            <option value={150000}>Under $150,000</option>
            <option value={200000}>Under $200,000</option>
            <option value={300000}>All Prices</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#6B5E52] pointer-events-none">▼</span>
        </div>

        {/* Dropdown: Model Year */}
        <div className="relative">
          <select
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="appearance-none px-4 py-2.5 pr-8 bg-[#F6F0E6] border border-[#E5DCCF] rounded-xl text-xs font-medium text-[#1F1813] cursor-pointer focus:outline-none focus:border-[#8B5A2B]"
          >
            <option value="year-desc">Model Year</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="power-desc">Power: High to Low</option>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#6B5E52] pointer-events-none">▼</span>
        </div>

        {/* Sliders / Filter Toggle Button */}
        <button
          onClick={onResetFilters}
          className="p-2.5 bg-[#F6F0E6] border border-[#E5DCCF] rounded-xl text-[#1F1813] hover:border-[#8B5A2B] transition-colors cursor-pointer"
          title="Reset Filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Primary Brown Search Button */}
        <button
          onClick={() => {}}
          className="p-2.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white rounded-xl transition-colors cursor-pointer"
          title="Search Inventory"
        >
          <Search className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
