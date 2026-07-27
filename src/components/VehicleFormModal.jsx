import React, { useState, useEffect } from 'react';
import { X, Save, Car, DollarSign, Tag, CheckCircle2, AlertCircle } from 'lucide-react';

export const VehicleFormModal = ({ vehicle, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    quantity: 1,
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    horsepower: 300,
    topSpeed: '155 mph',
    mileage: 0,
    vin: '',
    imageUrl: '',
    description: '',
    features: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        price: vehicle.price || '',
        quantity: vehicle.quantity ?? 1,
        bodyType: vehicle.bodyType || 'Sedan',
        fuelType: vehicle.fuelType || 'Gasoline',
        transmission: vehicle.transmission || 'Automatic',
        horsepower: vehicle.horsepower || 300,
        topSpeed: vehicle.topSpeed || '155 mph',
        mileage: vehicle.mileage || 0,
        vin: vehicle.vin || '',
        imageUrl: vehicle.imageUrl || '',
        description: vehicle.description || '',
        features: Array.isArray(vehicle.features) ? vehicle.features.join(', ') : vehicle.features || ''
      });
    } else {
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        quantity: 1,
        bodyType: 'Sedan',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        horsepower: 300,
        topSpeed: '155 mph',
        mileage: 0,
        vin: '',
        imageUrl: '',
        description: '',
        features: ''
      });
    }
    setError('');
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.make || !formData.model || !formData.price) {
      setError('Please fill in all required fields (Make, Model, Price).');
      return;
    }

    setIsSubmitting(true);
    try {
      const featuresArray = typeof formData.features === 'string'
        ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
        : formData.features;

      await onSave({
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        year: Number(formData.year),
        horsepower: Number(formData.horsepower),
        mileage: Number(formData.mileage),
        features: featuresArray
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save vehicle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#F8F4EC] border border-[#E5DCCF] rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5DCCF]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F2EBE1] text-[#8B5A2B] rounded-2xl border border-[#E5DCCF]">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-sans text-[#6B5E52] uppercase font-bold tracking-widest block">
                ADMIN INVENTORY CONSOLE
              </span>
              <h2 className="text-lg font-bold text-[#1F1813] font-display">
                {vehicle ? `Edit Vehicle: ${vehicle.make} ${vehicle.model}` : 'Add New Vehicle Entry'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#F2EBE1] text-[#1F1813] hover:bg-[#E5DCCF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-[#FBEAE5] border border-[#B2543C] text-[#B2543C] text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Make *</label>
              <input
                type="text"
                name="make"
                required
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g. Porsche"
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Model *</label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. 911 GT3 RS"
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Model Year *</label>
              <input
                type="number"
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Price (INR ₹) *</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="25000000"
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Stock Quantity *</label>
              <input
                type="number"
                name="quantity"
                required
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Body Type</label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              >
                <option value="Coupe">Coupe</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Convertible">Convertible</option>
                <option value="Supercar">Supercar</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Fuel Type / Powertrain</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              >
                <option value="Gasoline">Gasoline</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Transmission</label>
              <input
                type="text"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                placeholder="e.g. 7-Speed PDK Dual-Clutch"
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Horsepower (HP)</label>
              <input
                type="number"
                name="horsepower"
                value={formData.horsepower}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Top Speed</label>
              <input
                type="text"
                name="topSpeed"
                value={formData.topSpeed}
                onChange={handleChange}
                placeholder="184 mph"
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Mileage (miles)</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">VIN Code</label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="WP0AB2A99NS294821"
                className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Image URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Key Features (comma-separated)</label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Aero Package, Carbon Ceramic Brakes, Front Axle Lift"
              className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#6B5E52] uppercase block mb-1">Vehicle Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detail vehicle history, options, and overview..."
              className="w-full px-3.5 py-2 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E5DCCF]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E5DCCF] bg-white text-[#1F1813] text-xs font-bold hover:bg-[#F2EBE1] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#8B5A2B] hover:bg-[#6E4520] text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Vehicle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
