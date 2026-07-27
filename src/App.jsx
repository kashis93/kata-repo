/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { api } from './services/api.js';
import { Navbar } from './components/Navbar.jsx';
import { HeroBanner } from './components/HeroBanner.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { VehicleCard } from './components/VehicleCard.jsx';
import { UserProfileModal } from './components/UserProfileModal.jsx';
import { ClientTestimonials } from './components/ClientTestimonials.jsx';
import { Carousel3D } from './components/Carousel3D.jsx';
import { AdminPanel } from './components/AdminPanel.jsx';
import { VehicleFormModal } from './components/VehicleFormModal.jsx';
import { exportVehiclesToCSV } from './utils/csvExport.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { ServicesPage } from './pages/ServicesPage.jsx';
import { FinancingPage } from './pages/FinancingPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import {
  ThreeCarShowroom,
  VehicleDetailModal,
  VehicleCompareModal,
  MonroneyStickerModal,
  PurchaseModal,
  VideoShowcaseModal
} from './components/Modals.jsx';
import { Footer } from './components/Footer.jsx';
import { TestDriveModal } from './components/TestDriveModal.jsx';
import { PartnerBrandsMarquee } from './components/PartnerBrandsMarquee.jsx';
import { Car, Heart, ArrowLeftRight, X, Loader2, Lock, Shield } from 'lucide-react';


function AppContent() {
  const { user, token, isLoading, login } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState('showroom');
  const [hashRoute, setHashRoute] = useState(window.location.hash || '#/');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | '3d-deck'

  // Modals state
  const [showroomVehicle, setShowroomVehicle] = useState(null);
  const [is3DStageOpen, setIs3DStageOpen] = useState(false);

  const [videoStudioVehicle, setVideoStudioVehicle] = useState(null);
  const [isVideoStudioOpen, setIsVideoStudioOpen] = useState(false);

  const [detailVehicle, setDetailVehicle] = useState(null);
  const [purchaseVehicle, setPurchaseVehicle] = useState(null);
  const [testDriveVehicle, setTestDriveVehicle] = useState(null);
  const [printStickerVehicle, setPrintStickerVehicle] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const [formVehicle, setFormVehicle] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [purchasesCount, setPurchasesCount] = useState(0);

  // Saved / Bookmarked Favorites State (Persistent via localStorage)
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('autolot_saved_vehicles');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Side-by-Side Comparison State
  const [comparedIds, setComparedIds] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    searchQuery: '',
    make: 'All',
    bodyType: 'All',
    fuelType: 'All',
    minPrice: 0,
    maxPrice: 10000000,
    inStockOnly: false,
    sortBy: 'price-asc'
  });

  // Track window location hash routing
  useEffect(() => {
    const handleHashChange = () => {
      setHashRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Hash-based routing & auth guarding redirects
  useEffect(() => {
    if (isLoading) return;

    const route = hashRoute.split('?')[0];
    if (route === '#/admin') {
      if (!user) {
        window.location.hash = '#/login';
      } else if (user.role !== 'admin') {
        window.location.hash = '#/';
      } else {
        setActiveTab('admin');
      }
    } else if (route === '#/login') {
      setActiveTab('login');
    } else if (route === '#/register') {
      setActiveTab('register');
    } else if (route === '#/services') {
      setActiveTab('services');
    } else if (route === '#/financing') {
      setActiveTab('financing');
    } else if (route === '#/about') {
      setActiveTab('about');
    } else if (route === '#/contact') {
      setActiveTab('contact');
    } else {
      setActiveTab('showroom');
    }
  }, [hashRoute, user, isLoading]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('autolot_saved_vehicles', JSON.stringify(savedIds));
    } catch (e) {
      console.error('Failed to store saved vehicles', e);
    }
  }, [savedIds]);

  // Load vehicles & orders dynamically from backend / cache
  const refreshVehicles = async () => {
    const loaded = await api.getVehicles();
    setVehicles(loaded);
    setPurchasesCount(api.getPurchases().length);
  };

  useEffect(() => {
    refreshVehicles();
  }, [token]);

  // Extract distinct makes
  const uniqueMakes = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.make));
    return Array.from(set).sort();
  }, [vehicles]);

  // Filter & Sort Logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        if (showFavoritesOnly && !savedIds.includes(v.id)) return false;

        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const match =
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            (v.vin && v.vin.toLowerCase().includes(q)) ||
            (v.features && v.features.some((f) => f.toLowerCase().includes(q))) ||
            (v.year && v.year.toString().includes(q));
          if (!match) return false;
        }

        if (filters.make !== 'All' && v.make !== filters.make) return false;
        if (filters.bodyType !== 'All' && v.bodyType !== filters.bodyType) return false;
        if (filters.fuelType !== 'All' && v.fuelType !== filters.fuelType) return false;
        if (v.price > filters.maxPrice) return false;
        if (filters.inStockOnly && v.quantity <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'year-desc') return b.year - a.year;
        if (filters.sortBy === 'power-desc') return (b.horsepower || 0) - (a.horsepower || 0);
        if (filters.sortBy === 'mileage-asc') return (a.mileage || 0) - (b.mileage || 0);
        return 0;
      });
  }, [vehicles, filters, showFavoritesOnly, savedIds]);

  // Compared Vehicles
  const comparedVehicles = useMemo(() => {
    return vehicles.filter((v) => comparedIds.includes(v.id));
  }, [vehicles, comparedIds]);

  // Handlers
  const handleToggleSave = (id) => {
    if (!user) {
      window.location.hash = '#/register';
      return;
    }
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleToggleCompare = (id) => {
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

  const handleUpdateFilters = (updated) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      make: 'All',
      bodyType: 'All',
      fuelType: 'All',
      minPrice: 0,
      maxPrice: 1000000000,
      inStockOnly: false,
      sortBy: 'price-asc'
    });
    setShowFavoritesOnly(false);
  };

  const handleInitiatePurchase = (vehicle) => {
    if (!user) {
      window.location.hash = '#/register';
      return;
    }
    setPurchaseVehicle(vehicle);
  };

  // Admin Handlers
  const handleAddVehicle = () => {
    setFormVehicle(null);
    setIsFormOpen(true);
  };

  const handleEditVehicle = (vehicle) => {
    setFormVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleSaveVehicle = async (data) => {
    try {
      if (formVehicle) {
        await api.updateVehicle({ ...formVehicle, ...data });
      } else {
        await api.addVehicle(data);
      }
      await refreshVehicles();
    } catch (err) {
      alert(err.message || 'Failed to save vehicle details.');
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await api.deleteVehicle(id);
      setComparedIds((prev) => prev.filter((i) => i !== id));
      setSavedIds((prev) => prev.filter((i) => i !== id));
      await refreshVehicles();
    } catch (err) {
      alert(err.message || 'Failed to delete vehicle.');
    }
  };

  const handleDuplicateVehicle = async (vehicle) => {
    try {
      const { id, ...rest } = vehicle;
      await api.addVehicle({
        ...rest,
        model: `${vehicle.model} (Copy)`,
        vin: `WP0AB2A${Math.floor(100000 + Math.random() * 900000)}`
      });
      await refreshVehicles();
    } catch (err) {
      alert(err.message || 'Failed to duplicate vehicle entry.');
    }
  };

  const handleResetCatalog = () => {
    api.resetVehicles();
    refreshVehicles();
  };

  const handleInspect3D = (vehicle) => {
    setShowroomVehicle(vehicle);
    setIs3DStageOpen(true);
  };

  const handleGlobal3DStage = () => {
    setShowroomVehicle(vehicles[0] || null);
    setIs3DStageOpen(true);
  };

  const handleOpenVideoStudio = (vehicle) => {
    setVideoStudioVehicle(vehicle || vehicles[0] || null);
    setIsVideoStudioOpen(true);
  };

  const handleTabChange = (tab) => {
    if (tab === 'showroom') {
      window.location.hash = '#/';
    } else if (tab === 'services') {
      window.location.hash = '#/services';
    } else if (tab === 'financing') {
      window.location.hash = '#/financing';
    } else if (tab === 'about') {
      window.location.hash = '#/about';
    } else if (tab === 'contact') {
      window.location.hash = '#/contact';
    } else if (tab === 'login') {
      window.location.hash = '#/login';
    } else if (tab === 'register') {
      window.location.hash = '#/register';
    } else if (tab === 'admin') {
      window.location.hash = '#/admin';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F4EC] text-[#1F1813] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3 p-6 bg-white border border-[#E5DCCF] rounded-3xl shadow-xl text-center max-w-sm w-full mx-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B5A2B]" />
          <div className="text-sm font-bold text-[#1F1813] font-display">Initializing AutoLot Gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#1F1813] flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpen3DStage={handleGlobal3DStage}
        purchaseCount={purchasesCount}
        totalVehiclesCount={vehicles.length}
        savedCount={savedIds.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        comparedCount={comparedIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Full-Bleed Edge-to-Edge Hero Banner */}
      {activeTab === 'showroom' && (
        <HeroBanner
          onOpen3DStage={handleGlobal3DStage}
          onOpenVideoStudio={() => setIsVideoStudioOpen(true)}
        />
      )}

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Login Page */}
        {activeTab === 'login' && <LoginPage />}

        {/* Register Page */}
        {activeTab === 'register' && <RegisterPage />}

        {/* Services Page */}
        {activeTab === 'services' && <ServicesPage />}

        {/* Financing Page */}
        {activeTab === 'financing' && <FinancingPage />}

        {/* About Us Page */}
        {activeTab === 'about' && <AboutPage />}

        {/* Contact Page */}
        {activeTab === 'contact' && <ContactPage />}

        {/* Customer Showroom Tab */}
        {activeTab === 'showroom' && (
          <div className="space-y-6">

            {/* Interactive 3D Video Portfolio Deck Stage */}
            <Carousel3D
              selectedCategory="all"
              onSelectProject={(project) => {
                const matchedVehicle = vehicles.find(
                  (v) => v.make.toLowerCase() === (project.make || '').toLowerCase()
                ) || vehicles[0];
                if (matchedVehicle) {
                  setShowroomVehicle(matchedVehicle);
                  setIs3DStageOpen(true);
                }
              }}
              onOpenBooking={(project) => {
                const matchedVehicle = vehicles.find(
                  (v) => v.make.toLowerCase() === (project.make || '').toLowerCase()
                ) || vehicles[0];
                if (matchedVehicle) {
                  handleInitiatePurchase(matchedVehicle);
                }
              }}
            />

            {/* Top Quick Filter & View Mode Controls Bar */}
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
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              user={user}
            />

            {/* Main Inventory Vehicle Cards Grid (Full-width clean layout) */}
            <div className="w-full">
              {filteredVehicles.length === 0 ? (
                <div className="bg-white border border-[#E5DCCF] rounded-3xl p-12 text-center space-y-4 my-4 shadow-md">
                  <div className="w-16 h-16 rounded-3xl bg-[#F8F4EC] border border-[#E5DCCF] flex items-center justify-center mx-auto text-[#8B5A2B]">
                    {showFavoritesOnly ? <Heart className="w-8 h-8 text-[#8B5A2B] fill-[#8B5A2B]/20" /> : <Car className="w-8 h-8 text-[#8B5A2B]" />}
                  </div>
                  <h3 className="text-xl font-bold text-[#1F1813] font-display">
                    {showFavoritesOnly ? 'No Saved Favorite Vehicles' : 'No Vehicles Match Your Search'}
                  </h3>
                  <p className="text-xs text-[#6B5E52] max-w-md mx-auto">
                    {showFavoritesOnly
                      ? 'Click the heart icon on any vehicle card to save your favorite models for quick access in your profile.'
                      : 'Try adjusting your search keywords, price range, or brand filter to discover available models.'}
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-3 bg-[#8B5A2B] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all cursor-pointer hover:bg-[#6E4520]"
                  >
                    Clear Search Filters
                  </button>
                </div>
              ) : (
                <div id="inventory-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onPurchase={handleInitiatePurchase}
                      onInspect3D={handleInspect3D}
                      onOpenDetails={(v) => setDetailVehicle(v)}
                      onScheduleTestDrive={(v) => setTestDriveVehicle(v)}
                      isSaved={savedIds.includes(vehicle.id)}
                      onToggleSave={handleToggleSave}
                      isCompared={comparedIds.includes(vehicle.id)}
                      onToggleCompare={handleToggleCompare}
                      onOpenPrintSticker={(v) => setPrintStickerVehicle(v)}
                      user={user}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Client Testimonials Slider Section below Inventory Grid */}
            <ClientTestimonials />

          </div>
        )}

        {/* Admin / Inventory Catalog Protection */}
        {activeTab === 'inventory' && (
          user && user.role === 'admin' ? (
            <AdminPanel
              vehicles={vehicles}
              onAddVehicle={handleAddVehicle}
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onDuplicateVehicle={handleDuplicateVehicle}
              onResetCatalog={handleResetCatalog}
            />
          ) : (
            <div className="py-16 px-4 max-w-2xl mx-auto text-center font-sans space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-[#120D12] border-2 border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.4)] flex items-center justify-center mx-auto text-red-500">
                <Lock className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-extrabold text-red-400 uppercase tracking-widest px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40">
                  ADMINISTRATOR ACCESS PROTECTED
                </span>
                <h2 className="text-3xl font-black font-display text-white uppercase tracking-tight">
                  DEALER INVENTORY CATALOG
                </h2>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  The raw inventory management console, stock adjustments, Monroney sticker editor, and vehicle database controls are restricted exclusively to authorized AutoLot Gallery dealers and administrators.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    login('admin@autolotgallery.com', 'admin123');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-red-600/40 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4 text-amber-300" />
                  <span>AUTHENTICATE AS ADMIN</span>
                </button>

                <button
                  onClick={() => handleTabChange('showroom')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  RETURN TO 3D SHOWROOM
                </button>
              </div>
            </div>
          )
        )}

        {/* Admin Console Tab */}
        {activeTab === 'admin' && (
          <ProtectedRoute roleRequired="admin">
            <AdminPanel
              vehicles={vehicles}
              onAddVehicle={handleAddVehicle}
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onDuplicateVehicle={handleDuplicateVehicle}
              onResetCatalog={handleResetCatalog}
            />
          </ProtectedRoute>
        )}

      </main>

      {/* Floating Bottom Comparison Bar Dock */}
      {comparedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 border border-[#E5DCCF] shadow-xl backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300 print:hidden max-w-2xl w-[92%]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1F1813] shrink-0">
            <ArrowLeftRight className="w-4 h-4 text-[#8B5A2B]" />
            <span className="font-display">Comparing ({comparedIds.length}/3)</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto flex-1 py-1">
            {comparedVehicles.map((v) => (
              <span
                key={v.id}
                className="px-3 py-1 bg-[#F2EBE1] border border-[#E5DCCF] rounded-full text-xs text-[#1F1813] font-semibold whitespace-nowrap flex items-center gap-1.5"
              >
                <span>{v.make} {v.model}</span>
                <button
                  onClick={() => handleToggleCompare(v.id)}
                  className="text-[#6B5E52] hover:text-[#B2543C] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-5 py-2 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-full transition-all shadow-xs cursor-pointer"
            >
              Compare Now
            </button>
            <button
              onClick={() => setComparedIds([])}
              className="p-2 text-[#6B5E52] hover:text-[#1F1813]"
              title="Clear comparison list"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Official Partner Brands Infinite Marquee Ticker */}
      <PartnerBrandsMarquee />

      {/* Footer */}
      <Footer onTabChange={handleTabChange} user={user} />

      {/* Test Drive Scheduling Modal */}
      <TestDriveModal
        vehicle={testDriveVehicle}
        user={user}
        isOpen={Boolean(testDriveVehicle)}
        onClose={() => setTestDriveVehicle(null)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 3D Interactive Showroom Modal */}

      {is3DStageOpen && (
        <ThreeCarShowroom
          vehicle={showroomVehicle}
          onClose={() => setIs3DStageOpen(false)}
          onPurchase={handleInitiatePurchase}
        />
      )}

      {/* 360 Video Studio Showcase Modal */}
      <VideoShowcaseModal
        vehicles={vehicles}
        initialVehicle={videoStudioVehicle}
        isOpen={isVideoStudioOpen}
        onClose={() => setIsVideoStudioOpen(false)}
        onPurchase={handleInitiatePurchase}
      />

      {/* Vehicle Details Modal */}
      <VehicleDetailModal
        vehicle={detailVehicle}
        isOpen={Boolean(detailVehicle)}
        onClose={() => setDetailVehicle(null)}
        onPurchase={handleInitiatePurchase}
        onInspect3D={(v) => handleInspect3D(v)}
        onScheduleTestDrive={(v) => setTestDriveVehicle(v)}
        isSaved={detailVehicle ? savedIds.includes(detailVehicle.id) : false}
        onToggleSave={handleToggleSave}
        isCompared={detailVehicle ? comparedIds.includes(detailVehicle.id) : false}
        onToggleCompare={handleToggleCompare}
        onOpenPrintSticker={(v) => setPrintStickerVehicle(v)}
      />


      {/* Side-by-Side Compare Modal */}
      <VehicleCompareModal
        vehicles={comparedVehicles}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onRemoveVehicle={handleToggleCompare}
        onPurchase={handleInitiatePurchase}
      />

      {/* Print-Friendly Monroney Sticker Modal */}
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

      {/* User Profile & Bookmarks Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        vehicles={vehicles}
        savedIds={savedIds}
        onToggleSave={handleToggleSave}
        onPurchase={handleInitiatePurchase}
        onOpenDetails={(v) => setDetailVehicle(v)}
        onScheduleTestDrive={(v) => setTestDriveVehicle(v)}
        onOpenAddVehicle={() => {
          setFormVehicle(null);
          setIsFormOpen(true);
        }}
        onDeleteVehicle={handleDeleteVehicle}
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
