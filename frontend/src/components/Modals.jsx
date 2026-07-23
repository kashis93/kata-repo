import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, CheckCircle2, Heart, ArrowLeftRight, Printer, Sparkles, Compass, Play, Pause, Loader2, ExternalLink, RefreshCw, ShieldCheck, AlertCircle, Film, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react';
import { searchSketchfabCarModel } from '../services/sketchfabService.js';
import { getVehicleImage } from '../services/carImageService.js';
import { getVehicleVideoUrl } from '../services/videoService.js';
import { api } from '../services/api.js';

// ============================================================
// 1. Sketchfab 3D CAD Viewer Component
// ============================================================
export const Sketchfab3DViewer = ({ vehicle, make, model, onFallbackToProcedural, onPurchase }) => {
  const [sketchfabModel, setSketchfabModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [error, setError] = useState(false);

  const carMake = vehicle ? vehicle.make : make;
  const carModel = vehicle ? vehicle.model : model;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setIframeLoaded(false);
    setError(false);

    searchSketchfabCarModel(carMake, carModel)
      .then((res) => {
        if (!isMounted) return;
        if (res) {
          setSketchfabModel(res);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [carMake, carModel]);

  if (loading) {
    return (
      <div className="relative aspect-video w-full rounded-2xl bg-[#F2EBE1] border border-[#E5DCCF] flex flex-col items-center justify-center p-6 text-center shadow-xs">
        <Loader2 className="w-8 h-8 text-[#8B5A2B] animate-spin mb-2" />
        <div className="text-xs font-bold text-[#1F1813] font-display">Initializing 3D Viewport Engine...</div>
        <div className="text-[11px] text-[#6B5E52] font-sans mt-1">Loading 3D CAD mesh for {carMake} {carModel}</div>
      </div>
    );
  }

  if (error || !sketchfabModel) {
    return <RealCarTurntable3D vehicle={vehicle} make={carMake} model={carModel} autoRotateDefault={true} onPurchase={onPurchase} />;
  }

  return (
    <div className="relative w-full rounded-2xl bg-[#F2EBE1] border border-[#E5DCCF] overflow-hidden shadow-xs flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-white/90 border-b border-[#E5DCCF] text-xs font-sans text-[#6B5E52]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3F7A5B] animate-ping" />
          <span className="font-bold text-[#1F1813] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#8B5A2B]" /> Interactive 3D Model
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#6B5E52] font-medium">
          <span className="hidden sm:inline">Drag to rotate • Scroll to zoom • Right-click to pan</span>
          {onFallbackToProcedural && (
            <button
              onClick={onFallbackToProcedural}
              className="text-[#8B5A2B] hover:text-[#6E4520] underline font-sans text-xs flex items-center gap-1 cursor-pointer font-bold"
            >
              <RefreshCw className="w-3 h-3 text-[#8B5A2B]" /> Studio View
            </button>
          )}
        </div>
      </div>

      <div className="relative aspect-video w-full bg-[#E5DCCF]">
        {!iframeLoaded && (
          <div className="absolute inset-0 z-10 bg-[#F2EBE1] flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 text-[#8B5A2B] animate-spin mb-2" />
            <span className="text-xs text-[#6B5E52] font-sans font-medium">Initializing 3D Engine...</span>
          </div>
        )}
        <iframe
          title={sketchfabModel.name}
          src={sketchfabModel.embedUrl}
          onLoad={() => setIframeLoaded(true)}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; xr-spatial-tracking; vr"
          allowFullScreen
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-white/95 border-t border-[#E5DCCF] text-[11px] text-[#6B5E52]">
        <div className="truncate max-w-[70%] font-medium">
          <span className="text-[#1F1813] font-bold">{sketchfabModel.name}</span> by{' '}
          <a href={sketchfabModel.user?.profileUrl} target="_blank" rel="noopener noreferrer" className="text-[#8B5A2B] hover:underline font-bold">
            {sketchfabModel.user?.username}
          </a>
        </div>
        <a href={sketchfabModel.viewerUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#8B5A2B] font-bold flex items-center gap-1">
          Sketchfab <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

// ============================================================
// 2. Real Car 360° Studio Turntable Viewer Component
// ============================================================
const ROTATION_ANGLES = [
  { code: '01', label: '3/4 Front' },
  { code: '05', label: 'Front Facing' },
  { code: '09', label: '3/4 Front Right' },
  { code: '13', label: 'Side Profile' },
  { code: '17', label: 'Rear Right' },
  { code: '21', label: 'Rear Facing' },
  { code: '25', label: 'Rear Left' },
  { code: '29', label: 'Side Profile Left' }
];

export const RealCarTurntable3D = ({ vehicle, make = 'Porsche', model = '911 GT3 RS', autoRotateDefault = true, onPurchase }) => {
  const [angleIdx, setAngleIdx] = useState(0);
  const [isRotating, setIsRotating] = useState(autoRotateDefault);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const activeVehicleMake = vehicle ? vehicle.make : make;
  const activeVehicleModel = vehicle ? vehicle.model : model;

  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setAngleIdx((prev) => (prev + 1) % ROTATION_ANGLES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isRotating]);

  const currentAngle = ROTATION_ANGLES[angleIdx];
  const imageUrl = getVehicleImage(
    activeVehicleMake,
    activeVehicleModel,
    vehicle ? vehicle.imageUrl : undefined,
    currentAngle.code
  );

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsRotating(false);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 35) {
      if (deltaX > 0) {
        setAngleIdx((prev) => (prev + 1) % ROTATION_ANGLES.length);
      } else {
        setAngleIdx((prev) => (prev - 1 + ROTATION_ANGLES.length) % ROTATION_ANGLES.length);
      }
      startXRef.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative aspect-video w-full rounded-2xl bg-[#F8F4EC] border border-[#E5DCCF] overflow-hidden flex flex-col justify-between p-3 select-none group">
      <div className="flex items-center justify-between z-10 bg-white/90 border border-[#E5DCCF] px-4 py-2 rounded-full backdrop-blur-md text-xs font-sans text-[#1F1813]">
        <span className="font-bold flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#8B5A2B]" /> 360° Turntable: {activeVehicleMake} {activeVehicleModel}
        </span>
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
            isRotating ? 'bg-[#8B5A2B] text-white' : 'bg-[#F2EBE1] text-[#1F1813]'
          }`}
        >
          {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-[#8B5A2B]" />}
          <span>{isRotating ? 'Pause 360' : 'Auto Rotate'}</span>
        </button>
      </div>

      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative flex-1 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing my-2"
      >
        <img
          src={imageUrl}
          alt={`${activeVehicleMake} ${activeVehicleModel}`}
          className="max-h-[85%] w-auto object-contain filter drop-shadow-md transition-all duration-300"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="w-3/4 h-3 bg-black/10 blur-md rounded-full -mt-2" />
        <div className="absolute bottom-2 text-[10px] text-[#6B5E52] font-sans font-medium bg-white/80 px-3 py-1 rounded-full border border-[#E5DCCF] opacity-0 group-hover:opacity-100 transition-opacity">
          Drag horizontally to spin 360° • Angle: {currentAngle.label}
        </div>
      </div>

      <div className="flex items-center justify-between z-10 bg-white/90 border border-[#E5DCCF] px-4 py-2 rounded-full backdrop-blur-md text-xs font-sans">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {ROTATION_ANGLES.map((ang, idx) => (
            <button
              key={ang.code}
              onClick={() => {
                setIsRotating(false);
                setAngleIdx(idx);
              }}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                angleIdx === idx ? 'bg-[#8B5A2B] text-white font-extrabold' : 'text-[#6B5E52] hover:text-[#1F1813]'
              }`}
            >
              {ang.label}
            </button>
          ))}
        </div>

        {vehicle && onPurchase && (
          <button
            onClick={() => onPurchase(vehicle)}
            className="px-4 py-1.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-full cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Reserve Model</span>
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================
// 3. Dedicated Full 360° Video Studio Showcase Modal
// ============================================================
export const VideoShowcaseModal = ({
  vehicles = [],
  initialVehicle = null,
  isOpen,
  onClose,
  onPurchase
}) => {
  const [activeVehicle, setActiveVehicle] = useState(initialVehicle || vehicles[0] || null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef(null);

  useEffect(() => {
    if (initialVehicle) {
      setActiveVehicle(initialVehicle);
    } else if (vehicles.length > 0 && !activeVehicle) {
      setActiveVehicle(vehicles[0]);
    }
  }, [initialVehicle, vehicles]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  if (!isOpen || !activeVehicle) return null;

  const videoUrl = getVehicleVideoUrl(activeVehicle.make, activeVehicle.model);
  const fallbackImg = getVehicleImage(activeVehicle.make, activeVehicle.model, activeVehicle.imageUrl, '01');

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleResetLoop = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#F8F4EC] border border-[#E5DCCF] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5DCCF]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F2EBE1] text-[#8B5A2B]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-sans text-[#6B5E52] uppercase font-bold tracking-widest block">
                360° HIGH-DEFINITION VIDEO STUDIO
              </span>
              <h2 className="text-lg font-bold text-[#1F1813] font-display">
                {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-[#F2EBE1] text-[#1F1813] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player & Reel Switcher */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Main Video Screen */}
          <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-[#E5DCCF] shadow-lg group">
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
              poster={fallbackImg}
            />

            {/* Floating Top Reel Info */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-mono text-amber-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>STUDIO LOOP: {activeVehicle.make} {activeVehicle.model}</span>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
                </button>
                <button onClick={toggleMute} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer">
                  {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                </button>
                <button onClick={handleResetLoop} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 cursor-pointer" title="Restart Reel">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Playback Speed Selector */}
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-400">Speed:</span>
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackRate(rate)}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      playbackRate === rate ? 'bg-[#8B5A2B] text-white font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Reel Switcher Bar */}
          <div className="space-y-2 font-sans">
            <span className="text-xs font-bold text-[#6B5E52] uppercase tracking-wider block">Available 360° Studio Video Reels:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {vehicles.map((v) => {
                const isSelected = activeVehicle.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setActiveVehicle(v);
                      setIsPlaying(true);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] shadow-md font-bold'
                        : 'bg-white hover:bg-[#F2EBE1] text-[#1F1813] border-[#E5DCCF]'
                    }`}
                  >
                    <div className="text-[10px] opacity-80 uppercase font-mono">{v.year} {v.make}</div>
                    <div className="text-xs font-display truncate">{v.model}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Reserve Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onPurchase(activeVehicle);
              }}
              className="w-full py-3.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Reserve {activeVehicle.make} {activeVehicle.model} For ${activeVehicle.price.toLocaleString()}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

// ============================================================
// 4. Interactive 3D Showroom Modal Component
// ============================================================
export const ThreeCarShowroom = ({ vehicle, onClose, onPurchase }) => {
  const [viewMode, setViewMode] = useState('sketchfab');

  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#F8F4EC] border border-[#E5DCCF] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5DCCF]">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#8B5A2B]" />
            <h2 className="text-xl font-bold text-[#1F1813] font-display">{vehicle.year} {vehicle.make} {vehicle.model}</h2>
          </div>

          <div className="flex items-center gap-2 bg-[#F2EBE1] p-1 rounded-full border border-[#E5DCCF]">
            <button
              onClick={() => setViewMode('sketchfab')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'sketchfab' ? 'bg-[#8B5A2B] text-white' : 'text-[#6B5E52]'
              }`}
            >
              3D CAD Mesh
            </button>
            <button
              onClick={() => setViewMode('real_photo_360')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'real_photo_360' ? 'bg-[#8B5A2B] text-white' : 'text-[#6B5E52]'
              }`}
            >
              Real Photo 360°
            </button>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F2EBE1] text-[#1F1813] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-hidden">
          {viewMode === 'sketchfab' ? (
            <Sketchfab3DViewer make={vehicle.make} model={vehicle.model} onFallbackToProcedural={() => setViewMode('real_photo_360')} />
          ) : (
            <RealCarTurntable3D vehicle={vehicle} make={vehicle.make} model={vehicle.model} onPurchase={onPurchase} />
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 5. Vehicle Detail Modal Component with Interactive Angle Switching
// ============================================================
export const VehicleDetailModal = ({ vehicle, isOpen, onClose, onPurchase, onInspect3D, isSaved, onToggleSave, isCompared, onToggleCompare, onOpenPrintSticker }) => {
  const [selectedAngle, setSelectedAngle] = useState('01');

  if (!isOpen || !vehicle) return null;

  const currentImageUrl = getVehicleImage(vehicle.make, vehicle.model, vehicle.imageUrl, selectedAngle);

  const angles = [
    { code: '01', label: '3/4 Front' },
    { code: '13', label: 'Side Profile' },
    { code: '21', label: 'Rear 3/4' },
    { code: '09', label: 'Direct Facing' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#F8F4EC] border border-[#E5DCCF] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5DCCF]">
          <span className="text-xs font-mono font-bold text-[#6B5E52] uppercase">FACTORY SPECIFICATION SHEET • VIN: {vehicle.vin}</span>
          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button onClick={() => onToggleSave(vehicle.id)} className="p-2 rounded-full border border-[#E5DCCF] bg-white cursor-pointer" title="Save Favorite">
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#B2543C] text-[#B2543C]' : 'text-[#6B5E52]'}`} />
              </button>
            )}
            {onToggleCompare && (
              <button onClick={() => onToggleCompare(vehicle.id)} className="p-2 rounded-full border border-[#E5DCCF] bg-white text-[#6B5E52] cursor-pointer" title="Compare Model">
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-full border border-[#E5DCCF] bg-white text-[#1F1813] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="relative aspect-video w-full rounded-2xl bg-[#E5DCCF] overflow-hidden border border-[#E5DCCF] group">
            <img
              src={currentImageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80';
              }}
            />

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-[#E5DCCF] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
              {angles.map((ang) => (
                <button
                  key={ang.code}
                  onClick={() => setSelectedAngle(ang.code)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedAngle === ang.code ? 'bg-[#8B5A2B] text-white shadow-xs' : 'text-[#6B5E52] hover:text-[#1F1813]'
                  }`}
                >
                  {ang.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onClose();
                onInspect3D(vehicle);
              }}
              className="absolute top-3 left-3 px-4 py-2 bg-[#8B5A2B] text-white hover:bg-[#6E4520] rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-1.5 cursor-pointer font-sans shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Launch 3D CAD Stage</span>
            </button>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-[#E5DCCF]">
            <div>
              <span className="text-xs font-mono text-[#8B5A2B] uppercase font-bold">{vehicle.make}</span>
              <h1 className="text-3xl font-bold text-[#1F1813] font-display">{vehicle.year} {vehicle.model}</h1>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#6B5E52] uppercase font-bold block">MANUFACTURER MSRP</span>
              <span className="text-3xl font-bold text-[#1F1813] font-display">${vehicle.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-[#E5DCCF] rounded-xl">
              <span className="text-[10px] text-[#6B5E52] uppercase font-bold block">Horsepower</span>
              <span className="text-base font-bold text-[#1F1813]">{vehicle.horsepower} HP</span>
            </div>
            <div className="p-3 bg-white border border-[#E5DCCF] rounded-xl">
              <span className="text-[10px] text-[#6B5E52] uppercase font-bold block">Top Speed</span>
              <span className="text-base font-bold text-[#1F1813]">{vehicle.topSpeed} mph</span>
            </div>
            <div className="p-3 bg-white border border-[#E5DCCF] rounded-xl">
              <span className="text-[10px] text-[#6B5E52] uppercase font-bold block">Powertrain</span>
              <span className="text-base font-bold text-[#1F1813]">{vehicle.fuelType}</span>
            </div>
            <div className="p-3 bg-white border border-[#E5DCCF] rounded-xl">
              <span className="text-[10px] text-[#6B5E52] uppercase font-bold block">Transmission</span>
              <span className="text-base font-bold text-[#1F1813]">{vehicle.transmission}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F1813]">Factory Installed Options</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
              {(vehicle.features || []).map((feat, idx) => (
                <div key={idx} className="p-2.5 bg-white border border-[#E5DCCF] rounded-xl flex items-center gap-2 text-[#1F1813]">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7A5B] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5DCCF] flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onPurchase(vehicle);
              }}
              className="w-full sm:flex-1 py-3.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Reserve Model For ${vehicle.price.toLocaleString()}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

// ============================================================
// 6. Vehicle Side-by-Side Compare Modal Component
// ============================================================
export const VehicleCompareModal = ({ vehicles, isOpen, onClose, onRemoveVehicle, onPurchase }) => {
  if (!isOpen || !vehicles || vehicles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#F8F4EC] border border-[#E5DCCF] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5DCCF]">
          <h2 className="text-lg font-bold text-[#1F1813] font-display flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-[#8B5A2B]" />
            Side-by-Side Model Comparison ({vehicles.length}/3)
          </h2>
          <button onClick={onClose} className="p-2 rounded-full border border-[#E5DCCF] text-[#1F1813] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          <div className="grid grid-cols-4 gap-4 min-w-[700px]">
            <div className="font-bold text-xs text-[#6B5E52] space-y-6 pt-24">
              <div>Price (MSRP)</div>
              <div>Power (HP)</div>
              <div>Top Speed</div>
              <div>Body Style</div>
              <div>Powertrain</div>
              <div>Transmission</div>
            </div>

            {vehicles.map((v) => (
              <div key={v.id} className="bg-white border border-[#E5DCCF] rounded-2xl p-4 space-y-4 text-xs">
                <div className="relative">
                  <button onClick={() => onRemoveVehicle(v.id)} className="absolute top-0 right-0 p-1 text-[#6B5E52] hover:text-[#B2543C]">
                    <X className="w-4 h-4" />
                  </button>
                  <img src={getVehicleImage(v.make, v.model, v.imageUrl, '01')} alt={v.model} className="h-20 w-auto mx-auto object-contain mb-2" />
                  <div className="font-bold text-[#1F1813] font-display text-sm">{v.year} {v.make} {v.model}</div>
                </div>

                <div className="font-bold text-[#8B5A2B] text-base">${v.price.toLocaleString()}</div>
                <div className="font-bold text-[#1F1813]">{v.horsepower} HP</div>
                <div className="font-bold text-[#1F1813]">{v.topSpeed} mph</div>
                <div className="font-bold text-[#1F1813]">{v.bodyType}</div>
                <div className="font-bold text-[#1F1813]">{v.fuelType}</div>
                <div className="font-bold text-[#1F1813]">{v.transmission}</div>

                <button
                  onClick={() => { onClose(); onPurchase(v); }}
                  className="w-full py-2 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Reserve Model
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 7. Monroney Factory Window Sticker Modal Component
// ============================================================
export const MonroneyStickerModal = ({ vehicle, isOpen, onClose }) => {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-[#E5DCCF] rounded-3xl shadow-2xl overflow-hidden p-6 max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-[#E5DCCF] pb-4 mb-4">
          <span className="font-mono text-xs font-bold text-[#8B5A2B]">OFFICIAL MONRONEY FACTORY WINDOW STICKER</span>
          <button onClick={onClose} className="p-2 rounded-full bg-[#F8F4EC] text-[#1F1813] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-2 border-[#1F1813] p-6 space-y-6 font-mono text-xs text-[#1F1813]">
          <div className="flex justify-between items-center border-b-2 border-[#1F1813] pb-4">
            <div>
              <h1 className="text-xl font-bold font-display uppercase">{vehicle.make} {vehicle.model}</h1>
              <p className="text-[10px] text-[#6B5E52]">MODEL YEAR: {vehicle.year} • VIN: {vehicle.vin}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] block">TOTAL MSRP</span>
              <span className="text-2xl font-bold">${vehicle.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold border-b border-[#1F1813] pb-1 mb-2">STANDARD EQUIPMENT</h4>
              <ul className="text-[11px] space-y-1 text-[#6B5E52]">
                <li>• {vehicle.horsepower} HP Engine Package</li>
                <li>• {vehicle.transmission} Transmission</li>
                <li>• {vehicle.fuelType} Powertrain System</li>
                <li>• Top Speed: {vehicle.topSpeed} mph</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold border-b border-[#1F1813] pb-1 mb-2">FACTORY PACKAGES</h4>
              <ul className="text-[11px] space-y-1 text-[#6B5E52]">
                {(vehicle.features || []).map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 8. Purchase / Reservation Checkout Modal Component
// ============================================================
export const PurchaseModal = ({ vehicle, isOpen, onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !vehicle) return null;

  const displayImageUrl = getVehicleImage(vehicle.make, vehicle.model, vehicle.imageUrl, '01');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await api.recordPurchase(vehicle.id, customerName, customerEmail, customerPhone);
      setIsSubmitting(false);
      setIsConfirmed(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to complete reservation');
    }
  };

  const handleCloseAll = () => {
    setIsConfirmed(false);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#F8F4EC] border border-[#E5DCCF] rounded-3xl shadow-2xl overflow-hidden my-8">
        
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5DCCF]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F2EBE1] text-[#8B5A2B]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-sans text-[#6B5E52] uppercase font-bold tracking-widest block">
                AUTOLOT DIRECT ALLOCATION
              </span>
              <h2 className="text-lg font-bold text-[#1F1813] font-display">
                {isConfirmed ? 'Reservation Confirmed!' : `Reserve ${vehicle.year} ${vehicle.make}`}
              </h2>
            </div>
          </div>
          <button onClick={handleCloseAll} className="p-2 rounded-full bg-[#F2EBE1] text-[#1F1813] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isConfirmed ? (
          <div className="p-8 text-center space-y-4 font-sans">
            <div className="w-16 h-16 rounded-full bg-[#EAF2ED] border border-[#3F7A5B] text-[#3F7A5B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold text-[#1F1813] font-display">
              Vehicle Successfully Reserved
            </h3>

            <p className="text-xs text-[#6B5E52] max-w-sm mx-auto leading-relaxed">
              Congratulations <strong>{customerName}</strong>! Your allocation for the <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong> (${vehicle.price.toLocaleString()}) has been saved. Our senior concierge will contact you shortly at <strong>{customerPhone}</strong>.
            </p>

            <div className="p-4 bg-white border border-[#E5DCCF] rounded-2xl text-left text-xs font-sans space-y-1 text-[#1F1813]">
              <div className="font-bold font-display">Reservation Details:</div>
              <div>VIN: <span className="font-mono">{vehicle.vin}</span></div>
              <div>Customer Email: {customerEmail}</div>
              <div>Delivering Concierge: AutoLot Direct Logistics</div>
            </div>

            <button onClick={handleCloseAll} className="w-full py-3.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">
              Return to Gallery Showroom
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 font-sans">
            <div className="flex items-center gap-4 p-3.5 bg-white border border-[#E5DCCF] rounded-2xl">
              <img src={displayImageUrl} alt={`${vehicle.make} ${vehicle.model}`} className="w-20 h-14 object-cover rounded-xl bg-[#E5DCCF] border border-[#E5DCCF] shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#1F1813] font-display">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                <div className="text-xs text-[#8B5A2B] font-extrabold font-display">${vehicle.price.toLocaleString()} MSRP</div>
                <div className="text-[10px] text-[#6B5E52] font-mono">VIN: {vehicle.vin}</div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-[#FBEAE5] border border-[#B2543C] text-[#B2543C] text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-sans uppercase text-[#6B5E52] block mb-1 font-bold">Full Legal Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Alexander Vance"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-sans uppercase text-[#6B5E52] block mb-1 font-bold">Email Address *</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="alexander@autolot.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-sans uppercase text-[#6B5E52] block mb-1 font-bold">Phone Number *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 019-2831"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5DCCF] rounded-xl text-xs text-[#1F1813] focus:outline-none focus:border-[#8B5A2B] font-medium"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#8B5A2B] hover:bg-[#6E4520] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Concierge Reservation...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Confirm & Lock Allocation</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
