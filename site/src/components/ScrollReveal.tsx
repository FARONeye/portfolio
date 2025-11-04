"use client";
import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/** Révèle un bloc en fonction du scroll — supporte opacity, x, y, scale, rotate, skewY */
type Props = {
  children: ReactNode;
  from?: { opacity?: number; x?: number; y?: number; scale?: number; rotate?: number; skewY?: number };
  to?:   { opacity?: number; x?: number; y?: number; scale?: number; rotate?: number; skewY?: number };
  startVH?: number; endVH?: number; className?: string;
};

export default function ScrollReveal({
  children,
  from = { opacity: 0, y: 24, scale: 0.98 },
  to   = { opacity: 1, y: 0,  scale: 1 },
  startVH = 85, endVH = 15, className,
}: Props){
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${startVH}%`, `end ${endVH}%`] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 18, mass: .3 });

  const opacity = useTransform(p, [0,1], [from.opacity ?? 1, to.opacity ?? 1]);
  const x       = useTransform(p, [0,1], [from.x ?? 0,        to.x ?? 0]);
  const y       = useTransform(p, [0,1], [from.y ?? 0,        to.y ?? 0]);
  const scale   = useTransform(p, [0,1], [from.scale ?? 1,    to.scale ?? 1]);
  const rotate  = useTransform(p, [0,1], [from.rotate ?? 0,   to.rotate ?? 0]);
  const skewY   = useTransform(p, [0,1], [from.skewY ?? 0,    to.skewY ?? 0]);

  return (
    <motion.div ref={ref} className={className} style={{ opacity, x, y, scale, rotate, skewY }}>
      {children}
    </motion.div>
  );
}
