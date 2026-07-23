import React, { useState, useEffect } from 'react';
import { Vehicle, BodyType, FuelType, TransmissionType, SampleCarPreset } from '../types/vehicle';
import { SAMPLE_CAR_PRESETS } from '../data/initialVehicles';
import { X, Sparkles, Image as ImageIcon, Car, Plus, Check, Wand2, Loader2, RefreshCw } from 'lucide-react';
import { getCarMakes, getCarModels, CarMake, CarModel } from '../services/carQueryService';
import { getVehicleImage } from '../services/carImageService';

interface VehicleFormModalProps {
  vehicle: Vehicle | null; // null for add, Vehicle object for edit
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: Partial<Vehicle>) => void;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSave
}) => {
  const isEditing = Boolean(vehicle);

  const [formData, setFormData] = useState<Partial<Vehicle>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 75000,
    quantity: 1,
    imageUrl: '',
    bodyType: 'Coupe',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    mileage: 0,
    vin: '',
    exteriorColor: 'Obsidian Black',
    interiorColor: 'Black Leather',
    horsepower: 450,
    topSpeed: '175 mph',
    features: ['Navigation System', 'Premium Surround Sound', 'Heated Sport Seats'],
    description: ''
  });

  const [featureInput, setFeatureInput] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // CarQuery Makes and Models state
  const [makes, setMakes] = useState<CarMake[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Load makes when modal opens
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoadingMakes(true);
    getCarMakes()
      .then((data) => {
        if (isMounted) setMakes(data);
      })
      .finally(() => {
        if (isMounted) setLoadingMakes(false);
      });
    return () => { isMounted = false; };
  }, [isOpen]);

  // Load models whenever selected make changes
  useEffect(() => {
    if (!isOpen || !formData.make) {
      setModels([]);
      return;
    }
    let isMounted = true;
    setLoadingModels(true);
    getCarModels(formData.make)
      .then((data) => {
        if (isMounted) setModels(data);
      })
      .finally(() => {
        if (isMounted) setLoadingModels(false);
      });
    return () => { isMounted = false; };
  }, [isOpen, formData.make]);

  useEffect(() => {
    if (vehicle) {
      setFormData({ ...vehicle });
    } else {
      setFormData({
        make: 'Porsche',
        model: '911 Carrera S',
        year: 2025,
        price: 131300,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
        bodyType: 'Coupe',
        fuelType: 'Gasoline',
        transmission: 'PDK Dual-Clutch',
        mileage: 15,
        vin: `WP0AB2A9${Math.floor(100000 + Math.random() * 900000)}`,
        exteriorColor: 'Shark Blue',
        interiorColor: 'Black Alcantara',
        horsepower: 443,
        topSpeed: '191 mph',
        features: ['Sport Chrono Package', 'Sports Exhaust System', 'BOSE Surround Sound'],
        description: 'Iconic rear-engine sports car delivering timeless precision and athletic performance.'
      });
    }
    setImagePreviewError(false);
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.price) return;
    onSave(formData);
    onClose();
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    const currentFeats = formData.features || [];
    setFormData({ ...formData, features: [...currentFeats, featureInput.trim()] });
    setFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    const currentFeats = formData.features || [];
    setFormData({ ...formData, features: currentFeats.filter((_, i) => i !== index) });
  };

  const applyPreset = (preset: SampleCarPreset) => {
    setFormData({
      ...formData,
      make: preset.make,
      model: preset.model,
      imageUrl: preset.imageUrl,
      bodyType: preset.bodyType,
      fuelType: preset.fuelType,
      horsepower: preset.horsepower,
      price: preset.suggestedPrice
    });
    setImagePreviewError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                {isEditing ? `Edit ${vehicle?.make} ${vehicle?.model}` : 'Add New Vehicle to Inventory'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">Fill out specifications & Monroney sticker details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Picker */}
        <div className="bg-slate-950/60 px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1 font-semibold">
            <Wand2 className="w-3.5 h-3.5" /> Quick Real Models:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_CAR_PRESETS.map((p) => (
              <button
                key={p.model}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                {p.make} {p.model}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Make, Model, Year, MSRP, Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Make / Brand Autocomplete Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-slate-400 font-bold">Make / Brand *</label>
                {loadingMakes && (
                  <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> CarQuery...
                  </span>
                )}
              </div>
              <div className="relative">
                <select
                  required
                  value={formData.make || ''}
                  onChange={(e) => {
                    const newMake = e.target.value;
                    setFormData({ ...formData, make: newMake, model: '' });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="" disabled>Select Manufacturer Make...</option>
                  {makes.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Model Name Dependent Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-slate-400 font-bold">Model Name *</label>
                {loadingModels && (
                  <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading Models...
                  </span>
                )}
              </div>
              {models.length > 0 ? (
                <select
                  required
                  value={formData.model || ''}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="" disabled>Select Model for {formData.make}...</option>
                  {models.map((m, idx) => (
                    <option key={idx} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={formData.model || ''}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder={formData.make ? `Type model name for ${formData.make}...` : "Select Make first or type model..."}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              )}
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Model Year *</label>
              <input
                type="number"
                required
                value={formData.year || 2025}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Price MSRP ($) *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-amber-400 font-bold font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Quantity in Stock *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.quantity ?? 1}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">VIN Number</label>
              <input
                type="text"
                value={formData.vin || ''}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                placeholder="Optional / Auto-generated"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section 2: Requirement 1 - Image URL Input & Preview */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-amber-400 flex items-center gap-1.5 font-bold">
                <ImageIcon className="w-4 h-4" /> Vehicle Image URL (Optional)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">16:9 Aspect Ratio recommended</span>
            </div>

            <input
              type="text"
              value={formData.imageUrl || ''}
              onChange={(e) => {
                setFormData({ ...formData, imageUrl: e.target.value });
                setImagePreviewError(false);
              }}
              placeholder="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
            />

            {/* Live Image Preview with Fallback */}
            <div className="mt-2 relative aspect-video w-full max-w-sm mx-auto rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
              {(() => {
                const previewUrl = getVehicleImage(formData.make || '', formData.model || '', formData.imageUrl);
                return previewUrl && !imagePreviewError ? (
                  <img
                    src={previewUrl}
                    alt="Live vehicle preview"
                    onError={() => setImagePreviewError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-slate-500">
                    <Car className="w-8 h-8 text-slate-600 mb-1" />
                    <span className="text-xs font-mono text-slate-400">
                      {imagePreviewError ? 'Unable to load image — fallback garage icon will be used' : 'Image Preview Placeholder'}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Section 3: Technical Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Body Style</label>
              <select
                value={formData.bodyType || 'Coupe'}
                onChange={(e) => setFormData({ ...formData, bodyType: e.target.value as BodyType })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
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
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Fuel / Drivetrain</label>
              <select
                value={formData.fuelType || 'Gasoline'}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Gasoline">Gasoline</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Twin-Turbo V8">Twin-Turbo V8</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Transmission</label>
              <select
                value={formData.transmission || 'Automatic'}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value as TransmissionType })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="PDK Dual-Clutch">PDK Dual-Clutch</option>
                <option value="Direct Drive">Direct Drive</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Horsepower (HP)</label>
              <input
                type="number"
                value={formData.horsepower || 0}
                onChange={(e) => setFormData({ ...formData, horsepower: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Mileage (Miles)</label>
              <input
                type="number"
                value={formData.mileage ?? 0}
                onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Exterior Finish</label>
              <input
                type="text"
                value={formData.exteriorColor || ''}
                onChange={(e) => setFormData({ ...formData, exteriorColor: e.target.value })}
                placeholder="e.g. Guards Red / Carbon"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Interior Trim</label>
              <input
                type="text"
                value={formData.interiorColor || ''}
                onChange={(e) => setFormData({ ...formData, interiorColor: e.target.value })}
                placeholder="e.g. Alcantara Black"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section 4: Features Tags */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Features & Options</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="e.g. Carbon Ceramic Brakes, Lift System"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Add Feature
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(formData.features || []).map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 text-xs border border-slate-700 flex items-center gap-1"
                >
                  {feat}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-rose-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: Description */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Vehicle Description</label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed sales summary or highlights..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              {isEditing ? 'Save Vehicle Changes' : 'Publish Vehicle To Inventory'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
