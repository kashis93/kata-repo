import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Car, 
  Globe2, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  ArrowRight,
  Compass,
  FileCheck
} from 'lucide-react';

export const AboutPage = () => {
  const stats = [
    { label: 'Exotic Vehicles Delivered', value: '2,500+' },
    { label: 'Verified Inventory Value', value: '€250M+' },
    { label: 'VIP Client Satisfaction', value: '99.6%' },
    { label: 'Years of Atelier Heritage', value: '14 Years' }
  ];

  const team = [
    {
      name: 'Henrik Von Berg',
      role: 'Founder & Managing Director',
      bio: 'Former Porsche Motorsport strategist with over 20 years of experience curating rare European collector automobiles.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Elena Rostova',
      role: 'Head of VIP Concierge & Acquisition',
      bio: 'Specializing in off-market hypercars, bespoke allocation sourcing, and international diplomatic logistics.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Marcus Thorne',
      role: 'Chief Master Technician & Inspection Director',
      bio: 'Certified factory diagnostic lead for Ferrari, Bugatti, and McLaren with 150-point Monroney sticker certification mastery.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const qualityPillars = [
    {
      title: 'Monroney Certified Authenticity',
      desc: 'Every vehicle in our collection features a factory-verified Monroney window sticker showing original MSRP, optional equipment, and VIN build specs.'
    },
    {
      title: '150-Point Technical Inspection',
      desc: 'Rigorous diagnostic check covering powertrain compression, suspension geometry, electronic control modules, and paint depth analysis.'
    },
    {
      title: 'Provenance & Clean History',
      desc: 'Zero-tolerance policy for accident damage or unverified service logs. Fully documented single-owner or collector heritage.'
    },
    {
      title: 'White-Glove Global Logistics',
      desc: 'Climate-controlled enclosed transport delivered directly to your private estate, airport hangar, or yacht marina worldwide.'
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#1F1813] text-[#F8F4EC] p-8 md:p-14 shadow-2xl border border-[#3A2E25]">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-[#8B5A2B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5A2B]/30 border border-[#8B5A2B]/50 text-[#C9A66B] text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Our Heritage & Philosophy</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display leading-tight text-white">
            Redefining the Luxury Automobile Acquisition Experience
          </h1>
          <p className="text-sm md:text-base text-[#D4C8B8] leading-relaxed">
            AutoLot Gallery was founded on a simple principle: extraordinary cars deserve an extraordinary presentation. We combine transparent factory data with concierge-level service.
          </p>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((st, i) => (
          <div key={i} className="bg-white border border-[#E5DCCF] rounded-3xl p-6 text-center space-y-1 shadow-xs hover:border-[#8B5A2B] transition-colors">
            <div className="text-2xl md:text-4xl font-extrabold font-display text-[#8B5A2B]">{st.value}</div>
            <div className="text-xs font-medium text-[#6B5E52]">{st.label}</div>
          </div>
        ))}
      </section>

      {/* Story & Quality Pillars Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B]">The Atelier Standard</span>
            <h2 className="text-2xl md:text-4xl font-bold font-display text-[#1F1813] mt-1">
              Curated for Discerning Enthusiasts
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[#6B5E52] leading-relaxed">
            At AutoLot Gallery, we reject high-pressure dealership tactics in favor of a private gallery experience. Whether sourcing an air-cooled Porsche 911 Carrera, an Audi RS6 Avant, or a rare supercar, every car is presented with full transparency, Monroney sticker documentation, and 3D digital stage viewing.
          </p>
          <div className="space-y-4 pt-2">
            {qualityPillars.map((p, idx) => (
              <div key={idx} className="flex items-start gap-3.5 bg-white border border-[#E5DCCF] rounded-2xl p-4 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#F8F4EC] border border-[#E5DCCF] flex items-center justify-center text-[#8B5A2B] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F1813] font-display">{p.title}</h4>
                  <p className="text-[11px] text-[#6B5E52] mt-0.5 leading-normal">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Box */}
        <div className="relative bg-[#1F1813] border border-[#3A2E25] rounded-3xl p-8 text-[#F8F4EC] space-y-6 shadow-2xl flex flex-col justify-between min-h-[420px]">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5A2B] text-white flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">
              The Monroney Window Sticker Direct Guarantee
            </h3>
            <p className="text-xs text-[#D4C8B8] leading-relaxed">
              Unlike ordinary pre-owned dealers, every vehicle on our lot includes the original window sticker reproduction detailing MSRP, option codes, powertrain specs, and fuel efficiency metrics.
            </p>
          </div>

          <div className="bg-[#2A211A] border border-[#4A3B30] rounded-2xl p-4 flex items-center gap-3">
            <FileCheck className="w-8 h-8 text-[#C9A66B] shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-white">100% Factory Specification Certified</div>
              <div className="text-[#A69888] text-[10px]">Verified against original manufacturer build sheets</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => (window.location.hash = '#/')}
              className="w-full py-3 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore Gallery Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B]">Leadership & Concierge</span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-[#1F1813]">
            Meet the Executive Team
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <div key={i} className="bg-white border border-[#E5DCCF] rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all group">
              <div className="h-56 bg-[#F8F4EC] overflow-hidden relative">
                <img 
                  src={m.image} 
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold font-display text-[#1F1813]">{m.name}</h3>
                <div className="text-xs font-bold text-[#8B5A2B]">{m.role}</div>
                <p className="text-xs text-[#6B5E52] leading-relaxed pt-1">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
