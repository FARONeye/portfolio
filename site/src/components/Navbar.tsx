"use client";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

type NavStyle = CSSProperties & { ["--nav-bottom"]?: string };

export default function Navbar() {
  // espace en bas (mobile) : safe-area + 12px
  const navStyle: NavStyle = { ["--nav-bottom"]: "max(env(safe-area-inset-bottom), 12px)" };

  return (
    <nav
      aria-label="Navigation principale"
      className="
        fixed inset-x-0 z-[100] pointer-events-auto
        bottom-[var(--nav-bottom)]
        md:top-4 md:bottom-auto md:left-1/2 md:-translate-x-1/2
      "
      style={navStyle}
    >
      {/* largeur contrôlée par breakpoint pour rétrécir en desktop */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="
          mx-auto
          w-[min(92vw,700px)]           /* mobile */
          md:w-[min(58vw,640px)]        /* ≥768px : plus étroit */
          lg:w-[min(50vw,600px)]        /* ≥1024px */
          xl:w-[560px]                  /* ≥1280px */
          2xl:w-[540px]                 /* ≥1536px */
        "
      >
        <ul
          className="
            w-full mx-auto flex items-center justify-center
            gap-2 md:gap-5
            rounded-2xl md:rounded-full
            border border-white/10
            bg-black/35 backdrop-blur-md shadow-lg
            px-3 py-2 md:px-5 md:py-3
            text-[13px] md:text-sm text-zinc-300
          "
        >
          <li><a href="#about"    className="block px-2 py-1.5 md:px-0 md:py-0 hover:text-white">À propos</a></li>
          <li><a href="#projects" className="block px-2 py-1.5 md:px-0 md:py-0 hover:text-white">Projets</a></li>
          <li><a href="#skills"   className="block px-2 py-1.5 md:px-0 md:py-0 hover:text-white">Compétences</a></li>
          <li><a href="#contact"  className="block px-2 py-1.5 md:px-0 md:py-0 hover:text-white">Contact</a></li>
        </ul>
      </motion.div>
    </nav>
  );
}
