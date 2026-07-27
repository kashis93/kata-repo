import React, { useState } from 'react';
import { Shield, Sparkles, Send, Phone, Mail, MapPin, Check, Lock } from 'lucide-react';

export const Footer = ({ onTabChange, user }) => {
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribedEmail) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setSubscribedEmail('');
    }, 2000);
  };

  return (
    <footer className="w-full bg-[#0B080C] border-t border-red-950/80 text-slate-300 font-sans pt-12 pb-8 px-6 sm:px-10 lg:px-12 mt-16 print:hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Grid: Brand Info, Links, Hours, Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1 & 2: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange && onTabChange('showroom')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5A2B] via-[#6E4520] to-[#A06C3B] flex items-center justify-center font-display font-black text-white text-lg shadow-lg shadow-[#8B5A2B]/30">
                CX
              </div>
              <div>
                <span className="text-lg font-black font-display text-white uppercase tracking-tight block">
                  CariusX Gallery
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block">
                  Curated Supercars & 3D Virtual Showrooms
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier international destination for certified high-performance supercars, factory Monroney specifications, and interactive 3D virtual perspective showrooms.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 text-red-400">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>100% Certified</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>White-Glove Delivery</span>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-red-950/80 pb-2">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('showroom')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  3D Virtual Showroom
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('services')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Concierge Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('financing')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Bespoke Financing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('about')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  About Our Gallery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('contact')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Client Relations & Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('inventory')}
                  className="text-red-400 hover:text-amber-300 font-bold font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-red-500" />
                  <span>Admin Inventory Access</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Curated Marques */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-red-950/80 pb-2">
              FEATURED MARQUES
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li className="hover:text-white transition-colors cursor-pointer">Ferrari Scuderia</li>
              <li className="hover:text-white transition-colors cursor-pointer">Porsche Motorsport</li>
              <li className="hover:text-white transition-colors cursor-pointer">Lamborghini Squadra</li>
              <li className="hover:text-white transition-colors cursor-pointer">McLaren Automotive</li>
              <li className="hover:text-white transition-colors cursor-pointer">Audi Sport RS</li>
              <li className="hover:text-white transition-colors cursor-pointer">BMW M Performance</li>
            </ul>
          </div>

          {/* Column 5: Concierge Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-red-950/80 pb-2">
              PRIVATE ALLOCATION LIST
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Subscribe to receive instant notifications for rare off-market allocations and limited hypercar inventory.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="vip@domain.com"
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-[#1A1218] border border-red-900/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {isSubscribed && (
                <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Subscribed to Allocation VIP Desk</span>
                </div>
              )}
            </form>

            <div className="pt-2 text-[10px] font-mono text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-amber-400" />
                <span>+1 (800) 555-AUTOLOT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-amber-400" />
                <span>concierge@autolotgallery.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal & Security */}
        <div className="pt-8 border-t border-red-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} AutoLot Gallery International. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Allocation</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Monroney Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
