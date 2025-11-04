"use client";
import { motion } from "framer-motion";

export default function StyxPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0B] to-black text-white flex flex-col items-center justify-center px-6">
      <motion.img
        src="/styx-logo.webp" alt="Styx"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="h-40 mb-10"
      />
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-4xl font-bold mb-6 text-[#9B1C31]"
      >
        STYX — Connecter les joueurs autrement
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="max-w-2xl text-center text-[#b3b3b3]"
      >
        Application mobile pour rejoindre ou créer des matchs de foot entre passionnés.
        Notifications en temps réel, UX soignée, communauté active.
      </motion.p>
    </main>
  );
}
