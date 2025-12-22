"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { MapPin, ArrowLeft, X, Heart, Share2, Camera, Map as MapIcon, Film, Maximize2, ChevronLeft, ChevronRight, Play } from "lucide-react";

// --- TYPES ---
type Lane = -1 | 0 | 1;
type TripKind = "Work" | "Trip" | "Family" | "Study";

type Trip = {
  id: string;
  start: string;
  end: string;
  places: string;
  country: string;
  mood: string;
  accent: string;
  lane: Lane;
  kind: TripKind;
  coverUrl?: string; 
  gallery?: string[];
  description?: string;
  coordinates?: string;
};

type Stop = Trip & {
  x: number;
  y: number;
  year: number;
  dateLabel: string;
  durationDays: number;
};

/* --- Hooks --- */

function useViewport() {
  const [vw, setVw] = useState(1200);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { vw, vh };
}

function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width:${breakpointPx - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [breakpointPx]);

  return isMobile;
}

/* --- Utils --- */

function isVideo(url: string) {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

function iso(y: number, m: number, d: number) {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function parseISO(s: string) {
  const [Y, M, D] = s.split("-").map(Number);
  return Date.UTC(Y, (M ?? 1) - 1, D ?? 1, 12, 0, 0, 0);
}

function daysBetween(aISO: string, bISO: string) {
  const a = parseISO(aISO);
  const b = parseISO(bISO);
  const ms = Math.max(0, b - a);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

const MONTHS_FR = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDateRangeDeterministic(startISO: string, endISO: string, locale: string) {
  const s = new Date(parseISO(startISO));
  const e = new Date(parseISO(endISO));
  const months = locale === "fr" ? MONTHS_FR : MONTHS_EN;
  const sDay = String(s.getUTCDate()).padStart(2, "0");
  const eDay = String(e.getUTCDate()).padStart(2, "0");
  const sMon = months[s.getUTCMonth()];
  const eMon = months[e.getUTCMonth()];
  const sYear = s.getUTCFullYear();
  const eYear = e.getUTCFullYear();

  if (sYear === eYear) return `${sDay} ${sMon} → ${eDay} ${eMon} ${sYear}`;
  return `${sDay} ${sMon} ${sYear} → ${eDay} ${eMon} ${eYear}`;
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function flagFromCode(code: string) {
  const up = code.toUpperCase().trim();
  const map: Record<string, string> = {
    FR: "🇫🇷", ES: "🇪🇸", UK: "🇬🇧", US: "🇺🇸", CA: "🇨🇦", IE: "🇮🇪", GR: "🇬🇷",
  };
  if (up.includes("/")) {
    const parts = up.split("/").map((p) => p.trim());
    return parts.map((p) => map[p] ?? "🏳️").join(" ");
  }
  return map[up] ?? "🏳️";
}

function clampText2LinesStyle() {
  return {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  };
}

/* ---------- Badges & FX ---------- */

function kindStyles(kind: TripKind) {
  switch (kind) {
    case "Work": return { label: "WORK", ring: "rgba(255,255,255,0.16)", bg: "rgba(155,28,49,0.18)" };
    case "Family": return { label: "FAMILY", ring: "rgba(255,255,255,0.16)", bg: "rgba(108,30,128,0.18)" };
    case "Trip": return { label: "TRIP", ring: "rgba(255,255,255,0.16)", bg: "rgba(192,132,252,0.18)" };
    case "Study": default: return { label: "STUDY", ring: "rgba(255,255,255,0.16)", bg: "rgba(255,255,255,0.10)" };
  }
}

function KindBadge({ kind }: { kind: TripKind }) {
  const s = kindStyles(kind);
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-mono tracking-[0.34em] text-white/80"
      style={{
        borderColor: s.ring,
        background: `linear-gradient(90deg, ${s.bg}, rgba(0,0,0,0.14))`,
        backdropFilter: "blur(10px)",
      }}
    >
      <span className="h-[6px] w-[6px] rounded-full bg-white/65" />
      {s.label}
    </span>
  );
}

function Starfield({ density = 120 }: { density?: number }) {
  const stars = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => {
      const a = (i * 97) % 1000;
      const b = (i * 223) % 1000;
      const c = (i * 431) % 1000;
      const left = (a / 1000) * 100;
      const top = (b / 1000) * 100;
      const size = 1 + (c % 3);
      const baseOpacity = 0.05 + (c % 7) * 0.03;
      const dur = 4.4 + (c % 9) * 0.6;
      const delay = (c % 12) * 0.2;
      return { id: i, left, top, size, baseOpacity, dur, delay };
    });
  }, [density]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.baseOpacity,
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 0 10px rgba(255,255,255,0.10)",
            animation: `twinkle ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 opacity-[0.06] [background:radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.06),transparent_42%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.04),transparent_48%),radial-gradient(circle_at_55%_15%,rgba(155,28,49,0.06),transparent_54%),radial-gradient(circle_at_60%_85%,rgba(108,30,128,0.06),transparent_58%)]" />
    </div>
  );
}

function ShootingStars() {
  const shots = useMemo(() => [
    { id: 1, top: 22, left: 10, dur: 7.8, delay: 1.2, scale: 1.0, op: 0.10 },
    { id: 2, top: 64, left: 48, dur: 10.2, delay: 2.6, scale: 0.9, op: 0.09 },
  ], []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      {shots.map((s) => (
        <span
          key={s.id}
          className="absolute block h-[1px] w-[180px]"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            opacity: s.op,
            transform: `rotate(-18deg) scale(${s.scale})`,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.40), rgba(155,28,49,0.20), transparent)",
            filter: "blur(0.2px)",
            animation: `shoot ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- GALERIE CINÉMATOGRAPHIQUE + LIGHTBOX (Responsive) ---------- */

function PortfolioGalleryModal({ trip, onClose }: { trip: Stop; onClose: () => void }) {
    const flag = flagFromCode(trip.country);
    
    // Simulation de galerie
    const galleryImages = trip.gallery && trip.gallery.length > 0 
        ? trip.gallery 
        : Array(6).fill(trip.coverUrl);

    // --- LIGHTBOX STATE ---
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const nextImage = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((prev) => (prev! + 1) % galleryImages.length);
    }, [lightboxIndex, galleryImages.length]);

    const prevImage = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((prev) => (prev! - 1 + galleryImages.length) % galleryImages.length);
    }, [lightboxIndex, galleryImages.length]);

    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, nextImage, prevImage]);
  
    // Variants Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } },
        exit: { opacity: 0, transition: { duration: 0.4 } }
    };

    const heroImageVariants = {
        hidden: { scale: 1.1, opacity: 0 },
        visible: { 
            scale: 1, 
            opacity: 1,
            transition: { duration: 1.2, ease: "easeOut" }
        }
    };

    const lightLeakVariants = {
        initial: { opacity: 0, x: -100 },
        animate: { 
            opacity: [0, 0.4, 0], 
            x: [0, 500],
            transition: { duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 3 }
        }
    };

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 bg-[#0A0A0B] flex flex-col font-sans"
      >
        {/* --- FX: Grain & Light Leaks --- */}
        <div className="pointer-events-none absolute inset-0 z-40 opacity-[0.05] bg-[url('/noise.png')] bg-repeat mix-blend-overlay animate-pulse"></div>
        <motion.div 
            variants={lightLeakVariants}
            initial="initial"
            animate="animate"
            className="pointer-events-none absolute top-0 left-0 w-[50vw] h-full bg-gradient-to-r from-transparent via-[#ff4d0033] to-transparent mix-blend-screen blur-[100px] z-30"
        />

        {/* --- Top Bar Nav --- */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-2 md:gap-3 font-mono text-[10px] md:text-xs tracking-[0.2em] text-white/60 uppercase">
                <Film size={14} className="text-white/40"/>
                <span>Seq. {trip.year}</span>
                <span className="text-white/20">|</span>
                <span>{flag} {trip.country}</span>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={onClose}
                    className="group p-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-md hover:bg-white/10 hover:border-white/30 transition-all"
                >
                    <X size={20} className="text-white/70 group-hover:text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            
            {/* === SCÈNE D'OUVERTURE === */}
            <div className="relative w-full h-[65vh] md:h-[85vh] overflow-hidden">
                <motion.div 
                    variants={heroImageVariants}
                    className="relative w-full h-full"
                >
                    {trip.coverUrl && (
                        isVideo(trip.coverUrl) ? (
                            <video src={trip.coverUrl} autoPlay muted loop className="object-cover w-full h-full" />
                        ) : (
                            <Image 
                                src={trip.coverUrl} 
                                alt="Cover" 
                                fill 
                                className="object-cover"
                                priority
                            />
                        )
                    )}
                </motion.div>
                
                {/* Vignettage Cinéma */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A0A0B_90%)] opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent" />
                
                {/* Typography Scénographique */}
                <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full flex flex-col items-start">
                    
                    {/* Meta Data */}
                    <div className="mb-4 md:mb-6 flex flex-wrap items-center gap-3 md:gap-4 text-[10px] font-mono text-white/50 tracking-widest uppercase">
                        <div className="flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full backdrop-blur-md">
                            <MapIcon size={12} />
                            {trip.coordinates || "LOC: UNKNOWN"}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: trip.accent }}/>
                            {trip.dateLabel}
                        </div>
                    </div>

                    {/* Titre Massif Superposé */}
                    <h1 className="text-5xl md:text-6xl lg:text-[8rem] font-black text-white tracking-tighter leading-none mix-blend-overlay opacity-30 absolute bottom-12 left-6 md:left-12 select-none pointer-events-none">
                        {trip.places.split(' ')[0]}
                    </h1>
                     <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight mb-4 relative z-10 leading-tight">
                        {trip.places}
                    </h2>

                    <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light italic relative z-10 border-l-4 pl-4 md:pl-6 max-w-2xl" style={{ borderColor: trip.accent }}>
                        &quot;{trip.mood}&quot;
                    </p>
                </div>
            </div>

            {/* === LE SCÉNARIO === */}
            <div className="px-6 md:px-12 py-16 md:py-24 bg-[#0A0A0B] relative z-20">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 mb-8 md:mb-12 opacity-50">
                        <div className="h-px flex-1 bg-white/30"></div>
                        <span className="font-mono text-xs tracking-[0.3em] uppercase">The Narrative</span>
                        <div className="h-px flex-1 bg-white/30"></div>
                    </div>
                    <p className="text-white/70 leading-[1.8] text-base md:text-lg lg:text-xl font-light first-letter:text-4xl md:first-letter:text-5xl first-letter:font-bold first-letter:text-white first-letter:mr-2 first-letter:float-left">
                        {trip.description || "Une exploration visuelle des paysages et de l&apos;atmosphère unique de ce lieu. Chaque capture est une tentative de figer le temps, la lumière singulière et l&apos;émotion brute ressentie lors de cette immersion scénographique."}
                    </p>
                </div>
            </div>

            {/* === L'EXPOSITION (Galerie) === */}
            <div className="px-4 md:px-12 pb-24 bg-[#0A0A0B] relative z-20">
                 <div className="flex items-center gap-4 mb-8 md:mb-12 opacity-50 max-w-3xl mx-auto">
                        <span className="font-mono text-xs tracking-[0.3em] uppercase shrink-0">Visual Archives</span>
                        <div className="h-px flex-1 bg-white/30"></div>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 max-w-7xl mx-auto">
                    {galleryImages.map((mediaUrl, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                            className="relative break-inside-avoid rounded-lg overflow-hidden group bg-zinc-900 mb-4 cursor-pointer"
                            onClick={() => setLightboxIndex(idx)}
                        >
                            <div className="relative w-full h-auto">
                                {isVideo(mediaUrl) ? (
                                    <div className="relative w-full aspect-video">
                                        <video src={mediaUrl} className="object-cover w-full h-full" muted />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                            <Play className="text-white opacity-70" size={32} />
                                        </div>
                                    </div>
                                ) : (
                                    <Image 
                                        src={mediaUrl} 
                                        alt={`Gallery ${idx}`} 
                                        width={800}
                                        height={600}
                                        className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale-[30%] group-hover:grayscale-0"
                                    />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex justify-between items-end w-full font-mono text-[10px] text-white/60 uppercase tracking-widest">
                                <span>Frame {idx + 1 < 10 ? `0${idx+1}` : idx+1}</span>
                                <Maximize2 size={14} className="text-white/80" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            
            {/* Footer */}
            <div className="py-16 text-center relative z-20">
                <div className="inline-flex flex-col items-center gap-3 font-mono text-xs text-white/30 tracking-[0.3em] uppercase">
                    <div className="w-px h-8 bg-white/20 mb-2"></div>
                    <span>End of Sequence</span>
                    <span>{trip.year} © Mathis Truong</span>
                </div>
            </div>

        </div>

        {/* --- LIGHTBOX (PLEIN ÉCRAN) --- */}
        <AnimatePresence>
            {lightboxIndex !== null && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-black flex flex-col justify-center items-center"
                >
                    {/* Bouton Fermer Lightbox */}
                    <button 
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-4 right-4 z-[210] p-3 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Navigation Gauche */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 z-[210] p-3 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    {/* Image / Video Centrale */}
                    <div className="relative w-full h-full max-w-7xl max-h-screen p-4 md:p-10 flex items-center justify-center">
                        <motion.div 
                            key={lightboxIndex} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            {isVideo(galleryImages[lightboxIndex]) ? (
                                <video 
                                    src={galleryImages[lightboxIndex]} 
                                    controls 
                                    autoPlay 
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                                />
                            ) : (
                                <div className="relative w-full h-full">
                                    <Image 
                                        src={galleryImages[lightboxIndex]} 
                                        alt="Fullscreen" 
                                        fill 
                                        className="object-contain"
                                        quality={100}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Navigation Droite */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 z-[210] p-3 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors"
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Compteur */}
                    <div className="absolute bottom-6 font-mono text-white/50 text-sm tracking-widest">
                        {lightboxIndex + 1} / {galleryImages.length}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Actions Flottantes */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-4 z-50">
            <button className="p-3 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white/50 hover:text-[#9B1C31] transition-colors group">
                <Heart size={20} className="group-hover:scale-110 transition-transform"/>
            </button>
            <button className="p-3 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white/50 hover:text-white transition-colors group">
                <Share2 size={20} className="group-hover:scale-110 transition-transform"/>
            </button>
        </div>
      </motion.div>
    );
}

/* ---------- COMPOSANT CARTE (Desktop) (Inchangé) ---------- */

function TravelCardDesktop({
  stop,
  unlocked,
  near,
  topY,
  midY,
  botY,
  onClick
}: {
  stop: Stop;
  unlocked: boolean;
  near: boolean;
  topY: number;
  midY: number;
  botY: number;
  onClick: () => void;
}) {
  const fog = near ? 0 : unlocked ? 0.28 : 0.70;
  const sat = unlocked ? 1 : 0;
  const opacity = unlocked ? 1 : 0.60;
  const flag = flagFromCode(stop.country);
  const y = stop.lane === -1 ? topY : stop.lane === 1 ? botY : midY;
  const pointerEvents = unlocked || near ? "auto" : "none";

  return (
    <div
      className="absolute group/card"
      style={{
        left: stop.x + 60,
        top: y,
        transform: "translateY(-50%)",
        width: 420,
        maxWidth: "90vw",
        pointerEvents: pointerEvents,
        zIndex: unlocked ? 10 : 5,
      }}
      onClick={onClick}
    >
      <div
        className="relative rounded-[20px] border border-white/12 bg-black/55 backdrop-blur-xl shadow-[0_28px_110px_rgba(0,0,0,0.70)] overflow-hidden cursor-pointer transition-transform duration-300 group-hover/card:scale-[1.02] group-active/card:scale-[0.98]"
        style={{ filter: `saturate(${sat})`, opacity }}
      >
        <div className="absolute inset-0" style={{ background: `radial-gradient(560px 220px at 12% 40%, ${stop.accent}20, transparent 60%), radial-gradient(520px 240px at 85% 55%, rgba(255,255,255,0.08), transparent 62%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.80))` }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(520px 160px at 45% 35%, rgba(255,255,255,0.12), transparent 66%), linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.78))", opacity: fog, transition: "opacity 420ms ease" }} />

        <div className="absolute right-0 top-0 h-full w-[42%]">
          {stop.coverUrl ? (
            <div className="absolute inset-0 opacity-[0.92] transition-opacity duration-300 group-hover/card:opacity-100">
              <Image src={stop.coverUrl} alt={stop.places} fill sizes="240px" className="object-cover" priority={false} />
              <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(0,0,0,0.78),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(155,28,49,0.16),transparent_62%)]" />
              <div className="absolute top-3 right-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
                 <Maximize2 size={16} className="text-white/70" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 opacity-[0.20]">
              <div className="absolute inset-0" style={{ background: `radial-gradient(240px 240px at 30% 35%, ${stop.accent}55, transparent 65%)` }} />
            </div>
          )}
          <div className="absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent)] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.70))]" />
        </div>

        <div className="relative z-10 p-4 pr-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="text-[11px] font-mono tracking-[0.30em] text-white/55 uppercase">{stop.year}</div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[10px] font-mono tracking-[0.16em] text-white/85 backdrop-blur-md">
                  <span className="text-[14px] leading-none">{flag}</span>
                  <span className="opacity-80">{stop.country}</span>
                </span>
              </div>
              <div className="mt-2 text-[20px] sm:text-[22px] font-semibold text-white/92 leading-tight group-hover/card:text-white transition-colors">{stop.places}</div>
              <div className="mt-1 text-[10px] font-mono tracking-[0.16em] text-white/55 uppercase">{stop.dateLabel} · {stop.durationDays}j</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <KindBadge kind={stop.kind} />
              <div className="h-3 w-3 rounded-full" style={{ background: unlocked ? stop.accent : "rgba(255,255,255,0.22)", boxShadow: unlocked ? `0 0 18px ${stop.accent}88` : "none" }} />
            </div>
          </div>
          <div className="mt-3 text-[13px] text-white/72 leading-relaxed max-w-[58ch]" style={clampText2LinesStyle()}>{stop.mood}</div>
          <div className="mt-3 h-[2px] w-16 rounded-full transition-all duration-300 group-hover/card:w-24" style={{ background: stop.accent, opacity: unlocked ? 0.8 : 0.25 }} />
        </div>
      </div>
    </div>
  );
}

/* ---------- COMPOSANT CARTE (Mobile) (Inchangé) ---------- */

function TravelCardMobile({ stop, onClick }: { stop: Stop, onClick: () => void }) {
  const flag = flagFromCode(stop.country);

  return (
    <div 
      className="relative w-full max-w-[400px] mx-auto mb-8 last:mb-0 cursor-pointer active:scale-[0.98] transition-transform group"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
        
        {/* Image top */}
        <div className="relative h-32 w-full">
          {stop.coverUrl ? (
            <Image src={stop.coverUrl} alt={stop.places} fill className="object-cover opacity-80" sizes="400px" />
          ) : (
            <div className="absolute inset-0 bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" />
          
          <div className="absolute top-3 right-3 flex gap-2">
            <KindBadge kind={stop.kind} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 -mt-6 px-5 pb-5">
          <div className="flex items-center gap-2 mb-2">
             <div className="text-[10px] font-mono tracking-[0.2em] text-white/60 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                {stop.year}
             </div>
             <span className="text-lg">{flag}</span>
          </div>

          <h3 className="text-xl font-bold text-white leading-tight mb-1">{stop.places}</h3>
          
          <div className="text-[10px] font-mono text-white/50 tracking-widest mb-3 uppercase">
            {stop.dateLabel} · {stop.durationDays}j
          </div>

          <p className="text-sm text-white/70 leading-relaxed border-l-2 pl-3" style={{ borderColor: stop.accent }}>
            {stop.mood}
          </p>
        </div>
      </div>
      
      <div className="absolute top-full left-1/2 -translate-x-1/2 h-8 w-[1px] bg-gradient-to-b from-white/20 to-transparent last:hidden" />
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */

export default function TravelTimeline() {
  // ✅ SECURITÉ HYDRATATION
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [selectedTrip, setSelectedTrip] = useState<Stop | null>(null);

  const locale = useLocale();
  const { vw, vh } = useViewport();
  const isMobile = useIsMobile(768);

  const centerX = Math.round(vw * 0.5);
  const baselineY = Math.round(vh * 0.54);

  const HEADER_SAFE = 210;
  const TOP_LANE_Y = Math.max(HEADER_SAFE + 55, Math.round(vh * 0.30));
  const MID_LANE_Y = baselineY - 8;
  const BOT_LANE_Y = Math.min(vh - 90, Math.round(vh * 0.78));

  // ✅ DONNÉES (APOSTROPHES CORRIGÉES)
  const trips: Trip[] = useMemo(
    () => [
      {
        id: "2018-hendaye",
        start: iso(2018, 7, 22), end: iso(2018, 8, 3),
        places: "Saint-Sébastien",
        country: "ES",
        mood: "Océan, frontière, premiers grands horizons.",
        accent: "#9B1C31", lane: 1, kind: "Trip",
        coverUrl: "/travel/landscape.jpg",
        coordinates: "43.3183° N, 1.9812° W"
      },
      {
        id: "2019-usa",
        start: iso(2019, 7, 15), end: iso(2019, 7, 31),
        places: "Boston",
        country: "US",
        // Correction apostrophe
        mood: "Choc d&apos;échelle. Lumières, routes, énergie.",
        accent: "#F472B6", lane: 1, kind: "Trip",
        coverUrl: "/travel/landscape.jpg",
        coordinates: "42.3601° N, 71.0589° W"
      },
      {
        id: "2023-dublin",
        start: iso(2023, 4, 29), end: iso(2023, 6, 23),
        places: "Dublin",
        country: "IE",
        mood: "Pluie fine, pubs, lueurs vertes. Une ville qui respire.",
        accent: "#6C1E80", lane: 1, kind: "Work",
        coverUrl: "/travel/landscape.jpg",
        coordinates: "53.3498° N, 6.2603° W"
      },
      {
        id: "2023-barcelone",
        start: iso(2023, 9, 19), end: iso(2023, 10, 29),
        places: "Barcelone",
        country: "ES",
        mood: "Architecture, textures, lumière urbaine.",
        accent: "#F472B6", lane: -1, kind: "Trip",
        coverUrl: "/travel/landscape.jpg",
        coordinates: "41.3874° N, 2.1686° E"
      },
      {
        id: "2024-londres",
        start: iso(2024, 6, 20), end: iso(2024, 6, 24),
        places: "Londres",
        country: "UK",
        mood: "Néons, pluie légère, rythme cinéma.",
        accent: "#9B1C31", lane: 1, kind: "Trip",
        coverUrl: "/travel/landscape.jpg",
        coordinates: "51.5072° N, 0.1276° W"
      },
      {
        id: "2025-madrid",
        start: iso(2025, 3, 11), end: iso(2025, 3, 13),
        places: "Madrid",
        country: "ES",
        mood: "Vitesse, art, rues vivantes.",
        accent: "#9B1C31", lane: -1, kind: "Trip",
        coverUrl: "/travel/landscape.jpg",
        coordinates: "40.4168° N, 3.7038° W"
      },
      {
        id: "2025-montreal",
        start: iso(2025, 4, 26), end: iso(2025, 6, 15),
        places: "Montréal",
        country: "CA",
        mood: "Ville-lumière froide. Quartiers, rythme, contrastes.",
        accent: "#F472B6", lane: 1, kind: "Trip",
        coverUrl: "/travel/landscape.jpg",
        coordinates: "45.5017° N, 73.5673° W"
      },
      {
        id: "2025-crete", 
        start: iso(2025, 8, 10), end: iso(2025, 8, 20),
        places: "Crète",
        country: "GR",
        mood: "Mythologie, mer turquoise et chaleur antique.",
        accent: "#C084FC", lane: -1, kind: "Trip",
        coverUrl: "/travel/landscape.jpg",
        // Correction apostrophe
        description: "Exploration des palais minoens, randonnées dans les gorges de Samaria et détente sur les plages de sable rose d&apos;Elafonissi.",
        coordinates: "35.2401° N, 24.8093° E"
      },
      {
        id: "2025-londres-2",
        start: iso(2025, 10, 31), end: iso(2025, 11, 2),
        places: "Londres",
        country: "UK",
        mood: "Retour. Même ville, autre regard.",
        accent: "#F472B6", lane: 1, kind: "Trip",
        coverUrl: "/travel/landscape.jpg",
        coordinates: "51.5072° N, 0.1276° W"
      },
    ],
    []
  );

  const stops: Stop[] = useMemo(() => {
    const sorted = [...trips].sort((a, b) => parseISO(a.start) - parseISO(b.start));
    const START_OFFSET_X = 180;
    const BASE_GAP_X = 420;
    const PER_DAY_X = 18;
    const EXTRA_YEAR_X = 120;

    let x = START_OFFSET_X;
    let prevYear = new Date(parseISO(sorted[0]?.start ?? iso(2018, 1, 1))).getFullYear();

    return sorted.map((t) => {
      const yr = new Date(parseISO(t.start)).getFullYear();
      const dur = daysBetween(t.start, t.end);
      const jump = Math.max(0, yr - prevYear);
      if (jump > 0) x += jump * EXTRA_YEAR_X;

      const s: Stop = {
        ...t,
        x,
        y: 0,
        year: yr,
        dateLabel: formatDateRangeDeterministic(t.start, t.end, locale),
        durationDays: dur,
      };

      x += BASE_GAP_X + dur * PER_DAY_X;
      prevYear = yr;
      return s;
    });
  }, [trips, locale]);

  const contentWidth = useMemo(() => {
    const last = stops[stops.length - 1];
    const end = (last?.x ?? 0) + 980;
    return Math.max(end, vw + 400);
  }, [stops, vw]);

  /* --- Logic Desktop (Scroll Horizontal) --- */
  const target = useMotionValue(0);
  const progress = useSpring(target, { stiffness: 70, damping: 22, mass: 0.9 });
  const maxProgressDesktop = Math.max(0, contentWidth - centerX - 120);
  const worldX = useTransform(progress, (p) => centerX - p);

  const viewportRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isMobile) return;
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const delta = raw * 0.9;
      const next = clamp(target.get() + delta, 0, maxProgressDesktop);
      target.set(next);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isMobile, target, maxProgressDesktop]);

  const dragRef = useRef<{ pos: number; p: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (isMobile) return;
    if((e.target as HTMLElement).closest('.group\\/card')) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { pos: e.clientX, p: target.get() };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!dragRef.current || isMobile) return;
    const d = e.clientX - dragRef.current.pos;
    const next = clamp(dragRef.current.p - d * 1.12, 0, maxProgressDesktop);
    target.set(next);
  };
  const onPointerUp = () => { dragRef.current = null; };

  const [pNow, setPNow] = useState(0);
  useEffect(() => {
    const unsub = progress.on("change", (v) => setPNow(v));
    return () => unsub();
  }, [progress]);

  const REVEAL_NEAR = 110;
  const UNLOCK_AT = 12;
  const PATH_AHEAD = 240;
  const visibleUntil = pNow + PATH_AHEAD;
  const pointPosInWorld = pNow;
  const backHref = `/${locale}`;

  // ✅ Scroll lock quand le modal est ouvert
  useEffect(() => {
    if (selectedTrip) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
    } else {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
    }
    return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
    };
  }, [selectedTrip]);

  // Si pas monté, on renvoie une section vide pour éviter l'Hydration Error
  if (!mounted) return <section className="relative h-screen w-full bg-[#0A0A0B]" />;

  /* --- RENDER --- */

  return (
    <>
      <AnimatePresence>
        {selectedTrip && (
          <PortfolioGalleryModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
        )}
      </AnimatePresence>

      {isMobile ? (
        // --- MOBILE RENDER ---
        <section className="relative w-full min-h-screen bg-[#0A0A0B] text-white">
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Starfield density={60} />
            <ShootingStars />
          </div>

          <div className="relative z-10 px-6 pt-8 pb-10">
            <Link href={backHref} className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-white/70 mb-6 border border-white/10 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur">
              <ArrowLeft size={14} /> RETOUR
            </Link>
            <h1 className="text-4xl font-black tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">
                Travel Log
              </span>
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Fragments de monde et souvenirs collectés.
            </p>
          </div>

          <div className="relative z-10 px-6 pb-20 flex flex-col items-center">
            {stops.map((stop) => (
              <TravelCardMobile 
                key={stop.id} 
                stop={stop} 
                onClick={() => setSelectedTrip(stop)} 
              />
            ))}
          </div>
        </section>
      ) : (
        // --- DESKTOP RENDER ---
        <section
          ref={(node) => { viewportRef.current = node; }}
          className="relative h-screen w-full overflow-hidden bg-[#0A0A0B] text-white select-none cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="pointer-events-none absolute inset-0 z-[1]">
            <div className="absolute inset-0 opacity-70 [background:radial-gradient(1100px_520px_at_18%_20%,rgba(155,28,49,0.18),transparent_62%),radial-gradient(900px_520px_at_92%_30%,rgba(108,30,128,0.16),transparent_64%)]" />
            <div className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.14),rgba(255,255,255,0.14)_1px,transparent_1px,transparent_3px)]" />
          </div>
          <Starfield density={120} />
          <ShootingStars />

          <div className="pointer-events-none absolute left-0 right-0 top-0 z-[8] px-6 pt-6">
            <div className="mx-auto max-w-6xl relative">
              <div className="pointer-events-auto absolute left-0 top-0">
                <Link
                  href={backHref}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[11px] font-mono tracking-[0.20em] text-white/85 backdrop-blur-md hover:bg-black/55 transition"
                >
                  <ArrowLeft size={14} className="opacity-80" />
                  RETOUR
                </Link>
              </div>
              <div className="text-[10px] font-mono tracking-[0.42em] text-white/35 uppercase pl-[110px]">
                TRAVEL <span className="mx-3 text-white/20">—</span> CHRONO
              </div>
              <h1 className="mt-3 text-6xl font-black tracking-tight pl-[110px]">
                <span className="bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-[#ffffff] bg-clip-text text-transparent">
                  Frise Vivante
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-white/60 pl-[110px]">
                Une ligne qui avance. Des lieux qui se débloquent quand tu t’en approches.
              </p>
            </div>
          </div>

          <motion.div
            className="absolute inset-0 z-[4]"
            style={{ x: worldX }}
            aria-hidden="true"
          >
            <svg
              width={contentWidth}
              height={vh}
              viewBox={`0 0 ${contentWidth} ${vh}`}
              className="absolute left-0 top-0"
            >
              <line x1={0} y1={baselineY} x2={contentWidth} y2={baselineY} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
              <line x1={0} y1={baselineY} x2={Math.max(0, visibleUntil)} y2={baselineY} stroke="rgba(155,28,49,0.65)" strokeWidth={2.5} />

              {stops.map((s) => {
                const dx = Math.abs(pointPosInWorld - s.x);
                const near = dx < REVEAL_NEAR;
                const unlocked = pointPosInWorld >= s.x + UNLOCK_AT;
                const showBranch = unlocked || near;
                const laneY = s.lane === -1 ? TOP_LANE_Y : s.lane === 1 ? BOT_LANE_Y : baselineY;

                return (
                  <g key={s.id}>
                    {(unlocked || near) && (
                      <>
                        <circle cx={s.x} cy={baselineY} r={unlocked ? 6 : 4} fill={unlocked ? s.accent : "rgba(255,255,255,0.25)"} opacity={unlocked ? 1 : 0.7} />
                        {unlocked && <circle cx={s.x} cy={baselineY} r={16} fill="transparent" stroke={s.accent} strokeWidth={1.2} opacity={0.20} />}
                      </>
                    )}
                    {showBranch && s.lane !== 0 && (
                      <>
                        <line x1={s.x} y1={baselineY} x2={s.x} y2={laneY} stroke={unlocked ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)"} strokeWidth={1.6} />
                        <circle cx={s.x} cy={laneY} r={unlocked ? 4 : 3} fill={unlocked ? s.accent : "rgba(255,255,255,0.18)"} opacity={unlocked ? 1 : 0.65} />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {stops.map((s) => {
              const dx = Math.abs(pointPosInWorld - s.x);
              const near = dx < REVEAL_NEAR;
              const unlocked = pointPosInWorld >= s.x + UNLOCK_AT;
              const visible = unlocked || dx < 280;
              if (!visible) return null;

              return (
                <TravelCardDesktop
                  key={s.id}
                  stop={s}
                  unlocked={unlocked}
                  near={near}
                  topY={TOP_LANE_Y}
                  midY={MID_LANE_Y}
                  botY={BOT_LANE_Y}
                  onClick={() => setSelectedTrip(s)}
                />
              );
            })}
          </motion.div>

          <div className="pointer-events-none absolute z-[6]" style={{ left: centerX, top: baselineY, transform: "translate(-50%, -50%)" }}>
            <div className="absolute -inset-10 rounded-full" style={{ background: "radial-gradient(circle at center, rgba(155,28,49,0.14), rgba(108,30,128,0.10), transparent 72%)", filter: "blur(2px)" }} />
            <div className="relative grid place-items-center">
              <div className="h-3 w-3 rounded-full" style={{ background: "#9B1C31", boxShadow: "0 0 24px rgba(155,28,49,0.55)" }} />
              <div className="absolute -left-10 -top-7 opacity-80">
                <MapPin size={16} className="text-white/70" />
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-[7] flex justify-center">
            <div className="text-[10px] font-mono tracking-[0.42em] text-white/40 uppercase">
              SCROLL / DRAG → ADVANCE
            </div>
          </div>
        </section>
      )}
      <style jsx global>{`
        @keyframes twinkle {
          0% { transform: scale(0.95); opacity: 0.05; }
          40% { transform: scale(1.15); opacity: 0.18; }
          100% { transform: scale(0.98); opacity: 0.08; }
        }
        @keyframes shoot {
          0% { transform: translateX(-220px) rotate(-18deg); opacity: 0; }
          12% { opacity: 1; }
          38% { opacity: 0.55; }
          55% { opacity: 0; }
          100% { transform: translateX(520px) rotate(-18deg); opacity: 0; }
        }
      `}</style>
    </>
  );
}