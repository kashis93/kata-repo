import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { Sketchfab3DViewer } from './Sketchfab3DViewer';
import { RealCarTurntable3D } from './RealCarTurntable3D';
import { X, Sparkles, ShoppingBag, Box, Compass, RefreshCw } from 'lucide-react';

interface ThreeCarShowroomProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onPurchase: (vehicle: Vehicle) => void;
}

export const ThreeCarShowroom: React.FC<ThreeCarShowroomProps> = ({ vehicle, onClose, onPurchase }) => {
  const [viewMode, setViewMode] = useState<'sketchfab' | 'real_photo_360'>('sketchfab');

  if (!vehicle) return null;

  const displayName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const displayPrice = `$${vehicle.price.toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-2 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-slate-950 border-b border-slate-800 z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="text-xs font-mono text-amber-400 tracking-wider uppercase font-semibold">3D Interactive Showroom</div>
              <h2 className="text-xl font-extrabold text-white font-display tracking-tight">{displayName}</h2>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('sketchfab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'sketchfab'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" /> 3D CAD Mesh
            </button>
            <button
              onClick={() => setViewMode('real_photo_360')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'real_photo_360'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Real Photo 360°
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {vehicle.quantity > 0 && (
              <button
                onClick={() => {
                  onClose();
                  onPurchase(vehicle);
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Reserve For {displayPrice}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close 3D View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Display Area */}
        <div className="relative w-full p-2 bg-slate-950 overflow-hidden flex-1">
          {viewMode === 'sketchfab' ? (
            <Sketchfab3DViewer
              make={vehicle.make}
              model={vehicle.model}
              category={vehicle.category}
              onFallbackToProcedural={() => setViewMode('real_photo_360')}
            />
          ) : (
            <RealCarTurntable3D
              vehicle={vehicle}
              make={vehicle.make}
              model={vehicle.model}
              autoRotateDefault={true}
              onPurchase={(v) => {
                onClose();
                onPurchase(v);
              }}
            />
          )}
        </div>

        {/* Footer Specs Quick Glance */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Power</span>
              <span className="font-bold text-slate-200">{vehicle.horsepower} HP</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Top Speed</span>
              <span className="font-bold text-slate-200">{vehicle.topSpeed} mph</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Stock Status</span>
              <span className="font-bold text-emerald-400">{vehicle.quantity} Available</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            AutoLot High-Definition 3D Showroom Platform
          </div>
        </div>
      </div>
    </div>
  );
};
