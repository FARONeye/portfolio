"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";

export default function ParallaxBand() {
  const t = useTranslations("parallax");

  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  const items = t.raw("items") as string[];

  return (
    <div className="relative py-8 border-y border-white/10 bg-black/30 backdrop-blur">
      <motion.div
        style={{ x }}
        className="flex gap-10 whitespace-nowrap text-xl md:text-2xl"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-white bg-clip-text text-transparent"
          >
            • {items.join(" • ")}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
