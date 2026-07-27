import React from 'react';
import { ShieldCheck, Wrench, Sparkles, Truck, Clock, Award, PhoneCall } from 'lucide-react';

export const ServicesPage = () => {
  const services = [
    {
      icon: ShieldCheck,
      title: 'Concierge Multi-Point Certification',
      description: 'Every vehicle undergoes a 250+ point rigorous technical inspection by certified master technicians prior to gallery delivery.'
    },
    {
      icon: Wrench,
      title: 'Bespoke Maintenance & Tuning',
      description: 'Custom performance upgrades, specialized supercar maintenance, track preparation, and factory-authorized servicing.'
    },
    {
      icon: Truck,
      title: 'White-Glove Enclosed Transport',
      description: 'Nationwide and international climate-controlled enclosed transport right to your private driveway or climate garage.'
    },
    {
      icon: Sparkles,
      title: 'Paint Protection & Detailing',
      description: 'Self-healing PPF ceramic coatings, paint correction, interior leather restoration, and precision aesthetic preservation.'
    },
    {
      icon: Clock,
      title: '24/7 VIP Dedicated Support',
      description: 'Direct personal concierge line for emergency roadside assistance, maintenance scheduling, and event access.'
    },
    {
      icon: Award,
      title: 'Provenance & Title Assurance',
      description: 'Complete documentation of ownership history, verified mileage certification, and clear title guarantee.'
    }
  ];

  return (
    <div className="py-8 space-y-10 font-sans animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-[#F6F0E6] border border-[#E5DCCF] text-xs font-bold font-mono text-[#8B5A2B] uppercase tracking-wider">
          AUTOLOT GALLERY CONCIERGE
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#1F1813]">
          Elite Automotive Services
        </h1>
        <p className="text-xs text-[#6B5E52] leading-relaxed">
          From acquisition to white-glove transport and master maintenance, our dedicated concierge team ensures an unparalleled ownership experience.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-[#E5DCCF] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F8F4EC] border border-[#E5DCCF] text-[#8B5A2B] flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#1F1813]">{item.title}</h3>
              <p className="text-xs text-[#6B5E52] leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-[#1F1813] text-white rounded-3xl p-8 border border-[#3D3128] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-xl font-bold font-display text-amber-200">Schedule Service Appointment</h2>
          <p className="text-xs text-slate-300 max-w-lg">
            Speak directly with a senior technician or reserve a service slot at our flagship gallery workshop.
          </p>
        </div>
        <a
          href="#/contact"
          className="px-6 py-3 bg-[#8B5A2B] hover:bg-[#6E4520] text-white text-xs font-bold rounded-2xl shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-amber-300" />
          <span>Contact Concierge Service</span>
        </a>
      </div>

    </div>
  );
};
