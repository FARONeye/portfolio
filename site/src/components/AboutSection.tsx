"use client";
import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="bg-[#0A0A0B] py-24 border-y border-white/10">
      <div className="mx-auto max-w-6xl px-6 grid gap-10 md:grid-cols-2 items-center">
        <ScrollReveal from={{ opacity:0, y:40 }} to={{ opacity:1, y:0 }}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">
              À propos
            </span>
          </h2>
          <p className="text-lg text-[#b3b3b3] leading-relaxed">
            Je conçois des expériences numériques où design et performance se rencontrent.
            Mon style : sombre, élégant, animé — inspiré des sites créatifs “new gen”.
          </p>
        </ScrollReveal>

        <ScrollReveal from={{ opacity:0, x:50, scale:.98 }} to={{ opacity:1, x:0, scale:1 }}>
          <motion.img
            whileHover={{ scale: 1.03 }} transition={{ type:"spring", stiffness:120, damping:12 }}
            src="/portrait2.webp" alt="Mathis Truong" className="rounded-3xl border border-white/10 shadow-xl glow-rouge"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
