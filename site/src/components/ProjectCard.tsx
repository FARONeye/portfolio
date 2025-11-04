/* eslint-disable @next/next/no-img-element */
"use client";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

type Props = {
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  index: number;
};

export default function ProjectCard({ title, subtitle, imageUrl, href, index }: Props) {
  // 👉 ref sur un <a>, pas une <div>
  const ref = useRef<HTMLAnchorElement>(null);

  // Scroll reveal réversible
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 30%"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.3 });

  const opacity = useTransform(p, [0, 0.15, 1], [0, 1, 1]);
  const y = useTransform(p, [0, 1], [40, 0]);
  const scale = useTransform(p, [0, 1], [0.96, 1]);
  const skewY = useTransform(p, [0, 0.5, 1], [5, 1.5, 0]);
  const clip = useTransform(p, [0, 1], [
    "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
    "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
  ]);

  // Tilt 3D au hover
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);
  const [hovered, setHovered] = useState(false);

  function handleMove(e: ReactMouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const max = 6;
    setRy((x - 0.5) * max * 2);
    setRx(-(y - 0.5) * max * 2);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className="group relative h-72 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40"
      style={{
        opacity,
        y,
        scale,
        skewY,
        clipPath: clip,
        transformStyle: "preserve-3d",
        rotateX: hovered ? rx : 0,
        rotateY: hovered ? ry : 0,
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.4 }}
    >
      {/* Fond dégradé */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 20% 0%, rgba(155,28,49,.18), transparent 60%), radial-gradient(60% 50% at 100% 0%, rgba(108,30,128,.18), transparent 60%), #0b0b0f",
        }}
      />

      {/* Logo / visuel projet */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 m-auto h-40 w-auto object-contain"
      />

      {/* Overlay & texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-6 left-6">
        <div className="text-xs uppercase tracking-widest text-zinc-300/80">
          Projet #{String(index + 1).padStart(2, "0")}
        </div>
        <h3 className="mt-1 text-2xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-zinc-300">{subtitle}</p>
      </div>

      {/* Liseré au hover */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-transparent transition-all duration-300 group-hover:ring-[#9B1C31]/50" />
    </motion.a>
  );
}
