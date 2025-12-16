"use client";
import { motion } from "framer-motion";

export default function EsportwearPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0B] to-[#1a001a] text-white flex flex-col items-center justify-center px-6">
      <motion.img
        src="/esportwear.webp" alt="E-Sportwear"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
        className="h-40 mb-10"
      />
      <motion.h1
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="text-4xl font-bold mb-6 text-[#9B1C31]"
      >
        E-SPORTWEAR — Wear your game
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="max-w-2xl text-center text-[#b3b3b3]"
      >
        Marque techwear inspirée du gaming : pièces légères, silhouettes nettes, identité futuriste.
      </motion.p>
    </main>
  );
}
