"use client";
import { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
// CORRECTION ICI : Ajout de "Cpu" dans la liste
import { X, Gamepad2, Plane, Code2, Zap, Glasses, Cpu } from "lucide-react"; 
import ChibiModel from "./ChibiModel";

// --- DONNÉES ---
const GEAR = [
  {
    id: "head",
    slot: "HEAD",
    name: "Visionary Lens MK-II",
    rarity: "legendary",
    icon: <Glasses size={24} />,
    stats: [
        { label: "Creativity", value: "+100" },
        { label: "Focus", value: "Infinite" }
    ],
    desc: "Allows the user to capture moments in time and see the world through artistic angles.",
    realHobby: "Photography & Filmmaking",
    position: "top-4 left-4 md:top-20 md:left-20", 
    lineOrigin: "bottom-right",
  },
  {
    id: "r_hand",
    slot: "MAIN HAND",
    name: "Mechanical Keyblade",
    rarity: "epic",
    icon: <Code2 size={24} />,
    stats: [
        { label: "Typing Speed", value: "110 WPM" },
        { label: "Bugs Fixed", value: "99%" }
    ],
    desc: "A powerful tool capable of weaving complex logic into digital reality.",
    realHobby: "Fullstack Development",
    position: "top-1/2 left-4 md:top-1/2 md:left-10",
    lineOrigin: "right",
  },
  {
    id: "l_hand",
    slot: "OFF HAND",
    name: "Tactical Controller",
    rarity: "rare",
    icon: <Gamepad2 size={24} />,
    stats: [
        { label: "Reflexes", value: "0.15ms" },
        { label: "Rank", value: "Diamond" }
    ],
    desc: "Enhances strategic thinking and hand-eye coordination in virtual battlegrounds.",
    realHobby: "Competitive Gaming",
    position: "top-1/2 right-4 md:top-1/2 md:right-10",
    lineOrigin: "left",
  },
  {
    id: "feet",
    slot: "BOOTS",
    name: "Boots of Wandering",
    rarity: "common",
    icon: <Plane size={24} />,
    stats: [
        { label: "Stamina", value: "+50" },
        { label: "Culture", value: "MAX" }
    ],
    desc: "Grants the ability to traverse borders and absorb knowledge from new lands.",
    realHobby: "Travel & Exploration",
    position: "bottom-10 right-10 md:bottom-20 md:right-20",
    lineOrigin: "top-left",
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
  
  // État pour gérer le chargement différé de la 3D
  const [isModelReady, setIsModelReady] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExpanded) {
      // On attend 600ms pour être sûr que la div est stable
      timer = setTimeout(() => setIsModelReady(true), 600);
    } else {
      setIsModelReady(false);
      setSelectedGear(null);
    }
    return () => clearTimeout(timer);
  }, [isExpanded]);

  return (
    <section id="about" className="bg-[#0A0A0B] py-24 md:py-32 border-y border-white/10 relative z-20">
      
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#9B1C31]/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 grid gap-16 md:grid-cols-2 items-center">
        
        {/* --- Colonne Gauche --- */}
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
                 <button 
                    onClick={() => setIsExpanded(true)}
                    className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-[#6C1E80]/50 transition-all active:scale-95"
                 >
                    <span className="text-white font-medium">Open Inventory</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                 </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* --- Colonne Droite (Preview) --- */}
        <div className="relative w-full h-[500px] flex items-center justify-center">
            {!isExpanded && (
              <motion.div
                layoutId="character-sheet"
                onClick={() => setIsExpanded(true)}
                className="relative w-[300px] h-[450px] bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <img 
                    src="/portrait2.webp" 
                    alt="Character Preview" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-black via-black/80 to-transparent flex items-end p-6">
                    <p className="text-white font-mono text-sm animate-pulse">Click to inspect gear...</p>
                </div>
              </motion.div>
            )}
        </div>
      </div>

      {/* --- LE MODAL RPG --- */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 overflow-hidden">
            
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              layoutId="character-sheet"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-7xl h-full max-h-[90vh] bg-[url('/grid-pattern.svg')] bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_100px_-20px_rgba(108,30,128,0.3)] flex flex-col md:flex-row"
            >
              
              {/* --- 1. ZONE 3D CENTRALE --- */}
              <div className="relative flex-1 order-1 md:order-2 flex items-center justify-center h-[50vh] md:h-auto bg-gradient-to-b from-transparent to-black/40">
                 
                 <div className="absolute inset-0 z-0 flex items-center justify-center">
                    {isModelReady ? (
                        <motion.div 
                            className="w-full h-full"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <ChibiModel />
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-[#9B1C31]">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-t-[#9B1C31] rounded-full animate-spin"></div>
                            </div>
                            <p className="font-mono text-xs tracking-widest text-zinc-500 animate-pulse">
                                INITIALIZING SYSTEM...
                            </p>
                        </div>
                    )}
                 </div>

                 {isModelReady && (
                     <div className="absolute inset-0 z-10 pointer-events-none">
                        {GEAR.map((item, i) => (
                            <motion.button
                                key={item.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                onClick={() => setSelectedGear(item)}
                                className={`absolute ${item.position} pointer-events-auto group`}
                            >
                                <div className={`w-12 h-12 md:w-16 md:h-16 backdrop-blur-md rounded-lg flex items-center justify-center transition-all duration-300 border-2 hover:scale-110 ${getRarityColor(item.rarity)} ${selectedGear?.id === item.id ? "scale-110 shadow-[0_0_20px_currentColor] bg-white/20" : "bg-black/40 border-white/10"}`}>
                                    {item.icon}
                                </div>
                            </motion.button>
                        ))}
                     </div>
                 )}
              </div>

              {/* --- 2. GAUCHE : STATS --- */}
              <div className="w-full md:w-1/4 bg-[#0F0F11]/90 backdrop-blur-md border-r border-white/10 p-6 flex flex-col gap-6 order-2 md:order-1 z-20 shadow-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full overflow-hidden border border-white/20">
                        <img src="/portrait2.webp" className="w-full h-full object-cover" alt="Profile" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Mathis Truong</h3>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-20 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-[80%] bg-linear-to-r from-[#9B1C31] to-[#6C1E80]" />
                            </div>
                            <span className="text-xs text-zinc-500">XP 80%</span>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between text-sm text-zinc-400"><span>STR (Coding)</span> <span className="text-white font-mono">18</span></div>
                    <div className="flex justify-between text-sm text-zinc-400"><span>DEX (Gaming)</span> <span className="text-white font-mono">14</span></div>
                    <div className="flex justify-between text-sm text-zinc-400"><span>INT (Learning)</span> <span className="text-white font-mono">20</span></div>
                 </div>
                 
                 <div className="mt-auto text-xs text-zinc-600 text-center font-mono">
                    ID: 8493-AD-X • SERVER: EU-WEST
                 </div>
              </div>

              {/* --- 3. DROITE : DÉTAILS --- */}
              <div className="w-full md:w-1/4 bg-[#0F0F11]/90 backdrop-blur-md border-l border-white/10 p-6 flex flex-col order-3 z-20 relative shadow-2xl">
                 <button 
                    onClick={() => setIsExpanded(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                 >
                    <X size={20} />
                 </button>

                 <div className="mt-8 flex-1">
                    {selectedGear ? (
                        <motion.div 
                            key={selectedGear.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <div className={`text-xs font-bold tracking-widest uppercase mb-2 inline-block px-2 py-0.5 rounded ${selectedGear.rarity === 'legendary' ? 'text-yellow-400 bg-yellow-400/10' : selectedGear.rarity === 'epic' ? 'text-purple-400 bg-purple-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                                    {selectedGear.rarity} Item
                                </div>
                                <h2 className="text-2xl font-bold text-white font-mono leading-tight">{selectedGear.name}</h2>
                            </div>

                            <p className="text-zinc-400 italic text-sm border-l-2 border-zinc-700 pl-3">
                                "{selectedGear.desc}"
                            </p>

                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <span className="text-xs text-zinc-500 uppercase">Equipped Skill</span>
                                <div className="text-white font-bold mt-1 flex items-center gap-2">
                                    <Zap size={16} className="text-yellow-400" />
                                    {selectedGear.realHobby}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50 space-y-4">
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