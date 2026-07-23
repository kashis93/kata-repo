import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Car, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { getCarMakes, getCarModels } from '../services/carQueryService.js';

export const VehicleFormModal = ({
  vehicle,
  isOpen,
  onClose,
  onSave
}) => {
  const [makesList, setMakesList] = useState([]);
  const [modelsList, setModelsList] = useState([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  const [formData, setFormData] = useState({
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    price: 241300,
    quantity: 2,
    bodyType: 'Coupe',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    horsepower: 518,
    topSpeed: 184,
    mileage: 150,
    vin: 'WP0AB2A90PS294812',
    exteriorColor: 'Guards Red',
    interiorColor: 'Black Leather',
    imageUrl: '',
    features: ['PDK Dual Clutch', 'Sport Chrono Package', 'Carbon Ceramic Brakes']
  });

  const [newFeatureText, setNewFeatureText] = useState('');

  // Fetch CarQuery makes list on open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoadingMakes(true);
    getCarMakes()
      .then((data) => {
        if (isMounted) setMakesList(data);
      })
      .finally(() => {
        if (isMounted) setLoadingMakes(false);
      });
  }, [isOpen]);

  // Sync state with passed prop vehicle
  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        quantity: vehicle.quantity,
        bodyType: vehicle.bodyType,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        horsepower: vehicle.horsepower,
        topSpeed: vehicle.topSpeed,
        mileage: vehicle.mileage,
        vin: vehicle.vin,
        exteriorColor: vehicle.exteriorColor,
        interiorColor: vehicle.interiorColor,
        imageUrl: vehicle.imageUrl || '',
        features: vehicle.features ? [...vehicle.features] : []
      });
    } else {
      setFormData({
        make: 'Porsche',
        model: '911 GT3 RS',
        year: 2024,
        price: 241300,
        quantity: 2,
        bodyType: 'Coupe',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        horsepower: 518,
        topSpeed: 184,
        mileage: 150,
        vin: `WP0AB2A${Math.floor(100000 + Math.random() * 900000)}`,
        exteriorColor: 'Guards Red',
        interiorColor: 'Black Leather',
        imageUrl: '',
        features: ['PDK Dual Clutch', 'Sport Chrono Package', 'Carbon Ceramic Brakes']
      });
    }
  }, [vehicle, isOpen]);

  // Fetch models whenever selected make changes
  useEffect(() => {
    if (!formData.make) return;
    let isMounted = true;
    setLoadingModels(true);
    getCarModels(formData.make)
      .then((models) => {
        if (isMounted) setModelsList(models);
      })
      .finally(() => {
        if (isMounted) setLoadingModels(false);
      });
  }, [formData.make]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeatureText.trim()]
    }));
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-md p-2 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-[2.5rem] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-stone-100 border border-stone-200 text-stone-700">
              <Car className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <span className="text-[10px] font-sans text-stone-500 uppercase font-bold tracking-widest block">
                DEALERSHIP INVENTORY MANAGER
              </span>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                {vehicle ? `Edit ${vehicle.make} ${vehicle.model}` : 'Allocate New Vehicle Entry'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Form Area */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Make & Model Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-sans uppercase text-slate-500 block mb-1 font-bold">
                Manufacturer Make *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  list="makes-list"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  placeholder="e.g. Porsche, Ferrari"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-stone-500 font-medium"
                />
                <datalist id="makes-list">
                  {makesList.map((m) => (
                    <option key={m.id} value={m.name} />
                  ))}
                </datalist>
                {loadingMakes && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 animate-spin" />
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-sans uppercase text-slate-500 block mb-1 font-bold">
                Vehicle Model *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  list="models-list"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g. 911 GT3 RS"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-stone-500 font-medium"
                />
                <datalist id="models-list">
                  {modelsList.map((m, idx) => (
                    <option key={idx} value={m.name} />
                  ))}
                </datalist>
                {loadingModels && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 animate-spin" />
                )}
              </div>
            </div>
          </div>

          {/* Pricing, Year, Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-sans uppercase text-slate-500 block mb-1 font-bold">
                Manufacturer MSRP ($USD) *
              </label>
              <input
                type="number"
                required
                min={1000}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-stone-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-sans uppercase text-slate-500 block mb-1 font-bold">
                Model Year *
              </label>
              <input
                type="number"
                required
                min={1990}
                max={2030}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-stone-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-sans uppercase text-slate-500 block mb-1 font-bold">
                In-Stock Quantity Units *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-stone-500 font-medium"
              />
            </div>
          </div>

          {/* Drivetrain specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-sans uppercase text-slate-500 block mb-1 font-bold">Body Style</label>
              <select
                value={formData.bodyType}
                onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-stone-500 cursor-pointer font-medium"
              >
                <option value="Coupe">Coupe</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Convertible">Convertible</option>
                <option value="Electric">Electric</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-sans uppercase text-slate-500 block mb-1 font-bold">Fuel Powertrain</label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-stone-500 cursor-pointer font-medium"
              >
                <option value="Gasoline">Gasoline</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-sans uppercase text-slate-500 block mb-1 font-bold">Horsepower</label>
              <input
                type="number"
                value={formData.horsepower}
                onChange={(e) => setFormData({ ...formData, horsepower: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-stone-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-sans uppercase text-slate-500 block mb-1 font-bold">Top Speed (mph)</label>
              <input
                type="number"
                value={formData.topSpeed}
                onChange={(e) => setFormData({ ...formData, topSpeed: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-stone-500 font-medium"
              />
            </div>
          </div>

          {/* VIN & Custom Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-sans uppercase text-slate-500 block mb-1 font-bold">VIN Number *</label>
              <input
                type="text"
                required
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 font-mono focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="text-xs font-sans uppercase text-slate-500 block mb-1 font-bold">Custom Photo URL (Optional)</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-stone-500 font-medium"
              />
            </div>
          </div>

          {/* Features Tag Stack */}
          <div>
            <label className="text-xs font-sans uppercase text-slate-500 block mb-1.5 font-bold">Included Options & Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                placeholder="e.g. Sport Exhaust, Carbon Fiber Package"
                className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-stone-500 font-medium"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Add Feature
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {formData.features.map((feat, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-stone-100 border border-stone-200 text-slate-850 rounded-full text-xs font-medium flex items-center gap-1.5"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-slate-450 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-stone-200">
            <button
              type="submit"
              className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-250 font-bold text-xs rounded-full shadow-xs cursor-pointer transition-all active:scale-98"
            >
              {vehicle ? 'Save Vehicle Specs' : 'Allocate New Vehicle to Lot'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
