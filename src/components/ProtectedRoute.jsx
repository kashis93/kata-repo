import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, Shield } from 'lucide-react';

export const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, login } = useAuth();

  if (!user) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center font-sans space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#120D12] border-2 border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.4)] flex items-center justify-center mx-auto text-red-500">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-extrabold text-red-400 uppercase tracking-widest px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40">
            AUTHENTICATION REQUIRED
          </span>
          <h2 className="text-3xl font-black font-display text-[#1F1813] uppercase tracking-tight">
            RESTRICTED ACCESS
          </h2>
          <p className="text-xs text-[#6B5E52] max-w-md mx-auto leading-relaxed">
            Please sign in with appropriate permissions to access this page.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-mono font-extrabold text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer"
          >
            SIGN IN TO CONTINUE
          </a>
        </div>
      </div>
    );
  }

  if (roleRequired && user.role !== roleRequired) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center font-sans space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#120D12] border-2 border-red-500/60 shadow-[0_0_50px_rgba(239,68,68,0.4)] flex items-center justify-center mx-auto text-red-500">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-extrabold text-red-400 uppercase tracking-widest px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40">
            ADMINISTRATOR ACCESS PROTECTED
          </span>
          <h2 className="text-3xl font-black font-display text-[#1F1813] uppercase tracking-tight">
            DEALER INVENTORY CATALOG
          </h2>
          <p className="text-xs text-[#6B5E52] max-w-md mx-auto leading-relaxed">
            The inventory management console is restricted exclusively to authorized AutoLot gallery administrators.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => login('admin@autolotgallery.com', 'admin123')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono font-extrabold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-amber-300" />
            <span>AUTHENTICATE AS ADMIN</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
};
