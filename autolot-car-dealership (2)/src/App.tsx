/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Vehicle, FilterState } from './types/vehicle';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { VehicleCard } from './components/VehicleCard';
import { AdminPanel } from './components/AdminPanel';
import { VehicleFormModal } from './components/VehicleFormModal';
import { PurchaseModal } from './components/PurchaseModal';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { VehicleCompareModal } from './components/VehicleCompareModal';
import { MonroneyStickerModal } from './components/MonroneyStickerModal';
import { exportVehiclesToCSV } from './utils/csvExport';
import { Car, RefreshCw, AlertCircle, Sparkles, Heart, ArrowLeftRight, X, Download } from 'lucide-react';

const ThreeCarShowroom = lazy(() => import('./components/ThreeCarShowroom').then(m => ({ default: m.ThreeCarShowroom })));

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<'showroom' | 'admin'>('showroom');

  // Modals state
  const [showroomVehicle, setShowroomVehicle] = useState<Vehicle | null>(null);
  const [is3DStageOpen, setIs3DStageOpen] = useState(false);

  const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null);
  const [purchaseVehicle, setPurchaseVehicle] = useState<Vehicle | null>(null);
  const [printStickerVehicle, setPrintStickerVehicle] = useState<Vehicle | null>(null);

  const [formVehicle, setFormVehicle] = useState<Vehicle | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [purchasesCount, setPurchasesCount] = useState(0);

  // Requirement 4: Saved / Bookmarked Favorites State (Persistent via localStorage)
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('autolot_saved_vehicles');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Requirement 1: Side-by-Side Comparison State
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    make: 'All',
    bodyType: 'All',
    fuelType: 'All',
    minPrice: 0,
    maxPrice: 300000,
    inStockOnly: false,
    sortBy: 'price-asc'
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('autolot_saved_vehicles', JSON.stringify(savedIds));
    } catch (e) {
      console.error('Failed to store saved vehicles', e);
    }
  }, [savedIds]);

  // Load initial vehicles & orders
  const refreshVehicles = () => {
    const loaded = api.getVehicles();
    setVehicles(loaded);
    setPurchasesCount(api.getPurchases().length);
  };

  useEffect(() => {
    refreshVehicles();
  }, []);

  // Extract distinct makes
  const uniqueMakes = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.make));
    return Array.from(set).sort();
  }, [vehicles]);

  // Filter & Sort Logic (including Favorites filtering)
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Favorites check
        if (showFavoritesOnly && !savedIds.includes(v.id)) return false;

        // Search query check
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const match =
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.vin.toLowerCase().includes(q) ||
            v.features.some((f) => f.toLowerCase().includes(q)) ||
            v.year.toString().includes(q);
          if (!match) return false;
        }

        // Make check
        if (filters.make !== 'All' && v.make !== filters.make) return false;

        // Body type check
        if (filters.bodyType !== 'All' && v.bodyType !== filters.bodyType) return false;

        // Fuel type check
        if (filters.fuelType !== 'All' && v.fuelType !== filters.fuelType) return false;

        // Price check
        if (v.price > filters.maxPrice) return false;

        // In Stock check
        if (filters.inStockOnly && v.quantity <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'year-desc') return b.year - a.year;
        if (filters.sortBy === 'power-desc') return b.horsepower - a.horsepower;
        if (filters.sortBy === 'mileage-asc') return a.mileage - b.mileage;
        return 0;
      });
  }, [vehicles, filters, showFavoritesOnly, savedIds]);

  // Compared Vehicles
  const comparedVehicles = useMemo(() => {
    return vehicles.filter((v) => comparedIds.includes(v.id));
  }, [vehicles, comparedIds]);

  // Handlers
  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleToggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 vehicles at a time.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleUpdateFilters = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      make: 'All',
      bodyType: 'All',
      fuelType: 'All',
      minPrice: 0,
      maxPrice: 300000,
      inStockOnly: false,
      sortBy: 'price-asc'
    });
    setShowFavoritesOnly(false);
  };

  // Admin Handlers
  const handleAddVehicle = () => {
    setFormVehicle(null);
    setIsFormOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setFormVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleSaveVehicle = (data: Partial<Vehicle>) => {
    if (formVehicle) {
      api.updateVehicle({ ...formVehicle, ...data } as Vehicle);
    } else {
      api.addVehicle(data as Omit<Vehicle, 'id'>);
    }
    refreshVehicles();
  };

  const handleDeleteVehicle = (id: string) => {
    api.deleteVehicle(id);
    setComparedIds((prev) => prev.filter((i) => i !== id));
    setSavedIds((prev) => prev.filter((i) => i !== id));
    refreshVehicles();
  };

  const handleDuplicateVehicle = (vehicle: Vehicle) => {
    const { id, ...rest } = vehicle;
    api.addVehicle({
      ...rest,
      model: `${vehicle.model} (Copy)`,
      vin: `WP0AB2A${Math.floor(100000 + Math.random() * 900000)}`
    });
    refreshVehicles();
  };

  const handleResetCatalog = () => {
    api.resetVehicles();
    refreshVehicles();
  };

  const handleInspect3D = (vehicle: Vehicle) => {
    setShowroomVehicle(vehicle);
    setIs3DStageOpen(true);
  };

  const handleGlobal3DStage = () => {
    setShowroomVehicle(vehicles[0] || null);
    setIs3DStageOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpen3DStage={handleGlobal3DStage}
        purchaseCount={purchasesCount}
        totalVehiclesCount={vehicles.length}
        savedCount={savedIds.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        comparedCount={comparedIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Customer Showroom Tab */}
        {activeTab === 'showroom' && (
          <div className="space-y-6">
            
            {/* Hero Banner */}
            <HeroBanner
              onOpen3DStage={handleGlobal3DStage}
              totalUnits={vehicles.reduce((sum, v) => sum + v.quantity, 0)}
            />

            {/* Filter Controls Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={handleUpdateFilters}
              onResetFilters={handleResetFilters}
              makes={uniqueMakes}
              totalResults={filteredVehicles.length}
              onExportCSV={() => exportVehiclesToCSV(filteredVehicles)}
              showFavoritesOnly={showFavoritesOnly}
              onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
              savedCount={savedIds.length}
            />

            {/* Vehicle Card Grid View */}
            {filteredVehicles.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 my-8">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-amber-400">
                  {showFavoritesOnly ? <Heart className="w-8 h-8 text-rose-400" /> : <Car className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-extrabold text-white font-display">
                  {showFavoritesOnly ? 'No Saved Favorite Vehicles' : 'No Vehicles Match Your Search'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {showFavoritesOnly
                    ? 'Click the heart icon on any vehicle card to save your favorite models for quick comparison.'
                    : 'Try adjusting your price range, body style, or brand filter to discover available models in our lot.'}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Clear Search Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onPurchase={(v) => setPurchaseVehicle(v)}
                    onInspect3D={handleInspect3D}
                    onOpenDetails={(v) => setDetailVehicle(v)}
                    isSaved={savedIds.includes(vehicle.id)}
                    onToggleSave={handleToggleSave}
                    isCompared={comparedIds.includes(vehicle.id)}
                    onToggleCompare={handleToggleCompare}
                    onOpenPrintSticker={(v) => setPrintStickerVehicle(v)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* Admin Inventory Manager Tab */}
        {activeTab === 'admin' && (
          <AdminPanel
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onEditVehicle={handleEditVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onDuplicateVehicle={handleDuplicateVehicle}
            onResetCatalog={handleResetCatalog}
          />
        )}

      </main>

      {/* Floating Bottom Comparison Bar Dock */}
      {comparedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 border border-amber-500/50 shadow-2xl backdrop-blur-xl px-5 py-3 rounded-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300 print:hidden max-w-2xl w-[92%]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 shrink-0">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Comparing ({comparedIds.length}/3)</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto flex-1 py-1">
            {comparedVehicles.map((v) => (
              <span
                key={v.id}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-200 font-medium whitespace-nowrap flex items-center gap-1.5"
              >
                <span>{v.make} {v.model}</span>
                <button
                  onClick={() => handleToggleCompare(v.id)}
                  className="text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              Compare Now
            </button>
            <button
              onClick={() => setComparedIds([])}
              className="p-2 text-slate-400 hover:text-white"
              title="Clear comparison list"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-8 mt-12 text-xs text-slate-400 font-mono print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white font-display">AutoLot Dealership</span>
            <span>• Monroney Window Sticker Management System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>© {new Date().getFullYear()} AutoLot Direct Inc.</span>
            <span>All Specs Verified</span>
          </div>
        </div>
      </footer>

      {/* 3D Interactive Showroom Modal (Lazy Loaded) */}
      {is3DStageOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
              <div className="flex flex-col items-center gap-3 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-2xl">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <div className="text-sm font-extrabold text-white font-display">Initializing 3D Viewport Engine...</div>
              </div>
            </div>
          }
        >
          <ThreeCarShowroom
            vehicle={showroomVehicle}
            onClose={() => setIs3DStageOpen(false)}
            onPurchase={(v) => {
              setIs3DStageOpen(false);
              setPurchaseVehicle(v);
            }}
          />
        </Suspense>
      )}

      {/* Vehicle Details Modal */}
      <VehicleDetailModal
        vehicle={detailVehicle}
        isOpen={Boolean(detailVehicle)}
        onClose={() => setDetailVehicle(null)}
        onPurchase={(v) => setPurchaseVehicle(v)}
        onInspect3D={(v) => handleInspect3D(v)}
        isSaved={detailVehicle ? savedIds.includes(detailVehicle.id) : false}
        onToggleSave={handleToggleSave}
        isCompared={detailVehicle ? comparedIds.includes(detailVehicle.id) : false}
        onToggleCompare={handleToggleCompare}
        onOpenPrintSticker={(v) => setPrintStickerVehicle(v)}
      />

      {/* Requirement 1: Side-by-Side Compare Modal */}
      <VehicleCompareModal
        vehicles={comparedVehicles}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onRemoveVehicle={handleToggleCompare}
        onPurchase={(v) => setPurchaseVehicle(v)}
      />

      {/* Requirement 5: Print-Friendly Monroney Sticker Modal */}
      <MonroneyStickerModal
        vehicle={printStickerVehicle}
        isOpen={Boolean(printStickerVehicle)}
        onClose={() => setPrintStickerVehicle(null)}
      />

      {/* Purchase / Reservation Checkout Modal */}
      <PurchaseModal
        vehicle={purchaseVehicle}
        isOpen={Boolean(purchaseVehicle)}
        onClose={() => setPurchaseVehicle(null)}
        onSuccess={refreshVehicles}
      />

      {/* Admin Add/Edit Form Modal */}
      <VehicleFormModal
        vehicle={formVehicle}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveVehicle}
      />

    </div>
  );
}
