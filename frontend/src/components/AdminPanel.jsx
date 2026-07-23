import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Copy, RefreshCw, Car, DollarSign, Package, ShieldCheck, CheckCircle2, ShoppingBag, BarChart3 } from 'lucide-react';
import { getVehicleImage } from '../services/carImageService.js';
import { api } from '../services/api.js';

export const AdminPanel = ({
  vehicles,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onDuplicateVehicle,
  onResetCatalog
}) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [purchases, setPurchases] = useState(() => api.getPurchases());

  const totalValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const totalUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Admin Top Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-[#E5DCCF] rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F2EBE1] border border-[#E5DCCF] text-[#8B5A2B] rounded-2xl">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1F1813] font-display">Inventory Management Console</h2>
            <p className="text-xs text-[#6B5E52] font-medium">Add, edit, or remove dealership vehicle allocations</p>
          </div>
        </div>

        {/* View Switcher Tabs & Reset Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#F6F0E6] p-1.5 rounded-full border border-[#E5DCCF]">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#8B5A2B] text-white shadow-xs font-display'
                  : 'text-[#6B5E52] hover:text-[#1F1813]'
              }`}
            >
              Vehicles ({vehicles.length})
            </button>
            <button
              onClick={() => {
                setPurchases(api.getPurchases());
                setActiveTab('orders');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#8B5A2B] text-white shadow-xs font-display'
                  : 'text-[#6B5E52] hover:text-[#1F1813]'
              }`}
            >
              Order Log ({purchases.length})
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset catalog to default luxury dealership vehicles?')) {
                onResetCatalog();
              }
            }}
            className="px-3.5 py-2 bg-[#F6F0E6] hover:bg-[#F2EBE1] text-[#6B5E52] hover:text-[#1F1813] border border-[#E5DCCF] rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset Catalog to Initial Sample Fleet"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#8B5A2B]" />
            <span className="hidden sm:inline">Reset Fleet</span>
          </button>

          <button
            onClick={onAddVehicle}
            className="px-5 py-2 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-[#E5DCCF] rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#6B5E52] uppercase font-sans font-bold block">Total Catalog MSRP Value</span>
            <span className="text-2xl font-bold text-[#1F1813] font-display">${totalValue.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-[#F2EBE1] border border-[#E5DCCF] rounded-2xl text-[#8B5A2B]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E5DCCF] rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#6B5E52] uppercase font-bold block">Total Stock Inventory Units</span>
            <span className="text-2xl font-bold text-[#1F1813] font-display">{totalUnits} Units</span>
          </div>
          <div className="p-3 bg-[#F2EBE1] border border-[#E5DCCF] rounded-2xl text-[#8B5A2B]">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E5DCCF] rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#6B5E52] uppercase font-bold block">Completed Reservations</span>
            <span className="text-2xl font-bold text-[#1F1813] font-display">{purchases.length} Orders</span>
          </div>
          <div className="p-3 bg-[#F2EBE1] border border-[#E5DCCF] rounded-2xl text-[#8B5A2B]">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Area: Vehicle Inventory Table vs Order Log */}
      {activeTab === 'inventory' ? (
        <div className="bg-white border border-[#E5DCCF] rounded-3xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E5DCCF] bg-[#F6F0E6] flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1F1813] font-display">Active Vehicles Inventory</h3>
            <span className="text-xs text-[#6B5E52] font-mono">{vehicles.length} Models On Record</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5DCCF] bg-[#F6F0E6]/50 text-[#6B5E52] font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">MSRP</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Body / Powertrain</th>
                  <th className="py-3 px-4">VIN Number</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DCCF]">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-[#F8F4EC] transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={getVehicleImage(v.make, v.model, v.imageUrl, '01')}
                        alt={v.model}
                        className="w-12 h-9 object-cover rounded-lg bg-[#E5DCCF]"
                      />
                      <div>
                        <div className="font-bold text-[#1F1813] font-display">{v.year} {v.make} {v.model}</div>
                        <div className="text-[10px] text-[#6B5E52]">{v.horsepower} HP • {v.transmission}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#8B5A2B] font-display">
                      ${v.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        v.quantity > 0 ? 'bg-[#EAF2ED] text-[#3F7A5B]' : 'bg-[#FBEAE5] text-[#B2543C]'
                      }`}>
                        {v.quantity > 0 ? `${v.quantity} Units` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#6B5E52]">
                      {v.bodyType} • {v.fuelType}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#6B5E52]">
                      {v.vin}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => onEditVehicle(v)}
                        className="p-1.5 text-[#1F1813] hover:text-[#8B5A2B] rounded-md transition-colors"
                        title="Edit Specs"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDuplicateVehicle(v)}
                        className="p-1.5 text-[#6B5E52] hover:text-[#8B5A2B] rounded-md transition-colors"
                        title="Duplicate Entry"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${v.make} ${v.model} from inventory?`)) {
                            onDeleteVehicle(v.id);
                          }
                        }}
                        className="p-1.5 text-[#6B5E52] hover:text-[#B2543C] rounded-md transition-colors"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Order Log / Customer Reservations View */
        <div className="bg-white border border-[#E5DCCF] rounded-3xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E5DCCF] bg-[#F6F0E6] flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1F1813] font-display">Customer Reservation Orders</h3>
            <span className="text-xs text-[#6B5E52] font-mono">{purchases.length} Logged Orders</span>
          </div>

          {purchases.length === 0 ? (
            <div className="p-12 text-center text-[#6B5E52] space-y-2">
              <ShoppingBag className="w-8 h-8 text-[#8B5A2B] mx-auto" />
              <div className="font-bold text-[#1F1813]">No Reservations Logged Yet</div>
              <p className="text-xs">When customers reserve vehicles from the showroom, their orders will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E5DCCF] bg-[#F6F0E6]/50 text-[#6B5E52] font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Reserved Model</th>
                    <th className="py-3 px-4">Order Value</th>
                    <th className="py-3 px-4">Date Logged</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DCCF]">
                  {purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8F4EC] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#1F1813] font-display">
                        {p.customerName}
                      </td>
                      <td className="py-3 px-4 text-[#6B5E52]">
                        <div>{p.customerEmail}</div>
                        <div className="font-mono text-[10px]">{p.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#1F1813]">
                        {p.vehicleName}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#8B5A2B] font-display">
                        ${p.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-[#6B5E52] font-mono text-[10px]">
                        {new Date(p.timestamp).toLocaleDateString()} {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-[#EAF2ED] text-[#3F7A5B] font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Reserved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
