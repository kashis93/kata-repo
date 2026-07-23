import React from 'react';
import { Car, Sparkles, LayoutDashboard, ShoppingBag, Heart, ArrowLeftRight, User as UserIcon } from 'lucide-react';
import { User } from '../types/auth';

interface NavbarProps {
  activeTab: 'showroom' | 'admin';
  onTabChange: (tab: 'showroom' | 'admin') => void;
  onOpen3DStage: () => void;
  purchaseCount: number;
  totalVehiclesCount: number;
  savedCount: number;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  comparedCount: number;
  onOpenCompare: () => void;
  user: User | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpen3DStage,
  purchaseCount,
  totalVehiclesCount,
  savedCount,
  showFavoritesOnly,
  onToggleFavorites,
  comparedCount,
  onOpenCompare,
  user,
  onOpenLogin,
  onOpenRegister,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/80 shadow-2xl print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0 group" onClick={() => onTabChange('showroom')}>
          <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/20 border border-amber-300 transition-transform duration-300 group-hover:scale-105">
            <Car className="w-6 h-6" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white font-display tracking-tight text-champagne-gradient">AutoLot</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-extrabold uppercase tracking-widest">
                LUXURY
              </span>
            </div>
            <span className="text-[11px] font-sans text-slate-400 hidden lg:block tracking-wide">Premier Automotive Gallery & Inventory</span>
          </div>
        </div>

        {/* View Switcher Tabs (Showroom vs Admin) */}
        <div className="flex items-center p-1.5 bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-inner">
          <button
            onClick={() => onTabChange('showroom')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'showroom'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 font-extrabold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <Car className="w-4 h-4" />
            <span className="hidden sm:inline font-display">Showroom</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'showroom' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
              {totalVehiclesCount}
            </span>
          </button>

          <button
            onClick={() => onTabChange('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow-lg font-extrabold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline font-display">Inventory Admin</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Saved Favorites Toggle */}
          <button
            onClick={onToggleFavorites}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              showFavoritesOnly
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/10'
                : 'bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 border-slate-800/80'
            }`}
            title="Toggle Saved Favorites View"
          >
            <Heart className={`w-4 h-4 transition-transform duration-200 ${savedCount > 0 ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'}`} />
            <span className="hidden sm:inline font-display">Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Comparison Modal Button */}
          {comparedCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span className="hidden sm:inline font-display">Compare</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
                {comparedCount}
              </span>
            </button>
          )}

          {/* 3D Stage Trigger Button */}
          <button
            onClick={onOpen3DStage}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md hover:shadow-amber-500/10"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-display">3D Showroom</span>
          </button>

          {/* Auth Controls & Account Status */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-slate-800/80 pl-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white font-display truncate max-w-[120px]">{user.name || user.email.split('@')[0]}</span>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">{user.role}</span>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Log Out"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-slate-800/80 pl-3">
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={onOpenRegister}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Sign Up
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};

