import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare } from 'lucide-react';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="py-8 space-y-10 font-sans animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-[#F6F0E6] border border-[#E5DCCF] text-xs font-bold font-mono text-[#8B5A2B] uppercase tracking-wider">
          GET IN TOUCH
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#1F1813]">
          Contact Concierge & Showroom
        </h1>
        <p className="text-xs text-[#6B5E52] leading-relaxed">
          Schedule a private gallery appointment, inquire about a specific vehicle allocation, or request custom acquisition services.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E5DCCF] rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold font-display text-[#1F1813]">Gallery Headquarters</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#F8F4EC] text-[#8B5A2B] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#1F1813]">Flagship Gallery</div>
                  <div className="text-[#6B5E52]">100 Grand Boulevard, Financial District, NY 10005</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#F8F4EC] text-[#8B5A2B] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#1F1813]">Direct VIP Line</div>
                  <div className="text-[#6B5E52]">+1 (800) 555-AUTOLOT</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#F8F4EC] text-[#8B5A2B] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#1F1813]">Concierge Email</div>
                  <div className="text-[#6B5E52]">concierge@autolotgallery.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#F8F4EC] text-[#8B5A2B] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#1F1813]">Showroom Hours</div>
                  <div className="text-[#6B5E52]">Mon - Sat: 9:00 AM - 7:00 PM EST (By Appointment)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-[#E5DCCF] rounded-3xl p-8 shadow-md">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EAF2ED] border border-[#3F7A5B] text-[#3F7A5B] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-display text-[#1F1813]">Inquiry Received</h3>
              <p className="text-xs text-[#6B5E52] max-w-md mx-auto">
                Thank you, <strong>{name}</strong>. Our senior concierge advisor will respond to <strong>{email}</strong> within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-[#8B5A2B] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#6E4520]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold font-display text-[#1F1813]">Send Private Inquiry</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lord Sterling"
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sterling@luxury.com"
                    className="w-full px-3.5 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2831"
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#6B5E52] block mb-1">Message / Allocation Details *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Inquiring about Porsche 911 GT3 RS allocation or private test drive scheduling..."
                  className="w-full px-3.5 py-2.5 bg-[#F8F4EC] border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
