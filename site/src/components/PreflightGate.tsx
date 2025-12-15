"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionConsent } from "./MotionConsentProvider";

function useIsMobileClient() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const mqSmall = window.matchMedia("(max-width: 900px)");

    const update = () => setIsMobile(mqCoarse.matches || mqSmall.matches);
    update();

    mqCoarse.addEventListener("change", update);
    mqSmall.addEventListener("change", update);
    return () => {
      mqCoarse.removeEventListener("change", update);
      mqSmall.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}

// PRNG déterministe
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function StarsMap() {
  const stars = useMemo(() => {
    const rand = mulberry32(20251214);
    const n = 70;
    return Array.from({ length: n }, (_, i) => {
      const x = rand() * 100;
      const y = rand() * 100;
      const s = 0.6 + rand() * 1.6;
      const o = 0.25 + rand() * 0.65;
      const d = rand() * 6; // delay
      return { id: i, x, y, s, o, d };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((st) => (
        <span
          key={st.id}
          className="absolute rounded-full bg-white/80"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: `${st.s}px`,
            height: `${st.s}px`,
            opacity: st.o,
            filter: "blur(0.2px)",
            animation: `twinkle 3.6s ease-in-out ${st.d}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function PreflightGate() {
  // ✅ Hooks TOUJOURS appelés dans le même ordre
  const isMobile = useIsMobileClient();
  const { consent, requestMotionPermission, setConsent } = useMotionConsent();
  const [open, setOpen] = useState(false);

  // sync open avec consent
  useEffect(() => {
    setOpen(consent === "unknown");
  }, [consent]);

  const onAccept = async () => {
    await requestMotionPermission();
    setOpen(false);
  };

  const onDeny = () => {
    setConsent("denied");
    setOpen(false);
  };

  // ✅ return null APRES hooks
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* DECOR */}
          <div className="absolute inset-0">
            <StarsMap />
            <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_35%,rgba(108,30,128,.22),transparent_60%),radial-gradient(900px_500px_at_50%_75%,rgba(155,28,49,.18),transparent_60%)]" />
          </div>

          {/* Rings animés */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="h-[360px] w-[360px] rounded-full border border-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
              style={{
                boxShadow:
                  "0 0 80px rgba(108,30,128,0.20), 0 0 120px rgba(155,28,49,0.12)",
              }}
            />
            <motion.div
              className="absolute h-[260px] w-[260px] rounded-full border border-white/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{
                boxShadow:
                  "inset 0 0 60px rgba(124,58,237,0.16), 0 0 60px rgba(236,72,153,0.12)",
              }}
            />
            <motion.div
              className="absolute h-[120px] w-[120px] rounded-full"
              animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.05, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12), rgba(108,30,128,0.20), transparent 70%)",
                filter: "blur(0.2px)",
              }}
            />
          </div>

          {/* CARD */}
          <motion.div
            className="relative mx-6 w-full max-w-[420px] rounded-3xl border border-white/10 bg-[#0A0A0B]/80 p-6 shadow-2xl"
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-2 text-[11px] tracking-[0.35em] text-white/60">
              PRE-FLIGHT CHECK
            </div>

            <div className="text-2xl font-extrabold leading-tight">
              Activer le motion ?
            </div>

            <p className="mt-3 text-sm text-white/70">
              Sur mobile, on peut utiliser l’inclinaison du téléphone pour donner
              un effet de profondeur (parallax). Tu peux refuser, ça marchera
              quand même.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={onDeny}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 active:scale-[0.98]"
              >
                Non merci
              </button>

              <button
                onClick={onAccept}
                className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#9B1C31]/70 via-[#6C1E80]/70 to-white/20 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(155,28,49,0.25)] active:scale-[0.98]"
              >
                Activer
              </button>
            </div>

            <div className="mt-4 text-[11px] text-white/40">
              Tu peux changer ça plus tard (on pourra ajouter un toggle).
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
