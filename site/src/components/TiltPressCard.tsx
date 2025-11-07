"use client";

import React, { useEffect, useMemo, useRef } from "react";

type TiltPressCardProps = {
  src: string;
  alt: string;
  className?: string;
  /** Rayon des coins en px (appliqué via border-radius du conteneur) */
  radius?: number;       // défaut 24
  /** Intensité de la bascule en degrés */
  maxTilt?: number;      // défaut 12
  /** Profondeur “press” en px (translateZ négatif) */
  pressDepth?: number;   // défaut 10
  /** Ratio largeur/hauteur (ex: 3/4 = 0.75). Sert pour générer un wrapper aspect */
  aspect?: number;       // défaut 3/4
};

export default function TiltPressCard({
  src,
  alt,
  className,
  radius = 24,
  maxTilt = 12,
  pressDepth = 10,
  aspect = 3 / 4,
}: TiltPressCardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shineRef = useRef<HTMLDivElement | null>(null);

  // cibles → animées par raf (pour lisser)
  const target = useRef({ rx: 0, ry: 0, tz: 0, px: 0.5, py: 0.5, over: false });
  const cur = useRef({ rx: 0, ry: 0, tz: 0, px: 0.5, py: 0.5 });
  const rafId = useRef<number | null>(null);

  const aspectPadding = useMemo(() => `${(1 / (aspect <= 0 ? 1 : aspect)) * 100}%`, [aspect]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / Math.max(r.width, 1);  // 0..1
    const py = (e.clientY - r.top) / Math.max(r.height, 1);  // 0..1

    // Bascule : on incline “loin” du curseur (sensation d’appui)
    const dx = px - 0.5;
    const dy = py - 0.5;

    // Appuyer en haut-gauche => on veut “pousser” ce coin : on incline en sens inverse du curseur
    const rx = dy * maxTilt;     // rotateX (vers l’arrière si souris en haut)
    const ry = -dx * maxTilt;    // rotateY (vers l’arrière si souris à gauche)

    // Pression : plus on s’éloigne du centre, plus on “enfonce”
    const dist = Math.hypot(dx, dy); // 0..~0.71
    const tz = -(pressDepth * dist);

    target.current = { rx, ry, tz, px, py, over: true };
  };

  const onPointerLeave = () => {
    target.current = { rx: 0, ry: 0, tz: 0, px: 0.5, py: 0.5, over: false };
  };

  useEffect(() => {
    const step = () => {
      const k = 0.12; // lissage (0.1–0.2 confortable)
      cur.current.rx += (target.current.rx - cur.current.rx) * k;
      cur.current.ry += (target.current.ry - cur.current.ry) * k;
      cur.current.tz += (target.current.tz - cur.current.tz) * k;
      cur.current.px += (target.current.px - cur.current.px) * k;
      cur.current.py += (target.current.py - cur.current.py) * k;

      const card = cardRef.current;
      if (card) {
        card.style.transform = `rotateX(${cur.current.rx}deg) rotateY(${cur.current.ry}deg) translateZ(${cur.current.tz}px)`;
        // ombre dynamique
        const sx = -cur.current.ry * 1.2;
        const sy = cur.current.rx * 1.2;
        card.style.boxShadow = `${sx}px ${sy}px 40px rgba(0,0,0,0.45)`;
      }

      const shine = shineRef.current;
      if (shine) {
        const x = cur.current.px * 100;
        const y = cur.current.py * 100;
        // halo + léger specular qui glisse
        shine.style.background = `
          radial-gradient(360px 360px at ${x}% ${y}%,
            rgba(255,255,255,0.22),
            rgba(255,255,255,0.06) 30%,
            rgba(255,255,255,0.0) 60%)
        `;
        shine.style.opacity = target.current.over ? "1" : "0.0";
      }

      rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={className}
      style={{ perspective: "1000px" }}
    >
      {/* Wrapper “aspect-ratio” pour garder 3/4 sans layout shift */}
      <div style={{ position: "relative", width: "100%" }}>
        <div style={{ paddingTop: aspectPadding }} />
        <div
          ref={cardRef}
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: radius,
            transformStyle: "preserve-3d",
            willChange: "transform, box-shadow",
            transition: "box-shadow 120ms linear",
          }}
        >
          <img
            src={src}
            alt={alt}
            className="block w-full h-full object-cover select-none"
            draggable={false}
          />
          {/* Shine layer */}
          <div
            ref={shineRef}
            className="pointer-events-none absolute inset-0"
            style={{
              mixBlendMode: "screen",
              opacity: 0,
              transition: "opacity 150ms linear",
            }}
          />
          {/* Vignette douce */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.25) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
