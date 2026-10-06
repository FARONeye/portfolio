"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type MotionConsent = "unknown" | "granted" | "denied";

type MotionContextValue = {
  consent: MotionConsent;
  motionEnabled: boolean;
  requestMotionPermission: () => Promise<MotionConsent>;
  resetConsent: () => void;
  setConsent: (c: MotionConsent) => void;
};

const MotionConsentContext = createContext<MotionContextValue | null>(null);

const STORAGE_KEY = "motion-consent";

/** iOS type */
type DeviceOrientationEventIOS = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function getInitialConsent(): MotionConsent {
  if (typeof window === "undefined") return "unknown";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "granted" || saved === "denied") return saved;
  return "unknown";
}

export function MotionConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, _setConsent] = useState<MotionConsent>(getInitialConsent);

  const setConsent = useCallback((c: MotionConsent) => {
    _setConsent(c);
    if (typeof window !== "undefined") {
      if (c === "unknown") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, c);
    }
  }, []);

  const requestMotionPermission = useCallback(async (): Promise<MotionConsent> => {
    if (typeof window === "undefined") return "denied";

    const DeviceOrientation =
      window.DeviceOrientationEvent as unknown as DeviceOrientationEventIOS | undefined;

    // iOS 13+ : permission explicite
    if (DeviceOrientation?.requestPermission) {
      try {
        const result = await DeviceOrientation.requestPermission();
        const finalConsent: MotionConsent = result === "granted" ? "granted" : "denied";
        setConsent(finalConsent);
        return finalConsent;
      } catch {
        setConsent("denied");
        return "denied";
      }
    }

    // Android / Desktop : pas de permission nécessaire
    if ("DeviceOrientationEvent" in window) {
      setConsent("granted");
      return "granted";
    }

    setConsent("denied");
    return "denied";
  }, [setConsent]);

  const resetConsent = useCallback(() => {
    setConsent("unknown");
  }, [setConsent]);

  const motionEnabled = consent === "granted";

  const value = useMemo(
    () => ({
      consent,
      motionEnabled,
      requestMotionPermission,
      resetConsent,
      setConsent,
    }),
    [consent, motionEnabled, requestMotionPermission, resetConsent, setConsent]
  );

  return (
    <MotionConsentContext.Provider value={value}>
      {children}
    </MotionConsentContext.Provider>
  );
}

export function useMotionConsent() {
  const ctx = useContext(MotionConsentContext);
  if (!ctx) throw new Error("useMotionConsent must be used inside MotionConsentProvider");
  return ctx;
}
