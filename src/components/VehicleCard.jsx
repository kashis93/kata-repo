import React, { useState } from 'react';
import { Heart, ArrowLeftRight, ShoppingBag, Zap, Gauge, Check, AlertCircle, Eye, ShieldCheck, Calendar, ChevronDown, ChevronUp, Fuel, Settings, Sparkles, Cpu } from 'lucide-react';
import { getVehicleImage } from '../services/carImageService.js';
import { formatINR, formatINRLakhCrore } from '../utils/formatters.js';

export const VehicleCard = ({
  vehicle,
  onPurchase,
  onInspect3D,
  onOpenDetails,
  onScheduleTestDrive,
  isSaved = false,
  onToggleSave,
  isCompared = false,
  onToggleCompare,
  user = null
}) => {

  const [isHovered, setIsHovered] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  const imageUrl = getVehicleImage(
    vehicle.make,
    vehicle.model,
    vehicle.imageUrl,
    '01'
  );

  const isOutOfStock = vehicle.quantity === 0;
  const formattedPrice = formatINRLakhCrore(vehicle.price);
  const monthlyFinance = `${formatINRLakhCrore(Math.round((vehicle.price || 10000000) / 60))}/mo`;
  const formattedMileage = vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : 'Factory Delivery';

  return (
    <div
      className="group relative bg-white rounded-3xl border border-[#E5DCCF] hover:border-[#8B5A2B]/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-vehicle-id={vehicle.id}
    >
      {/* Media Image Header */}
      <div
        className="relative aspect-[16/10] overflow-hidden bg-[#120D12] cursor-pointer"
        onClick={() => onOpenDetails ? onOpenDetails(vehicle) : onInspect3D?.(vehicle)}
      >
        <img
          src={imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1 shadow-sm border ${
            isOutOfStock
              ? 'bg-red-950/90 text-red-200 border-red-500/40'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
          }`}>
            {isOutOfStock ? <AlertCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
            <span>{isOutOfStock ? 'RESERVED' : 'IN STOCK'}</span>
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Bookmarks heart icon only visible when logged in */}
            {user && onToggleSave && (
              <button
                type="button"
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-[#8B5A2B] border-[#8B5A2B] text-white shadow-md scale-105'
                    : 'bg-black/60 border-white/20 text-white hover:bg-black/90 hover:border-[#8B5A2B]'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(vehicle.id);
                }}
                title={isSaved ? 'Remove Bookmark' : 'Save Bookmark'}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white text-white' : ''}`} />
              </button>
            )}

            {onToggleCompare && (
              <button
                type="button"
                className={`px-2.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md border transition-all cursor-pointer shadow-xs ${
                  isCompared
                    ? 'bg-amber-500 border-amber-300 text-black shadow-md font-extrabold'
                    : 'bg-black/60 border-white/20 text-white hover:bg-black/90 hover:border-amber-400'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(vehicle.id);
                }}
                title={isCompared ? 'Remove from comparison' : 'Add vehicle to side-by-side comparison (up to 3)'}
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>{isCompared ? 'Compared' : 'Compare'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 3D Inspect Trigger */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
            {vehicle.year} MODEL
          </span>
        </div>
      </div>

      {/* Vehicle Info & Specs Body */}
      <div className="p-5 space-y-3">
        {/* Make & Certified Tag */}
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#8B5A2B] tracking-wider uppercase">
          <span>{vehicle.make}</span>
          <span className="flex items-center gap-1 text-[#6B5E52] text-[10px] uppercase">
            <ShieldCheck className="w-3 h-3 text-[#8B5A2B]" />
            Certified
          </span>
        </div>

        {/* Model Title */}
        <h3
          className="text-lg font-bold font-display text-[#1F1813] tracking-tight group-hover:text-[#8B5A2B] transition-colors cursor-pointer line-clamp-1"
          onClick={() => onOpenDetails ? onOpenDetails(vehicle) : onInspect3D?.(vehicle)}
        >
          {vehicle.model}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline justify-between pt-1 border-t border-[#F2EBE1]">
          <div>
            <span className="text-[10px] font-sans font-bold text-[#6B5E52] uppercase block">Price</span>
            <span className="text-xl font-bold font-display text-[#1F1813]">
              {formattedPrice}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-sans text-[#6B5E52] block">Est. Finance</span>
            <span className="text-xs font-mono font-bold text-[#8B5A2B]">{monthlyFinance}</span>
          </div>
        </div>

        {/* Clean 3-Metric Specs Strip */}
        <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-[#1F1813] bg-[#F8F4EC] p-2.5 rounded-2xl border border-[#E5DCCF]">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[9px] text-[#6B5E52] font-bold uppercase">Power</span>
            <div className="flex items-center gap-0.5 font-bold mt-0.5">
              <Zap className="w-3 h-3 text-[#8B5A2B]" />
              <span>{vehicle.horsepower || 500} HP</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center border-x border-[#E5DCCF]">
            <span className="text-[9px] text-[#6B5E52] font-bold uppercase">Mileage</span>
            <span className="font-bold mt-0.5 text-xs">{formattedMileage}</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[9px] text-[#6B5E52] font-bold uppercase">Type</span>
            <span className="font-bold mt-0.5 text-xs truncate max-w-full">{vehicle.bodyType || 'Coupe'}</span>
          </div>
        </div>

        {/* Expandable Specifications Section Trigger */}
        <button
          type="button"
          onClick={() => setShowSpecs(!showSpecs)}
          className="w-full py-2 px-3 rounded-xl bg-[#F2EBE1] hover:bg-[#E5DCCF] border border-[#E5DCCF] text-[#8B5A2B] text-[11px] font-mono font-bold flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-[#8B5A2B]" />
            <span>{showSpecs ? 'Hide Technical Specifications' : 'View Specifications'}</span>
          </span>
          {showSpecs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Expandable Technical Specifications Drawer */}
        {showSpecs && (
          <div className="p-3.5 bg-[#F8F4EC] rounded-2xl border border-[#8B5A2B]/40 space-y-2.5 text-xs animate-fadeIn">
            <div className="flex items-center justify-between text-[11px] font-bold font-mono text-[#8B5A2B] border-b border-[#E5DCCF] pb-1.5">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B]" />
                TECHNICAL SPECIFICATIONS
              </span>
              <span className="text-[10px] text-[#6B5E52] font-normal">{vehicle.year} Model</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white rounded-xl border border-[#E5DCCF]">
                <span className="text-[10px] font-mono text-[#6B5E52] block font-bold">Engine & Fuel</span>
                <span className="font-bold text-[#1F1813] flex items-center gap-1 mt-0.5">
                  <Fuel className="w-3 h-3 text-[#8B5A2B] shrink-0" />
                  <span className="truncate">{vehicle.fuelType ? `${vehicle.fuelType}` : 'V8 Biturbo'}</span>
                </span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-[#E5DCCF]">
                <span className="text-[10px] font-mono text-[#6B5E52] block font-bold">Transmission</span>
                <span className="font-bold text-[#1F1813] flex items-center gap-1 mt-0.5">
                  <Cpu className="w-3 h-3 text-[#8B5A2B] shrink-0" />
                  <span className="truncate">{vehicle.transmission || (vehicle.fuelType === 'Electric' ? 'Direct Drive' : '8-Speed Dual-Clutch')}</span>
                </span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-[#E5DCCF]">
                <span className="text-[10px] font-mono text-[#6B5E52] block font-bold">Fuel Efficiency</span>
                <span className="font-bold text-[#1F1813] mt-0.5 block">{formattedMileage}</span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-[#E5DCCF]">
                <span className="text-[10px] font-mono text-[#6B5E52] block font-bold">Top Speed</span>
                <span className="font-bold text-[#1F1813] mt-0.5 block">{vehicle.topSpeed || '315 km/h'}</span>
              </div>
            </div>

            <div className="pt-1 text-[10px] font-mono text-[#6B5E52] flex items-center justify-between border-t border-[#E5DCCF]">
              <span>VIN Allocation:</span>
              <span className="font-bold text-[#1F1813]">{vehicle.vin || `CX-${vehicle.id || 99}824X`}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="p-5 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {onOpenDetails && (
            <button
              type="button"
              onClick={() => onOpenDetails(vehicle)}
              className="py-2.5 rounded-xl bg-[#F8F4EC] hover:bg-[#F2EBE1] border border-[#E5DCCF] text-[#1F1813] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] active:translate-y-0.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#8B5A2B]" />
              <span>Details</span>
            </button>
          )}

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => onPurchase(vehicle)}
            className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_4px_12px_rgba(139,90,43,0.25)] hover:shadow-[0_6px_16px_rgba(139,90,43,0.35)] active:translate-y-0.5 ${
              onOpenDetails ? 'col-span-1' : 'col-span-2'
            } ${
              isOutOfStock
                ? 'bg-[#E5DCCF] text-[#6B5E52] cursor-not-allowed shadow-none'
                : 'bg-[#8B5A2B] hover:bg-[#6E4520] text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Reserved' : 'Reserve'}</span>
          </button>
        </div>

        {/* Schedule Test Drive Button with 3D Shadow Effect */}
        {onScheduleTestDrive && (
          <button
            type="button"
            onClick={() => onScheduleTestDrive(vehicle)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1F1813] via-[#2D231C] to-[#1F1813] hover:from-[#8B5A2B] hover:to-[#6E4520] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_12px_rgba(31,24,19,0.2)] hover:shadow-[0_6px_18px_rgba(139,90,43,0.35)] active:translate-y-0.5 border border-[#3D3128]"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Schedule Test Drive</span>
          </button>
        )}
      </div>


    </div>
  );
};

export default VehicleCard;
