import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { Plus, Edit2, Trash2, Car, Search, RefreshCw, AlertTriangle, Layers, DollarSign, Package, Copy, Download, BarChart3 } from 'lucide-react';
import { getVehicleImage } from '../services/carImageService';
import { PriceDistributionChart } from './PriceDistributionChart';
import { exportVehiclesToCSV } from '../utils/csvExport';

interface AdminPanelProps {
  vehicles: Vehicle[];
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  onDuplicateVehicle: (vehicle: Vehicle) => void;
  onResetCatalog: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  vehicles,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onDuplicateVehicle,
  onResetCatalog
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(true);

  // Filtered vehicles for admin table
  const filtered = vehicles.filter(
    (v) =>
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.year.toString().includes(searchTerm)
  );

  // Stats
  const totalValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const totalUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;
  const avgPrice = vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 print:hidden">
      
      {/* Admin Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-inner">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">Total Inventory Value</div>
            <div className="text-2xl font-black text-amber-400 font-display tracking-tight">${totalValue.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md">
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shadow-inner">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">Total Lot Units</div>
            <div className="text-2xl font-extrabold text-white font-display tracking-tight">{totalUnits} Vehicles</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">Out of Stock Items</div>
            <div className="text-2xl font-extrabold text-rose-400 font-display tracking-tight">{outOfStockCount} Models</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">Average Vehicle Price</div>
            <div className="text-2xl font-extrabold text-white font-display tracking-tight">${avgPrice.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Requirement 2: Recharts Price Distribution Chart Panel */}
      {showChart && <PriceDistributionChart vehicles={vehicles} />}

      {/* Admin Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
        
        {/* Table Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inventory table by make, model, VIN..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={() => setShowChart(!showChart)}
            className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700/50"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>{showChart ? 'Hide Analytics' : 'Show Analytics'}</span>
          </button>

          <button
            onClick={() => exportVehiclesToCSV(filtered, 'autolot_admin_inventory_report.csv')}
            className="px-3.5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:border-amber-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Export Admin Table to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onResetCatalog}
            className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700/50"
            title="Reset to default car lot dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Dataset</span>
          </button>

          <button
            onClick={onAddVehicle}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer font-display"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800/90 font-bold">
              <tr>
                <th className="py-4 px-4">Vehicle</th>
                <th className="py-4 px-4">VIN Number</th>
                <th className="py-4 px-4">Body / Drivetrain</th>
                <th className="py-4 px-4">MSRP</th>
                <th className="py-4 px-4">Quantity</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                    No matching vehicles found in lot inventory.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/50 transition-colors">
                    
                    {/* Vehicle column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <AdminThumbnail imageUrl={v.imageUrl} make={v.make} model={v.model} />

                        <div>
                          <div className="font-extrabold text-white font-display text-sm tracking-tight">
                            {v.year} {v.make} {v.model}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {v.horsepower} HP • {v.mileage.toLocaleString()} mi
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 font-medium">
                      {v.vin}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-200">{v.bodyType}</div>
                      <div className="text-[10px] text-slate-500">{v.fuelType}</div>
                    </td>

                    <td className="py-3.5 px-4 font-black text-amber-400 font-mono text-sm">
                      ${v.price.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`font-black text-sm ${v.quantity === 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                        {v.quantity} units
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {v.quantity > 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 uppercase">
                          IN STOCK
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-rose-950/90 text-rose-300 border border-rose-800/80 uppercase">
                          SOLD OUT
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {deleteConfirmId === v.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-[10px] text-rose-400 font-bold mr-1">Delete?</span>
                          <button
                            onClick={() => {
                              onDeleteVehicle(v.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-500 cursor-pointer shadow-md"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold hover:bg-slate-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditVehicle(v)}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/40"
                            title="Edit Vehicle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDuplicateVehicle(v)}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/40"
                            title="Duplicate Entry"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(v.id)}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer border border-slate-700/40"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

/* Helper Component for 40x40px rounded thumbnail with fallback icon */
const AdminThumbnail: React.FC<{ imageUrl?: string; make: string; model: string }> = ({ imageUrl, make, model }) => {
  const [hasError, setHasError] = useState(false);
  const displayUrl = getVehicleImage(make, model, imageUrl);

  if (!displayUrl || hasError) {
    return (
      <div className="w-[40px] h-[40px] rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-amber-400/80">
        <Car className="w-5 h-5" />
      </div>
    );
  }

  return (
    <img
      src={displayUrl}
      alt={`${make} ${model}`}
      onError={() => setHasError(true)}
      className="w-[40px] h-[40px] rounded-lg object-cover border border-slate-800 shrink-0 bg-slate-950"
    />
  );
};
