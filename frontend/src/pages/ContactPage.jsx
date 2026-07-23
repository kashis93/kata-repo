import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Car, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Globe
} from 'lucide-react';

export const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    contactMethod: 'email',
    subject: 'Vehicle Inquiry',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert('Please complete all required fields.');
      return;
    }
    setIsSubmitted(true);
  };

  const locations = [
    {
      city: 'London Mayfair Flagship',
      address: '14 Berkeley Square, Mayfair, London W1J 6EB, United Kingdom',
      phone: '+44 20 7946 0912',
      hours: 'Mon - Sat: 9:00 AM - 7:00 PM | Sun: By Appointment',
      type: 'Flagship Showroom & VIP Lounge'
    },
    {
      city: 'Munich Atelier & Workshop',
      address: 'Maximilianstraße 42, 80539 München, Germany',
      phone: '+49 89 2018 9400',
      hours: 'Mon - Fri: 8:30 AM - 6:30 PM | Sat: 10:00 AM - 4:00 PM',
      type: 'Factory Certified Workshop'
    },
    {
      city: 'Zurich Airport Private Hangar',
      address: 'General Aviation Terminal 3, 8058 Zürich-Flughafen, Switzerland',
      phone: '+41 44 800 2210',
      hours: '24/7 VIP Concierge & Airport Transfer',
      type: 'Enclosed Logistics Hub'
    }
  ];

  const faqs = [
    {
      question: 'Can I schedule a private viewing or test drive at my residence?',
      answer: 'Yes. Our White-Glove Concierge team delivers vehicles directly to your private estate, office, or airport hangar for confidential viewing and test driving.'
    },
    {
      question: 'How long does international white-glove transport take?',
      answer: 'Domestic European enclosed transport typically takes 24 to 48 hours. International air-freight transport to the US, Middle East, or Asia is arranged within 3 to 5 business days.'
    },
    {
      question: 'What is included in the Monroney Sticker Direct package?',
      answer: 'Every vehicle comes with a factory-authenticated window sticker showing full option codes, original MSRP, EPA fuel economy ratings, and a 150-point inspection certificate.'
    },
    {
      question: 'Do you accept high-end vehicle trade-ins?',
      answer: 'We accept trade-ins for luxury, exotic, and collector vehicles. Our valuation team provides a guaranteed cash or trade equity offer within 2 hours.'
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#1F1813] text-[#F8F4EC] p-8 md:p-14 shadow-2xl border border-[#3A2E25]">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#8B5A2B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5A2B]/30 border border-[#8B5A2B]/50 text-[#C9A66B] text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>24/7 VIP Concierge Desk</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display leading-tight text-white">
            Connect with Our AutoLot Specialists
          </h1>
          <p className="text-sm md:text-base text-[#D4C8B8] leading-relaxed">
            Whether you are inquiring about a vehicle in our collection, requesting a bespoke acquisition, or scheduling an atelier service appointment, our team is at your disposal.
          </p>
        </div>
      </section>

      {/* Main Form & Locations Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E5DCCF] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-display text-[#1F1813]">Send an Inquiry</h2>
            <p className="text-xs text-[#6B5E52] mt-1">Our concierge team responds to all communications within 30 minutes.</p>
          </div>

          {isSubmitted ? (
            <div className="bg-[#EBF5EF] border border-[#3F7A5B] rounded-2xl p-8 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#3F7A5B] text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-display text-[#1F1813]">
                Inquiry Received
              </h3>
              <p className="text-xs text-[#6B5E52] max-w-md mx-auto">
                Thank you <strong className="text-[#1F1813]">{form.name}</strong>. Your message regarding <strong className="text-[#8B5A2B]">{form.subject}</strong> has been assigned to a Senior Concierge Officer. We will contact you via {form.contactMethod} shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setForm({
                    name: '',
                    email: '',
                    phone: '',
                    contactMethod: 'email',
                    subject: 'Vehicle Inquiry',
                    message: ''
                  });
                }}
                className="px-6 py-2.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Victoria Sterling"
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
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="victoria@sterling.com"
                    className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+44 20 7946 0912"
                    className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                  >
                    <option value="Vehicle Purchase Inquiry">Vehicle Purchase Inquiry</option>
                    <option value="Trade-In & Valuation">Trade-In & Valuation</option>
                    <option value="Bespoke Sourcing Request">Bespoke Sourcing Request</option>
                    <option value="Atelier Service & PPF">Atelier Service & PPF</option>
                    <option value="Financing & Corporate Lease">Financing & Corporate Lease</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                  Preferred Contact Channel
                </label>
                <div className="flex items-center gap-4 text-xs">
                  {['email', 'phone', 'whatsapp'].map((method) => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer capitalize">
                      <input
                        type="radio"
                        name="contactMethod"
                        value={method}
                        checked={form.contactMethod === method}
                        onChange={(e) => setForm({ ...form, contactMethod: e.target.value })}
                        className="accent-[#8B5A2B]"
                      />
                      <span>{method === 'whatsapp' ? 'WhatsApp VIP' : method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Please describe the vehicle model or service you are interested in..."
                  className="w-full px-4 py-3 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Message to Concierge</span>
              </button>
            </form>
          )}
        </div>

        {/* Showrooms & Locations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1F1813] text-[#F8F4EC] border border-[#3A2E25] rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
            <h3 className="text-xl font-bold font-display text-white">Global Showroom Hubs</h3>
            <p className="text-xs text-[#D4C8B8]">Visit our gallery locations or request private access</p>

            <div className="space-y-4 pt-2">
              {locations.map((loc, i) => (
                <div key={i} className="bg-[#2A211A] border border-[#4A3B30] rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-display">{loc.city}</h4>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#8B5A2B] text-white">
                      {loc.type}
                    </span>
                  </div>
                  <div className="text-xs text-[#D4C8B8] flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A66B] shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="text-xs text-[#D4C8B8] flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#C9A66B] shrink-0" />
                    <span>{loc.phone}</span>
                  </div>
                  <div className="text-[11px] text-[#A69888] flex items-center gap-2 pt-1 border-t border-[#3A2E25]">
                    <Clock className="w-3 h-3 text-[#C9A66B] shrink-0" />
                    <span>{loc.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* FAQ Accordion Section */}
      <section className="bg-white border border-[#E5DCCF] rounded-3xl p-8 md:p-12 shadow-md space-y-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B]">Frequently Asked Questions</span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-[#1F1813] mt-1">
            Client Information Center
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="border border-[#E5DCCF] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left bg-[#F8F4EC] hover:bg-[#F2EBE1] flex items-center justify-between gap-4 font-display font-bold text-sm text-[#1F1813] cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#8B5A2B]" /> : <ChevronDown className="w-4 h-4 text-[#6B5E52]" />}
                </button>

                {isOpen && (
                  <div className="p-5 bg-white text-xs text-[#6B5E52] leading-relaxed border-t border-[#E5DCCF]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
