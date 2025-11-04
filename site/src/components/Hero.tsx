// src/components/Hero.tsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import EnergySphere3D from "./EnergySphere3D";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Photo en fond */}
      <motion.img
        src="/portrait2.webp"
        alt="Mathis Truong"
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-60"
        style={{ scale: useTransform(scrollYProgress, [0, 1], [1, 1.15]) }}
      />

      {/* Dégradé (derrière la sphère pour qu’elle pète visuellement) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" />

      {/* ⚡ Sphère 3D bien visible */}
      <EnergySphere3D />

      {/* Texte par-dessus */}
      <motion.div style={{ y: yText, opacity }} className="relative z-20 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent"
        >
          Mathis Truong
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 1.0 }}
          className="mt-6 text-lg text-[#b3b3b3] max-w-xl mx-auto"
        >
          Développeur créatif — chaque scroll est une émotion.
        </motion.p>
      </motion.div>
    </section>
  );
}
