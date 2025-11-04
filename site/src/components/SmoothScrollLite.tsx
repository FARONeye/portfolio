"use client";
import { useEffect } from "react";

export default function SmoothScrollLite() {
  useEffect(() => {
    // Gère la préférence "reduce motion" du système
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.style.setProperty("--motion-on", reduced ? "0" : "1");
  }, []);
  return null;
}
