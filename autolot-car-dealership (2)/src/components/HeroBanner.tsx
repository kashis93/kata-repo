import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-800/80 shadow-2xl bg-black text-white min-h-[380px] sm:min-h-[440px] flex items-center">
      
      {/* High-Resolution Luxury Car Background Image */}
      <img
        src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=2000&q=80"
        alt="Porsche 911 Luxury Vehicle"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Subtle Eased Gradient Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none" />

      {/* Clean & Neat Hero Content */}
      <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-xl space-y-4">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.08] uppercase text-white">
          EXPERIENCE<br />
          <span className="text-amber-400">CURATED LUXURY.</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
          Discover our exclusive collection of premium vehicles.
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              const el = document.getElementById('inventory-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20 inline-block font-sans"
          >
            BROWSE INVENTORY
          </button>
        </div>
      </div>

    </div>
  );
};
