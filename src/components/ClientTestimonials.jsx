import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Vikramaditya Singhania',
    location: 'Mumbai, Maharashtra',
    role: 'Managing Director, Zenith Capital',
    vehicle: '2024 Lamborghini Revuelto',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    date: 'Verified Buyer • July 2026',
    title: 'Exemplary Concierge & Flawless White-Glove Delivery',
    quote: 'Acquiring my Revuelto through CariusX was an effortless, high-precision experience. From the 3D interactive inspection to white-glove enclosed transporter delivery directly to my estate in Malabar Hill, every step reflected world-class luxury.'
  },
  {
    id: 2,
    name: 'Ananya Deshmukh',
    location: 'Bengaluru, Karnataka',
    role: 'Founder & CEO, TechMatrix Global',
    vehicle: '2023 Porsche 911 GT3 RS',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    date: 'Verified Buyer • June 2026',
    title: 'Unmatched Mechanical Inspection & Transparency',
    quote: 'Finding a pristine allocation for the GT3 RS Weissach Package seemed impossible until I connected with CariusX. The complete 150-point inspection dossier and instant finance pre-approval made this my smoothest supercar purchase to date.'
  },
  {
    id: 3,
    name: 'Karanvir Mehta',
    location: 'New Delhi, NCR',
    role: 'Real Estate Developer & Collector',
    vehicle: '2024 Ferrari SF90 Stradale',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    date: 'Verified Buyer • May 2026',
    title: 'The Gold Standard of Supercar Marketplaces',
    quote: 'The VIP Concierge team arranged a private 3D preview and handled all registration paperwork seamlessly. CariusX sets a benchmark for integrity, speed, and discretion in high-value automotive acquisitions.'
  },
  {
    id: 4,
    name: 'Rohan & Sunita Kapoor',
    location: 'Hyderabad, Telangana',
    role: 'Private Equity Partners',
    vehicle: '2023 Rolls-Royce Spectre',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    date: 'Verified Buyer • April 2026',
    title: 'Bespoke Electrified Luxury Transferred Effortlessly',
    quote: 'Reserving our Spectre online was surprisingly simple yet undeniably premium. The CariusX team kept us updated throughout transport and conducted a personal handover session detailing every custom feature.'
  }
];

export const ClientTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="mt-16 py-12 px-6 bg-gradient-to-b from-[#F8F4EC] via-white to-[#F8F4EC] border border-[#E5DCCF] rounded-3xl shadow-[0_10px_30px_rgba(31,24,19,0.04)] relative overflow-hidden">
      {/* Decorative Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5A2B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1F1813]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B5A2B]/10 border border-[#8B5A2B]/30 text-[#8B5A2B] text-xs font-mono font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified Client Experiences</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#1F1813] tracking-tight">
          What Our Discerning Collectors Say
        </h2>
        <p className="text-xs sm:text-sm text-[#6B5E52] leading-relaxed">
          Authentic feedback from luxury supercar buyers, executive collectors, and automotive connoisseurs who trust CariusX.
        </p>
      </div>

      {/* Slider Main Box */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white border border-[#E5DCCF] rounded-3xl p-6 sm:p-10 shadow-[0_12px_36px_rgba(31,24,19,0.08)] relative">
          <Quote className="w-12 h-12 text-[#8B5A2B]/15 absolute top-6 right-6 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Avatar & Buyer Details */}
            <div className="md:col-span-4 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-[#E5DCCF] pb-6 md:pb-0 md:pr-8">
              <div className="relative mb-4">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#8B5A2B] shadow-lg"
                />
                <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#8B5A2B] text-white shadow-md" title="Verified Buyer">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>

              <h3 className="text-base font-bold font-display text-[#1F1813]">{current.name}</h3>
              <p className="text-xs font-medium text-[#8B5A2B] mt-0.5">{current.role}</p>
              <p className="text-[11px] text-[#6B5E52] font-mono mt-0.5">{current.location}</p>

              <div className="mt-4 px-3 py-1.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-center">
                <span className="text-[10px] font-mono text-[#6B5E52] block uppercase font-bold">Acquired Model</span>
                <span className="text-xs font-bold text-[#1F1813] font-display">{current.vehicle}</span>
              </div>
            </div>

            {/* Right: Review Quote Content */}
            <div className="md:col-span-8 space-y-4">
              
              {/* Star Rating & Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-mono font-bold text-[#1F1813] ml-1.5">5.0 / 5.0</span>
                </div>

                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {current.date}
                </span>
              </div>

              <h4 className="text-lg font-bold font-display text-[#1F1813] leading-snug">
                "{current.title}"
              </h4>

              <p className="text-xs sm:text-sm text-[#6B5E52] leading-relaxed italic">
                "{current.quote}"
              </p>

              {/* Trust Tag */}
              <div className="pt-3 border-t border-[#F2EBE1] flex items-center gap-2 text-xs font-mono text-[#8B5A2B] font-bold">
                <Award className="w-4 h-4" />
                <span>Certified CariusX Dealership Purchase</span>
              </div>

            </div>

          </div>
        </div>

        {/* Controls Bar: Previous, Dots, Next */}
        <div className="flex items-center justify-between mt-6 px-2">
          
          <button
            type="button"
            onClick={handlePrev}
            className="p-3 rounded-2xl bg-white border border-[#E5DCCF] hover:border-[#8B5A2B] text-[#1F1813] hover:text-[#8B5A2B] shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1 text-xs font-bold"
            title="Previous Review"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`transition-all cursor-pointer rounded-full ${
                  idx === currentIndex
                    ? 'w-7 h-2.5 bg-[#8B5A2B]'
                    : 'w-2.5 h-2.5 bg-[#E5DCCF] hover:bg-[#8B5A2B]/50'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-3 rounded-2xl bg-white border border-[#E5DCCF] hover:border-[#8B5A2B] text-[#1F1813] hover:text-[#8B5A2B] shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1 text-xs font-bold"
            title="Next Review"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </section>
  );
};

export default ClientTestimonials;
