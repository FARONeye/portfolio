"use client";

import { AnimatePresence, motion } from "framer-motion";

type TeleportFXProps = {
  running: boolean;
  onDone: () => void;
  /** durée totale de l’animation (s) */
  duration?: number;
};

export default function TeleportFX({ running, onDone, duration = 0.9 }: TeleportFXProps) {
  // courbes d'interpolation
  const ease = [0.18, 0.7, 0.2, 1] as const;

  return (
    <>
      {/* Keyframes CSS (global) */}
      <style jsx global>{`
        @keyframes fx-rise {
          from { background-position-y: 0; }
          to   { background-position-y: -2200px; }
        }
        @keyframes fx-rise-slow {
          from { background-position-y: 0; }
          to   { background-position-y: -1400px; }
        }
        @keyframes fx-shake {
          0%   { transform: translate3d(0px, 0px, 0) rotate(0deg); }
          20%  { transform: translate3d(0.6px, -0.6px, 0) rotate(0.03deg); }
          40%  { transform: translate3d(-0.8px, 0.5px, 0) rotate(-0.02deg); }
          60%  { transform: translate3d(0.7px, 0.4px, 0) rotate(0.02deg); }
          80%  { transform: translate3d(-0.5px, -0.6px, 0) rotate(-0.03deg); }
          100% { transform: translate3d(0px, 0px, 0) rotate(0deg); }
        }
        @keyframes fx-parallax-up {
          from { transform: translate3d(0, 18%, 0); }
          to   { transform: translate3d(0, -18%, 0); }
        }
        @keyframes fx-parallax-up-strong {
          from { transform: translate3d(0, 28%, 0); }
          to   { transform: translate3d(0, -28%, 0); }
        }
      `}</style>

      <AnimatePresence>
        {running && (
          <motion.div
            className="fixed inset-0 z-[120] pointer-events-none"
            initial={{ y: "100%", scale: 1, filter: "brightness(1) contrast(1)" }}
            animate={{ y: 0, scale: 1.005, filter: "brightness(1.05) contrast(1.06)" }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease }}
            onAnimationComplete={onDone}
            style={{
              background:
                // base gradient (fond spatial dense)
                "radial-gradient(120% 70% at 50% 130%, rgba(255,255,255,0.06), rgba(124,58,237,0.22) 40%, rgba(0,0,0,0.98) 72%), #000",
              maskImage: "linear-gradient(to top, black 50%, transparent 98%)",
              animation: `fx-shake ${duration}s linear`,
            }}
          >
            {/* Layer A — “Aube” (flash qui part du bas) */}
            <motion.div
              initial={{ y: "100%", opacity: 0.9 }}
              animate={{ y: "-10%", opacity: 0.0 }}
              transition={{ duration: duration * 0.65, ease }}
              className="absolute inset-x-0 bottom-0"
              style={{
                height: "58%",
                background:
                  "linear-gradient( to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.45) 18%, rgba(255,255,255,0.08) 52%, rgba(255,255,255,0.0) 100%)",
                filter: "blur(0.6px)",
                mixBlendMode: "screen",
              }}
            />

            {/* Layer B — Stries verticales (warp) */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(to top, rgba(255,255,255,0.12) 0 2px, rgba(255,255,255,0) 2px 12px)",
                animation: `fx-rise ${duration * 1.2}s linear`,
                mixBlendMode: "screen",
                opacity: 0.85,
              }}
            />
            {/* Layer B' — Stries inclinées (parallax) */}
            <div
              className="absolute inset-0"
              style={{
                transform: "rotate(12deg)",
                background:
                  "repeating-linear-gradient(to top, rgba(255,255,255,0.08) 0 1px, rgba(255,255,255,0) 1px 14px)",
                animation: `fx-rise-slow ${duration * 1.7}s linear`,
                mixBlendMode: "screen",
                opacity: 0.6,
              }}
            />

            {/* Layer C — Anneaux “warp tunnel” */}
            <div className="absolute inset-0 overflow-hidden">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.6 + i * 0.1, opacity: 0.0 }}
                  animate={{ scale: 1.9 + i * 0.1, opacity: [0.0, 0.55, 0.0] }}
                  transition={{
                    duration: duration * (0.65 + i * 0.07),
                    ease: "easeOut",
                    times: [0, 0.5, 1],
                  }}
                  className="absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: "160vmax",
                    height: "160vmax",
                    borderRadius: "50%",
                    boxShadow: "0 0 0 2px rgba(255,255,255,0.06) inset, 0 0 80px rgba(124,58,237,0.35) inset",
                    background:
                      "radial-gradient(closest-side, rgba(255,255,255,0.18), rgba(255,255,255,0.05) 55%, rgba(255,255,255,0) 60%)",
                    mixBlendMode: "screen",
                    filter: "blur(0.4px)",
                  }}
                />
              ))}
            </div>

            {/* Layer D — Chroma glow (aberration subtile) */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 100%, rgba(236,72,153,0.18), rgba(255,255,255,0) 55%), radial-gradient(120% 80% at 50% 110%, rgba(59,130,246,0.16), rgba(255,255,255,0) 60%)",
                mixBlendMode: "screen",
                animation: `fx-parallax-up ${duration}s ease-out`,
                opacity: 0.9,
              }}
            />

            {/* Layer E — Scanlines fines + vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0 1px, rgba(255,255,255,0) 1px 3px)",
                mixBlendMode: "overlay",
                opacity: 0.35,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 100% at 50% 60%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
