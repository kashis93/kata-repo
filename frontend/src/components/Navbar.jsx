import React, { useState } from 'react';
import { Search, Heart, ArrowLeftRight, Shield, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({
  activeTab,
  onTabChange,
  onOpen3DStage,
  totalVehiclesCount,
  savedCount,
  showFavoritesOnly,
  onToggleFavorites,
  comparedCount,
  onOpenCompare
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'showroom', label: 'INVENTORY' },
    { id: 'services', label: 'SERVICES' },
    { id: 'financing', label: 'FINANCING' },
    { id: 'about', label: 'ABOUT US' },
    { id: 'contact', label: 'CONTACT' }
  ];

  const handleNavClick = (tabId) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar print:hidden relative z-50">
      <div className="navbar-inner">
        
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('showroom')}
          className="brand cursor-pointer select-none"
        >
          <span className="brand-mark">AG</span>
          <span className="brand-text">
            AutoLot<br />Gallery
          </span>
        </div>

        {/* Center Nav Links - Desktop */}
        <nav className="nav-links hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`text-xs font-bold tracking-wider transition-all cursor-pointer py-1 relative ${
                  isActive 
                    ? 'text-[#8B5A2B] font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5A2B] after:rounded-full' 
                    : 'text-[#1F1813]/80 hover:text-[#8B5A2B]'
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
              className={`px-3 py-1 bg-[#8B5A2B] text-white rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin' ? 'bg-[#71471F] ring-2 ring-[#8B5A2B]/40' : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ADMIN CONSOLE</span>
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions flex items-center gap-3">
          
          {/* Favorites Badge Button */}
          {savedCount > 0 && (
            <button
              type="button"
              onClick={onToggleFavorites}
              className={`icon-btn ${showFavoritesOnly ? 'icon-btn--primary' : ''}`}
              title="Toggle Favorites"
            >
              <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Comparison Dock Button */}
          {comparedCount > 0 && (
            <button
              type="button"
              onClick={onOpenCompare}
              className="icon-btn"
              title="View Model Comparison"
            >
              <ArrowLeftRight className="w-4 h-4 text-[#8B5A2B]" />
            </button>
          )}

          {/* User Auth Links */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#8B5A2B] font-sans truncate max-w-[120px]">
                  {user.email.split('@')[0]}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="auth-link"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className={`auth-link ${activeTab === 'login' ? 'text-[#8B5A2B] font-bold' : ''}`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('register')}
                  className={`auth-link auth-link--divider ${activeTab === 'register' ? 'text-[#8B5A2B] font-bold' : ''}`}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Book A Viewing Primary Pill Button */}
          <button
            type="button"
            onClick={onOpen3DStage}
            className="btn btn-primary btn-sm inline-flex"
          >
            Book a Viewing
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E5DCCF] px-6 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-xl transition-all cursor-pointer ${
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
                className="text-left text-xs font-bold uppercase tracking-wider py-2 px-3 bg-[#8B5A2B] text-white rounded-xl flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>

          <div className="pt-3 border-t border-[#F2EBE1] flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onOpen3DStage();
                setMobileMenuOpen(false);
              }}
              className="w-full btn btn-primary text-center text-xs py-2.5"
            >
              Book a Viewing
            </button>

            {user ? (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-[#8B5A2B]">
                  Logged in as {user.email}
                </span>
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
