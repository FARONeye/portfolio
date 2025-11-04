"use client";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 z-[90] -translate-x-1/2">
      <motion.div
        initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration: .5 }}
        className="backdrop-blur-md bg-black/35 border border-white/10 rounded-full px-6 py-3 shadow-lg"
      >
        <ul className="flex gap-6 text-sm text-zinc-300">
          <li><a href="#about" className="hover:text-white">À propos</a></li>
          <li><a href="#projects" className="hover:text-white">Projets</a></li>
          <li><a href="#skills" className="hover:text-white">Compétences</a></li>
          <li><a href="#contact" className="hover:text-white">Contact</a></li>
        </ul>
      </motion.div>
    </nav>
  );
}
