import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { X, Car, Zap, Fuel, Gauge, ShieldCheck, ShoppingBag, Eye, DollarSign, Calculator, CheckCircle2, Box, Camera, Sparkles, Printer, Heart, ArrowLeftRight } from 'lucide-react';
import { getVehicleImage } from '../services/carImageService';
import { Sketchfab3DViewer } from './Sketchfab3DViewer';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (vehicle: Vehicle) => void;
  onInspect3D: (vehicle: Vehicle) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (id: string) => void;
  onOpenPrintSticker?: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onPurchase,
  onInspect3D,
  isSaved = false,
  onToggleSave,
  isCompared = false,
  onToggleCompare,
  onOpenPrintSticker
}) => {
  const [downPayment, setDownPayment] = useState(20000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [imageError, setImageError] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [mediaMode, setMediaMode] = useState<'photo' | 'sketchfab'>('sketchfab');

  if (!isOpen || !vehicle) return null;

  const displayImageUrl = getVehicleImage(vehicle.make, vehicle.model, vehicle.imageUrl);

  // Finance estimate calculation
  const principal = Math.max(0, vehicle.price - downPayment);
  const monthlyRate = 0.059 / 12; // 5.9% APR
  const estimatedMonthly = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200 print:hidden">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest">
              MONRONEY WINDOW STICKER SPECIFICATIONS
            </span>
            <h2 className="text-xl font-extrabold text-white font-display">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Print Sticker Button */}
            {onOpenPrintSticker && (
              <button
                onClick={() => onOpenPrintSticker(vehicle)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Print Official Window Sticker"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print Sticker</span>
              </button>
            )}

            {/* Favorite Bookmark Button */}
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(vehicle.id)}
                className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                  isSaved
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-slate-800 hover:bg-rose-500/20 text-slate-300 border-slate-700'
                }`}
                title={isSaved ? 'Remove from Saved Favorites' : 'Save to Favorites'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              </button>
            )}

            {/* Compare Toggle Button */}
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(vehicle.id)}
                className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                  isCompared
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 hover:bg-amber-500/20 text-slate-300 border-slate-700'
                }`}
                title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Media Header & View Mode Selector Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                <button
                  onClick={() => setMediaMode('sketchfab')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    mediaMode === 'sketchfab'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" /> 3D Model (Sketchfab)
                </button>
                <button
                  onClick={() => setMediaMode('photo')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    mediaMode === 'photo'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" /> Real Photo (CDN)
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onInspect3D(vehicle);
                }}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 hover:border-amber-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Studio Stage</span>
              </button>
            </div>

            {/* Media Content Display */}
            {mediaMode === 'sketchfab' ? (
              <Sketchfab3DViewer
                make={vehicle.make}
                model={vehicle.model}
                category={vehicle.category}
                onFallbackToProcedural={() => {
                  onClose();
                  onInspect3D(vehicle);
                }}
              />
            ) : (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                {!imageError && displayImageUrl ? (
                  <>
                    {!photoLoaded && (
                      <div className="absolute inset-0 bg-slate-950 animate-pulse flex flex-col items-center justify-center text-slate-600">
                        <Car className="w-10 h-10 text-amber-500/50 animate-bounce mb-2" />
                        <span className="text-xs font-mono text-slate-400">Loading High-Res Vehicle Photo...</span>
                      </div>
                    )}
                    <img
                      src={displayImageUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      onLoad={() => setPhotoLoaded(true)}
                      onError={() => setImageError(true)}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${photoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                    <Car className="w-12 h-12 text-amber-400 mb-2" />
                    <span className="text-sm font-mono text-slate-300 font-bold">{vehicle.make} {vehicle.model}</span>
                    <span className="text-xs text-slate-500">AutoLot Visual Archive Record</span>
                  </div>
                )}

                {/* Floating Stock Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${vehicle.quantity > 0 ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700' : 'bg-rose-950/90 text-rose-300 border border-rose-700'}`}>
                    {vehicle.quantity > 0 ? `${vehicle.quantity} UNITS IN STOCK` : 'RESERVED / OUT OF STOCK'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">MSRP Price</span>
              <span className="text-xl font-black text-amber-400 font-display">${vehicle.price.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Power Output</span>
              <span className="text-base font-extrabold text-white">{vehicle.horsepower} HP</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Transmission</span>
              <span className="text-base font-extrabold text-white">{vehicle.transmission}</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Top Speed</span>
              <span className="text-base font-extrabold text-white">{vehicle.topSpeed}</span>
            </div>
          </div>

          {/* Detailed Features & Options */}
          <div>
            <h3 className="text-xs font-mono uppercase text-slate-400 mb-2 font-bold">Standard & Optional Equipment</h3>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 text-slate-200 text-xs border border-slate-800 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-mono uppercase text-slate-400 mb-1 font-bold">Dealership Notes</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
              {vehicle.description}
            </p>
          </div>

          {/* Financing Calculator Section */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
              <Calculator className="w-4 h-4" /> Estimated Payment Calculator
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Down Payment ($)</label>
                <input
                  type="number"
                  step={5000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Loan Duration</label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200"
                >
                  <option value={36}>36 Months</option>
                  <option value={48}>48 Months</option>
                  <option value={60}>60 Months</option>
                  <option value={72}>72 Months</option>
                </select>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Est. Monthly</span>
                  <span className="text-lg font-black text-emerald-400 font-display">${estimatedMonthly}/mo*</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">@ 5.9% APR</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-400">
              VIN: <span className="text-slate-200 font-bold">{vehicle.vin}</span>
            </div>

            <button
              disabled={vehicle.quantity === 0}
              onClick={() => {
                onClose();
                onPurchase(vehicle);
              }}
              className={`px-6 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg ${
                vehicle.quantity === 0
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{vehicle.quantity === 0 ? 'RESERVED / SOLD OUT' : 'RESERVE THIS VEHICLE'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
