import React, { useState } from 'react';
import { Heart, ArrowLeftRight, Shield, Lock, Menu, X, User as UserIcon, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogoutConfirmModal } from './LogoutConfirmModal';

export const Navbar = ({
  activeTab,
  onTabChange,
  onOpen3DStage,
  totalVehiclesCount,
  savedCount,
  showFavoritesOnly,
  onToggleFavorites,
  comparedCount,
  onOpenCompare,
  onOpenProfile,
  searchQuery = '',
  onSearchChange
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'showroom', label: 'SHOWROOM' },
    { id: 'services', label: 'SERVICES' },
    { id: 'contact', label: 'CONTACT' }
  ];

  const handleNavClick = (tabId) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  const displayName = user
    ? (user.name || user.fullName || user.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
    : '';

  return (
    <header className="navbar print:hidden relative z-50 bg-white/95 backdrop-blur-md border-b border-[#E5DCCF]/90 shadow-[0_12px_32px_rgba(31,24,19,0.12),0_2px_8px_rgba(0,0,0,0.06)] sticky top-0 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        
        {/* Brand Logo - CariusX */}
        <div
          onClick={() => handleNavClick('showroom')}
          className="brand flex items-center gap-2.5 cursor-pointer select-none shrink-0 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5A2B] via-[#6E4520] to-[#A06C3B] text-white flex items-center justify-center font-display font-black text-base shadow-[0_4px_12px_rgba(139,90,43,0.35)] group-hover:scale-105 group-hover:shadow-[0_6px_18px_rgba(139,90,43,0.45)] transition-all">
            CX
          </div>
          <div className="hidden sm:block leading-none">
            <span className="font-display font-black text-lg text-[#1F1813] tracking-tight block">
              Carius<span className="text-[#8B5A2B]">X</span>
            </span>
            <span className="text-[#8B5A2B] font-semibold text-[10px] uppercase tracking-widest block mt-0.5">
              Supercar Gallery
            </span>
          </div>
        </div>

        {/* Live Search Bar in Center Header */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-6 relative">
          <Search className="w-4 h-4 text-[#8B5A2B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search luxury cars, models..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-[#F8F4EC] border border-[#E5DCCF] rounded-full text-[#1F1813] placeholder-[#6B5E52]/60 focus:outline-none focus:border-[#8B5A2B] shadow-[inner_0_2px_4px_rgba(0,0,0,0.04)] focus:shadow-[0_4px_12px_rgba(139,90,43,0.15)] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange?.('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B5E52] hover:text-[#1F1813]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center Nav Links - Desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`text-xs font-bold tracking-wider transition-all cursor-pointer py-1 relative flex items-center gap-1 ${
                  isActive 
                    ? 'text-[#8B5A2B] font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5A2B] after:rounded-full' 
                    : 'text-[#1F1813]/80 hover:text-[#8B5A2B]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}

          {user && user.role === 'admin' && (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`px-3.5 py-1.5 bg-[#8B5A2B] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_4px_10px_rgba(139,90,43,0.3)] hover:shadow-[0_6px_14px_rgba(139,90,43,0.4)] active:translate-y-0.5 ${
                activeTab === 'admin' ? 'bg-[#6E4520] ring-2 ring-[#8B5A2B]/40' : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ADMIN CONSOLE</span>
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Favorites / Bookmarks Badge Button (Only shown when user is logged in) */}
          {user && (
            <button
              type="button"
              onClick={() => {
                if (onOpenProfile) onOpenProfile();
                else if (onToggleFavorites) onToggleFavorites();
              }}
              className={`relative p-2.5 rounded-full border transition-all cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.12)] active:translate-y-0.5 ${
                savedCount > 0 || showFavoritesOnly 
                  ? 'bg-[#F2EBE1] border-[#8B5A2B] text-[#8B5A2B]' 
                  : 'bg-[#F8F4EC] border-[#E5DCCF] text-[#6B5E52] hover:border-[#8B5A2B]'
              }`}
              title="View Saved Bookmarks"
            >
              <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-[#8B5A2B] text-[#8B5A2B]' : ''}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8B5A2B] text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          {/* Comparison Dock Button */}
          {comparedCount > 0 && (
            <button
              type="button"
              onClick={onOpenCompare}
              className="relative p-2.5 rounded-full bg-[#F8F4EC] border border-[#E5DCCF] text-[#8B5A2B] hover:border-[#8B5A2B] transition-all cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.12)] active:translate-y-0.5"
              title="View Model Comparison"
            >
              <ArrowLeftRight className="w-4 h-4 text-[#8B5A2B]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                {comparedCount}
              </span>
            </button>
          )}

          {/* User Auth Info & Profile Pill */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2EBE1] hover:bg-[#EAE1D3] border border-[#E5DCCF] transition-all cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_5px_12px_rgba(0,0,0,0.1)] active:translate-y-0.5"
                title="View Profile, Appointments & Logout"
              >
                <div className="w-6 h-6 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                  {displayName.charAt(0)}
                </div>
                <span className="text-xs font-bold text-[#1F1813] truncate max-w-[120px]">
                  {displayName}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    activeTab === 'login' ? 'bg-[#8B5A2B] text-white shadow-[0_4px_10px_rgba(139,90,43,0.3)]' : 'text-[#1F1813] hover:text-[#8B5A2B]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('register')}
                  className={`px-4 py-1.5 rounded-full bg-[#8B5A2B] text-white hover:bg-[#6E4520] transition-all cursor-pointer shadow-[0_4px_12px_rgba(139,90,43,0.3)] hover:shadow-[0_6px_16px_rgba(139,90,43,0.4)] active:translate-y-0.5`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button (STRICTLY hidden on lg screens and up) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-[#F8F4EC] border border-[#E5DCCF] text-[#1F1813] cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.06)]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Navigation Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5DCCF] px-6 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#F2EBE1] text-[#8B5A2B] font-black' 
                      : 'text-[#1F1813] hover:bg-[#F8F4EC]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {user && user.role === 'admin' && (
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className="text-left text-xs font-bold uppercase tracking-wider py-2.5 px-3 bg-[#8B5A2B] text-white rounded-xl flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>

          <div className="pt-3 border-t border-[#F2EBE1] flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onOpenProfile?.();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-[#8B5A2B] flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{displayName} Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-[#B2543C]"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-around pt-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className="text-[#1F1813]"
                >
                  Log In
                </button>
                <span className="text-[#E5DCCF]">|</span>
                <button
                  type="button"
                  onClick={() => handleNavClick('register')}
                  className="text-[#8B5A2B]"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
