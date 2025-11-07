"use client";
import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="bg-[#0A0A0B] py-24 border-y border-white/10">
      <div className="mx-auto max-w-6xl px-6 grid gap-10 md:grid-cols-2 items-center">
        <ScrollReveal
          from={{ opacity: 0, y: 28 }}
          to={{ opacity: 1, y: 0 }}
          startVH={96}
          endVH={56}
          accelerate={0.55}
          stiffness={180}
          damping={20}
          mass={0.28}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent">
                About Me
              </span>
            </h2>
            <p className="text-lg text-[#b3b3b3] leading-relaxed">
              Welcome to my portfolio, i am a young dev who likes to get
              creative and this is why i will share with you my projects and all
              my Talents
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal
          from={{ opacity: 0, x: 50, scale: 0.98 }}
          to={{ opacity: 1, x: 0, scale: 1 }}
          startVH={94}
          endVH={52}
          accelerate={0.6}
          stiffness={170}
          damping={18}
          mass={0.28}
        >
          <motion.img
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            src="/portrait2.webp"
            alt="Mathis Truong — portrait"
            loading="lazy"
            decoding="async"
            className="rounded-3xl border border-white/10 shadow-xl glow-rouge will-change-transform"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
