"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Home, Clock } from "lucide-react";

const PROJECT_LABELS: Record<string, string> = {
  styx: "Styx",
  "echo-noir": "Echo Noir",
  esportwear: "Esportwear",
};

export default function ProjectsComingSoonPage() {
  const router = useRouter();
  const params = useSearchParams();

  const p = params.get("p") ?? "";
  const projectName = PROJECT_LABELS[p] ?? "Ces projets";

  return (
    <main className="relative min-h-[100dvh] bg-black overflow-hidden">
      {/* FX inspirés de Teleport */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 tf-grain opacity-40" />
      <div className="absolute inset-0 tf-scanlines opacity-25" />
      <div className="absolute inset-[-40%] tf-neonFrame opacity-70" />

      {/* Nebula très soft */}
      <div className="pointer-events-none absolute -top-44 left-[-10%] h-[560px] w-[560px] rounded-full blur-3xl opacity-25 [background:radial-gradient(circle_at_center,rgba(155,28,49,0.35),transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-52 right-[-10%] h-[620px] w-[620px] rounded-full blur-3xl opacity-20 [background:radial-gradient(circle_at_center,rgba(108,30,128,0.35),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-18 md:py-24 grid place-items-center min-h-[100dvh]">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-white/10">
            <div className="flex items-center gap-3 text-white/70 font-mono text-[11px] tracking-[0.4em] uppercase">
              <Clock size={16} className="text-white/60" />
              Maintenance / Soon
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-white">
              Accès bientôt disponible
            </h1>

            <p className="mt-3 text-white/60 leading-relaxed">
              <span className="text-white/80 font-semibold">{projectName}</span>{" "}
              n’est pas encore publié. Les portails sont en cours de calibration —
              tu pourras y accéder très bientôt.
            </p>
          </div>

          {/* Progress vibe */}
          <div className="p-6 sm:p-8">
            <div className="mb-3 text-center text-[11px] tracking-[0.4em] text-white/50 font-mono uppercase">
              Stabilisation du portail
            </div>

            <div className="relative h-[3px] overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 w-[35%] tf-barFill"
                initial={{ x: "-120%" }}
                animate={{ x: "320%" }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 tf-barGlow" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => router.back()}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-[0.99]"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                Retour
              </button>

              <button
                onClick={() => router.push("/#projects")}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-[0.99]"
              >
                <Home size={18} className="group-hover:scale-105 transition-transform" />
                Retour aux projets
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-white/35">
              Merci pour la patience — les projets arrivent très vite.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
