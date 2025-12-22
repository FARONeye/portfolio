"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Gamepad2, Headphones, Clapperboard, LucideIcon, Plus, ScanLine } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";

// --- TYPES ---
type CategoryKey = "gaming" | "music" | "cinematics";

type PassionCategory = {
  id: CategoryKey;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  href: string;
  image: string;
  coords: string;
};

// --- DATA ---
const CATEGORIES: PassionCategory[] = [
  {
    id: "music",
    title: "MUSIQUE",
    subtitle: "Exploration",
    icon: Headphones,
    color: "#C084FC",
    href: "/passions/music",
    image: "/passions/music-bg.jpg", 
    coords: "AUDIO.FREQ.808",
  },
  {
    id: "gaming",
    title: "COMPETITIVE",
    subtitle: "Warfare",
    icon: Gamepad2,
    color: "#F472B6",
    href: "/passions/gaming",
    image: "/passions/gaming-bg.jpg",
    coords: "SYS.rank.GLB",
  },
  {
    id: "cinematics",
    title: "VISUAL",
    subtitle: "Stories",
    icon: Clapperboard,
    color: "#38BDF8",
    href: "/passions/cinematics",
    image: "/passions/cinema-bg.jpg",
    coords: "CAM.ISO.400",
  },
];

// --- HOOK MOBILE ---
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // Vérification sécurisée côté client
    if (typeof window === 'undefined') return;
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

// --- COMPOSANT : MARQUEE TEXT ---
function MarqueeText({ text, isHovered }: { text: string, isHovered: boolean }) {
  return (
    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full overflow-hidden pointer-events-none mix-blend-overlay z-10 flex">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          repeat: Infinity, 
          ease: "linear", 
          duration: 30,
        }}
        style={{ opacity: isHovered ? 0.3 : 0.1 }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="text-[15vh] md:text-[20vh] font-black tracking-tighter leading-none text-white px-8">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// --- COMPOSANT : HUD DECOR ---
function HudDecor({ color, coords, isMobile }: { color: string, coords: string, isMobile: boolean }) {
    return (
        <div className="absolute inset-0 pointer-events-none z-30 p-4 md:p-8 flex flex-col justify-between">
            <div className="flex justify-between">
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white/50" />
                    <div className="w-1 h-1 bg-white/20" />
                </div>
                {!isMobile && <Plus size={16} className="text-white/30" />}
            </div>
            
            <div className="flex justify-between items-end">
                <div className={`text-[9px] font-mono text-white/40 tracking-widest ${!isMobile ? "writing-vertical-lr rotate-180" : ""}`}>
                    {coords} // SYS.RDY
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-8 md:w-12 h-[1px] bg-white/20" />
                    <div className="w-2 h-2 border border-white/40" style={{ borderColor: color }} />
                </div>
            </div>
        </div>
    )
}

// --- COMPOSANT : CATEGORY PANEL ---
function CategoryPanel({
  item,
  index,
  hoveredIndex,
  setHoveredIndex,
  isMobile
}: {
  item: PassionCategory;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
  isMobile: boolean;
}) {
  const locale = useLocale();
  const isHovered = hoveredIndex === index;
  const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
  
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    x.set((mouseXPos / width - 0.5) * 15); 
    y.set((mouseYPos / height - 0.5) * 15);
  };

  const flexValue = isMobile ? 'none' : (isHovered ? 4 : 1);
  const heightValue = isMobile ? '33.33vh' : '100%'; 

  return (
    <motion.div
      ref={ref}
      layout
      onMouseMove={handleMouseMove}
      onClick={() => isMobile && setHoveredIndex(index)} 
      onMouseEnter={() => !isMobile && setHoveredIndex(index)}
      onMouseLeave={() => !isMobile && setHoveredIndex(null)}
      className="relative w-full overflow-hidden border-b border-white/10 md:border-b-0 md:border-r last:border-0 group cursor-pointer"
      style={{ 
          flex: flexValue,
          height: heightValue 
      }}
      transition={{ type: "spring", stiffness: 180, damping: 25 }}
    >
      <Link href={`/${locale}${item.href}`} className="block h-full w-full relative">
        
        {/* 1. BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
                className="relative w-[110%] h-[110%] -left-[5%] -top-[5%]"
                style={{ x: isMobile ? 0 : mouseX, y: isMobile ? 0 : mouseY }}
                animate={{ 
                    scale: isHovered ? 1.05 : 1, 
                    filter: isDimmed ? "grayscale(100%) brightness(0.3)" : "grayscale(0%) brightness(0.6)" 
                }}
                transition={{ duration: 0.8 }}
            >
                <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover"
                    priority
                />
                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500 mix-blend-multiply" 
                    style={{ backgroundColor: item.color }} 
                />
            </motion.div>
        </div>

        {/* 2. TEXTE DÉFILANT */}
        {!isMobile && <MarqueeText text={item.title} isHovered={isHovered} />}

        {/* 3. DÉCORATION HUD */}
        <HudDecor color={item.color} coords={item.coords} isMobile={isMobile} />

        {/* 4. SCANLINE & NOISE */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-[url('/scanline.png')] opacity-[0.03] bg-repeat" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-[url('/noise.png')] opacity-[0.05] bg-repeat mix-blend-overlay" />

        {/* 5. CONTENU PRINCIPAL */}
        <div className="absolute inset-0 z-20 p-6 md:p-10 flex flex-col justify-between">
            
            {/* Top */}
            <div className="flex justify-between items-start">
                <span className="font-mono text-xs md:text-sm text-white/60 tracking-widest border border-white/10 px-2 py-1 rounded bg-black/20 backdrop-blur-sm">
                    0{index + 1}
                </span>
                <motion.div 
                    animate={{ 
                        rotate: isHovered ? 45 : 0, 
                        scale: isHovered ? 1.1 : 1,
                        color: isHovered ? "#fff" : "rgba(255,255,255,0.5)"
                    }}
                    transition={{ duration: 0.4 }}
                >
                    <ArrowUpRight size={isMobile ? 20 : 28} />
                </motion.div>
            </div>

            {/* Bottom */}
            <div className="relative">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: (isHovered && !isMobile) ? 20 : 0 }}
                    className="flex flex-col"
                >
                    <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter relative z-30 drop-shadow-2xl">
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 md:mt-2">
                        <span className="h-[2px] w-6 bg-white/50" style={{ backgroundColor: isHovered ? item.color : undefined }} />
                        <p className="font-mono text-[10px] md:text-sm text-white/80 tracking-[0.3em] uppercase">
                            {item.subtitle}
                        </p>
                    </div>
                </motion.div>

                {/* Description Reveal */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: isMobile ? 8 : 20 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex items-center gap-4 text-white p-3 md:p-4 border-l-2 bg-black/40 backdrop-blur-md border-white/20 rounded-r-lg">
                                <div className="p-2 md:p-3 bg-white/10 rounded-full">
                                    <item.icon size={isMobile ? 18 : 24} style={{ color: item.color }} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Entrer</span>
                                    <span className="text-[10px] md:text-xs text-white/60 font-mono">Module {item.id}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </Link>
    </motion.div>
  );
}

// --- PAGE PRINCIPALE ---

export default function PassionsHome() {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const locale = useLocale();
  const isMobile = useIsMobile();

  useEffect(() => { setMounted(true); }, []);

  // Protection contre l'hydratation mismatch
  if (!mounted) return <div className="min-h-screen w-full bg-[#030303]" />;

  return (
    <>
        <section className="relative h-[100dvh] w-full bg-[#030303] flex flex-col md:flex-row overflow-hidden font-sans">
        
        {/* 1. BOUTON RETOUR (HUD Style) */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50 mix-blend-difference pointer-events-auto">
            <Link 
                href={`/${locale}`}
                className="group flex items-center gap-3 md:gap-4 text-white uppercase tracking-[0.2em] font-bold text-[10px] md:text-xs hover:text-white/80 transition-colors"
            >
                <div className="relative w-10 h-10 md:w-12 md:h-12 border border-white/20 rounded-full flex items-center justify-center overflow-hidden group-hover:border-white transition-all duration-500 md:group-hover:w-14">
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <ArrowLeft size={16} className="relative z-10 group-hover:text-black transition-colors duration-300" />
                </div>
                <div className="flex flex-col items-start hidden md:flex">
                    <span className="text-[8px] text-white/40 font-mono">SYSTEM</span>
                    <span>Return to Base</span>
                </div>
            </Link>
        </div>

        {/* 2. SCANNING LINE */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 z-40 animate-[scan_6s_linear_infinite] pointer-events-none" />

        {/* 3. LAYOUT PRINCIPAL */}
        <div className="flex flex-col md:flex-row w-full h-full">
            {CATEGORIES.map((cat, i) => (
                <CategoryPanel 
                    key={cat.id} 
                    item={cat} 
                    index={i}
                    hoveredIndex={hoveredIndex}
                    setHoveredIndex={setHoveredIndex}
                    isMobile={isMobile}
                />
            ))}
        </div>

        </section>
        
        {/* Styles globaux déplacés ici pour éviter les erreurs d'hydratation */}
        <style jsx global>{`
            @keyframes scan {
                0% { top: -10%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 110%; opacity: 0; }
            }
        `}</style>
    </>
  );
}