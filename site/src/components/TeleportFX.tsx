"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function TeleportFX({
  running,
  onDone,
  duration = 1.5,
}: {
  running: boolean;
  onDone: () => void;
  duration?: number;
}) {
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
            <div className="relative w-[360px]">
              <div className="mb-3 text-center text-[11px] tracking-[0.4em] text-white/60 font-mono">
                SECURE ACCESS
              </div>

              <div className="relative h-[3px] overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="absolute inset-0 tf-barFill"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration, ease: "easeInOut" }}
                  style={{ transformOrigin: "left" }}
                />
                <div className="absolute inset-0 tf-barGlow" />
              </div>

              <motion.div
                className="mt-4 text-center font-mono text-sm text-white/85"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: duration * 0.6 }}
              >
                ACCESS GRANTED
              </motion.div>
            </div>
          </div>

          {/* Iris close */}
          <motion.div
            className="absolute inset-0 tf-iris"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: duration - 0.35 }}
            onAnimationComplete={onDone}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
