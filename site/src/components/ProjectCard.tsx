"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useMemo, useRef, useState, MouseEvent as ReactMouseEvent } from "react";
import { ArrowLeft, Clapperboard } from "lucide-react";
import Image from "next/image";

export type ProjectCardData = {
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  index: number;
  kind: string;
  year: string;
  stack: string[];
  accentFrom: string;
  accentVia: string;
  accentTo: string;
};

export default function ProjectCard({
  data,
  variant = "side",
  mode = "grid",
  onOpen,
  onBack,
  onEnter,
}: {
  data: ProjectCardData;
  variant?: "featured" | "side" | "focus";
  mode?: "grid" | "focus";
  onOpen?: (index: number) => void;
  onBack?: () => void;
  onEnter?: (href: string) => void;
}) {
  const { title, subtitle, imageUrl, href, index, kind, year, stack, accentFrom, accentVia, accentTo } = data;

  const ref = useRef<HTMLDivElement>(null);

  // Scroll reveal (only meaningful in grid)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "end 40%"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.35 });

  const opacity = useTransform(p, [0, 0.15, 1], [0, 1, 1]);
  const y = useTransform(p, [0, 1], [32, 0]);
  const scale = useTransform(p, [0, 1], [0.985, 1]);

  // Hover tilt (grid only)
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);
  const [hovered, setHovered] = useState(false);

  function handleMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (mode !== "grid") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const max = variant === "featured" ? 5 : 4;
    setRy((nx - 0.5) * max * 2);
    setRx(-(ny - 0.5) * max * 2);
  }

  // deterministic sparks (no random)
  const sparks = useMemo(() => {
    const base = [
      { l: "8%", t: "18%" },
      { l: "92%", t: "22%" },
      { l: "12%", t: "86%" },
      { l: "88%", t: "78%" },
    ];
    return base.map((b, i) => ({
      ...b,
      size: 2 + ((index + i) % 2),
      op: 0.22 + ((index + i) % 3) * 0.08,
      delay: (i * 0.35 + index * 0.15).toFixed(2),
    }));
  }, [index]);

  const heightClass =
    variant === "featured"
      ? "min-h-[420px] sm:min-h-[520px]"
      : variant === "focus"
      ? "min-h-[520px] sm:min-h-[640px]"
      : "min-h-[240px] sm:min-h-[250px]";

  const titleClass =
    variant === "featured"
      ? "text-5xl sm:text-6xl"
      : variant === "focus"
      ? "text-5xl sm:text-7xl"
      : "text-2xl sm:text-3xl";

  const paddingClass = variant === "focus" ? "p-10 sm:p-12" : "p-8 sm:p-10";

  const showStack = variant === "featured" || variant === "focus";

  const handleClick = () => {
    if (mode !== "grid") return;
    onOpen?.(index);
  };

  return (
    <motion.div
      ref={ref}
      layoutId={`card-${index}`}
      layout
      className={[
        "group relative w-full overflow-hidden rounded-[28px] border border-white/10",
        "bg-[#0b0b10]/55 shadow-[0_28px_100px_rgba(0,0,0,0.60)]",
        heightClass,
        mode === "grid" ? "cursor-pointer" : "cursor-default",
      ].join(" ")}
      style={{
        opacity: mode === "grid" ? opacity : 1,
        y: mode === "grid" ? y : 0,
        scale: mode === "grid" ? scale : 1,
        transformStyle: "preserve-3d",
        rotateX: mode === "grid" && hovered ? rx : 0,
        rotateY: mode === "grid" && hovered ? ry : 0,
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => mode === "grid" && setHovered(true)}
      onMouseLeave={() => mode === "grid" && setHovered(false)}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.45 }}
      onClick={handleClick}
      aria-label={mode === "grid" ? `${title} — ouvrir` : `${title} — focus`}
      role={mode === "grid" ? "button" : undefined}
    >
      {/* Poster background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(900px 380px at 18% 18%, ${accentFrom}2a, transparent 60%),
            radial-gradient(760px 360px at 85% 24%, ${accentVia}22, transparent 60%),
            radial-gradient(900px 520px at 50% 120%, ${accentTo}12, transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.62))
          `,
        }}
      />

      {/* Grain + vignette */}
      <div className="pointer-events-none absolute inset-0 cinematic-grain opacity-40" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1000px_700px_at_50%_35%,rgba(255,255,255,0.03),transparent_60%),radial-gradient(1200px_900px_at_50%_70%,rgba(0,0,0,0.55),rgba(0,0,0,0.92))]" />

      {/* Projector sweep */}
      <div className="pointer-events-none absolute inset-0 cinematic-sweep opacity-0 transition-opacity duration-500 group-hover:opacity-70" />

      {/* Sparks */}
      <div className="pointer-events-none absolute inset-0">
        {sparks.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: s.l,
              top: s.t,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: accentVia,
              opacity: s.op,
              boxShadow: `0 0 16px ${accentVia}80`,
              animation: `sparkFloat 4.8s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Corner logo (Option A) */}
      <div className="absolute top-6 right-6">
        <div
          className="absolute -inset-6 rounded-3xl blur-2xl opacity-35"
          style={{
            background: `radial-gradient(220px 140px at 50% 50%, ${accentVia}66, transparent 70%)`,
          }}
        />
        <Image
          src={imageUrl}
          alt={title}
          width={160}
          height={160}
          className={[
            "relative w-auto",
            variant === "focus" ? "h-16 sm:h-20" : variant === "featured" ? "h-16 sm:h-20" : "h-12 sm:h-14",
            "opacity-85 grayscale transition-all duration-500",
            "group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.04]",
          ].join(" ")}
          priority={variant === "featured"}
        />
      </div>

      {/* Back button (only in focus mode) */}
      {mode === "focus" && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBack?.();
          }}
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/35 px-4 py-2 text-[12px] text-white/85 backdrop-blur-md hover:bg-black/55 transition"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
      )}

      {/* Content */}
      <div className={`relative z-10 ${paddingClass}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.42em] text-white/55 font-mono uppercase">
              {kind}
            </span>
            <span className="h-[1px] w-12 bg-white/10" />
            <span className="text-[10px] tracking-[0.42em] text-white/35 font-mono uppercase">
              {year}
            </span>
          </div>

          <span className="text-[10px] tracking-[0.42em] text-white/30 font-mono uppercase">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className={`mt-5 font-black tracking-tight text-white leading-[1.02] ${titleClass}`}>
          {title}
        </h3>

        <p className="mt-3 text-white/70 max-w-[70ch]">{subtitle}</p>

        {/* Focus-only cinematic header line */}
        {mode === "focus" && (
          <div className="mt-6 flex items-center gap-3 text-white/60">
            <Clapperboard size={18} />
            <span className="text-[11px] font-mono tracking-[0.28em] uppercase">
              Feature Presentation
            </span>
            <span className="h-[1px] w-20 bg-white/10" />
            <span className="text-[11px] font-mono tracking-[0.28em] uppercase">
              Cut • Light • Motion
            </span>
          </div>
        )}

        {/* Stack */}
        {showStack && (
          <div className="mt-6 flex flex-wrap gap-2">
            {stack.slice(0, mode === "focus" ? 6 : 4).map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* CTA row */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="h-[1px] w-14"
              style={{
                background: `linear-gradient(90deg, ${accentFrom}, ${accentVia}, transparent)`,
              }}
            />
            <span className="text-[11px] tracking-[0.28em] text-white/70 font-mono uppercase">
              {mode === "focus" ? "Enter the project" : "Open project"}
            </span>
          </div>

          {mode === "focus" ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEnter?.(href);
              }}
              className="group relative overflow-hidden rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/[0.10]"
            >
              <span className="relative z-10">Entrer dans ce projet</span>
              <span
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(220px 80px at 30% 50%, ${accentVia}55, transparent 70%)`,
                }}
              />
            </button>
          ) : (
            <span className="text-white/60 text-sm group-hover:text-white/85 transition">→</span>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-80 [background:linear-gradient(to_top,rgba(0,0,0,0.60),transparent)]" />
    </motion.div>
  );
}
