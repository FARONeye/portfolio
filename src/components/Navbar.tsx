"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");

  return (
    <nav
      aria-label="Navigation principale"
      className={[
        "fixed z-[90] pointer-events-auto flex justify-center",
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
          "rounded-2xl md:rounded-full shadow-lg",
          "px-3 md:px-6 py-2.5 md:py-3",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          {/* ✅ Seuls les liens scrollent (mobile) */}
          <div
            className={[
              "flex-1 md:flex-none",
              "overflow-x-auto scrollbar-none",
              "[-ms-overflow-style:none] [scrollbar-width:none]",
              "[&::-webkit-scrollbar]:hidden",
            ].join(" ")}
          >
            <ul
              className={[
                "flex items-center whitespace-nowrap text-[12px] md:text-sm text-zinc-300",
                // ✅ MOBILE: prend toute la place et répartit les liens
                "w-full justify-between gap-0",
                // ✅ DESKTOP: comportement normal
                "md:w-auto md:justify-start md:gap-6",
                // petit padding pour respirer avant le switcher
                "pr-2",
              ].join(" ")}
            >
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  {t("about")}
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="hover:text-white transition-colors"
                >
                  {t("projects")}
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-white transition-colors">
                  {t("skills")}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* séparateur */}
          <div className="h-5 w-px bg-white/10 mx-1 shrink-0" />

          {/* ✅ Switcher hors overflow => dropdown visible */}
          <div className="shrink-0 relative">
            <LocaleSwitcher />
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
