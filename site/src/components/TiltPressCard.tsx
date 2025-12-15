"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";

type TiltPressCardProps = {
  src: string;
  alt: string;
  className?: string;
  radius?: number; // défaut 24
  maxTilt?: number; // défaut 12
  pressDepth?: number; // défaut 10
  aspect?: number; // défaut 3/4
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

  const target = useRef({ rx: 0, ry: 0, tz: 0, px: 0.5, py: 0.5, over: false });
  const cur = useRef({ rx: 0, ry: 0, tz: 0, px: 0.5, py: 0.5 });
  const rafId = useRef<number | null>(null);

  const aspectPadding = useMemo(
    () => `${(1 / (aspect <= 0 ? 1 : aspect)) * 100}%`,
    [aspect]
  );

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / Math.max(r.width, 1);
    const py = (e.clientY - r.top) / Math.max(r.height, 1);

    const dx = px - 0.5;
    const dy = py - 0.5;

    const rx = dy * maxTilt;
    const ry = -dx * maxTilt;

    const dist = Math.hypot(dx, dy);
    const tz = -(pressDepth * dist);

    target.current = { rx, ry, tz, px, py, over: true };
  };

  const onPointerLeave = () => {
    target.current = { rx: 0, ry: 0, tz: 0, px: 0.5, py: 0.5, over: false };
  };

  useEffect(() => {
    const step = () => {
      const k = 0.12;
      cur.current.rx += (target.current.rx - cur.current.rx) * k;
      cur.current.ry += (target.current.ry - cur.current.ry) * k;
      cur.current.tz += (target.current.tz - cur.current.tz) * k;
      cur.current.px += (target.current.px - cur.current.px) * k;
      cur.current.py += (target.current.py - cur.current.py) * k;

      const card = cardRef.current;
      if (card) {
        card.style.transform = `rotateX(${cur.current.rx}deg) rotateY(${cur.current.ry}deg) translateZ(${cur.current.tz}px)`;
        const sx = -cur.current.ry * 1.2;
        const sy = cur.current.rx * 1.2;
        card.style.boxShadow = `${sx}px ${sy}px 40px rgba(0,0,0,0.45)`;
      }

      const shine = shineRef.current;
      if (shine) {
        const x = cur.current.px * 100;
        const y = cur.current.py * 100;
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
          {/* Remplace <img> par <Image fill> */}
          <div className="absolute inset-0">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className="object-cover select-none"
              draggable={false}
              priority={false}
            />
          </div>

          <div
            ref={shineRef}
            className="pointer-events-none absolute inset-0"
            style={{
              mixBlendMode: "screen",
              opacity: 0,
              transition: "opacity 150ms linear",
            }}
          />

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
