import React from 'react';

export const HeroBanner = () => {
  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] flex items-center shadow-2xl">
      
      {/* 100% Full-Bleed Red Ferrari SF90 Stradale Background Image */}
      <img
        src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=2600&q=90"
        alt="Ferrari SF90 Stradale Red Supercar"
        className="absolute inset-0 w-full h-full object-cover object-right sm:object-center filter brightness-[0.95] contrast-[1.05]"
      />

      {/* Seamless Eased Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/65 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />

      {/* Hero Content with Color-Matched Typography */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20">
        <div className="max-w-2xl space-y-6">
          
          {/* Color-Matched Red/Amber Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span>CURATED FERRARI & LUXURY GALLERY</span>
          </div>

          {/* Color-Matched Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[1.05] uppercase text-white drop-shadow-md">
            EXPERIENCE<br />
            <span className="bg-gradient-to-r from-red-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">
              CURATED LUXURY.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-200 font-sans leading-relaxed max-w-lg drop-shadow-sm">
            Discover our exclusive collection of hand-selected premium vehicles.
          </p>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('inventory-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#B2543C] via-[#8B5A2B] to-[#8B5A2B] hover:from-[#c25d43] hover:to-[#71471F] text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-xl shadow-red-900/30 inline-block font-sans hover:scale-105 active:scale-98 border border-white/20"
            >
              BROWSE INVENTORY
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
