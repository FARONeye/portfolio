"use client";
import { useEffect } from "react";

/** Halo lumineux qui suit le curseur (CSS vars), typé proprement */
export default function CursorGlow() {
  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      const root = document.documentElement;
      root.style.setProperty("--mx", `${e.clientX}px`);
      root.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{
        background:
          "radial-gradient(200px 200px at var(--mx) var(--my), rgba(155,28,49,.18), transparent 60%)",
      }}
    />
  );
}
