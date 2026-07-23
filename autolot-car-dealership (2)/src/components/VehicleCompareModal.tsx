import React from 'react';
import { Vehicle } from '../types/vehicle';
import { X, CheckCircle2, AlertCircle, ShoppingBag, Zap, Fuel, Gauge, Car, ArrowLeftRight, Sparkles } from 'lucide-react';
import { getVehicleImage } from '../services/carImageService';

interface VehicleCompareModalProps {
  vehicles: Vehicle[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveVehicle: (id: string) => void;
  onPurchase: (vehicle: Vehicle) => void;
}

export const VehicleCompareModal: React.FC<VehicleCompareModalProps> = ({
  vehicles,
  isOpen,
  onClose,
  onRemoveVehicle,
  onPurchase
}) => {
  if (!isOpen || vehicles.length === 0) return null;

  const compareRows = [
    { label: 'MSRP Price', render: (v: Vehicle) => `$${v.price.toLocaleString()}`, highlight: true },
    { label: 'Power Output', render: (v: Vehicle) => `${v.horsepower} HP` },
    { label: 'Top Speed', render: (v: Vehicle) => v.topSpeed },
    { label: 'Body Style', render: (v: Vehicle) => v.bodyType },
    { label: 'Drivetrain / Fuel', render: (v: Vehicle) => v.fuelType },
    { label: 'Transmission', render: (v: Vehicle) => v.transmission },
    { label: 'Mileage', render: (v: Vehicle) => `${v.mileage.toLocaleString()} mi` },
    { label: 'Exterior Paint', render: (v: Vehicle) => v.exteriorColor },
    { label: 'Interior Upholstery', render: (v: Vehicle) => v.interiorColor },
    { label: 'VIN Number', render: (v: Vehicle) => v.vin, fontMono: true },
    { label: 'In Stock Quantity', render: (v: Vehicle) => `${v.quantity} Available` }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Compare Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ArrowLeftRight className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest block">
                TECHNICAL SPECIFICATION COMPARISON
              </span>
              <h2 className="text-xl font-extrabold text-white font-display">
                Side-by-Side Model Comparison ({vehicles.length} Vehicles)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-Side Table Area */}
        <div className="p-4 sm:p-6 overflow-x-auto flex-1 space-y-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-4 px-4 w-48 text-xs font-mono uppercase text-slate-400 bg-slate-950/50 rounded-tl-xl">
                  Specification
                </th>
                {vehicles.map((v) => (
                  <th key={v.id} className="py-4 px-4 min-w-[240px] text-center bg-slate-950/40 align-top">
                    <div className="space-y-3 relative">
                      
                      {/* Remove Button */}
                      {vehicles.length > 1 && (
                        <button
                          onClick={() => onRemoveVehicle(v.id)}
                          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-rose-200 transition-colors cursor-pointer"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Image Thumbnail */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mx-auto">
                        <img
                          src={getVehicleImage(v.make, v.model, v.imageUrl)}
                          alt={`${v.make} ${v.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Name & Year */}
                      <div>
                        <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">{v.year} {v.make}</div>
                        <h3 className="text-base font-extrabold text-white font-display">{v.model}</h3>
                        <div className="text-lg font-black text-amber-400 font-display mt-1">${v.price.toLocaleString()}</div>
                      </div>

                      {/* Action Button */}
                      <button
                        disabled={v.quantity === 0}
                        onClick={() => {
                          onClose();
                          onPurchase(v);
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all ${
                          v.quantity === 0
                            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{v.quantity === 0 ? 'SOLD OUT' : 'Reserve Model'}</span>
                      </button>

                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80 text-xs">
              {compareRows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-950/20' : 'bg-transparent'}>
                  <td className="py-3 px-4 font-mono font-bold text-slate-400 uppercase text-[11px] border-r border-slate-800/60">
                    {row.label}
                  </td>
                  {vehicles.map((v) => (
                    <td
                      key={v.id}
                      className={`py-3 px-4 text-center font-medium ${
                        row.highlight
                          ? 'text-amber-400 font-bold text-sm font-display'
                          : 'text-slate-200'
                      } ${row.fontMono ? 'font-mono text-[11px]' : ''}`}
                    >
                      {row.render(v)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Equipment & Features Comparison Row */}
              <tr className="bg-slate-950/40">
                <td className="py-4 px-4 font-mono font-bold text-slate-400 uppercase text-[11px] border-r border-slate-800/60 align-top">
                  Standard Equipment
                </td>
                {vehicles.map((v) => (
                  <td key={v.id} className="py-4 px-4 align-top">
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {(v.features || []).map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2 py-1 rounded-md bg-slate-800 text-slate-200 text-[10px] border border-slate-700/60 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>AutoLot Vehicle Specification Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
