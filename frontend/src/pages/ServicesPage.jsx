import React, { useState } from 'react';
import { 
  Wrench, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Gauge, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Car, 
  PhoneCall, 
  ArrowRight,
  Award,
  ChevronRight
} from 'lucide-react';

export const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState('VIP Maintenance');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    makeModel: '',
    serviceType: 'VIP Maintenance & Inspection',
    date: '',
    timeSlot: 'Morning (9:00 AM - 12:00 PM)',
    valetPickup: false,
    notes: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const servicesList = [
    {
      id: 'maintenance',
      title: 'VIP Maintenance & Diagnostics',
      icon: Wrench,
      tag: 'Certified Technicians',
      description: 'Factory-certified master technicians using OEM diagnostic software for Porsche, Ferrari, Aston Martin, BMW M, and Audi RS.',
      features: ['150-Point Factory Diagnostic', 'Liqui Moly & Castrol Synthetic Fluids', 'Original OEM Parts Guarantee', 'Digital Service History Record']
    },
    {
      id: 'transport',
      title: 'White-Glove Enclosed Transport',
      icon: Truck,
      tag: 'Worldwide Logistics',
      description: 'Climate-controlled, fully enclosed hydraulic transports with air-ride suspension. Dedicated single-vehicle transit.',
      features: ['GPS Real-Time Tracking', 'Fully Insured up to €5M', 'Discreet Non-Branded Carriers', 'Door-to-Door Delivery']
    },
    {
      id: 'detailing',
      title: 'PPF & Ceramic Paint Protection',
      icon: Sparkles,
      tag: 'XPEL Certified Studio',
      description: 'Self-healing XPEL Ultimate Plus paint protection film, multi-stage paint correction, and 9H Ceramic Pro nano-coating.',
      features: ['Full Body Cut-to-Fit XPEL PPF', 'Multi-stage Paint Correction', '10-Year Ceramic Coating Warranty', 'Interior Leather Preservative']
    },
    {
      id: 'tuning',
      title: 'Performance & Track Setup',
      icon: Gauge,
      tag: 'Bespoke Engineering',
      description: 'Custom ECU recalibration, Akrapovič & Capristo exhaust installations, track-focused suspension geometry tuning.',
      features: ['AWD Dyno Calibration', 'Exhaust & Header Upgrades', 'Track Telemetry Configuration', 'Brake Upgrade Kits']
    },
    {
      id: 'warranty',
      title: 'Warranty & Insurance Concierge',
      icon: ShieldCheck,
      tag: 'Comprehensive Coverage',
      description: 'Seamless extended warranty coverage with direct zero-deductible claims handling with major European luxury insurers.',
      features: ['Bespoke Coverage Plans', 'Zero Deductible Options', 'Immediate Loaner Vehicle', '24/7 Global Roadside Assist']
    },
    {
      id: 'restoration',
      title: 'Classics & Exotic Preservation',
      icon: Award,
      tag: 'Concours Grade',
      description: 'Period-accurate restoration for air-cooled Porsches, classic Ferraris, and rare hypercars with factory provenance documentation.',
      features: ['Engine & Gearbox Overhaul', 'Matching Numbers Verification', 'Authentic Interior Re-trim', 'Concours Preparation']
    }
  ];

  const packages = [
    {
      name: 'Silver Maintenance',
      price: '€490',
      period: 'per service',
      description: 'Essential seasonal check-up for high-performance daily drivers.',
      features: [
        'Full 75-point vehicle inspection',
        'Synthetic oil & OEM filter change',
        'Brake pad & rotor wear analysis',
        'Tire pressure & tread depth check',
        'Complimentary hand wash & vacuum'
      ],
      popular: false
    },
    {
      name: 'Gold VIP Care',
      price: '€1,250',
      period: 'per service',
      description: 'Comprehensive annual care package including fluids and paint refresh.',
      features: [
        'Full 150-point factory diagnostic',
        'Engine, transmission & brake fluids',
        'Multi-stage exterior paint polish',
        'Cabin air & intake filter renewal',
        'Complimentary enclosed valet pickup',
        'Luxury loaner vehicle provided'
      ],
      popular: true
    },
    {
      name: 'Platinum Atelier',
      price: '€2,850',
      period: 'annual membership',
      description: 'Unlimited concierge service, track prep, and priority workshop access.',
      features: [
        'Priority 24/7 emergency workshop access',
        'Unlimited enclosed transport (up to 300km)',
        'Full XPEL PPF annual inspection & coat',
        'Track day technical prep & post-inspection',
        'Dedicated Master Technician assigned',
        'VIP Storage & battery maintenance'
      ],
      popular: false
    }
  ];

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone) {
      alert('Please fill out all required fields.');
      return;
    }
    setBookingSuccess(true);
  };

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#1F1813] text-[#F8F4EC] p-8 md:p-14 shadow-2xl border border-[#3A2E25]">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#8B5A2B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5A2B]/30 border border-[#8B5A2B]/50 text-[#C9A66B] text-xs font-semibold uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5" />
            <span>Master Atelier Services</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display leading-tight text-white">
            Unrivaled Care for Extraordinary Automobiles
          </h1>
          <p className="text-sm md:text-base text-[#D4C8B8] leading-relaxed">
            From precision diagnostic servicing and XPEL ceramic protection to white-glove enclosed transport, our certified technicians ensure your luxury vehicle performs at its peak.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 items-center text-xs font-medium text-[#C9A66B]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#8B5A2B]" /> Factory Certified Master Guild
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#8B5A2B]" /> OEM Direct Spare Parts
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#8B5A2B]" /> Climate-Controlled Transport
            </span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-[#1F1813]">
              Bespoke Service Offerings
            </h2>
            <p className="text-xs md:text-sm text-[#6B5E52] mt-1">
              Select a specialized service category to explore specs or schedule an atelier appointment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((srv) => {
            const Icon = srv.icon;
            return (
              <div 
                key={srv.id}
                className="bg-white border border-[#E5DCCF] rounded-3xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8F4EC] border border-[#E5DCCF] flex items-center justify-center text-[#8B5A2B] group-hover:bg-[#8B5A2B] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F2EBE1] text-[#8B5A2B] border border-[#E5DCCF]">
                      {srv.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-display text-[#1F1813] group-hover:text-[#8B5A2B] transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-[#6B5E52] mt-2 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-[#F2EBE1]">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-[#1F1813] flex items-center gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-[#8B5A2B] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBookingForm(prev => ({ ...prev, serviceType: srv.title }));
                    const el = document.getElementById('booking-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-6 w-full py-2.5 bg-[#F8F4EC] hover:bg-[#8B5A2B] hover:text-white border border-[#E5DCCF] rounded-xl text-xs font-bold text-[#1F1813] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Service Packages Pricing */}
      <section className="bg-[#F2EBE1] border border-[#E5DCCF] rounded-3xl p-8 md:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B]">Transparent Pricing</span>
          <h2 className="text-2xl md:text-4xl font-bold font-display text-[#1F1813]">
            Service Tiers & Membership
          </h2>
          <p className="text-xs md:text-sm text-[#6B5E52]">
            Choose a tailored maintenance plan suited to your driving habits and vehicle collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <div 
              key={i}
              className={`relative bg-white rounded-3xl p-7 border transition-all flex flex-col justify-between ${
                pkg.popular 
                  ? 'border-[#8B5A2B] shadow-xl ring-2 ring-[#8B5A2B]/20 scale-105 z-10' 
                  : 'border-[#E5DCCF] shadow-sm'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8B5A2B] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  Most Popular Choice
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-[#1F1813]">{pkg.name}</h3>
                  <p className="text-xs text-[#6B5E52] mt-1">{pkg.description}</p>
                </div>

                <div className="py-2 border-y border-[#F2EBE1]">
                  <span className="text-3xl font-extrabold font-display text-[#8B5A2B]">{pkg.price}</span>
                  <span className="text-xs text-[#6B5E52] ml-1.5">/ {pkg.period}</span>
                </div>

                <ul className="space-y-2.5">
                  {pkg.features.map((f, idx) => (
                    <li key={idx} className="text-xs text-[#1F1813] flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8B5A2B] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBookingForm(prev => ({ ...prev, serviceType: `${pkg.name} Package` }));
                  const el = document.getElementById('booking-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`mt-6 w-full py-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  pkg.popular
                    ? 'bg-[#8B5A2B] hover:bg-[#6E4520] text-white shadow-md'
                    : 'bg-[#F8F4EC] hover:bg-[#E5DCCF] text-[#1F1813]'
                }`}
              >
                Select Package
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Service Appointment Booking Form */}
      <section id="booking-section" className="bg-white border border-[#E5DCCF] rounded-3xl p-8 md:p-12 shadow-xl space-y-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2EBE1] text-[#8B5A2B] text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Online Appointment Booking</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-[#1F1813]">
            Schedule Your Atelier Appointment
          </h2>
          <p className="text-xs md:text-sm text-[#6B5E52] mt-1">
            Fill out your details below and our service manager will confirm your reservation within 1 business hour.
          </p>
        </div>

        {bookingSuccess ? (
          <div className="bg-[#EBF5EF] border border-[#3F7A5B] rounded-2xl p-8 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#3F7A5B] text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-display text-[#1F1813]">
              Service Appointment Confirmed!
            </h3>
            <p className="text-xs text-[#6B5E52] max-w-md mx-auto">
              Thank you, <strong className="text-[#1F1813]">{bookingForm.name}</strong>. We have reserved your appointment for <strong className="text-[#8B5A2B]">{bookingForm.serviceType}</strong> on <strong className="text-[#1F1813]">{bookingForm.date || 'your preferred date'}</strong>. A service advisor will reach out to <span className="underline">{bookingForm.email}</span> shortly.
            </p>
            <button
              type="button"
              onClick={() => {
                setBookingSuccess(false);
                setBookingForm({
                  name: '',
                  email: '',
                  phone: '',
                  makeModel: '',
                  serviceType: 'VIP Maintenance & Diagnostics',
                  date: '',
                  timeSlot: 'Morning (9:00 AM - 12:00 PM)',
                  valetPickup: false,
                  notes: ''
                });
              }}
              className="px-6 py-2.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
            >
              Book Another Service
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={bookingForm.name}
                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                placeholder="e.g. Alexander Vance"
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={bookingForm.email}
                onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                placeholder="alexander@example.com"
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                placeholder="+44 7911 123456"
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Vehicle Make & Model
              </label>
              <input
                type="text"
                value={bookingForm.makeModel}
                onChange={(e) => setBookingForm({ ...bookingForm, makeModel: e.target.value })}
                placeholder="e.g. 2024 Porsche 911 Carrera S"
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Service Category *
              </label>
              <select
                value={bookingForm.serviceType}
                onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value })}
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              >
                {servicesList.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
                <option value="Silver Maintenance Package">Silver Maintenance Package (€490)</option>
                <option value="Gold VIP Care Package">Gold VIP Care Package (€1,250)</option>
                <option value="Platinum Atelier Package">Platinum Atelier Package (€2,850)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Preferred Date *
              </label>
              <input
                type="date"
                required
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 p-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingForm.valetPickup}
                  onChange={(e) => setBookingForm({ ...bookingForm, valetPickup: e.target.checked })}
                  className="w-4 h-4 text-[#8B5A2B] rounded border-[#E5DCCF] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-[#1F1813] font-medium">
                  Request White-Glove Enclosed Valet Pickup from my home/office location
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                Special Requests or Notes
              </label>
              <textarea
                rows={3}
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                placeholder="Mention any specific concerns, squeaks, custom tuning options, or window sticker requests..."
                className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                Confirm Appointment Request
              </button>
            </div>
          </form>
        )}
      </section>

    </div>
  );
};
