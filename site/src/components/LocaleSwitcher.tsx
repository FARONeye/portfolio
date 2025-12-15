"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { ChevronDown, Check } from "lucide-react";

const LOCALES = ["en", "fr"] as const;
type AppLocale = (typeof LOCALES)[number];

function isAppLocale(v: string): v is AppLocale {
  return (LOCALES as readonly string[]).includes(v);
}

function buildLocalePath(pathname: string, nextLocale: AppLocale) {
  // pathname ex: "/fr", "/fr/projects", "/en#about" (hash pas ici), "/"
  const parts = pathname.split("/").filter(Boolean); // ["fr", "projects"]
  const first = parts[0];

  if (first && isAppLocale(first)) {
    parts[0] = nextLocale;
  } else {
    parts.unshift(nextLocale);
  }

  return "/" + parts.join("/");
}

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale() as AppLocale;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // click outside -> close
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const currentLabel = useMemo(() => (locale === "fr" ? "FR" : "EN"), [locale]);

  const go = (nextLocale: AppLocale) => {
    setOpen(false);
    if (!pathname) return;

    const base = buildLocalePath(pathname, nextLocale);
    const qs = searchParams?.toString();
    const hash = typeof window !== "undefined" ? window.location.hash : "";

    const url = base + (qs ? `?${qs}` : "") + (hash || "");
    router.push(url);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex items-center gap-2",
          "px-3 py-1.5 rounded-full",
          "bg-black/30 border border-white/10",
          "text-zinc-200 hover:text-white hover:bg-black/40",
          "transition-colors",
        ].join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="text-xs font-medium tracking-wide">{currentLabel}</span>
        <ChevronDown size={14} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

    {open && (
        <div
            role="menu"
            className={[
            "absolute right-0 min-w-[120px]",
            // 📱 mobile : menu au-dessus de la navbar
            "bottom-full mb-2",
            // 🖥 desktop : menu en dessous
            "md:bottom-auto md:top-full md:mt-2 md:mb-0",
            "rounded-2xl overflow-hidden",
            "bg-zinc-950/95 backdrop-blur-md",
            "border border-white/10 shadow-2xl",
            "p-1",
            "z-[200]",
            ].join(" ")}
        >
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitem"
              onClick={() => go(l)}
              className={[
                "w-full flex items-center justify-between gap-3",
                "px-3 py-2 rounded-xl",
                "text-sm text-zinc-200 hover:text-white hover:bg-white/5",
                "transition-colors",
              ].join(" ")}
            >
              <span>{l === "fr" ? "Français" : "English"}</span>
              {locale === l ? <Check size={16} /> : <span className="w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
