import React, { useState, useEffect, useRef } from 'react';
import { Vehicle } from '../types/vehicle';
import { getImaginStudioUrl } from '../services/carImageService';
import { RotateCcw, Play, Pause, Compass, Sparkles, Eye, Camera, RefreshCw } from 'lucide-react';

interface RealCarTurntable3DProps {
  vehicle: Vehicle | null;
  make?: string;
  model?: string;
  customImageUrl?: string;
  autoRotateDefault?: boolean;
  onPurchase?: (v: Vehicle) => void;
  onClose?: () => void;
  className?: string;
}

// 16 evenly spaced angles around the car for smooth 360° rotation
const ANGLES = ['01', '03', '05', '07', '09', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29', '31'];

export const RealCarTurntable3D: React.FC<RealCarTurntable3DProps> = ({
  vehicle,
  make: propMake,
  model: propModel,
  customImageUrl,
  autoRotateDefault = true,
  onPurchase,
  onClose,
  className = ''
}) => {
  const make = vehicle?.make || propMake || 'Porsche';
  const model = vehicle?.model || propModel || '911 GT3 RS';
  const displayImage = customImageUrl || vehicle?.imageUrl;

  const [angleIndex, setAngleIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(autoRotateDefault);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const [hasImageError, setHasImageError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Pre-generate image URLs for all 16 angles
  const angleUrls = React.useMemo(() => {
    const cleanMake = encodeURIComponent(make.trim().toLowerCase());
    const firstWord = model.trim().split(' ')[0] || model;
    const cleanModel = encodeURIComponent(firstWord.toLowerCase());

    return ANGLES.map((angle) => {
      if (displayImage && displayImage.startsWith('http') && !displayImage.includes('imagin.studio')) {
        // If user provided a custom photo URL, return custom image
        return displayImage;
      }
      return `https://cdn.imagin.studio/getImage?customer=hrfwsdesign&make=${cleanMake}&modelFamily=${cleanModel}&angle=${angle}&zoomType=fullscreen&width=1600`;
    });
  }, [make, model, displayImage]);

  // Preload angle images for instant rotation response
  useEffect(() => {
    let isMounted = true;
    setLoadedImagesCount(0);
    setHasImageError(false);

    angleUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (isMounted) setLoadedImagesCount((prev) => prev + 1);
      };
      img.onerror = () => {
        if (isMounted) setHasImageError(true);
      };
    });

    return () => {
      isMounted = false;
    };
  }, [angleUrls]);

  // Auto-rotate turntable loop
  useEffect(() => {
    if (!isRotating || isDragging) return;

    const interval = setInterval(() => {
      setAngleIndex((prev) => (prev + 1) % ANGLES.length);
    }, 180);

    return () => clearInterval(interval);
  }, [isRotating, isDragging]);

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    if (Math.abs(deltaX) > 15) {
      const step = deltaX > 0 ? -1 : 1;
      setAngleIndex((prev) => (prev + step + ANGLES.length) % ANGLES.length);
      setDragStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStartX(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    if (Math.abs(deltaX) > 12) {
      const step = deltaX > 0 ? -1 : 1;
      setAngleIndex((prev) => (prev + step + ANGLES.length) % ANGLES.length);
      setDragStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Quick Angle Presets
  const jumpToPreset = (index: number) => {
    setAngleIndex(index);
    setIsRotating(false);
  };

  const currentAngleLabel = (() => {
    if (angleIndex === 0 || angleIndex === 15) return '3/4 Front View';
    if (angleIndex >= 1 && angleIndex <= 3) return 'Front Profile';
    if (angleIndex >= 4 && angleIndex <= 6) return '3/4 Side Profile';
    if (angleIndex >= 7 && angleIndex <= 9) return 'Full Side View';
    if (angleIndex >= 10 && angleIndex <= 12) return '3/4 Rear Profile';
    return 'Full Rear View';
  })();

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full aspect-video rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden select-none cursor-grab active:cursor-grabbing group shadow-2xl flex flex-col justify-between ${className}`}
    >
      {/* Grid Floor & Ambient Lighting Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-950 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-amber-500/10 via-blue-500/5 to-transparent pointer-events-none" />
      
      {/* 360° Studio Header Bar */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400/50" />
          <span className="font-extrabold text-white tracking-wide uppercase font-display flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            Real Photo 360° View • {make} {model}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <span className="hidden sm:inline-block px-2.5 py-1 bg-slate-800/90 rounded-lg text-[11px] font-sans border border-slate-700 text-slate-300">
            {currentAngleLabel} ({angleIndex + 1}/16)
          </span>
        </div>
      </div>

      {/* Main Real Photo Display Area */}
      <div className="relative flex-1 w-full flex items-center justify-center p-2 overflow-hidden">
        {/* Loading Progress Indicator */}
        {loadedImagesCount < 3 && !hasImageError && (
          <div className="absolute inset-0 z-20 bg-slate-950/90 flex flex-col items-center justify-center text-center p-6">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
            <div className="text-sm font-bold text-white font-display">Loading Real 360° Vehicle Angles...</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Pre-rendering 16 high-res studio photos ({loadedImagesCount}/16)</div>
          </div>
        )}

        <img
          src={angleUrls[angleIndex]}
          alt={`${make} ${model} 360 view`}
          className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] transition-all duration-75"
          draggable={false}
          onError={() => setHasImageError(true)}
        />

        {/* Drag Helper Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 border border-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono text-slate-300 flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Eye className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Click & Drag left/right to rotate 360° photo</span>
        </div>
      </div>

      {/* Bottom Interactive Control Panel */}
      <div className="relative z-10 p-3 bg-slate-900/90 backdrop-blur-md border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Angle Preset Buttons */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase mr-1 hidden md:inline">Angles:</span>
          {[
            { label: '3/4 Front', idx: 0 },
            { label: 'Front', idx: 2 },
            { label: 'Side', idx: 8 },
            { label: '3/4 Rear', idx: 10 },
            { label: 'Rear', idx: 12 }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => jumpToPreset(preset.idx)}
              className={`px-2 py-1 rounded-lg font-mono text-[11px] uppercase transition-all cursor-pointer ${
                angleIndex === preset.idx
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Turntable Auto-Rotate Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer border ${
              isRotating
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            {isRotating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" /> Pause Rotation
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400" /> 360° Turntable
              </>
            )}
          </button>

          {/* Optional Reserve Button if inside modal */}
          {vehicle && onPurchase && (
            <button
              onClick={() => onPurchase(vehicle)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Reserve Vehicle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
