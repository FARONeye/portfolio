"use client";
import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/** Révèle un bloc en fonction du scroll — supporte opacity, x, y, scale, rotate, skewY */
type Vec = { opacity?: number; x?: number; y?: number; scale?: number; rotate?: number; skewY?: number };

type Props = {
  children: ReactNode;
  from?: Vec;
  to?: Vec;
  /** Quand l'élément entre dans le viewport: 'start {startVH}%' */
  startVH?: number;
  /** Quand l'élément sort du viewport: 'end {endVH}%' */
  endVH?: number;
  className?: string;

  /** Réglage de la vitesse du spring (facultatif) */
  stiffness?: number; // def 120
  damping?: number;   // def 18
  mass?: number;      // def 0.3

  /**
   * Proportion de progression où l'anim est déjà à 100%.
   * 0.65 par défaut (plus petit = plus tôt/plus rapide visuellement)
   */
  accelerate?: number;
};

export default function ScrollReveal({
  children,
  from = { opacity: 0, y: 24, scale: 0.98 },
  to   = { opacity: 1, y: 0,  scale: 1 },
  startVH = 85,
  endVH   = 15,
  className,

  stiffness = 120,
  damping   = 18,
  mass      = 0.3,
  accelerate = 0.65,
}: Props){
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${startVH}%`, `end ${endVH}%`],
  });

  // Spring + courbe “accélérée” (finit plus tôt)
  const p = useSpring(scrollYProgress, { stiffness, damping, mass });
  const accel = Math.max(0.3, Math.min(1, accelerate));
  const q = useTransform(p, [0, accel, 1], [0, 1, 1]); // 1 atteint plus tôt

  const opacity = useTransform(q, [0,1], [from.opacity ?? 1, to.opacity ?? 1]);
  const x       = useTransform(q, [0,1], [from.x ?? 0,      to.x ?? 0]);
  const y       = useTransform(q, [0,1], [from.y ?? 0,      to.y ?? 0]);
  const scale   = useTransform(q, [0,1], [from.scale ?? 1,  to.scale ?? 1]);
  const rotate  = useTransform(q, [0,1], [from.rotate ?? 0, to.rotate ?? 0]);
  const skewY   = useTransform(q, [0,1], [from.skewY ?? 0,  to.skewY ?? 0]);

  return (
    <motion.div ref={ref} className={className} style={{ opacity, x, y, scale, rotate, skewY }}>
      {children}
    </motion.div>
  );
}
