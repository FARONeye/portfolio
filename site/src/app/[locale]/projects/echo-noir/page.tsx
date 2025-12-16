"use client";
import { motion } from "framer-motion";

export default function EchoNoirPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0B] to-[#120012] text-white flex flex-col items-center justify-center px-6">
      <motion.img
        src="/echo-noir.webp" alt="Echo Noir"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
        className="h-40 mb-10"
      />
      <motion.h1
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="text-4xl font-bold mb-6 text-[#6C1E80]"
      >
        ECHO NOIR — Le son de la lumière
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="max-w-2xl text-center text-[#b3b3b3]"
      >
        Installation audiovisuelle qui fusionne onde sonore et forme visuelle. Expérience immersive et introspective.
      </motion.p>
    </main>
  );
}
