import React, { useState, useEffect } from 'react';
import { searchSketchfabCarModel, SketchfabModel } from '../services/sketchfabService';
import { RealCarTurntable3D } from './RealCarTurntable3D';
import { Loader2, Box, ExternalLink, RefreshCw, Sparkles, Compass, AlertCircle } from 'lucide-react';

interface Sketchfab3DViewerProps {
  make: string;
  model: string;
  category?: string;
  onFallbackToProcedural?: () => void;
}

export const Sketchfab3DViewer: React.FC<Sketchfab3DViewerProps> = ({
  make,
  model,
  onFallbackToProcedural
}) => {
  const [sketchfabModel, setSketchfabModel] = useState<SketchfabModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setIframeLoaded(false);
    setError(false);

    console.log(`[Sketchfab3DViewer] Querying Sketchfab Data API for vehicle: ${make} ${model}...`);
    searchSketchfabCarModel(make, model)
      .then((res) => {
        if (!isMounted) return;
        if (res) {
          console.log(`[Sketchfab3DViewer] Successfully matched 3D model: "${res.name}" (UID: ${res.uid}) by creator @${res.user.username}`);
          setSketchfabModel(res);
        } else {
          console.log(`[Sketchfab3DViewer] No direct Sketchfab match found for ${make} ${model}. Falling back to 3D Studio Stage.`);
          setError(true);
        }
      })
      .catch((err) => {
        console.warn(`[Sketchfab3DViewer] Error querying Sketchfab API:`, err);
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [make, model]);

  if (loading) {
    return (
      <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-blue-500/5 animate-pulse" />
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-3 z-10" />
        <div className="text-sm font-bold text-slate-200 z-10 font-display">
          Searching Sketchfab 3D API...
        </div>
        <div className="text-xs text-slate-400 font-mono mt-1 z-10">
          Querying 3D assets for {make} {model}
        </div>
      </div>
    );
  }

  if (error || !sketchfabModel) {
    return (
      <RealCarTurntable3D
        make={make}
        model={model}
        autoRotateDefault={true}
      />
    );
  }

  return (
    <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden group shadow-2xl flex flex-col">
      {/* 3D Embed Header & Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-slate-100 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" /> Interactive 3D Model
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden sm:inline">Drag to rotate • Scroll to zoom • Right-click to pan</span>
          {onFallbackToProcedural && (
            <button
              onClick={onFallbackToProcedural}
              className="text-amber-400 hover:text-amber-300 underline font-sans text-xs flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Studio View
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Viewport iframe */}
      <div className="relative aspect-video w-full bg-slate-950">
        {!iframeLoaded && (
          <div className="absolute inset-0 z-10 bg-slate-950 flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
            <span className="text-xs text-slate-400 font-mono">Initializing 3D Mesh Engine...</span>
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

      {/* Sketchfab CC License Attribution Footer (Required by Sketchfab Guidelines) */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/95 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="truncate max-w-[70%]">
          <span className="text-slate-200 font-medium">{sketchfabModel.name}</span> by{' '}
          <a
            href={sketchfabModel.user.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline inline-flex items-center gap-0.5 font-medium"
          >
            {sketchfabModel.user.username}
          </a>
          {sketchfabModel.license && (
            <span className="ml-1 text-slate-500 font-mono">({sketchfabModel.license.label})</span>
          )}
        </div>
        <a
          href={sketchfabModel.viewerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 shrink-0 font-medium"
        >
          Sketchfab <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
