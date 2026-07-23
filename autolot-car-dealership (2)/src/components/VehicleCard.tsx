import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { Car, Fuel, Gauge, Zap, ShoppingBag, Eye, CheckCircle2, AlertCircle, Heart, ArrowLeftRight, Printer } from 'lucide-react';
import { getVehicleImage } from '../services/carImageService';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (vehicle: Vehicle) => void;
  onInspect3D: (vehicle: Vehicle) => void;
  onOpenDetails: (vehicle: Vehicle) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (id: string) => void;
  onOpenPrintSticker?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onPurchase,
  onInspect3D,
  onOpenDetails,
  isSaved = false,
  onToggleSave,
  isCompared = false,
  onToggleCompare,
  onOpenPrintSticker
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const displayImageUrl = getVehicleImage(vehicle.make, vehicle.model, vehicle.imageUrl);
  const isOutOfStock = vehicle.quantity === 0;

  return (
    <div className="group relative bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col print:hidden backdrop-blur-sm">
      
      {/* 1. Perforated Window Sticker Top Bar / Edge */}
      <div className="relative bg-slate-950 px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] font-mono-sticker tracking-widest text-slate-400 uppercase font-bold">
            MONRONEY STICKER
          </span>
        </div>
        
        {/* Top Bar Quick Action Controls */}
        <div className="flex items-center gap-2">
          {onOpenPrintSticker && (
            <button
              onClick={() => onOpenPrintSticker(vehicle)}
              className="text-slate-400 hover:text-amber-400 transition-colors p-1 rounded-md hover:bg-slate-900"
              title="Print Monroney Window Sticker"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] font-mono-sticker text-slate-500 truncate max-w-[120px]" title={vehicle.vin}>
            VIN: {vehicle.vin}
          </span>
        </div>
      </div>

      {/* Decorative Perforated Notch Divider Pattern */}
      <div className="h-1.5 w-full bg-slate-950 flex justify-between px-1 gap-1 overflow-hidden opacity-50">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="h-full w-2 bg-slate-800/80 rounded-t-sm" />
        ))}
      </div>

      {/* 2. Top Image Container (16:9 Aspect Ratio with object-cover and robust fallback) */}
      <div 
        onClick={() => onOpenDetails(vehicle)}
        className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer group-hover:brightness-105 transition-all"
      >
        {!imageError && displayImageUrl ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-950 animate-pulse flex flex-col items-center justify-center text-slate-700 p-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-1 text-amber-500/50">
                  <Car className="w-5 h-5 animate-bounce" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase font-semibold">Loading High-Res Image...</span>
              </div>
            )}
            <img
              src={displayImageUrl}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          /* Robust Fallback */
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 flex flex-col items-center justify-center p-4 text-center text-slate-500 border-b border-slate-800/60">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-2 text-amber-400/80 shadow-inner">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-slate-400 font-medium">AutoLot Visual Archive</span>
            <span className="text-[10px] text-slate-600 mt-0.5">{vehicle.make} {vehicle.model}</span>
          </div>
        )}

        {/* Floating Bookmark / Compare Action Badges (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          
          {/* Bookmark / Saved Favorites Heart Button */}
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(vehicle.id);
              }}
              className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer border shadow-lg ${
                isSaved
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-950/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border-slate-800/80'
              }`}
              title={isSaved ? 'Remove from Favorites' : 'Save to Favorites'}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          )}

          {/* Compare Toggle Button */}
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(vehicle.id);
              }}
              className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer border shadow-lg ${
                isCompared
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-950/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border-slate-800/80'
              }`}
              title={isCompared ? 'Remove from Comparison' : 'Add to Compare'}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md border shadow-md flex items-center gap-1 ${
              isOutOfStock
                ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
            }`}
          >
            {isOutOfStock ? (
              <>
                <AlertCircle className="w-3 h-3 text-rose-400" /> SOLD OUT
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {vehicle.quantity} IN STOCK
              </>
            )}
          </span>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-slate-300 border border-slate-700/80 backdrop-blur-md uppercase tracking-wider">
            {vehicle.bodyType}
          </span>
        </div>

        {/* 3D Stage Quick Inspect Overlay Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInspect3D(vehicle);
          }}
          className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-950/90 hover:bg-amber-500 text-slate-200 hover:text-slate-950 border border-slate-700/80 hover:border-amber-400 rounded-xl text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg group/btn cursor-pointer font-display"
        >
          <Eye className="w-3.5 h-3.5 text-amber-400 group-hover/btn:text-slate-950" />
          <span>3D Stage</span>
        </button>
      </div>

      {/* 3. Sticker Body / Specs Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Make & Year */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[11px]">{vehicle.make}</span>
            <span className="font-semibold text-slate-400">{vehicle.year} MODEL</span>
          </div>

          {/* Model Name */}
          <h3 
            onClick={() => onOpenDetails(vehicle)}
            className="text-xl font-extrabold text-white font-display tracking-tight hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
          >
            {vehicle.model}
          </h3>

          {/* Pricing Box */}
          <div className="mt-3.5 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 flex items-baseline justify-between shadow-inner">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-mono font-bold tracking-wider">Total MSRP</span>
              <span className="text-2xl font-black text-amber-400 font-display tracking-tight">
                ${vehicle.price.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block font-mono font-bold tracking-wider">Est. Finance</span>
              <span className="text-xs text-slate-300 font-bold">
                ${Math.round(vehicle.price / 60).toLocaleString()}/mo*
              </span>
            </div>
          </div>

          {/* Grid Spec Icons */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 text-xs text-slate-300 font-medium">
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/60 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{vehicle.horsepower} HP</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/60 flex items-center gap-2">
              <Fuel className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/60 flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{vehicle.mileage.toLocaleString()} mi</span>
            </div>
          </div>

          {/* Feature Badges (First 2) */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {vehicle.features.slice(0, 2).map((feat, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2.5 py-0.5 rounded-lg bg-slate-800/70 text-slate-300 border border-slate-700/50 truncate max-w-[130px] font-medium"
                >
                  {feat}
                </span>
              ))}
              {vehicle.features.length > 2 && (
                <span className="text-[10px] px-2 py-0.5 text-slate-500 font-mono">
                  +{vehicle.features.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: Window Sticker Print & Purchase / Reserve */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
          {onOpenPrintSticker && (
            <button
              onClick={() => onOpenPrintSticker(vehicle)}
              className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer shadow-sm"
              title="Print Monroney Window Sticker"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}

          <button
            disabled={isOutOfStock}
            onClick={() => onPurchase(vehicle)}
            className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-75'
                : 'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 active:scale-[0.98]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-display tracking-wide">{isOutOfStock ? 'RESERVED / SOLD OUT' : 'PURCHASE / RESERVE'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
