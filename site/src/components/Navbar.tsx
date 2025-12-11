"use client";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav
      aria-label="Navigation principale"
      // Un seul markup pour mobile & desktop (CSS responsive uniquement)
      className={[
        "fixed z-90 pointer-events-auto flex justify-center",
        // position mobile (barre en bas avec safe-area)
        "inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+12px)]",
        // override desktop : barre centrée en haut
        "md:inset-x-auto md:bottom-auto md:top-4 md:left-1/2 md:-translate-x-1/2",
      ].join(" ")}
    >
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className={[
          // largeur: compacte en mobile, auto en desktop
          "w-[92%] max-w-[380px] md:w-auto md:max-w-none",
          "backdrop-blur-md bg-black/35 border border-white/10",
          "rounded-2xl md:rounded-full px-5 md:px-6 py-3 shadow-lg",
        ].join(" ")}
      >
        <ul className="flex justify-between md:justify-center gap-6 text-sm text-zinc-300">
          <li><a href="#about"     className="hover:text-white">About Me</a></li>
          <li><a href="#projects"  className="hover:text-white">Projects</a></li>
          <li><a href="#skills"    className="hover:text-white">Skills</a></li>
          <li><a href="#contact"   className="hover:text-white">Contact</a></li>
        </ul>
      </motion.div>
    </nav>
  );
}
  