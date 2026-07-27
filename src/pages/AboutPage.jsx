import React from 'react';
import { ShieldCheck, Award, Users, Compass, Globe, Sparkles } from 'lucide-react';

export const AboutPage = () => {
  const stats = [
    { label: 'Curated Supercars', value: '250+' },
    { label: 'Global Deliveries', value: '1,400+' },
    { label: 'Customer Rating', value: '4.98 ★' },
    { label: 'Years of Excellence', value: '15+' }
  ];

  return (
    <div className="py-8 space-y-12 font-sans animate-in fade-in duration-300">
      
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1 rounded-full bg-[#F6F0E6] border border-[#E5DCCF] text-xs font-bold font-mono text-[#8B5A2B] uppercase tracking-wider">
          THE AUTOLOT HERITAGE
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#1F1813]">
          Redefining Luxury Automotive Curation
        </h1>
        <p className="text-xs text-[#6B5E52] leading-relaxed">
          Founded on an unyielding passion for automotive artistry and engineering perfection, AutoLot Gallery brings together the rarest supercars, hypercars, and grand tourers under one roof.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-[#E5DCCF] rounded-3xl p-6 shadow-sm">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#8B5A2B]">{stat.value}</div>
            <div className="text-[11px] font-sans text-[#6B5E52] uppercase tracking-wider font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E5DCCF] rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-[#F8F4EC] text-[#8B5A2B] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-[#1F1813]">Uncompromising Quality</h3>
          <p className="text-xs text-[#6B5E52] leading-relaxed">
            Every vehicle in our catalog undergoes rigorous multi-point verification, provenance validation, and comprehensive cosmetic prep.
          </p>
        </div>

        <div className="bg-white border border-[#E5DCCF] rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-[#F8F4EC] text-[#8B5A2B] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-[#1F1813]">Global Concierge Logistics</h3>
          <p className="text-xs text-[#6B5E52] leading-relaxed">
            We handle worldwide customs, enclosed transport, registration compliance, and home delivery with absolute discretion.
          </p>
        </div>

        <div className="bg-white border border-[#E5DCCF] rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-[#F8F4EC] text-[#8B5A2B] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-[#1F1813]">Private Collector Network</h3>
          <p className="text-xs text-[#6B5E52] leading-relaxed">
            Access off-market allocations, rare build slots, and limited production editions through our exclusive private client network.
          </p>
        </div>
      </div>

    </div>
  );
};
