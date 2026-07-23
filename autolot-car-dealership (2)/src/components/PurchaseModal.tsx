import React, { useState } from 'react';
import { Vehicle, PurchaseOrder } from '../types/vehicle';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, ShoppingBag, ShieldCheck, CreditCard, Car, Sparkles, Building2, Wallet } from 'lucide-react';

interface PurchaseModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Financing' | 'Cash / Wire Transfer' | 'Crypto'>('Financing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PurchaseOrder | null>(null);
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const res = api.purchaseVehicle(vehicle.id, {
        name: buyerName,
        email: buyerEmail,
        phone: buyerPhone || '(555) 019-2834',
        paymentMethod
      });

      setIsSubmitting(false);

      if (res.success && res.order) {
        setConfirmedOrder(res.order);
        
        // Launch celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        onSuccess();
      }
    }, 600);
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    setBuyerName('');
    setBuyerEmail('');
    setBuyerPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                {confirmedOrder ? 'Reservation Confirmed!' : 'Vehicle Purchase Reservation'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">AutoLot Direct Inventory Dealership</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {confirmedOrder ? (
          /* Confirmation Receipt View */
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white font-display">Receipt #{confirmedOrder.id}</h3>
              <p className="text-xs text-emerald-400 font-mono mt-1 font-semibold">
                Vehicle allocation confirmed in lot storage.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Reserved Vehicle</span>
                <span className="font-bold text-white">{confirmedOrder.vehicleName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">VIN Number</span>
                <span className="font-mono text-amber-400">{confirmedOrder.vin}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Buyer Name</span>
                <span className="font-medium text-slate-200">{confirmedOrder.buyerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Payment Option</span>
                <span className="font-medium text-slate-200">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400 font-bold">Total Lock Price</span>
                <span className="font-extrabold text-amber-400 font-display text-base">
                  ${confirmedOrder.vehiclePrice.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Return To Showroom
            </button>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handlePurchase} className="p-6 space-y-5">
            
            {/* Vehicle Summary Card */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4">
              <div className="w-20 h-14 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
                {!imageError && vehicle.imageUrl ? (
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.model}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Car className="w-6 h-6 text-amber-400" />
                )}
              </div>
              <div>
                <div className="text-xs text-amber-400 font-mono font-bold">{vehicle.year} {vehicle.make}</div>
                <div className="text-base font-extrabold text-white font-display">{vehicle.model}</div>
                <div className="text-xs font-mono text-slate-400">VIN: {vehicle.vin}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Price MSRP</div>
                <div className="text-lg font-black text-amber-400 font-display">${vehicle.price.toLocaleString()}</div>
              </div>
            </div>

            {/* Buyer Contact Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Alexander Vance"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="alexander@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="(555) 019-2834"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-2">Preferred Financing / Payment</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Financing', label: 'Auto Finance', icon: CreditCard },
                  { id: 'Cash / Wire Transfer', label: 'Wire / Cash', icon: Building2 },
                  { id: 'Crypto', label: 'Crypto Pay', icon: Wallet }
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === opt.id
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lock Reservation Submit */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Units Remaining: <span className="text-emerald-400 font-bold">{vehicle.quantity}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Processing Allocation...' : `Confirm Purchase ($${vehicle.price.toLocaleString()})`}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
