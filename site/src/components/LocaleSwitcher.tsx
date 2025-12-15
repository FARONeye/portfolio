"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";

const LOCALES = ["en", "fr"] as const;
type Locale = (typeof LOCALES)[number];

function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split("/")[1];
  return (LOCALES as readonly string[]).includes(seg) ? (seg as Locale) : "en";
}

function switchLocalePath(pathname: string, nextLocale: Locale) {
  const parts = pathname.split("/");
  // pathname: /en/xxx or /fr/xxx
  if ((LOCALES as readonly string[]).includes(parts[1])) parts[1] = nextLocale;
  else parts.splice(1, 0, nextLocale);
  return parts.join("/") || `/${nextLocale}`;
}

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const current = useMemo(() => getLocaleFromPath(pathname), [pathname]);

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const onSelect = (nextLocale: Locale) => {
    const nextPath = switchLocalePath(pathname, nextLocale);
    setOpen(false);
    startTransition(() => {
      router.push(nextPath);
      router.refresh();
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex items-center gap-2 rounded-full border border-white/10",
          "bg-black/30 px-3 py-2 text-xs font-mono text-white/80",
          "hover:bg-black/45 hover:text-white transition",
        ].join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="tracking-[0.22em]">{current.toUpperCase()}</span>
        <ChevronDown size={14} className={open ? "rotate-180 transition" : "transition"} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-28 overflow-hidden rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl"
        >
          {LOCALES.map((loc) => {
            const active = loc === current;
            return (
              <button
                key={loc}
                role="menuitem"
                type="button"
                disabled={isPending}
                onClick={() => onSelect(loc)}
                className={[
                  "w-full px-3 py-2 text-left text-xs font-mono",
                  "flex items-center justify-between",
                  active ? "text-white bg-white/10" : "text-white/75 hover:bg-white/10 hover:text-white",
                  isPending ? "opacity-60" : "",
                ].join(" ")}
              >
                <span className="tracking-[0.22em]">{loc.toUpperCase()}</span>
                {active && <Check size={14} className="opacity-90" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
