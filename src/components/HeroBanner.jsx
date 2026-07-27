import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Layers, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { motion } from 'motion/react';
import heroVideo from '../herosection.mp4';

export const HeroBanner = ({ onOpen3DStage, onOpenVideoStudio }) => {
  const bgVideoRef = useRef(null);
  const [isBgMuted, setIsBgMuted] = useState(false); // Try unmuted by default
  const [isBgPlaying, setIsBgPlaying] = useState(true);

  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    // Set high quality rendering attributes
    video.currentTime = 0;
    video.muted = false; // Enable audio with video start

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsBgPlaying(true);
          setIsBgMuted(false);
        })
        .catch((err) => {
          console.warn('Unmuted autoplay prevented by browser policy, attempting muted fallback until first user interaction:', err);
          // Fallback to muted playback if browser blocks unmuted autoplay on load
          video.muted = true;
          setIsBgMuted(true);
          video.play().then(() => setIsBgPlaying(true)).catch(() => {});

          // Unmute automatically on first user click anywhere on page
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
    <div className="relative w-full overflow-hidden text-white min-h-[90vh] sm:min-h-[92vh] flex items-center justify-center border-b border-red-950/40 bg-black">

      {/* Crisp Ultra-HD Video Background */}
      <video
        ref={bgVideoRef}
        src={heroVideo}
        autoPlay
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-105 contrast-105 scale-[1.01]"
      />

      {/* Clean Subtle Overlay Gradients (Preserving high-definition video clarity) */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/25 to-black/50" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/50 via-transparent to-black/50" />

      {/* Ambient Lighting Accents */}
      <div className="absolute inset-0 w-full h-full z-[2] pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-red-600/15 blur-[180px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[160px]" />
      </div>

      {/* Hero Central Content Container */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-6 sm:px-10 lg:px-12 py-16 text-center flex flex-col items-center justify-center space-y-8">

        {/* Top Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/60 border border-red-500/40 backdrop-blur-xl shadow-lg shadow-red-950/40"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
            OFFICIAL AUTOLOT GALLERY SHOWROOM
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[1.05] uppercase text-white select-none max-w-4xl"
          style={{
            textShadow: '0 10px 30px rgba(0,0,0,0.9), 0 4px 15px rgba(239, 68, 68, 0.6), 0 0 60px rgba(245, 158, 11, 0.35)'
          }}
        >
          <span>EXPERIENCE </span>
          <span
            className="bg-gradient-to-r from-red-500 via-amber-300 to-amber-400 bg-clip-text text-transparent inline-block"
            style={{
              filter: 'drop-shadow(0px 8px 25px rgba(239, 68, 68, 0.6)) drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.9))'
            }}
          >
            CURATED LUXURY.
          </span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-base sm:text-lg text-slate-200 font-sans font-medium leading-relaxed max-w-2xl drop-shadow-md"
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
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_0_35px_rgba(239,68,68,0.7)] hover:shadow-[0_0_55px_rgba(239,68,68,0.95)] hover:scale-105 active:scale-95 flex items-center gap-3 font-sans overflow-hidden border border-red-400/60"
          >
            <span className="relative z-10">BROWSE 3D PORTFOLIO</span>
            <ArrowRight className="relative z-10 w-4 h-4 text-amber-200 group-hover:translate-x-1.5 transition-transform" />
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
            className="px-7 py-4 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-amber-500/50 text-amber-300 hover:text-amber-200 font-extrabold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 flex items-center gap-2.5 font-sans"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>LAUNCH 3D SHOWROOM</span>
          </button>
        </motion.div>

      </div>

      {/* Floating Bottom-Right Video Play/Pause & Sound Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 bg-black/70 border border-white/20 p-2 rounded-full backdrop-blur-xl shadow-2xl">
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
          {isBgMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
        </button>
      </div>

    </div>
  );
};

export default HeroBanner;
