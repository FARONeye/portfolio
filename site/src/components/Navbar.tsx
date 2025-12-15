"use client";

import { motion } from "framer-motion";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("nav");

  return (
    <nav
      aria-label="Navigation principale"
      className={[
        "fixed z-90 pointer-events-auto flex justify-center",
        "inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+12px)]",
        "md:inset-x-auto md:bottom-auto md:top-4 md:left-1/2 md:-translate-x-1/2",
      ].join(" ")}
    >
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className={[
          "w-[92%] max-w-[420px] md:w-auto md:max-w-none",
          "backdrop-blur-md bg-black/35 border border-white/10",
          "rounded-2xl md:rounded-full px-5 md:px-6 py-3 shadow-lg",
          "flex items-center justify-between md:justify-center gap-4",
        ].join(" ")}
      >
        <ul className="flex flex-1 justify-between md:justify-center gap-6 text-sm text-zinc-300">
          <li>
            <a href="#about" className="hover:text-white transition-colors">
              {t("about")}
            </a>
          </li>
          <li>
            <a href="#projects" className="hover:text-white transition-colors">
              {t("projects")}
            </a>
          </li>
          <li>
            <a href="#skills" className="hover:text-white transition-colors">
              {t("skills")}
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-white transition-colors">
              {t("contact")}
            </a>
          </li>
        </ul>

        {/* Switch langue */}
        <div className="shrink-0">
          <LocaleSwitcher />
        </div>
      </motion.div>
    </nav>
  );
}
