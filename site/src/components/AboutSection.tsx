"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  X,
  ScanFace,
  Brain,
  Fingerprint,
  Target,
  BriefcaseBusiness,
  ChevronDown,
  Zap,
  Globe,
  Languages,
  GraduationCap,
  Wrench,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import ChibiModel from "./ChibiModel";

const BIRTH_DATE = new Date("2004-06-24");

function computeProfileStats() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let age = currentYear - BIRTH_DATE.getFullYear();

  const hasHadBirthday =
    now.getMonth() > BIRTH_DATE.getMonth() ||
    (now.getMonth() === BIRTH_DATE.getMonth() &&
      now.getDate() >= BIRTH_DATE.getDate());

  if (!hasHadBirthday) age--;

  const lastBirthday = new Date(
    hasHadBirthday ? currentYear : currentYear - 1,
    BIRTH_DATE.getMonth(),
    BIRTH_DATE.getDate()
  );
  const nextBirthday = new Date(
    hasHadBirthday ? currentYear + 1 : currentYear,
    BIRTH_DATE.getMonth(),
    BIRTH_DATE.getDate()
  );

  const totalDuration = nextBirthday.getTime() - lastBirthday.getTime();
  const elapsed = now.getTime() - lastBirthday.getTime();
  const xpPercent = Math.min(
    100,
    Math.max(0, Math.round((elapsed / totalDuration) * 100))
  );

  return { level: age, xp: xpPercent };
}

type PersonaId = "origin" | "studies" | "work" | "goals";
type Rarity = "legendary" | "epic" | "rare" | "common";

type PersonaItem = {
  id: PersonaId;
  slot: string;
  name: string;
  rarity: Rarity;
  icon: ReactNode;
  stats: { label: string; value: string }[];
  desc: string;
  realHobby: string;
  position: string;
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "text-yellow-400 border-yellow-400/50 shadow-yellow-900/50 bg-yellow-400/10";
    case "epic":
      return "text-purple-400 border-purple-400/50 shadow-purple-900/50 bg-purple-400/10";
    case "rare":
      return "text-blue-400 border-blue-400/50 shadow-blue-900/50 bg-blue-400/10";
    default:
      return "text-zinc-400 border-zinc-600/50 shadow-zinc-900/50 bg-zinc-800/50";
  }
};

export default function AboutSection() {
  const t = useTranslations("about");

  const [stats, setStats] = useState<{ level: number; xp: number }>({
    level: 0,
    xp: 0,
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PersonaItem | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);

  const [modelSession, setModelSession] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setStats(computeProfileStats());
  }, []);

  type PersonaI18n = {
  origin: {
    slot: string;
    name: string;
    stats: { label: string; value: string }[];
    desc: string;
    realHobby: string;
  };
  studies: {
    slot: string;
    name: string;
    stats: { label: string; value: string }[];
    desc: string;
    realHobby: string;
  };
  work: {
    slot: string;
    name: string;
    stats: { label: string; value: string }[];
    desc: string;
    realHobby: string;
  };
  goals: {
    slot: string;
    name: string;
    stats: { label: string; value: string }[];
    desc: string;
    realHobby: string;
  };
};

function isPersonaI18n(v: unknown): v is PersonaI18n {
  const o = v as Record<string, unknown> | null;
  return (
    !!o &&
    typeof o === "object" &&
    "origin" in o &&
    "studies" in o &&
    "work" in o &&
    "goals" in o
  );
}

  const PERSONA: PersonaItem[] = useMemo(() => {
    const raw = t.raw("persona");
    if (!isPersonaI18n(raw)) return [];

    const p = raw;

    return [
      {
        id: "origin",
        slot: p.origin.slot,
        name: p.origin.name,
        rarity: "legendary",
        icon: <Fingerprint size={24} />,
        stats: p.origin.stats,
        desc: p.origin.desc,
        realHobby: p.origin.realHobby,
        position: "top-6 left-4 md:top-20 md:left-20",
      },
      {
        id: "studies",
        slot: p.studies.slot,
        name: p.studies.name,
        rarity: "epic",
        icon: <Brain size={24} />,
        stats: p.studies.stats,
        desc: p.studies.desc,
        realHobby: p.studies.realHobby,
        position: "top-1/2 -translate-y-1/2 left-4 md:left-10",
      },
      {
        id: "work",
        slot: p.work.slot,
        name: p.work.name,
        rarity: "rare",
        icon: <BriefcaseBusiness size={24} />,
        stats: p.work.stats,
        desc: p.work.desc,
        realHobby: p.work.realHobby,
        position: "top-1/2 -translate-y-1/2 right-4 md:right-10",
      },
      {
        id: "goals",
        slot: p.goals.slot,
        name: p.goals.name,
        rarity: "common",
        icon: <Target size={24} />,
        stats: p.goals.stats,
        desc: p.goals.desc,
        realHobby: p.goals.realHobby,
        position: "bottom-24 right-6 md:bottom-20 md:right-20",
      },
    ];
  }, [t]);


  const lockScroll = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };

  const forceResize = () => {
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    setTimeout(() => window.dispatchEvent(new Event("resize")), 150);
  };

  const openInventory = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setModelSession((s) => s + 1);
    setSelectedItem(null);
    setIsModelReady(false);
    setIsExpanded(true);

    lockScroll();

    timerRef.current = setTimeout(() => {
      setIsModelReady(true);
      forceResize();
    }, 600);
  };

  const closeInventory = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;

    setIsExpanded(false);
    setSelectedItem(null);
    setIsModelReady(false);

    unlockScroll();
  };

  return (
    <section
      id="about"
      className="bg-[#0A0A0B] py-24 md:py-32 border-y border-white/10 relative z-20"
    >
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#9B1C31]/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 grid gap-16 md:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            <span className="bg-linear-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h2>

          <div className="space-y-6 text-lg text-[#b3b3b3] leading-relaxed text-pretty">
            <p>
              {t.rich("intro", {
                name: (chunks) => (
                  <span className="text-white font-medium">{chunks}</span>
                ),
              })}
            </p>

            <div className="pt-4">
              <button
                onClick={openInventory}
                className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-[#6C1E80]/50 transition-all active:scale-95"
              >
                <span className="text-white font-medium">{t("open")}</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>

              <div className="mt-3 text-xs text-white/40">{t("tip")}</div>
            </div>
          </div>
        </motion.div>

        <div className="relative w-full h-[500px] flex items-center justify-center">
          {!isExpanded && (
            <motion.div
              layoutId="character-sheet"
              onClick={openInventory}
              className="relative w-[300px] h-[450px] bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Image
                src="/portrait2.webp"
                alt="Preview"
                fill
                sizes="300px"
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                priority={false}
              />
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 font-mono">CLASS</span>
                  <span className="text-sm font-bold text-white tracking-widest">
                    CREATIVE_DEV
                  </span>
                </div>
                <div className="px-2 py-1 bg-[#9B1C31] rounded text-xs font-bold text-white">
                  LVL {stats.level || "—"}
                </div>
              </div>

              <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-black via-black/80 to-transparent flex items-end p-6">
                <p className="text-white font-mono text-sm animate-pulse">
                  {t("previewHint")}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeInventory}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />

            <motion.div
              layoutId="character-sheet"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-[100dvh] md:max-w-7xl md:h-auto md:max-h-[90vh] bg-[url('/grid-pattern.svg')] bg-zinc-950 border-white/10 md:border md:rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={closeInventory}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 backdrop-blur-md group shadow-lg"
              >
                <X
                  size={24}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>

              {/* 3D CENTER */}
              <div className="relative w-full h-[40vh] md:h-auto md:flex-1 order-1 md:order-2 flex items-center justify-center bg-gradient-to-b from-transparent to-black/40 shrink-0">
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  {isModelReady ? (
                    <motion.div
                      className="w-full h-full"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <ChibiModel key={`chibi-${modelSession}`} />
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-[#9B1C31]">
                      <div className="relative w-12 h-12 md:w-16 md:h-16">
                        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-[#9B1C31] rounded-full animate-spin"></div>
                      </div>
                      <p className="font-mono text-[10px] md:text-xs tracking-widest text-zinc-500 animate-pulse">
                        LOADING SYSTEM...
                      </p>
                    </div>
                  )}
                </div>

                {isModelReady && (
                  <div className="absolute inset-0 z-20 pointer-events-none p-2">
                    {PERSONA.map((item, i) => {
                      const active = selectedItem?.id === item.id;

                      return (
                        <motion.button
                          key={item.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          onClick={() => setSelectedItem(item)}
                          className={`absolute ${item.position} pointer-events-auto group touch-manipulation`}
                          type="button"
                          aria-label={`${item.slot}: ${item.name}`}
                        >
                          <div
                            className={[
                              "relative",
                              "w-12 h-12 md:w-14 md:h-14",
                              "backdrop-blur-md rounded-xl flex items-center justify-center",
                              "transition-all duration-300 border-2",
                              "shadow-[0_18px_60px_rgba(0,0,0,0.55)]",
                              "cursor-pointer",
                              active
                                ? "scale-110 ring-2 ring-white/20 shadow-[0_0_22px_rgba(255,255,255,0.12)]"
                                : "hover:scale-110 ring-1 ring-white/10",
                              getRarityColor(item.rarity),
                              active
                                ? "bg-white/15"
                                : "bg-black/40 border-white/10",
                            ].join(" ")}
                          >
                            {item.icon}

                            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
                              <span
                                className={[
                                  "px-2 py-0.5 rounded-full",
                                  "text-[9px] font-mono tracking-[0.25em] uppercase",
                                  "border border-white/10",
                                  active
                                    ? "bg-white/10 text-white/80"
                                    : "bg-black/40 text-white/55 group-hover:text-white/80",
                                ].join(" ")}
                              >
                                {item.slot}
                              </span>
                            </div>

                            <div className="pointer-events-none absolute left-1/2 top-[-10px] -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="rounded-xl border border-white/10 bg-black/80 px-3 py-2 text-[11px] text-white/80 shadow-xl backdrop-blur-md">
                                <div className="font-semibold text-white/90">
                                  {item.name}
                                </div>
                                <div className="text-white/55">
                                  {t("tooltip")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* LEFT PANEL */}
              <div className="w-full md:w-1/4 bg-[#0F0F11]/95 backdrop-blur-md border-t md:border-t-0 md:border-r border-white/10 p-4 md:p-6 flex flex-col gap-4 md:gap-6 order-2 md:order-1 z-20 shadow-2xl overflow-y-auto custom-scrollbar flex-1 md:flex-none">
                <div className="flex items-center gap-3 md:gap-4 shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-800 rounded-full overflow-hidden border-2 border-white/10 p-1 shrink-0">
                    <Image
                      src="/portrait2.webp"
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white font-bold text-base md:text-lg leading-tight">
                      Mathis Truong
                    </h3>

                    <div className="flex flex-col gap-1 w-full mt-1">
                      <div className="flex justify-between text-[9px] md:text-[10px] text-zinc-400 font-mono tracking-wider">
                        <span>LVL {stats.level || "—"}</span>
                        <span>{stats.xp}% TO LVL {stats.level + 1 || "—"}</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-[#9B1C31] to-[#6C1E80]"
                          style={{ width: `${stats.xp}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 bg-white/5 p-4 md:p-5 rounded-xl border border-white/5">
                  <h4 className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">
                    {t("summaryTitle")}
                  </h4>

                  <AttributeRow
                    icon={<Globe size={16} className="text-blue-400" />}
                    label={t("summary.location")}
                    value={t("summary.locationValue")}
                  />
                  <AttributeRow
                    icon={<ScanFace size={16} className="text-[#9B1C31]" />}
                    label={t("summary.role")}
                    value={t("summary.roleValue")}
                  />
                  <AttributeRow
                    icon={<GraduationCap size={16} className="text-purple-400" />}
                    label={t("summary.studies")}
                    value={t("summary.studiesValue")}
                  />
                  <AttributeRow
                    icon={
                      <BriefcaseBusiness size={16} className="text-blue-400" />
                    }
                    label={t("summary.company")}
                    value={t("summary.companyValue")}
                  />
                  <AttributeRow
                    icon={<Languages size={16} className="text-emerald-400" />}
                    label={t("summary.languages")}
                    value={t("summary.languagesValue")}
                  />
                  <AttributeRow
                    icon={<Target size={16} className="text-orange-400" />}
                    label={t("summary.goal")}
                    value={t("summary.goalValue")}
                  />
                  <AttributeRow
                    icon={<Sparkles size={16} className="text-pink-400" />}
                    label={t("summary.status")}
                    value={t("summary.statusValue")}
                  />
                  <AttributeRow
                    icon={<Wrench size={16} className="text-zinc-300" />}
                    label={t("summary.xp")}
                    value={t("summary.xpValue")}
                  />
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 pb-8 md:pb-0 text-center">
                  <p className="text-[10px] md:text-xs text-zinc-500 font-mono">
                    ID: 8493-MT • LOC: EARTH-FR
                  </p>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div
                className={`w-full md:w-1/4 bg-[#0F0F11] md:bg-[#0F0F11]/95 backdrop-blur-md border-t md:border-t-0 md:border-l border-white/10 p-6 flex flex-col z-40 shadow-2xl absolute inset-x-0 bottom-0 top-auto h-[60vh] md:h-auto md:inset-auto md:relative transition-transform duration-300 ease-out rounded-t-3xl md:rounded-none order-3 md:order-3 ${
                  selectedItem
                    ? "translate-y-0"
                    : "translate-y-[110%] md:translate-y-0"
                } md:transform-none overflow-y-auto custom-scrollbar`}
              >
                <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-6 md:hidden shrink-0" />

                <button
                  onClick={() => setSelectedItem(null)}
                  className="md:hidden absolute top-4 right-4 p-2 bg-zinc-800/50 rounded-full text-zinc-400 hover:text-white"
                >
                  <ChevronDown size={20} />
                </button>

                <div className="flex-1 flex flex-col">
                  {selectedItem ? (
                    <motion.div
                      key={selectedItem.id}
                      initial={{ opacity: 0, x: 0, y: 10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <div
                          className={`text-xs font-bold tracking-widest uppercase mb-2 inline-block px-2 py-0.5 rounded ${
                            selectedItem.rarity === "legendary"
                              ? "text-yellow-400 bg-yellow-400/10"
                              : selectedItem.rarity === "epic"
                              ? "text-purple-400 bg-purple-400/10"
                              : selectedItem.rarity === "rare"
                              ? "text-blue-400 bg-blue-400/10"
                              : "text-zinc-400 bg-white/5"
                          }`}
                        >
                          {selectedItem.slot}
                        </div>
                        <h2 className="text-2xl font-bold text-white font-mono leading-tight">
                          {selectedItem.name}
                        </h2>
                      </div>

                      <p className="text-zinc-400 italic text-sm border-l-2 border-zinc-700 pl-3">
                        &quot;{selectedItem.desc}&quot;
                      </p>

                      <div className="grid grid-cols-2 gap-2 my-2">
                        {selectedItem.stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="bg-black/40 p-2 rounded border border-white/5"
                          >
                            <div className="text-[10px] text-zinc-500 uppercase">
                              {stat.label}
                            </div>
                            <div className="text-white font-mono text-sm">
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 mt-auto">
                        <span className="text-xs text-zinc-500 uppercase">
                          {t("right.activeNode")}
                        </span>
                        <div className="text-white font-bold mt-1 flex items-center gap-2">
                          <Zap size={16} className="text-yellow-400" />
                          {selectedItem.realHobby}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="hidden md:flex h-full flex-col items-center justify-center text-zinc-600 opacity-50 space-y-4">
                      <Target size={48} className="animate-pulse" />
                      <p className="font-mono text-sm text-center">
                        {t("right.placeholder")}
                      </p>
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

function AttributeRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between group gap-3">
      <div className="flex items-center gap-3 text-zinc-400 text-xs md:text-sm">
        {icon} <span>{label}</span>
      </div>
      <span className="text-white text-xs md:text-sm font-medium text-right">
        {value}
      </span>
    </div>
  );
}
