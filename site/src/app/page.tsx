'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100">
      {/* Contenu central */}
      <div className="z-10 text-center px-6">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Bienvenue sur mon Portfolio
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Je suis un développeur passionné par les animations web et les expériences immersives.
        </motion.p>

        <motion.button
          className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900/60 px-6 py-3 backdrop-blur-sm hover:bg-zinc-800 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-base md:text-lg">Découvrir mes projets</span>
          <motion.span
            aria-hidden
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            ➜
          </motion.span>
        </motion.button>
      </div>

      {/* Lueurs en arrière-plan */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl bg-cyan-500/10" />
        <div className="absolute top-40 right-12 h-72 w-72 rounded-full blur-3xl bg-fuchsia-500/10" />
      </motion.div>
    </main>
  );
}
