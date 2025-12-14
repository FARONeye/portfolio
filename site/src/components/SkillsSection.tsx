"use client";

import ScrollReveal from "./ScrollReveal";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Plane, Gamepad2, Sparkles } from "lucide-react";

type Hub = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  tag: string;
  accentFrom: string;
  accentVia: string;
  accentTo: string;
  motif: "travel" | "passions" | "creation";
};

const hubs: Hub[] = [
  {
    title: "Voyages",
    subtitle: "Carnet d’exploration",
    description:
      "Pays visités, itinéraires, photos, histoires et inspirations qui nourrissent mon travail.",
    href: "/travel",
    tag: "WORLD MODE",
    accentFrom: "#9B1C31",
    accentVia: "#6C1E80",
    accentTo: "#ffffff",
    motif: "travel",
  },
  {
    title: "Passions",
    subtitle: "Création • Jeux • Culture",
    description:
      "Mes univers : gaming, musique, créativité, curiosités… tout ce qui me fait vibrer.",
    href: "/passions",
    tag: "SIDE QUESTS",
    accentFrom: "#6C1E80",
    accentVia: "#C084FC",
    accentTo: "#F472B6",
    motif: "passions",
  },
  {
    title: "Création",
    subtitle: "Projets personnels",
    description:
      "Expérimentations, idées, prototypes… un laboratoire où je teste des concepts visuels & techniques.",
    href: "/creation",
    tag: "LAB",
    accentFrom: "#9B1C31",
    accentVia: "#F472B6",
    accentTo: "#C084FC",
    motif: "creation",
  },
];

/** -------- Utils -------- */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const clamp01 = (v: number) => clamp(v, 0, 1);

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    // Safe in client component
    const touch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        (navigator as any).maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0);
    setIsTouch(!!touch);
  }, []);
  return isTouch;
}

/**
 * Gyro tilt hook:
 * - Updates motion values mx/my in [-0.5..0.5]
 * - Handles iOS permission request (DeviceOrientationEvent.requestPermission)
 */
function useDeviceTilt(enabled: boolean) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const [needsPermission, setNeedsPermission] = useState(false);
  const [active, setActive] = useState(false);

  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    // If iOS requires permission, we won't start until user triggers it
    const D: any = typeof window !== "undefined" ? (window as any).DeviceOrientationEvent : null;
    const requiresPermission = !!(D && typeof D.requestPermission === "function");
    setNeedsPermission(requiresPermission);

    // Non-iOS: start immediately
    if (!requiresPermission) {
      setActive(true);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !active) return;

    const onOri = (e: DeviceOrientationEvent) => {
      // gamma: left-right [-90..90], beta: front-back [-180..180]
      const gamma = typeof e.gamma === "number" ? e.gamma : 0;
      const beta = typeof e.beta === "number" ? e.beta : 0;

      // Make it feel nice: small tilts already visible
      // Normalize into [-0.5..0.5]
      const nx = clamp(gamma / 45, -0.5, 0.5);
      const ny = clamp(beta / 60, -0.5, 0.5);

      // simple smoothing (avoid jitter)
      const sx = last.current.x + (nx - last.current.x) * 0.12;
      const sy = last.current.y + (ny - last.current.y) * 0.12;
      last.current = { x: sx, y: sy };

      mx.set(sx);
      my.set(sy);
    };

    window.addEventListener("deviceorientation", onOri, { passive: true });
    return () => window.removeEventListener("deviceorientation", onOri);
  }, [enabled, active, mx, my]);

  const requestPermission = async () => {
    try {
      const D: any = (window as any).DeviceOrientationEvent;
      if (D && typeof D.requestPermission === "function") {
        const res = await D.requestPermission();
        if (res === "granted") setActive(true);
      }
    } catch {
      // Ignore: keep inactive
    }
  };

  return { mx, my, needsPermission, active, requestPermission };
}

/** -------- Visual bits -------- */
function Sparks({ accentVia, count = 10 }: { accentVia: string; count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: `${(i * 9 + 11) % 100}%`,
        top: `${(i * 17 + 19) % 100}%`,
        delay: `${(i * 0.28).toFixed(2)}s`,
        dur: `${(4.2 + (i % 6) * 0.55).toFixed(2)}s`,
        size: `${(1 + (i % 3)).toFixed(0)}px`,
        op: 0.18 + (i % 5) * 0.07,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0">
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            background: accentVia,
            opacity: d.op,
            filter: "blur(0.2px)",
            boxShadow: `0 0 14px ${accentVia}66`,
            animation: `sparkFloat ${d.dur} ease-in-out infinite`,
            animationDelay: d.delay,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes sparkFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.14;
          }
          50% {
            transform: translate3d(8px, -12px, 0) scale(1.25);
            opacity: 0.45;
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.14;
          }
        }
      `}</style>
    </div>
  );
}

function NeonBorder({
  from,
  via,
  to,
  speed = 14,
}: {
  from: string;
  via: string;
  to: string;
  speed?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[30px] p-[1px]">
      <div
        className="absolute inset-0 rounded-[30px] opacity-60"
        style={{
          background: `conic-gradient(from 180deg, ${from}, ${via}, ${to}, ${from})`,
          filter: "blur(10px)",
          animation: `spinGlow ${speed}s linear infinite`,
        }}
      />
      <div
        className="absolute inset-0 rounded-[30px] opacity-45"
        style={{
          background: `conic-gradient(from 0deg, ${via}, ${to}, ${from}, ${via})`,
          animation: `spinGlow2 ${speed * 1.35}s linear infinite`,
        }}
      />
      <style jsx>{`
        @keyframes spinGlow {
          0% {
            transform: rotate(0deg);
            opacity: 0.28;
          }
          50% {
            opacity: 0.85;
          }
          100% {
            transform: rotate(360deg);
            opacity: 0.28;
          }
        }
        @keyframes spinGlow2 {
          0% {
            transform: rotate(360deg);
            opacity: 0.18;
          }
          50% {
            opacity: 0.55;
          }
          100% {
            transform: rotate(0deg);
            opacity: 0.18;
          }
        }
      `}</style>
    </div>
  );
}

function Motif({ type, accent }: { type: Hub["motif"]; accent: string }) {
  if (type === "travel") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[10%] opacity-[0.16] blur-[0.2px]">
          <Plane size={220} style={{ color: accent, filter: `drop-shadow(0 0 22px ${accent}55)` }} />
        </div>
        <svg className="absolute inset-0 opacity-[0.18]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M -10 70 C 20 40, 45 78, 70 42 S 125 40, 110 18"
            fill="none"
            stroke={accent}
            strokeWidth="0.6"
            strokeDasharray="2 2"
            style={{ animation: "dashTravel 7.5s linear infinite" }}
          />
        </svg>
        <style jsx>{`
          @keyframes dashTravel {
            from {
              stroke-dashoffset: 0;
              opacity: 0.12;
            }
            50% {
              opacity: 0.32;
            }
            to {
              stroke-dashoffset: -18;
              opacity: 0.12;
            }
          }
        `}</style>
      </div>
    );
  }

  if (type === "passions") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6%] bottom-[-10%] opacity-[0.14] blur-[0.2px]">
          <Gamepad2 size={240} style={{ color: accent, filter: `drop-shadow(0 0 22px ${accent}55)` }} />
        </div>
        <div className="absolute right-[8%] top-[18%] flex items-end gap-[6px] opacity-[0.20]">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="block w-[3px] rounded-full"
              style={{
                height: 12 + (i % 5) * 10,
                background: accent,
                boxShadow: `0 0 14px ${accent}55`,
                animation: `eq ${2.6 + (i % 4) * 0.35}s ease-in-out infinite`,
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
        <style jsx>{`
          @keyframes eq {
            0% {
              transform: scaleY(0.65);
              opacity: 0.12;
            }
            50% {
              transform: scaleY(1.25);
              opacity: 0.38;
            }
            100% {
              transform: scaleY(0.65);
              opacity: 0.12;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:34px_34px]" />
      <svg className="absolute inset-0 opacity-[0.16]" viewBox="0 0 100 100">
        <circle cx="72" cy="42" r="18" fill="none" stroke={accent} strokeWidth="0.6" />
        <circle cx="72" cy="42" r="10" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.75" />
        <path
          d="M 54 42 C 60 30, 88 28, 90 44"
          fill="none"
          stroke={accent}
          strokeWidth="0.55"
          strokeDasharray="2 2"
          style={{ animation: "dashCreate 8.5s linear infinite" }}
        />
      </svg>
      <div className="absolute right-[6%] bottom-[10%] opacity-[0.16]">
        <Sparkles size={150} style={{ color: accent, filter: `drop-shadow(0 0 22px ${accent}55)` }} />
      </div>
      <style jsx>{`
        @keyframes dashCreate {
          from {
            stroke-dashoffset: 0;
            opacity: 0.12;
          }
          50% {
            opacity: 0.35;
          }
          to {
            stroke-dashoffset: -20;
            opacity: 0.12;
          }
        }
      `}</style>
    </div>
  );
}

/** -------- Main card -------- */
function HubPanel({ hub, index, align = "left" }: { hub: Hub; index: number; align?: "left" | "right" }) {
  const isTouch = useIsTouchDevice();

  // Mouse tilt (desktop)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Gyro tilt (mobile)
  const gyro = useDeviceTilt(isTouch);

  // Choose source for tilt
  const mx = isTouch ? gyro.mx : mouseX;
  const my = isTouch ? gyro.my : mouseY;

  // Tilt mapping (same ranges as before)
  const rx = useTransform(my, [-0.5, 0.5], [10, -10]);
  const ry = useTransform(mx, [-0.5, 0.5], [-12, 12]);

  const srx = useSpring(rx, { stiffness: 120, damping: 18, mass: 0.65 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18, mass: 0.65 });

  // Parallax internal
  const px = useTransform(mx, [-0.5, 0.5], [-10, 10]);
  const py = useTransform(my, [-0.5, 0.5], [-8, 8]);
  const spx = useSpring(px, { stiffness: 110, damping: 20, mass: 0.65 });
  const spy = useSpring(py, { stiffness: 110, damping: 20, mass: 0.65 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    mouseX.set(px);
    mouseY.set(py);
  };

  const handleLeave = () => {
    if (isTouch) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  const artBg = useMemo(() => {
    return `
      radial-gradient(950px 420px at ${align === "left" ? "20%" : "80%"} 40%, ${hub.accentFrom}38, transparent 62%),
      radial-gradient(850px 420px at ${align === "left" ? "80%" : "20%"} 72%, ${hub.accentVia}2e, transparent 60%),
      radial-gradient(700px 340px at 50% 10%, rgba(255,255,255,0.07), transparent 70%),
      linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.58))
    `;
  }, [hub, align]);

  return (
    <ScrollReveal from={{ opacity: 0, y: 22 }} to={{ opacity: 1, y: 0 }}>
      <Link href={hub.href} className="block">
        <motion.div
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          whileHover={!isTouch ? { y: -10 } : undefined}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          style={{
            transformStyle: "preserve-3d",
            rotateX: srx,
            rotateY: sry,
          }}
          className="group relative h-full overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] shadow-[0_30px_90px_rgba(0,0,0,0.62)]"
        >
          <NeonBorder from={hub.accentFrom} via={hub.accentVia} to={hub.accentTo} speed={14} />
          <div className="absolute inset-0 opacity-95" style={{ background: artBg }} />
          <Motif type={hub.motif} accent={hub.accentVia} />
          <div className="absolute inset-0 opacity-[0.09] mix-blend-overlay [background-image:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.18)_1px,transparent_1px,transparent_3px)]" />
          <Sparks accentVia={hub.accentVia} count={hub.motif === "passions" ? 12 : 9} />

          <div
            className="absolute -inset-16 opacity-55 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
            style={{
              background: `radial-gradient(740px 300px at 50% 45%, ${hub.accentVia}50, transparent 70%)`,
            }}
          />

          {/* sweep */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute top-[-40%] left-[-60%] h-[160%] w-[40%] rotate-12 opacity-30 group-hover:opacity-60"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
                filter: "blur(1px)",
                animation: "sweep 6.2s ease-in-out infinite",
              }}
            />
            <style jsx>{`
              @keyframes sweep {
                0% {
                  transform: translateX(-10%) rotate(12deg);
                  opacity: 0.1;
                }
                50% {
                  transform: translateX(340%) rotate(12deg);
                  opacity: 0.55;
                }
                100% {
                  transform: translateX(340%) rotate(12deg);
                  opacity: 0.1;
                }
              }
            `}</style>
          </div>

          {/* CONTENT */}
          <motion.div
            className="relative z-10 h-full p-8 sm:p-10"
            style={{
              transform: "translateZ(34px)",
              x: spx,
              y: spy,
            }}
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-[0.35em] text-white/75 font-mono">{hub.tag}</span>
                <span className="h-[1px] w-12 bg-white/20" />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: hub.accentVia,
                    boxShadow: `0 0 22px ${hub.accentVia}88`,
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-white/65">0{index + 1}</span>
            </div>

            <div className="mt-9 max-w-2xl">
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.02]">
                {hub.title}
              </h3>

              <p className="mt-3 text-[11px] sm:text-sm uppercase tracking-[0.28em] text-white/70">
                {hub.subtitle}
              </p>

              <p className="mt-5 sm:mt-6 text-sm sm:text-base text-white/80 leading-relaxed max-w-[52ch]">
                {hub.description}
              </p>
            </div>

            <div className="mt-9 sm:mt-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-[1px] w-12"
                  style={{
                    background: `linear-gradient(90deg, ${hub.accentFrom}, ${hub.accentVia}, transparent)`,
                  }}
                />
                <span className="text-sm font-semibold text-white/90">
                  Entrer
                  <span className="inline-block translate-x-1 transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </span>
              </div>

              <div
                className="relative rounded-full border border-white/15 px-4 py-2 text-[11px] font-mono text-white/80 backdrop-blur-md overflow-hidden"
                style={{
                  background: `linear-gradient(90deg, ${hub.accentFrom}28, ${hub.accentVia}28, ${hub.accentTo}18)`,
                }}
              >
                <span className="relative z-10">ENTER PORTAL</span>
                <span
                  className="absolute inset-0 opacity-35"
                  style={{
                    background: `radial-gradient(220px 80px at 30% 50%, ${hub.accentVia}66, transparent 70%)`,
                    animation: "ctaPulse 3.2s ease-in-out infinite",
                  }}
                />
                <style jsx>{`
                  @keyframes ctaPulse {
                    0% {
                      transform: translateX(-10%);
                      opacity: 0.18;
                    }
                    50% {
                      transform: translateX(14%);
                      opacity: 0.55;
                    }
                    100% {
                      transform: translateX(-10%);
                      opacity: 0.18;
                    }
                  }
                `}</style>
              </div>
            </div>

            {/* iOS: permission button overlay (only on touch devices, only if needed & not active) */}
            {isTouch && gyro.needsPermission && !gyro.active && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  gyro.requestPermission();
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[11px] font-mono text-white/85 backdrop-blur-md hover:bg-black/55 transition"
              >
                Enable Motion
                <span className="opacity-70">(iOS)</span>
              </button>
            )}
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 h-28 opacity-90 [background:linear-gradient(to_top,rgba(0,0,0,0.72),transparent)]" />
          <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-0 ring-white/0 transition-all duration-500 group-hover:ring-2 group-hover:ring-white/12" />
        </motion.div>
      </Link>
    </ScrollReveal>
  );
}

/** -------- Section -------- */
export default function SkillsSection() {
  return (
    <section id="explore" className="py-24 sm:py-28 bg-[#0a0a0b] border-y border-white/10">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal from={{ opacity: 0, y: 18 }} to={{ opacity: 1, y: 0 }} className="mb-12 sm:mb-14">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">
              Explorer mon univers
            </span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl">
            Trois portails — PC à la souris, mobile à l’inclinaison du téléphone.
          </p>
        </ScrollReveal>

        <div className="grid gap-8 sm:gap-10">
          <div className="h-[320px] sm:h-[380px] md:h-[430px]">
            <HubPanel hub={hubs[0]} index={0} align="left" />
          </div>

          <div className="h-[320px] sm:h-[380px] md:h-[430px] md:ml-14">
            <HubPanel hub={hubs[1]} index={1} align="right" />
          </div>

          <div className="h-[320px] sm:h-[380px] md:h-[430px]">
            <HubPanel hub={hubs[2]} index={2} align="left" />
          </div>
        </div>
      </div>
    </section>
  );
}
