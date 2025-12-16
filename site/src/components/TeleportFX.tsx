"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export default function TeleportFX({
  running,
  finishing,
  onDone,
  minDurationMs = 1500,
}: {
  running: boolean;
  finishing: boolean;
  onDone: () => void;
  minDurationMs?: number;
}) {
  const t = useTranslations("teleport");

  const minSeconds = useMemo(() => Math.max(1.5, minDurationMs / 1000), [minDurationMs]);

  return (
    <AnimatePresence>
      {running && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Grain */}
          <div className="absolute inset-0 tf-grain opacity-40" />

          {/* Scanlines */}
          <div className="absolute inset-0 tf-scanlines opacity-30" />

          {/* Neon frame */}
          <div className="absolute inset-[-40%] tf-neonFrame" />

          {/* Center */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative w-[360px] max-w-[86vw]">
              <div className="mb-3 text-center text-[11px] tracking-[0.4em] text-white/60 font-mono">
                {t("secureAccess")}
              </div>

              {/* Barre "min 1.5s" (et si ça charge plus longtemps, elle reste) */}
              <div className="relative h-[3px] overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="absolute inset-0 tf-barFill"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: minSeconds, ease: "easeInOut" }}
                  style={{ transformOrigin: "left" }}
                />
                <div className="absolute inset-0 tf-barGlow" />
              </div>

              <motion.div
                className="mt-4 text-center font-mono text-sm text-white/85"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: minSeconds * 0.6 }}
              >
                {t("accessGranted")}
              </motion.div>
            </div>
          </div>

          {/* Iris close uniquement quand on décide de finir */}
          <AnimatePresence>
            {finishing && (
              <motion.div
                className="absolute inset-0 tf-iris"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onAnimationComplete={onDone}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
