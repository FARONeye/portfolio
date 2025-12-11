"use client";
import { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gamepad2, Plane, Music, Zap, ScanFace, Cpu, Brain, BatteryCharging, Globe, Smile, Layers, Fingerprint, Target, ChevronDown } from "lucide-react"; 
import ChibiModel from "./ChibiModel";

// --- CALCUL DYNAMIQUE AGE & XP ---
const BIRTH_DATE = new Date("2004-06-24");

function getProfileStats() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let age = currentYear - BIRTH_DATE.getFullYear();
  const hasHadBirthday = (now.getMonth() > BIRTH_DATE.getMonth()) || 
                         (now.getMonth() === BIRTH_DATE.getMonth() && now.getDate() >= BIRTH_DATE.getDate());
  if (!hasHadBirthday) age--;

  const lastBirthday = new Date(hasHadBirthday ? currentYear : currentYear - 1, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate());
  const nextBirthday = new Date(hasHadBirthday ? currentYear + 1 : currentYear, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate());
  
  const totalDuration = nextBirthday.getTime() - lastBirthday.getTime();
  const elapsed = now.getTime() - lastBirthday.getTime();
  const xpPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

  return { level: age, xp: xpPercent };
}

// --- DONNÉES ITEMS ---
const GEAR = [
  {
    id: "head",
    slot: "HEAD",
    name: "Neural Interface Visor",
    rarity: "legendary",
    icon: <ScanFace size={24} />,
    stats: [
        { label: "Vision", value: "Artistique" },
        { label: "Focus", value: "Deep Work" }
    ],
    desc: "A direct link to digital inspiration, filtering noise and enhancing creative vision.",
    realHobby: "Tech Watch & AI Exploration",
    position: "top-2 left-2 md:top-20 md:left-20", 
  },
  {
    id: "r_hand",
    slot: "MAIN HAND",
    name: "Sonic Wave Amplifier",
    rarity: "epic",
    icon: <Music size={24} />,
    stats: [
        { label: "Genre", value: "Synthwave" },
        { label: "Mood", value: "Focus Boost" }
    ],
    desc: "Harmonizes frequencies to create immersive auditory experiences while coding.",
    realHobby: "Music Production / Audiophile",
    position: "top-[40%] left-2 md:top-1/2 md:left-10", 
  },
  {
    id: "l_hand",
    slot: "OFF HAND",
    name: "Tactical Controller",
    rarity: "rare",
    icon: <Gamepad2 size={24} />,
    stats: [
        { label: "Style", value: "Strategic" },
        { label: "Rank", value: "Top 1%" }
    ],
    desc: "Enhances strategic thinking and reflex coordination in competitive environments.",
    realHobby: "Competitive Gaming",
    position: "top-[40%] right-2 md:top-1/2 md:right-10", 
  },
  {
    id: "feet",
    slot: "BOOTS",
    name: "Boots of Wandering",
    rarity: "common",
    icon: <Plane size={24} />,
    stats: [
        { label: "Visited", value: "12 Countries" },
        { label: "Spirit", value: "Nomad" }
    ],
    desc: "Grants the ability to traverse borders and absorb knowledge from new cultures.",
    realHobby: "Travel & Exploration",
    position: "bottom-12 right-4 md:bottom-20 md:right-20", 
  }
];

const getRarityColor = (rarity: string) => {
    switch(rarity) {
        case "legendary": return "text-yellow-400 border-yellow-400/50 shadow-yellow-900/50 bg-yellow-400/10";
        case "epic": return "text-purple-400 border-purple-400/50 shadow-purple-900/50 bg-purple-400/10";
        case "rare": return "text-blue-400 border-blue-400/50 shadow-blue-900/50 bg-blue-400/10";
        default: return "text-zinc-400 border-zinc-600/50 shadow-zinc-900/50 bg-zinc-800/50";
    }
};

export default function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedGear, setSelectedGear] = useState<typeof GEAR[0] | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const [stats, setStats] = useState({ level: 21, xp: 0 });

  useEffect(() => { setStats(getProfileStats()); }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExpanded) {
      timer = setTimeout(() => setIsModelReady(true), 600);
    } else {
      setIsModelReady(false);
      setSelectedGear(null);
    }
    return () => clearTimeout(timer);
  }, [isExpanded]);

  // --- NOUVEAU : BLOQUER LE SCROLL DU BODY QUAND LE MODAL EST OUVERT ---
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = ''; // ou 'auto'
    }
    // Nettoyage au démontage
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  return (
    <section id="about" className="bg-[#0A0A0B] py-24 md:py-32 border-y border-white/10 relative z-20">
      
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#9B1C31]/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 grid gap-16 md:grid-cols-2 items-center">
        {/* Intro Texte */}
        <ScrollReveal from={{ opacity: 0, x: -50 }} to={{ opacity: 1, x: 0 }}>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              <span className="bg-linear-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">
                Select Your Character
              </span>
            </h2>
            <div className="space-y-6 text-lg text-[#b3b3b3] leading-relaxed text-pretty">
              <p>
                Hello, I'm <span className="text-white font-medium">Mathis</span>. 
                Life is an open-world game, and I'm grinding every day to level up my skills.
              </p>
              <div className="pt-4">
                 <button onClick={() => setIsExpanded(true)} className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-[#6C1E80]/50 transition-all active:scale-95">
                    <span className="text-white font-medium">Open Inventory</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                 </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Preview Card */}
        <div className="relative w-full h-[500px] flex items-center justify-center">
            {!isExpanded && (
              <motion.div
                layoutId="character-sheet"
                onClick={() => setIsExpanded(true)}
                className="relative w-[300px] h-[450px] bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <img src="/portrait2.webp" alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <div className="flex flex-col">
                         <span className="text-xs text-zinc-500 font-mono">CLASS</span>
                         <span className="text-sm font-bold text-white tracking-widest">CREATIVE_DEV</span>
                    </div>
                    <div className="px-2 py-1 bg-[#9B1C31] rounded text-xs font-bold text-white">LVL {stats.level}</div>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-black via-black/80 to-transparent flex items-end p-6">
                    <p className="text-white font-mono text-sm animate-pulse">Click to inspect gear...</p>
                </div>
              </motion.div>
            )}
        </div>
      </div>

      {/* --- LE MODAL RPG (RESPONSIVE FIXE) --- */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 overflow-hidden">
            
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsExpanded(false)} 
                className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
            />

            <motion.div
              layoutId="character-sheet"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              // RESPONSIVE : Flex-col sur mobile (empilé), Flex-row sur desktop (côte à côte)
              className="relative w-full h-[100dvh] md:max-w-7xl md:h-auto md:max-h-[90vh] bg-[url('/grid-pattern.svg')] bg-zinc-950 border-white/10 md:border md:rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              
              {/* --- 1. ZONE 3D CENTRALE (PERSONNAGE) --- */}
              {/* MOBILE: order-1 (HAUT) | DESKTOP: md:order-2 (CENTRE) */}
              <div className="relative w-full h-[40vh] md:h-auto md:flex-1 order-1 md:order-2 flex items-center justify-center bg-gradient-to-b from-transparent to-black/40 shrink-0">
                 
                 {/* Lignes de connexion (Cachées sur mobile) */}
                 {isModelReady && (
                   <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none hidden md:block" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                              <stop offset="50%" stopColor="rgba(155, 28, 49, 0.6)" />
                              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                          </linearGradient>
                      </defs>
                      <g stroke="url(#lineGradient)" strokeWidth="2" fill="none">
                          <path d="M 18% 18% L 48% 30%" /> 
                          <path d="M 18% 50% L 42% 50%" />
                          <path d="M 82% 50% L 58% 50%" />
                          <path d="M 82% 80% L 55% 72%" />
                      </g>
                      <circle cx="48%" cy="30%" r="3" fill="#9B1C31" />
                      <circle cx="42%" cy="50%" r="3" fill="#9B1C31" />
                      <circle cx="58%" cy="50%" r="3" fill="#9B1C31" />
                      <circle cx="55%" cy="72%" r="3" fill="#9B1C31" />
                   </svg>
                 )}

                 <div className="absolute inset-0 z-10 flex items-center justify-center">
                    {isModelReady ? (
                        <motion.div className="w-full h-full" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                            <ChibiModel />
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-[#9B1C31]">
                            <div className="relative w-12 h-12 md:w-16 md:h-16">
                                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-t-[#9B1C31] rounded-full animate-spin"></div>
                            </div>
                            <p className="font-mono text-[10px] md:text-xs tracking-widest text-zinc-500 animate-pulse">LOADING ASSETS...</p>
                        </div>
                    )}
                 </div>

                 {isModelReady && (
                     <div className="absolute inset-0 z-20 pointer-events-none">
                        {GEAR.map((item, i) => (
                            <motion.button
                                key={item.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                onClick={() => setSelectedGear(item)}
                                className={`absolute ${item.position} pointer-events-auto group touch-manipulation`}
                            >
                                <div className={`w-10 h-10 md:w-14 md:h-14 backdrop-blur-md rounded-lg flex items-center justify-center transition-all duration-300 border-2 hover:scale-110 ${getRarityColor(item.rarity)} ${selectedGear?.id === item.id ? "scale-110 shadow-[0_0_20px_currentColor] bg-white/20" : "bg-black/40 border-white/10"}`}>
                                    {item.icon}
                                </div>
                            </motion.button>
                        ))}
                     </div>
                 )}
                 
                 {/* Bouton Fermer Principal (Mobile) */}
                 <button 
                    onClick={() => setIsExpanded(false)} 
                    className="md:hidden absolute top-4 right-4 p-2 bg-black/60 backdrop-blur rounded-full text-white z-50 border border-white/10 active:scale-90 transition-transform"
                 >
                    <X size={24}/>
                 </button>
              </div>

              {/* --- 2. GAUCHE : STATS & ATTRIBUTS --- */}
              {/* MOBILE: order-2 (BAS) | DESKTOP: md:order-1 (GAUCHE) */}
              <div className="w-full md:w-1/4 bg-[#0F0F11]/95 backdrop-blur-md border-t md:border-t-0 md:border-r border-white/10 p-4 md:p-6 flex flex-col gap-4 md:gap-6 order-2 md:order-1 z-20 shadow-2xl overflow-y-auto custom-scrollbar flex-1 md:flex-none">
                 
                 <div className="flex items-center gap-3 md:gap-4 shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-800 rounded-full overflow-hidden border-2 border-white/10 p-1 shrink-0">
                        <img src="/portrait2.webp" className="w-full h-full object-cover rounded-full" alt="Profile" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-base md:text-lg leading-tight">Mathis Truong</h3>
                        {/* XP BAR */}
                        <div className="flex flex-col gap-1 w-full mt-1">
                             <div className="flex justify-between text-[9px] md:text-[10px] text-zinc-400 font-mono tracking-wider">
                                 <span>LVL {stats.level}</span>
                                 <span>{stats.xp}% TO LVL {stats.level + 1}</span>
                             </div>
                             <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-linear-to-r from-[#9B1C31] to-[#6C1E80]" style={{ width: `${stats.xp}%` }} />
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-3 md:space-y-4 bg-white/5 p-4 md:p-5 rounded-xl border border-white/5">
                    <h4 className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Human Attributes</h4>
                    
                    <AttributeRow icon={<Brain size={16} className="text-[#9B1C31]" />} label="Mindset" value="Kaizen" />
                    <AttributeRow icon={<Smile size={16} className="text-yellow-500" />} label="Vibe" value="Chill & Focused" />
                    
                    {/* LANGUAGES */}
                    <div className="flex flex-col gap-2 py-1">
                        <div className="flex items-center gap-3 text-zinc-400 mb-1">
                            <Globe size={16} className="text-blue-400" /> <span className="text-xs md:text-sm">Languages</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pl-7">
                            <div className="bg-white/5 rounded p-2 flex flex-col items-center justify-center border border-white/5 hover:border-white/20 transition-colors">
                                <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Fluent</span>
                                <div className="flex gap-1 items-center">
                                     <span className="font-bold text-white text-xs md:text-sm">FR</span>
                                     <span className="text-zinc-600 text-[10px]">/</span>
                                     <span className="font-bold text-white text-xs md:text-sm">EN</span>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded p-2 flex flex-col items-center justify-center border border-white/5 border-dashed">
                                <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Loading...</span>
                                <div className="flex flex-wrap justify-center gap-1">
                                    {['ES','VN','CN','JP','KR'].map(l => (
                                        <span key={l} className="text-[9px] bg-white/10 px-1 rounded text-zinc-400">{l}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <AttributeRow icon={<BatteryCharging size={16} className="text-green-500" />} label="Fuel" value="Monster Energy" />
                    <AttributeRow icon={<Layers size={16} className="text-pink-500" />} label="Archetype" value="Tech Artisan" />
                    <AttributeRow icon={<Fingerprint size={16} className="text-cyan-400" />} label="Signature" value="Immersive UI" />
                    <AttributeRow icon={<Target size={16} className="text-orange-500" />} label="Current Focus" value="WebGL Mastery" />
                 </div>
                 
                 <div className="mt-auto pt-4 border-t border-white/5 pb-8 md:pb-0 text-center">
                     <p className="text-[10px] md:text-xs text-zinc-500 font-mono">ID: 8493-MT • LOC: EARTH-FR</p>
                 </div>
              </div>

              {/* --- 3. DROITE : DÉTAILS ITEM (MOBILE: BOTTOM SHEET / DESKTOP: DROITE) --- */}
              {/* MOBILE: absolute bottom | DESKTOP: md:order-3 (DROITE) */}
              <div 
                className={`w-full md:w-1/4 bg-[#0F0F11] md:bg-[#0F0F11]/95 backdrop-blur-md border-t md:border-t-0 md:border-l border-white/10 p-6 flex flex-col z-40 shadow-2xl absolute inset-x-0 bottom-0 top-auto h-[60vh] md:h-auto md:inset-auto md:relative transition-transform duration-300 ease-out rounded-t-3xl md:rounded-none order-3 md:order-3 ${selectedGear ? 'translate-y-0' : 'translate-y-[110%] md:translate-y-0'} md:transform-none`}
              >
                 {/* Barre de drag pour mobile */}
                 <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-6 md:hidden"></div>

                 {/* Bouton pour fermer uniquement le tiroir sur Mobile */}
                 <button onClick={() => setSelectedGear(null)} className="md:hidden absolute top-4 right-4 p-2 bg-zinc-800/50 rounded-full text-zinc-400 hover:text-white">
                    <ChevronDown size={20} />
                 </button>

                 {/* Bouton pour fermer tout sur Desktop */}
                 <button onClick={() => setIsExpanded(false)} className="hidden md:block absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                    <X size={20} />
                 </button>

                 <div className="flex-1 flex flex-col">
                    {selectedGear ? (
                        <motion.div key={selectedGear.id} initial={{ opacity: 0, x: 0, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} className="space-y-6">
                            <div>
                                <div className={`text-xs font-bold tracking-widest uppercase mb-2 inline-block px-2 py-0.5 rounded ${selectedGear.rarity === 'legendary' ? 'text-yellow-400 bg-yellow-400/10' : selectedGear.rarity === 'epic' ? 'text-purple-400 bg-purple-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                                    {selectedGear.rarity} Item
                                </div>
                                <h2 className="text-2xl font-bold text-white font-mono leading-tight">{selectedGear.name}</h2>
                            </div>
                            <p className="text-zinc-400 italic text-sm border-l-2 border-zinc-700 pl-3">"{selectedGear.desc}"</p>
                            <div className="grid grid-cols-2 gap-2 my-2">
                                {selectedGear.stats.map((stat, idx) => (
                                    <div key={idx} className="bg-black/40 p-2 rounded border border-white/5">
                                        <div className="text-[10px] text-zinc-500 uppercase">{stat.label}</div>
                                        <div className="text-white font-mono text-sm">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 mt-auto">
                                <span className="text-xs text-zinc-500 uppercase">Equipped Skill</span>
                                <div className="text-white font-bold mt-1 flex items-center gap-2">
                                    <Zap size={16} className="text-yellow-400" />
                                    {selectedGear.realHobby}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="hidden md:flex h-full flex-col items-center justify-center text-zinc-600 opacity-50 space-y-4">
                            <Cpu size={48} className="animate-pulse" />
                            <p className="font-mono text-sm text-center">AWAITING INPUT...<br/>SELECT A GEAR SLOT</p>
                        </div>
                    )}
                 </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function AttributeRow({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 text-zinc-400 text-xs md:text-sm">
                {icon} <span>{label}</span>
            </div>
            <span className="text-white text-xs md:text-sm font-medium text-right">{value}</span>
        </div>
    );
}