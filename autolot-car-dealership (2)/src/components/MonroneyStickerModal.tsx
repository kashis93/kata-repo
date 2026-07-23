import React from 'react';
import { Vehicle } from '../types/vehicle';
import { Printer, X, ShieldCheck, Car, Fuel, DollarSign, CheckCircle2 } from 'lucide-react';
import { getVehicleImage } from '../services/carImageService';

interface MonroneyStickerModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MonroneyStickerModal: React.FC<MonroneyStickerModalProps> = ({ vehicle, isOpen, onClose }) => {
  if (!isOpen || !vehicle) return null;

  const handlePrint = () => {
    window.print();
  };

  const baseMsrp = Math.round(vehicle.price * 0.92);
  const optionsPrice = Math.round(vehicle.price * 0.06);
  const destinationCharge = vehicle.price - baseMsrp - optionsPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-6 overflow-y-auto print:p-0 print:static print:bg-white print:text-black">
      
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:w-full print:bg-white print:text-black">
        
        {/* Action Top Bar (Hidden during printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                OFFICIAL MONRONEY WINDOW STICKER GENERATOR
              </span>
              <h2 className="text-lg font-extrabold text-white font-display">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sticker (PDF/Paper)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE MONRONEY STICKER SHEET */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-900 print:bg-white print:text-black print:p-4 print:space-y-4">
          
          <div className="border-4 border-slate-700 print:border-black rounded-2xl p-6 bg-slate-950 print:bg-white text-slate-100 print:text-black space-y-6">
            
            {/* 1. Header Banner */}
            <div className="border-b-2 border-slate-800 print:border-black pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-400 print:text-black uppercase">
                    UNITED STATES MONRONEY LABEL ACT COMPLIANT
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white print:text-black font-display tracking-tight uppercase">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <div className="text-xs font-mono text-slate-400 print:text-slate-700 mt-1">
                  BODY STYLE: <span className="text-white print:text-black font-bold">{vehicle.bodyType}</span> | FUEL TYPE: <span className="text-white print:text-black font-bold">{vehicle.fuelType}</span>
                </div>
              </div>

              {/* Total MSRP Badge Box */}
              <div className="bg-slate-900 print:bg-slate-100 border-2 border-amber-500 print:border-black p-4 rounded-xl text-right">
                <span className="text-[10px] font-mono text-slate-400 print:text-slate-600 uppercase block font-bold">
                  TOTAL MANUFACTURER MSRP
                </span>
                <span className="text-3xl font-black text-amber-400 print:text-black font-display">
                  ${vehicle.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 2. Three Column Specifications Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs border-b-2 border-slate-800 print:border-black pb-6">
              
              {/* Column A: Standard Equipment */}
              <div className="space-y-3">
                <h3 className="font-mono text-amber-400 print:text-black font-bold uppercase border-b border-slate-800 print:border-slate-300 pb-1">
                  STANDARD EQUIPMENT
                </h3>
                <ul className="space-y-1.5 text-slate-300 print:text-slate-800">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 print:text-black shrink-0" />
                    <span>Engine: {vehicle.horsepower} HP High Output</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 print:text-black shrink-0" />
                    <span>Transmission: {vehicle.transmission}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 print:text-black shrink-0" />
                    <span>Top Speed: {vehicle.topSpeed}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 print:text-black shrink-0" />
                    <span>Odometer: {vehicle.mileage.toLocaleString()} miles</span>
                  </li>
                </ul>
              </div>

              {/* Column B: Factory Features & Options */}
              <div className="space-y-3">
                <h3 className="font-mono text-amber-400 print:text-black font-bold uppercase border-b border-slate-800 print:border-slate-300 pb-1">
                  FACTORY OPTIONAL PACKAGES
                </h3>
                <ul className="space-y-1.5 text-slate-300 print:text-slate-800">
                  {vehicle.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 print:bg-black shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column C: Price Breakdown */}
              <div className="space-y-3 bg-slate-900 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300">
                <h3 className="font-mono text-amber-400 print:text-black font-bold uppercase border-b border-slate-800 print:border-slate-300 pb-1">
                  PRICING BREAKDOWN
                </h3>
                <div className="space-y-2 text-slate-300 print:text-slate-800 font-mono">
                  <div className="flex justify-between">
                    <span>Base Vehicle MSRP:</span>
                    <span className="font-bold">${baseMsrp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Installed Options:</span>
                    <span className="font-bold">${optionsPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destination Charge:</span>
                    <span className="font-bold">${destinationCharge.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-700 print:border-black pt-2 flex justify-between font-bold text-amber-400 print:text-black text-sm">
                    <span>Total MSRP:</span>
                    <span>${vehicle.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. EPA Fuel Economy & Environmental Rating Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b-2 border-slate-800 print:border-black pb-6">
              
              <div className="border-2 border-slate-800 print:border-black p-4 rounded-xl bg-slate-900/50 print:bg-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 print:text-black uppercase font-bold block">
                    EPA FUEL ECONOMY & ENVIRONMENT
                  </span>
                  <div className="text-3xl font-black text-white print:text-black font-display my-1">
                    {vehicle.fuelType === 'Electric' ? '112 MPGe' : '22 MPG'}
                  </div>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 font-mono">
                    Combined City/Highway Rating
                  </span>
                </div>
                <div className="text-right border-l border-slate-800 print:border-slate-300 pl-4">
                  <span className="text-[10px] font-mono text-slate-400 print:text-slate-600 block">Annual Fuel Cost</span>
                  <span className="text-xl font-extrabold text-amber-400 print:text-black font-display">$2,450</span>
                </div>
              </div>

              {/* Color Specs */}
              <div className="border-2 border-slate-800 print:border-black p-4 rounded-xl bg-slate-900/50 print:bg-white space-y-2 font-mono text-xs">
                <div className="text-[10px] text-amber-400 print:text-black font-bold uppercase">PAINT & INTERIOR FINISH</div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-slate-600">Exterior Color:</span>
                  <span className="font-bold text-white print:text-black">{vehicle.exteriorColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 print:text-slate-600">Interior Color:</span>
                  <span className="font-bold text-white print:text-black">{vehicle.interiorColor}</span>
                </div>
              </div>

            </div>

            {/* 4. VIN & Barcode Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 font-mono text-xs">
              <div>
                <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase">VEHICLE IDENTIFICATION NUMBER (VIN)</div>
                <div className="text-base font-bold text-white print:text-black tracking-wider">{vehicle.vin}</div>
                <div className="text-[10px] text-slate-500">DEALERSHIP: AutoLot Direct Inc. • 100 Luxury Way</div>
              </div>

              {/* Barcode representation */}
              <div className="text-center">
                <div className="tracking-[6px] text-2xl font-mono text-slate-400 print:text-black select-none">
                  ||||| | |||| ||||| ||| ||||
                </div>
                <span className="text-[9px] text-slate-500 uppercase block">MONRONEY BARCODE STICKER ID</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
