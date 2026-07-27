import React, { useState, useEffect } from 'react';
import { PROJECTS } from '../data/projects';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Layers,
  Zap,
  Gauge,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';
import { playTick, playWoosh } from '../utils/audio';
import { formatINRLakhCrore } from '../utils/formatters';

export const Carousel3D = ({
  selectedCategory = 'all',
  onSelectProject,
  onOpenBooking
}) => {
  const filteredProjects = PROJECTS.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    if (!isAutoScrolling || filteredProjects.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoScrolling, filteredProjects.length]);

  const handleNext = () => {
    playWoosh();
    setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrev = () => {
    playWoosh();
    setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  if (filteredProjects.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      id="cinema-deck"
      className="py-6 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden text-slate-100"
      onMouseEnter={() => setIsAutoScrolling(false)}
      onMouseLeave={() => setIsAutoScrolling(true)}
    >
      
      {/* Clean Header - Just 3D SHOWCASE */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight uppercase text-white">
          <span className="bg-gradient-to-r from-red-500 via-amber-400 to-red-400 bg-clip-text text-transparent drop-shadow-md">3D SHOWCASE</span>
        </h2>
      </div>

      {/* 3D Stage Container */}
      <div className="relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center py-4" style={{ perspective: '1200px' }}>
        
        {/* Glowing Red-Amber Ambient Halo behind Center Card */}
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-red-600/30 to-amber-500/20 blur-[150px] pointer-events-none" />

        {/* Carousel Deck Cards */}
        <div className="relative w-full max-w-4xl flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {filteredProjects.map((project, index) => {
            let offset = index - currentIndex;
            if (offset < -Math.floor(filteredProjects.length / 2)) {
              offset += filteredProjects.length;
            } else if (offset > Math.floor(filteredProjects.length / 2)) {
              offset -= filteredProjects.length;
            }

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            // Derived specs for display
            const priceFormatted = formatINRLakhCrore(project.price || 35000000);
            const hpText = project.description.match(/\b\d{3,4}\s*HP\b/i)?.[0] || '650 HP';
            const speedText = project.duration === '1:12' ? '0-60 in 2.0s' : '0-60 in 2.8s';

            return (
              <motion.div
                key={project.id}
                initial={false}
                animate={{
                  x: offset * (typeof window !== 'undefined' && window.innerWidth < 640 ? 150 : 270),
                  scale: isCenter ? 1 : 0.82 - Math.abs(offset) * 0.1,
                  rotateY: offset * -28,
                  translateZ: isCenter ? 0 : -Math.abs(offset) * 130,
                  zIndex: 30 - Math.abs(offset) * 10,
                  opacity: isCenter ? 1 : 0.55 - Math.abs(offset) * 0.15,
                }}
                whileHover={{
                  scale: isCenter ? 1.04 : 0.86,
                  y: isCenter ? -10 : -4,
                  transition: { type: 'spring', stiffness: 350, damping: 22 }
                }}
                whileTap={{ scale: isCenter ? 0.98 : 0.8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                onClick={() => {
                  if (isCenter) {
                    playWoosh();
                    if (onSelectProject) onSelectProject(project);
                  } else {
                    playTick();
                    setCurrentIndex(index);
                  }
                }}
                className={`absolute w-full max-w-[320px] sm:max-w-[400px] h-[440px] rounded-3xl bg-[#120E13] border transition-all duration-300 cursor-pointer overflow-hidden shadow-2xl flex flex-col justify-between ${
                  isCenter
                    ? 'border-red-500 shadow-[0_0_45px_rgba(239,68,68,0.45)] ring-2 ring-red-500/50'
                    : 'border-red-950/70 opacity-75 hover:opacity-95 hover:border-red-600/50'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Media Header Section */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <video
                    src={project.previewVideoUrl}
                    poster={project.thumbnailUrl}
                    autoPlay={isCenter}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover filter brightness-95 contrast-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#120E13] via-transparent to-black/40 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-red-950/90 text-red-300 border border-red-500/40 backdrop-blur-md shadow-md">
                      {project.categoryLabel}
                    </span>

                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/80 text-amber-300 border border-amber-500/40 font-extrabold backdrop-blur-md">
                      {priceFormatted}
                    </span>
                  </div>

                  {/* Center Animated Crimson Play Overlay */}
                  {isCenter && (
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center z-10"
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.8)] border border-white/30 cursor-pointer">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Card Body & Technical Specs - Streamlined */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-[#120E13]">
                  <div className="space-y-2.5">
                    
                    {/* Make Header */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <img
                          src={project.clientAvatar}
                          alt={project.client}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover border border-red-500/40"
                        />
                        <span className="text-red-400 font-bold tracking-wider uppercase">{project.make || project.client}</span>
                      </div>
                    </div>

                    {/* Vehicle Title */}
                    <h3 className="text-lg font-black font-display text-white tracking-tight line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {project.title}
                    </h3>

                    {/* Technical Specs Metric Strip */}
                    <div className="grid grid-cols-2 gap-2 py-2 border-t border-red-950/60 text-[10px] font-mono">
                      <div className="flex flex-col items-center bg-[#1A131B] p-2 rounded-xl border border-red-900/30">
                        <span className="text-red-400 font-bold uppercase">POWER</span>
                        <div className="flex items-center gap-1 text-white font-extrabold mt-0.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>{hpText}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center bg-[#1A131B] p-2 rounded-xl border border-red-900/30">
                        <span className="text-red-400 font-bold uppercase">PERFORMANCE</span>
                        <div className="flex items-center gap-1 text-white font-extrabold mt-0.5">
                          <Gauge className="w-3.5 h-3.5 text-amber-400" />
                          <span>{speedText}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenBooking) onOpenBooking(project);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-red-900/40 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-200" />
                      <span>BOOK / RESERVE MODEL</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Red Theme Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 z-40 p-3.5 rounded-2xl bg-[#181017]/90 hover:bg-red-950/90 border border-red-500/40 text-white shadow-2xl backdrop-blur-md transition-all active:scale-95 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-amber-300" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-6 z-40 p-3.5 rounded-2xl bg-[#181017]/90 hover:bg-red-950/90 border border-red-500/40 text-white shadow-2xl backdrop-blur-md transition-all active:scale-95 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 text-amber-300" />
        </button>

      </div>

      {/* Pagination Counter */}
      <div className="flex items-center justify-center gap-2 mt-2 font-mono text-xs font-bold text-slate-400">
        <span className="text-red-400">{currentIndex + 1}</span>
        <span>/</span>
        <span>{filteredProjects.length}</span>
      </div>

    </motion.section>
  );
};

export default Carousel3D;
