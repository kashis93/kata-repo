import React from 'react';
import { Heart, ArrowLeftRight, Eye, ShoppingBag, Zap, Fuel, Gauge, Check, AlertCircle, Sparkles } from 'lucide-react';
import { getVehicleImage } from '../services/carImageService.js';

export const VehicleCard = ({
  vehicle,
  onPurchase,
  onInspect3D,
  onOpenDetails,
  isSaved = false,
  onToggleSave,
  isCompared = false,
  onToggleCompare
}) => {
  const imageUrl = getVehicleImage(
    vehicle.make,
    vehicle.model,
    vehicle.imageUrl,
    '01'
  );

  const isOutOfStock = vehicle.quantity === 0;
  const formattedPrice = `€${(vehicle.price || 100000).toLocaleString()}`;
  const monthlyFinance = `€${Math.round((vehicle.price || 100000) / 60).toLocaleString()}/mo*`;

  return (
    <div className="vehicle-card" data-vehicle-id={vehicle.id}>
      
      {/* Media & Image Container */}
      <div
        className="vehicle-media"
        onClick={() => onOpenDetails ? onOpenDetails(vehicle) : onInspect3D?.(vehicle)}
      >
        <img
          src={imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Top Left Badges */}
        <div className="vehicle-top-left-badges">
          <span className={`vehicle-badge ${isOutOfStock ? 'vehicle-badge-sold' : 'vehicle-badge-in-stock'}`}>
            {isOutOfStock ? <AlertCircle className="w-3 h-3 text-[#B2543C]" /> : <Check className="w-3 h-3 text-[#3F7A5B]" />}
            <span>{isOutOfStock ? 'SOLD OUT' : `${vehicle.quantity || 1} IN STOCK`}</span>
          </span>
          <span className="vehicle-badge vehicle-badge-body-type">
            {vehicle.bodyType || 'Coupe'}
          </span>
        </div>

        {/* Top Right Action Icons */}
        <div className="vehicle-top-right-actions">
          {onToggleSave && (
            <button
              type="button"
              className={`vehicle-action-btn vehicle-action-btn-save ${isSaved ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(vehicle.id);
              }}
              title={isSaved ? 'Remove from Favorites' : 'Save to Favorites'}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#B2543C] text-[#B2543C]' : ''}`} />
            </button>
          )}

          {onToggleCompare && (
            <button
              type="button"
              className={`vehicle-action-btn vehicle-action-btn-compare ${isCompared ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(vehicle.id);
              }}
              title={isCompared ? 'Remove from Comparison' : 'Add to Compare'}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 3D View Center Overlay Button */}
        <button
          type="button"
          className="vehicle-3d-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (onInspect3D) onInspect3D(vehicle);
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>3D View</span>
        </button>
      </div>

      {/* Card Content Body */}
      <div className="vehicle-body">
        <div>
          <div className="vehicle-header-make-year">
            <span className="vehicle-make">{vehicle.make}</span>
            <span className="vehicle-year">{vehicle.year} MODEL</span>
          </div>

          <h3
            className="vehicle-name"
            onClick={() => onOpenDetails ? onOpenDetails(vehicle) : onInspect3D?.(vehicle)}
          >
            {vehicle.model}
          </h3>

          {/* Pricing Box */}
          <div className="vehicle-pricing-box">
            <div>
              <span className="vehicle-price-label">Total MSRP</span>
              <span className="vehicle-price">{formattedPrice}</span>
            </div>
            <div>
              <span className="vehicle-finance-label">Est. Finance</span>
              <span className="vehicle-finance-price">{monthlyFinance}</span>
            </div>
          </div>

          {/* 3 Spec Grid Columns */}
          <div className="vehicle-spec-grid">
            <div className="vehicle-spec-item">
              <Zap className="w-3.5 h-3.5 text-[#8C7E6A]" />
              <span className="vehicle-spec-text">{vehicle.horsepower || 450} HP</span>
            </div>
            <div className="vehicle-spec-item">
              <Fuel className="w-3.5 h-3.5 text-[#8C7E6A]" />
              <span className="vehicle-spec-text">{vehicle.fuelType || 'Gasoline'}</span>
            </div>
            <div className="vehicle-spec-item">
              <Gauge className="w-3.5 h-3.5 text-[#8C7E6A]" />
              <span className="vehicle-spec-text">{(vehicle.mileage || 8500).toLocaleString()} mi</span>
            </div>
          </div>

          {/* Features Tags */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="vehicle-features">
              {vehicle.features.slice(0, 2).map((feat, idx) => (
                <span key={idx} className="vehicle-feature-tag">{feat}</span>
              ))}
              {vehicle.features.length > 2 && (
                <span className="vehicle-features-more">+{vehicle.features.length - 2} more</span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Reserve Button */}
        <div className="vehicle-bottom-actions">
          <button
            type="button"
            className={`vehicle-reserve-btn ${isOutOfStock ? 'vehicle-reserve-btn-disabled' : 'vehicle-reserve-btn-active'}`}
            onClick={() => onPurchase(vehicle)}
            disabled={isOutOfStock}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="vehicle-reserve-btn-text">
              {isOutOfStock ? 'SOLD OUT' : 'RESERVE VEHICLE'}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};
