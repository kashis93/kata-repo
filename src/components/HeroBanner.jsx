import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Layers, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { motion } from 'motion/react';
import heroVideo from '../herosection.mp4';

export const HeroBanner = ({ onOpen3DStage, onOpenVideoStudio }) => {
  const bgVideoRef = useRef(null);
  const [isBgMuted, setIsBgMuted] = useState(false);
  const [isBgPlaying, setIsBgPlaying] = useState(true);

  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = false;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsBgPlaying(true);
          setIsBgMuted(false);
        })
        .catch((err) => {
          console.warn('Unmuted autoplay prevented by browser policy, fallback to muted autoplay:', err);
          video.muted = true;
          setIsBgMuted(true);
          video.play().then(() => setIsBgPlaying(true)).catch(() => {});

          const enableAudioOnUserInteraction = () => {
            if (bgVideoRef.current) {
              bgVideoRef.current.muted = false;
              setIsBgMuted(false);
            }
            window.removeEventListener('click', enableAudioOnUserInteraction);
            window.removeEventListener('keydown', enableAudioOnUserInteraction);
            window.removeEventListener('touchstart', enableAudioOnUserInteraction);
          };

          window.addEventListener('click', enableAudioOnUserInteraction);
          window.addEventListener('keydown', enableAudioOnUserInteraction);
          window.addEventListener('touchstart', enableAudioOnUserInteraction);
        });
    }
  }, []);

  const toggleBgPlay = () => {
    if (!bgVideoRef.current) return;
    if (isBgPlaying) {
      bgVideoRef.current.pause();
      setIsBgPlaying(false);
    } else {
      bgVideoRef.current.play().then(() => setIsBgPlaying(true)).catch(() => {});
    }
  };

  const toggleBgMute = () => {
    if (!bgVideoRef.current) return;
    const nextMuted = !isBgMuted;
    bgVideoRef.current.muted = nextMuted;
    setIsBgMuted(nextMuted);
  };

  return (
    <div className="relative w-full overflow-hidden text-white min-h-[90vh] sm:min-h-[92vh] flex items-center justify-center border-b border-[#E5DCCF]/20 bg-[#120E13]">

      {/* Ultra-HD Hardware Accelerated Background Video */}
      <video
        ref={bgVideoRef}
        src={heroVideo}
        autoPlay
        loop
        playsInline
        preload="auto"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
        className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-105 contrast-105"
      />

      {/* Crystal Clear Light Overlay Gradient to ensure max video visibility & sharp text contrast */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#120E13]/85 via-black/20 to-[#120E13]/40" />
      <div className="absolute inset-0 z-[1] bg-black/15 pointer-events-none" />

      {/* Subtle Luxury Ambient Lighting Accent */}
      <div className="absolute inset-0 w-full h-full z-[2] pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#8B5A2B]/15 blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-[#D4AF37]/10 blur-[160px]" />
      </div>

      {/* Hero Central Content Container */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-6 sm:px-10 lg:px-12 py-16 text-center flex flex-col items-center justify-center space-y-8">

        {/* Top Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#120E13]/80 border border-[#D4AF37]/60 backdrop-blur-xl shadow-lg shadow-black/70"
        >
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <span className="text-xs font-mono font-bold text-[#F5E6C8] uppercase tracking-widest">
            OFFICIAL AUTOLOT GALLERY SHOWROOM
          </span>
        </motion.div>

        {/* Main Heading with High-Contrast Shadows & Matched Palette */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[1.05] uppercase text-white select-none max-w-4xl drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]"
        >
          <span>EXPERIENCE </span>
          <span className="bg-gradient-to-r from-[#F5E6C8] via-[#D4AF37] to-[#8B5A2B] bg-clip-text text-transparent inline-block drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]">
            CURATED LUXURY.
          </span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-base sm:text-lg text-white font-sans font-semibold leading-relaxed max-w-2xl drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]"
        >
          Hand-selected certified supercars with factory Monroney specs & 3D virtual perspective stage.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="pt-4 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => {
              const el = document.getElementById('cinema-deck') || document.getElementById('inventory-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8B5A2B] via-[#D4AF37] to-[#6E4520] hover:from-[#D4AF37] hover:to-[#8B5A2B] text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 flex items-center gap-3 font-sans overflow-hidden border border-[#D4AF37]/60"
          >
            <span className="relative z-10">BROWSE 3D PORTFOLIO</span>
            <ArrowRight className="relative z-10 w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
          </button>

          <button
            onClick={() => {
              if (onOpen3DStage) {
                onOpen3DStage();
              } else {
                const el = document.getElementById('cinema-deck');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-7 py-4 rounded-2xl bg-[#120E13]/85 hover:bg-[#120E13] backdrop-blur-xl border border-[#D4AF37]/60 text-[#F5E6C8] hover:text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 flex items-center gap-2.5 font-sans"
          >
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>LAUNCH 3D SHOWROOM</span>
          </button>
        </motion.div>

      </div>

      {/* Floating Bottom-Right Video Play/Pause & Sound Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 bg-[#120E13]/85 border border-[#D4AF37]/40 p-2 rounded-full backdrop-blur-xl shadow-2xl">
        <button
          type="button"
          onClick={toggleBgPlay}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          title={isBgPlaying ? "Pause Video" : "Play Video"}
        >
          {isBgPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
        </button>

        <button
          type="button"
          onClick={toggleBgMute}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          title={isBgMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isBgMuted ? <VolumeX className="w-4 h-4 text-[#D4AF37]" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
        </button>
      </div>

    </div>
  );
};

export default HeroBanner;


