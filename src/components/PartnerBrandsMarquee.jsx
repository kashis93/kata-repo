import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

export const PARTNER_BRANDS = [
  {
    name: 'Porsche',
    slug: 'porsche',
    color: '#D00000',
    tagline: 'Stuttgart Performance & Icon Design',
    description: 'Renowned rear-engine sports cars with 911 GT3 RS and Turbo S track pedigree.',
    origin: 'Germany',
    badge: '🏎️',
    logoUrl: 'https://cdn.simpleicons.org/porsche/D00000'
  },
  {
    name: 'Ferrari',
    slug: 'ferrari',
    color: '#D00000',
    tagline: 'Maranello V12 & V8 Racing Heritage',
    description: 'Atmospheric V12 and twin-turbo V8 supercars built with Formula 1 DNA.',
    origin: 'Italy',
    badge: '🐎',
    logoUrl: 'https://cdn.simpleicons.org/ferrari/D00000'
  },
  {
    name: 'Lamborghini',
    slug: 'lamborghini',
    color: '#D4AF37',
    tagline: 'Sant’Agata V12 Supercars',
    description: 'Aspirational design, atmospheric V12 revs, and cutting-edge hybrid hypercars.',
    origin: 'Italy',
    badge: '🐂',
    logoUrl: 'https://cdn.simpleicons.org/lamborghini/D4AF37'
  },
  {
    name: 'Mercedes-Benz',
    slug: 'mercedes',
    color: '#1F1813',
    tagline: 'AMG High Performance & Class',
    description: 'Supreme German engineering blending hand-built V8 biturbo power with executive luxury.',
    origin: 'Germany',
    badge: '⭐',
    logoUrl: 'https://cdn.simpleicons.org/mercedes/1F1813'
  },
  {
    name: 'BMW',
    slug: 'bmw',
    color: '#0066B1',
    tagline: 'M Power Ultimate Driving Machines',
    description: 'Precision chassis tuning and twin-turbo inline-6 and V8 twin-power engines.',
    origin: 'Germany',
    badge: '🔵',
    logoUrl: 'https://cdn.simpleicons.org/bmw/0066B1'
  },
  {
    name: 'Suzuki',
    slug: 'suzuki',
    color: '#003399',
    tagline: 'Precision Engineering & Sport',
    description: 'Agile turbocharged hot hatches and rugged ALLGRIP PRO 4x4 off-road icons.',
    origin: 'Japan',
    badge: '⚡',
    logoUrl: 'https://cdn.simpleicons.org/suzuki/003399'
  },
  {
    name: 'Aston Martin',
    slug: 'astonmartin',
    color: '#004225',
    tagline: 'British Grand Touring Elegance',
    description: 'Timeless hand-crafted aluminum grand tourers with AMG-sourced twin-turbo V8 thrust.',
    origin: 'UK',
    badge: '🦅',
    logoUrl: 'https://cdn.simpleicons.org/astonmartin/004225'
  },
  {
    name: 'Bugatti',
    slug: 'bugatti',
    color: '#000000',
    tagline: 'W16 Quad-Turbo Hypercar Supremacy',
    description: 'World record breaching 1,500+ HP W16 quad-turbo hypercars crafted in Molsheim.',
    origin: 'France',
    badge: '💎',
    logoUrl: 'https://cdn.simpleicons.org/bugatti/000000'
  },
  {
    name: 'McLaren',
    slug: 'mclaren',
    color: '#FF8000',
    tagline: 'Formula 1 Carbon Chassis',
    description: 'Ultra-lightweight Monocell carbon tub construction and active aerodynamic supercars.',
    origin: 'UK',
    badge: '🔥',
    logoUrl: 'https://cdn.simpleicons.org/mclaren/FF8000'
  },
  {
    name: 'Audi',
    slug: 'audi',
    color: '#BB0A30',
    tagline: 'Vorsprung durch Technik & quattro',
    description: 'High-revving 5.2L V10 powerplants and legendary quattro all-wheel drive stability.',
    origin: 'Germany',
    badge: '⭕',
    logoUrl: 'https://cdn.simpleicons.org/audi/BB0A30'
  },
  {
    name: 'Maserati',
    slug: 'maserati',
    color: '#0C2340',
    tagline: 'Trident Italian Elegance',
    description: 'Formula 1 pre-chamber Nettuno twin-turbo engines in sculpted Italian bodies.',
    origin: 'Italy',
    badge: '🔱',
    logoUrl: 'https://cdn.simpleicons.org/maserati/0C2340'
  },
  {
    name: 'Rolls-Royce',
    slug: 'rollsroyce',
    color: '#1F1813',
    tagline: 'Spirit of Ecstasy Sanctuary',
    description: 'Pinnacle of ultra-luxury coachbuilding delivering effortless Magic Carpet Ride tranquility.',
    origin: 'UK',
    badge: '🏛️',
    logoUrl: 'https://cdn.simpleicons.org/rollsroyce/1F1813'
  },
  {
    name: 'Lexus',
    slug: 'lexus',
    color: '#000000',
    tagline: 'Takumi Crafted Engineering',
    description: 'Master Takumi craftsmanship, atmospheric V8 screams, and whisper-quiet reliability.',
    origin: 'Japan',
    badge: '💠',
    logoUrl: 'https://cdn.simpleicons.org/lexus/000000'
  },
  {
    name: 'Nissan',
    slug: 'nissan',
    color: '#C3002F',
    tagline: 'GT-R Twin-Turbo All-Wheel Drive',
    description: 'Hand-assembled Takumi twin-turbo V6 engines with advanced ATTESA E-TS AWD.',
    origin: 'Japan',
    badge: '⚡',
    logoUrl: 'https://cdn.simpleicons.org/nissan/C3002F'
  }
];

function BrandLogoImage({ brand }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return <span className="text-2xl">{brand.badge}</span>;
  }

  return (
    <img
      src={brand.logoUrl}
      alt={`${brand.name} logo`}
      onError={() => setImgError(true)}
      className="w-7 h-7 object-contain transition-transform group-hover:scale-115 filter drop-shadow-sm"
    />
  );
}

export const PartnerBrandsMarquee = () => {
  // Continuous infinite marquee list
  const marqueeList = [...PARTNER_BRANDS, ...PARTNER_BRANDS];

  return (
    <section id="brand-showcase" className="py-12 bg-gradient-to-b from-white via-[#F8F4EC] to-white border-t border-b border-[#E5DCCF] relative overflow-hidden print:hidden">
      
      {/* Ambient Lighting Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[220px] bg-[#8B5A2B]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2EBE1] text-[#8B5A2B] border border-[#E5DCCF] text-[11px] font-mono font-bold mb-3 shadow-xs">
          <Award className="w-3.5 h-3.5 text-[#8B5A2B]" />
          <span>OFFICIAL AUTOMOTIVE BRAND SHOWCASE</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black font-display text-[#1F1813] tracking-tight">
          Curated Luxury Manufacturer Brands
        </h3>
        <p className="text-xs sm:text-sm text-[#6B5E52] max-w-xl mx-auto mt-1.5 font-medium">
          Direct factory allocations, certified warranty support, and officialMonroney specifications for top world manufacturers.
        </p>
      </div>

      {/* Auto-Scrolling Infinite Marquee Ticker */}
      <div className="w-full overflow-hidden relative z-10 py-3">
        
        {/* Soft Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        <div className="flex animate-marquee gap-5 items-center">
          {marqueeList.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="flex-shrink-0 w-[270px] p-4 rounded-2xl bg-white border border-[#E5DCCF] shadow-[0_6px_16px_rgba(31,24,19,0.06)] hover:shadow-[0_12px_28px_rgba(139,90,43,0.2)] hover:border-[#8B5A2B] hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between h-[150px]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F8F4EC] border border-[#E5DCCF] flex items-center justify-center p-1.5 shrink-0 group-hover:bg-[#F2EBE1] transition-colors">
                      <BrandLogoImage brand={brand} />
                    </div>
                    <div>
                      <span className="text-sm font-black font-display text-[#1F1813] tracking-tight group-hover:text-[#8B5A2B] transition-colors block leading-snug">
                        {brand.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#6B5E52] font-semibold">
                        {brand.origin}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Verified
                  </span>
                </div>

                <div className="text-[11px] text-[#6B5E52] font-medium leading-tight line-clamp-2 mt-1">
                  {brand.description}
                </div>
              </div>

              <div className="pt-2 border-t border-[#F2EBE1] flex items-center justify-between text-[10px] text-[#8B5A2B] font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {brand.tagline}
                </span>
                <span className="group-hover:translate-x-1 transition-transform text-[#8B5A2B]">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default PartnerBrandsMarquee;
