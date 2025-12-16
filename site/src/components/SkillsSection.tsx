"use client";

import ScrollReveal from "./ScrollReveal";
import React, { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Plane, Gamepad2, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTeleport } from "@/components/TeleportProvider";

type HubMotif = "travel" | "passions" | "creation";

type Hub = {
  key: "travel" | "passions" | "creation";
  title: string;
  subtitle: string;
  description: string;
  href: string;
  tag: string;
  accentFrom: string;
  accentVia: string;
  accentTo: string;
  motif: HubMotif;
};


function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch =
      "ontouchstart" in window || (navigator?.maxTouchPoints ?? 0) > 0;
    setIsTouch(touch);
  }, []);

  return isTouch;
}

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
    </div>
  );
}

function Motif({ type, accent }: { type: HubMotif; accent: string }) {
  if (type === "travel") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[10%] opacity-[0.16] blur-[0.2px]">
          <Plane
            size={220}
            style={{ color: accent, filter: `drop-shadow(0 0 22px ${accent}55)` }}
          />
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
      </div>
    );
  }

  if (type === "passions") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6%] bottom-[-10%] opacity-[0.14] blur-[0.2px]">
          <Gamepad2
            size={240}
            style={{ color: accent, filter: `drop-shadow(0 0 22px ${accent}55)` }}
          />
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
        <Sparkles
          size={150}
          style={{ color: accent, filter: `drop-shadow(0 0 22px ${accent}55)` }}
        />
      </div>
    </div>
  );
}

function HubPanel({
  hub,
  index,
  align = "left",
  enterLabel,
  portalLabel,
  onEnter,
}: {
  hub: Hub;
  index: number;
  align?: "left" | "right";
  enterLabel: string;
  portalLabel: string;
  onEnter: (href: string) => void;
}) {
  const isTouch = useIsTouchDevice();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rx = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const ry = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);

  const srx = useSpring(rx, { stiffness: 120, damping: 18, mass: 0.65 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18, mass: 0.65 });

  const px = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const py = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);
  const spx = useSpring(px, { stiffness: 110, damping: 20, mass: 0.65 });
  const spy = useSpring(py, { stiffness: 110, damping: 20, mass: 0.65 });

  // ✅ FIX TS: button -> HTMLButtonElement
  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTouch) return; // ✅ pas de motion au toucher
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
      <motion.button
        type="button"
        onClick={() => onEnter(hub.href)}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={!isTouch ? { y: -10 } : undefined}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        style={{
          transformStyle: "preserve-3d",
          rotateX: !isTouch ? srx : 0,
          rotateY: !isTouch ? sry : 0,
        }}
        className="group relative h-full w-full text-left overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] shadow-[0_30px_90px_rgba(0,0,0,0.62)]"
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

        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-[-40%] left-[-60%] h-[160%] w-[40%] rotate-12 opacity-30 group-hover:opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
              filter: "blur(1px)",
              animation: "sweep 6.2s ease-in-out infinite",
            }}
          />
        </div>

        <motion.div
          className="relative z-10 h-full p-8 sm:p-10"
          style={{
            transform: "translateZ(34px)",
            x: !isTouch ? spx : 0,
            y: !isTouch ? spy : 0,
          }}
        >
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[0.35em] text-white/75 font-mono">
                {hub.tag}
              </span>
              <span className="h-[1px] w-12 bg-white/20" />
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: hub.accentVia,
                  boxShadow: `0 0 22px ${hub.accentVia}88`,
                }}
              />
            </div>
            <span className="text-[10px] font-mono text-white/65">
              {String(index + 1).padStart(2, "0")}
            </span>
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
                {enterLabel}
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
              <span className="relative z-10">{portalLabel}</span>
              <span
                className="absolute inset-0 opacity-35"
                style={{
                  background: `radial-gradient(220px 80px at 30% 50%, ${hub.accentVia}66, transparent 70%)`,
                  animation: "ctaPulse 3.2s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 h-28 opacity-90 [background:linear-gradient(to_top,rgba(0,0,0,0.72),transparent)]" />
        <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-0 ring-white/0 transition-all duration-500 group-hover:ring-2 group-hover:ring-white/12" />
      </motion.button>
    </ScrollReveal>
  );
}

export default function SkillsSection() {
  const t = useTranslations("skills");
  const locale = useLocale();
  const { startTeleport } = useTeleport();

  const hubs: Hub[] = useMemo(
    () => [
      {
        key: "travel",
        title: t("hubs.travel.title"),
        subtitle: t("hubs.travel.subtitle"),
        description: t("hubs.travel.description"),
        href: `/${locale}/travel`,
        tag: t("hubs.travel.tag"),
        accentFrom: "#9B1C31",
        accentVia: "#6C1E80",
        accentTo: "#ffffff",
        motif: "travel",
      },
      {
        key: "passions",
        title: t("hubs.passions.title"),
        subtitle: t("hubs.passions.subtitle"),
        description: t("hubs.passions.description"),
        href: `/${locale}/projects/en-cours?p=passions`,
        tag: t("hubs.passions.tag"),
        accentFrom: "#6C1E80",
        accentVia: "#C084FC",
        accentTo: "#F472B6",
        motif: "passions",
      },
      {
        key: "creation",
        title: t("hubs.creation.title"),
        subtitle: t("hubs.creation.subtitle"),
        description: t("hubs.creation.description"),
        href: `/${locale}/projects/en-cours?p=creation`,
        tag: t("hubs.creation.tag"),
        accentFrom: "#9B1C31",
        accentVia: "#F472B6",
        accentTo: "#C084FC",
        motif: "creation",
      },
    ],
    [t, locale]
  );

  const handleEnter = (href: string) => startTeleport(href, { minMs: 1500 });

  return (
    <section id="explore" className="py-24 sm:py-28 bg-[#0a0a0b] border-y border-white/10">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal from={{ opacity: 0, y: 18 }} to={{ opacity: 1, y: 0 }} className="mb-12 sm:mb-14">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl">{t("subtitle")}</p>
        </ScrollReveal>

        <div className="grid gap-8 sm:gap-10">
          <div className="h-[320px] sm:h-[380px] md:h-[430px]">
            <HubPanel
              hub={hubs[0]}
              index={0}
              align="left"
              enterLabel={t("enter")}
              portalLabel={t("portal")}
              onEnter={handleEnter}
            />
          </div>

          <div className="h-[320px] sm:h-[380px] md:h-[430px] md:ml-14">
            <HubPanel
              hub={hubs[1]}
              index={1}
              align="right"
              enterLabel={t("enter")}
              portalLabel={t("portal")}
              onEnter={handleEnter}
            />
          </div>

          <div className="h-[320px] sm:h-[380px] md:h-[430px]">
            <HubPanel
              hub={hubs[2]}
              index={2}
              align="left"
              enterLabel={t("enter")}
              portalLabel={t("portal")}
              onEnter={handleEnter}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
