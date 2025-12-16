"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TeleportFX from "@/components/TeleportFX";

type TeleportCtx = {
  startTeleport: (href: string, opts?: { minMs?: number }) => void;
};

const Ctx = createContext<TeleportCtx | null>(null);

function normalizeHref(href: string) {
  // href attendu: "/fr/projects/en-cours?p=styx" (absolu interne)
  return href.startsWith("/") ? href : `/${href}`;
}

function currentFullPath(pathname: string, sp: URLSearchParams) {
  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function TeleportProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [running, setRunning] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [minMs, setMinMs] = useState<number>(1500);
  const [target, setTarget] = useState<string | null>(null);

  const arrivedRef = useRef(false);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFinishTimer = () => {
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    finishTimerRef.current = null;
  };

  const reset = useCallback(() => {
    clearFinishTimer();
    arrivedRef.current = false;
    setRunning(false);
    setFinishing(false);
    setTarget(null);
    setStartedAt(0);
    setMinMs(1500);
  }, []);

  // 1) Démarre portail + navigation tout de suite
  const startTeleport = useCallback(
    (href: string, opts?: { minMs?: number }) => {
      const nextTarget = normalizeHref(href);
      const min = opts?.minMs ?? 1500;

      clearFinishTimer();
      arrivedRef.current = false;

      setMinMs(min);
      setStartedAt(performance.now());
      setTarget(nextTarget);
      setRunning(true);
      setFinishing(false);

      // ✅ La navigation commence immédiatement (pendant le portail)
      router.push(nextTarget);
    },
    [router]
  );

  // 2) Détecte quand on est arrivé sur la nouvelle page
  useEffect(() => {
    if (!running || !target) return;

    const nowPath = currentFullPath(pathname, searchParams);
    if (nowPath === target) {
      arrivedRef.current = true;

      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, minMs - elapsed);

      // ✅ minimum 1.5s, mais si la page met 3s, on attend 3s
      clearFinishTimer();
      finishTimerRef.current = setTimeout(() => {
        setFinishing(true);
      }, remaining);
    }
  }, [pathname, searchParams, running, target, startedAt, minMs]);

  const value = useMemo(() => ({ startTeleport }), [startTeleport]);

  return (
    <Ctx.Provider value={value}>
      {children}

      {/* ✅ FX global, donc il survit au changement de page */}
      <TeleportFX
        running={running}
        finishing={finishing}
        minDurationMs={minMs}
        onDone={reset}
      />
    </Ctx.Provider>
  );
}

export function useTeleport() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTeleport must be used within <TeleportProvider />");
  return ctx;
}
