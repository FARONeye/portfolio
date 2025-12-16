"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, ArrowLeft } from "lucide-react";

type Lane = -1 | 0 | 1;
type TripKind = "Work" | "Trip" | "Family" | "Study";

type Trip = {
  id: string;
  start: string; // ISO YYYY-MM-DD
  end: string; // ISO YYYY-MM-DD
  places: string;
  country: string; // label court (FR/ES/UK/US…)
  mood: string;
  accent: string;
  lane: Lane;
  kind: TripKind;
  imageUrl?: string; // /public/... (ex: /travel/2023-barcelona.webp)
};

type Stop = Trip & {
  x: number;
  year: number;
  dateLabel: string;
  durationDays: number;
};

function useViewport() {
  const [vw, setVw] = useState(1200);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { vw, vh };
}

function iso(y: number, m: number, d: number) {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function parseISO(s: string) {
  const [Y, M, D] = s.split("-").map(Number);
  // ✅ UTC midi (évite les décalages timezone)
  return Date.UTC(Y, (M ?? 1) - 1, D ?? 1, 12, 0, 0, 0);
}

function daysBetween(aISO: string, bISO: string) {
  const a = parseISO(aISO);
  const b = parseISO(bISO);
  const ms = Math.max(0, b - a);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

const MONTHS_FR = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDateRangeDeterministic(startISO: string, endISO: string, locale: string) {
  const s = new Date(parseISO(startISO));
  const e = new Date(parseISO(endISO));

  const months = locale === "fr" ? MONTHS_FR : MONTHS_EN;

  const sDay = String(s.getUTCDate()).padStart(2, "0");
  const eDay = String(e.getUTCDate()).padStart(2, "0");

  const sMon = months[s.getUTCMonth()];
  const eMon = months[e.getUTCMonth()];

  const sYear = s.getUTCFullYear();
  const eYear = e.getUTCFullYear();

  if (sYear === eYear) return `${sDay} ${sMon} → ${eDay} ${eMon} ${sYear}`;
  return `${sDay} ${sMon} ${sYear} → ${eDay} ${eMon} ${eYear}`;
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

/* ---------- Flags (emoji) ---------- */

function flagFromCode(code: string) {
  const up = code.toUpperCase().trim();

  const map: Record<string, string> = {
    FR: "🇫🇷",
    ES: "🇪🇸",
    UK: "🇬🇧",
    US: "🇺🇸",
    CA: "🇨🇦",
    IE: "🇮🇪",
  };

  if (up.includes("/")) {
    const parts = up.split("/").map((p) => p.trim());
    return parts.map((p) => map[p] ?? "🏳️").join(" ");
  }

  return map[up] ?? "🏳️";
}

/* ---------- Kind badge ---------- */

function kindStyles(kind: TripKind) {
  switch (kind) {
    case "Work":
      return { label: "WORK", ring: "rgba(255,255,255,0.16)", bg: "rgba(155,28,49,0.18)" };
    case "Family":
      return { label: "FAMILY", ring: "rgba(255,255,255,0.16)", bg: "rgba(108,30,128,0.18)" };
    case "Trip":
      return { label: "TRIP", ring: "rgba(255,255,255,0.16)", bg: "rgba(192,132,252,0.18)" };
    case "Study":
    default:
      return { label: "STUDY", ring: "rgba(255,255,255,0.16)", bg: "rgba(255,255,255,0.10)" };
  }
}

function KindBadge({ kind }: { kind: TripKind }) {
  const s = kindStyles(kind);
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-mono tracking-[0.34em] text-white/80"
      style={{
        borderColor: s.ring,
        background: `linear-gradient(90deg, ${s.bg}, rgba(0,0,0,0.14))`,
        backdropFilter: "blur(10px)",
      }}
    >
      <span className="h-[6px] w-[6px] rounded-full bg-white/65" />
      {s.label}
    </span>
  );
}

/* ---------- Décor ---------- */

function Starfield({ density = 120 }: { density?: number }) {
  const stars = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => {
      const a = (i * 97) % 1000;
      const b = (i * 223) % 1000;
      const c = (i * 431) % 1000;

      const left = (a / 1000) * 100;
      const top = (b / 1000) * 100;

      const size = 1 + (c % 3);
      const baseOpacity = 0.05 + (c % 7) * 0.03;
      const dur = 4.4 + (c % 9) * 0.6;
      const delay = (c % 12) * 0.2;

      return { id: i, left, top, size, baseOpacity, dur, delay };
    });
  }, [density]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.baseOpacity,
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 0 10px rgba(255,255,255,0.10)",
            animation: `twinkle ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      <div className="absolute inset-0 opacity-[0.06] [background:radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.06),transparent_42%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.04),transparent_48%),radial-gradient(circle_at_55%_15%,rgba(155,28,49,0.06),transparent_54%),radial-gradient(circle_at_60%_85%,rgba(108,30,128,0.06),transparent_58%)]" />
    </div>
  );
}

function ShootingStars() {
  const shots = useMemo(
    () => [
      { id: 1, top: 22, left: 10, dur: 7.8, delay: 1.2, scale: 1.0, op: 0.10 },
      { id: 2, top: 64, left: 48, dur: 10.2, delay: 2.6, scale: 0.9, op: 0.09 },
    ],
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      {shots.map((s) => (
        <span
          key={s.id}
          className="absolute block h-[1px] w-[180px]"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            opacity: s.op,
            transform: `rotate(-18deg) scale(${s.scale})`,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.40), rgba(155,28,49,0.20), transparent)",
            filter: "blur(0.2px)",
            animation: `shoot ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Cartes ---------- */

function clampText2LinesStyle() {
  return {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  };
}

function TravelCard({
  stop,
  unlocked,
  near,
  topY,
  midY,
  botY,
}: {
  stop: Stop;
  unlocked: boolean;
  near: boolean;
  topY: number;
  midY: number;
  botY: number;
}) {
  const fog = near ? 0 : unlocked ? 0.28 : 0.70;
  const sat = unlocked ? 1 : 0;
  const opacity = unlocked ? 1 : 0.60;

  const flag = flagFromCode(stop.country);

  const y =
    stop.lane === -1 ? topY : stop.lane === 1 ? botY : midY;

  return (
    <div
      className="absolute"
      style={{
        left: stop.x + 60,
        top: y,
        transform: "translateY(-50%)",
        width: 420,
        maxWidth: "90vw",
        pointerEvents: "none",
      }}
    >
      <div
        className="relative rounded-[20px] border border-white/12 bg-black/55 backdrop-blur-xl shadow-[0_28px_110px_rgba(0,0,0,0.70)] overflow-hidden"
        style={{
          filter: `saturate(${sat})`,
          opacity,
        }}
      >
        {/* fond interne */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(560px 220px at 12% 40%, ${stop.accent}20, transparent 60%),
                         radial-gradient(520px 240px at 85% 55%, rgba(255,255,255,0.08), transparent 62%),
                         linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.80))`,
          }}
        />

        {/* Fog */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(520px 160px at 45% 35%, rgba(255,255,255,0.12), transparent 66%), linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.78))",
            opacity: fog,
            transition: "opacity 420ms ease",
          }}
        />

        {/* zone image à droite */}
        <div className="absolute right-0 top-0 h-full w-[42%]">
          {stop.imageUrl ? (
            <div className="absolute inset-0 opacity-[0.92]">
              <Image
                src={stop.imageUrl}
                alt={stop.places}
                fill
                sizes="(max-width: 640px) 40vw, 240px"
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(0,0,0,0.78),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(155,28,49,0.16),transparent_62%)]" />
            </div>
          ) : (
            <div className="absolute inset-0 opacity-[0.20]">
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(240px 240px at 30% 35%, ${stop.accent}55, transparent 65%),
                               radial-gradient(210px 210px at 70% 65%, rgba(255,255,255,0.18), transparent 70%)`,
                }}
              />
            </div>
          )}
          <div className="absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent)] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.70))]" />
        </div>

        <div className="relative z-10 p-4 pr-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="text-[11px] font-mono tracking-[0.30em] text-white/55 uppercase">
                  {stop.year}
                </div>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[10px] font-mono tracking-[0.16em] text-white/85 backdrop-blur-md">
                  <span className="text-[14px] leading-none">{flag}</span>
                  <span className="opacity-80">{stop.country}</span>
                </span>
              </div>

              <div className="mt-2 text-[20px] sm:text-[22px] font-semibold text-white/92 leading-tight">
                {stop.places}
              </div>

              <div className="mt-1 text-[10px] font-mono tracking-[0.16em] text-white/55 uppercase">
                {stop.dateLabel} · {stop.durationDays}j
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <KindBadge kind={stop.kind} />
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  background: unlocked ? stop.accent : "rgba(255,255,255,0.22)",
                  boxShadow: unlocked ? `0 0 18px ${stop.accent}88` : "none",
                }}
              />
            </div>
          </div>

          <div
            className="mt-3 text-[13px] text-white/72 leading-relaxed max-w-[58ch]"
            style={clampText2LinesStyle()}
          >
            {stop.mood}
          </div>

          <div
            className="mt-3 h-[2px] w-16 rounded-full"
            style={{ background: stop.accent, opacity: unlocked ? 0.8 : 0.25 }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TravelTimeline() {
  const locale = useLocale();
  const { vw, vh } = useViewport();

  const centerX = Math.round(vw * 0.5);
  const baselineY = Math.round(vh * 0.54);

  // ✅ Zone safe header : évite que les cartes “haut” passent derrière le titre
  const HEADER_SAFE = vw < 640 ? 165 : 210;
  const TOP_LANE_Y = Math.max(HEADER_SAFE + 55, Math.round(vh * 0.30));
  const MID_LANE_Y = baselineY - 8;
  const BOT_LANE_Y = Math.min(vh - 90, Math.round(vh * 0.78));

  const trips: Trip[] = useMemo(
    () => [
      // 2018
      {
        id: "2018-hendaye",
        start: iso(2018, 7, 22),
        end: iso(2018, 8, 3),
        places: "Hendaye · Saint-Sébastien",
        country: "FR/ES",
        mood: "Océan, frontière, premiers grands horizons.",
        accent: "#9B1C31",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2018-hendaye.webp",
      },
      {
        id: "2018-sainte-sylvestre",
        start: iso(2018, 12, 31),
        end: iso(2019, 1, 2),
        places: "Sainte-Sylvestre-sur-Lot",
        country: "FR",
        mood: "Transition de fin d’année. Parenthèse calme.",
        accent: "#6C1E80",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2018-lot.webp",
      },

      // 2019
      {
        id: "2019-usa",
        start: iso(2019, 7, 15),
        end: iso(2019, 7, 31),
        places: "États-Unis",
        country: "US",
        mood: "Choc d’échelle. Lumières, routes, énergie.",
        accent: "#F472B6",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2019-usa.webp",
      },

      // 2020
      {
        id: "2020-la-rochelle",
        start: iso(2020, 7, 28),
        end: iso(2020, 8, 4),
        places: "La Rochelle",
        country: "FR",
        mood: "Port, vents, texture des pierres et des quais.",
        accent: "#C084FC",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2020-la-rochelle.webp",
      },

      // 2021
      {
        id: "2021-la-gaude",
        start: iso(2021, 7, 30),
        end: iso(2021, 8, 2),
        places: "La Gaude",
        country: "FR",
        mood: "Chaleur du sud. Lumière sèche, reliefs.",
        accent: "#9B1C31",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2021-la-gaude.webp",
      },
      {
        id: "2021-saint-aignan",
        start: iso(2021, 10, 30),
        end: iso(2021, 10, 31),
        places: "Saint-Aignan",
        country: "FR",
        mood: "Escapade courte. Une pause sur la route.",
        accent: "#6C1E80",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2021-saint-aignan.webp",
      },
      {
        id: "2021-lot-villeneuve-loubet",
        start: iso(2021, 12, 19),
        end: iso(2021, 12, 30),
        places: "Sainte-Livrette-sur-Lot · Villeneuve-Loubet",
        country: "FR",
        mood: "Deux ambiances. Campagne + bord de mer.",
        accent: "#F472B6",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2021-villeneuve.webp",
      },

      // 2022
      {
        id: "2022-dieppe",
        start: iso(2022, 2, 26),
        end: iso(2022, 2, 28),
        places: "Dieppe",
        country: "FR",
        mood: "Ciel bas, embruns, contrastes nets.",
        accent: "#C084FC",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2022-dieppe.webp",
      },
      {
        id: "2022-espagne",
        start: iso(2022, 7, 17),
        end: iso(2022, 8, 3),
        places: "Espagne",
        country: "ES",
        mood: "Couleurs chaudes. Rythme, rues, nuits.",
        accent: "#9B1C31",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2022-espagne.webp",
      },
      {
        id: "2022-frejus",
        start: iso(2022, 8, 21),
        end: iso(2022, 8, 29),
        places: "Fréjus",
        country: "FR",
        mood: "Mer, soleil. Détails et reflets.",
        accent: "#6C1E80",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2022-frejus.webp",
      },
      {
        id: "2022-noyelles-pontoile",
        start: iso(2022, 11, 11),
        end: iso(2022, 11, 13),
        places: "Noyelles-sur-Mer · Pontoiles",
        country: "FR",
        mood: "Air froid. Grands espaces, silence.",
        accent: "#F472B6",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2022-noyelles.webp",
      },

      // 2023
      {
        id: "2023-dublin",
        start: iso(2023, 4, 29),
        end: iso(2023, 6, 23),
        places: "Dublin",
        country: "IE",
        mood: "Pluie fine, pubs, lueurs vertes. Une ville qui respire.",
        accent: "#6C1E80",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2023-dublin.webp",
      },
      {
        id: "2023-capbreton-villeneuve",
        start: iso(2023, 7, 2),
        end: iso(2023, 7, 22),
        places: "Capbreton · Villeneuve-Loubet",
        country: "FR",
        mood: "Long souffle d’été. Océan + Méditerranée.",
        accent: "#C084FC",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2023-capbreton.webp",
      },
      {
        id: "2023-roquebrune-provins",
        start: iso(2023, 9, 6),
        end: iso(2023, 9, 17),
        places: "Roquebrune-sur-Argent · Provins",
        country: "FR",
        mood: "Entre pierres & histoire. Contrastes de lieux.",
        accent: "#9B1C31",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2023-roquebrune.webp",
      },
      {
        id: "2023-barcelone",
        start: iso(2023, 9, 19),
        end: iso(2023, 10, 29),
        places: "Barcelone",
        country: "ES",
        mood: "Architecture, textures, lumière urbaine.",
        accent: "#F472B6",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2023-barcelone.webp",
      },
      {
        id: "2023-chambord",
        start: iso(2023, 11, 4),
        end: iso(2023, 11, 5),
        places: "Chambord",
        country: "FR",
        mood: "Symétrie. Grandeur, lignes, détails.",
        accent: "#6C1E80",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2023-chambord.webp",
      },

      // 2024
      {
        id: "2024-sainte-foy-les-lyon",
        start: iso(2024, 5, 12),
        end: iso(2024, 5, 18),
        places: "Sainte-Foy-lès-Lyon",
        country: "FR",
        mood: "Repères, rythme plus doux. Interlude en altitude.",
        accent: "#C084FC",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2024-sainte-foy.webp",
      },
      {
        id: "2024-londres",
        start: iso(2024, 6, 20),
        end: iso(2024, 6, 24),
        places: "Londres",
        country: "UK",
        mood: "Néons, pluie légère, rythme cinéma.",
        accent: "#9B1C31",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2024-londres.webp",
      },
      {
        id: "2024-frejus-esparon",
        start: iso(2024, 8, 11),
        end: iso(2024, 9, 1),
        places: "Fréjus · Esparon de Verdon",
        country: "FR",
        mood: "Eau, chaleur, bleus profonds.",
        accent: "#F472B6",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2024-verdon.webp",
      },

      // 2025
      {
        id: "2025-lormont",
        start: iso(2025, 2, 18),
        end: iso(2025, 2, 23),
        places: "Lormont",
        country: "FR",
        mood: "Changement de décor. Repos & repères.",
        accent: "#6C1E80",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2025-lormont.webp",
      },
      {
        id: "2025-madrid",
        start: iso(2025, 3, 11),
        end: iso(2025, 3, 13),
        places: "Madrid",
        country: "ES",
        mood: "Vitesse, art, rues vivantes.",
        accent: "#9B1C31",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2025-madrid.webp",
      },
      {
        id: "2025-pornichet",
        start: iso(2025, 4, 19),
        end: iso(2025, 4, 22),
        places: "Port-Nichet",
        country: "FR",
        mood: "Air marin. Détente, horizon.",
        accent: "#C084FC",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2025-pornichet.webp",
      },
      {
        id: "2025-montreal",
        start: iso(2025, 4, 26),
        end: iso(2025, 6, 15),
        places: "Montréal",
        country: "CA",
        mood: "Ville-lumière froide. Quartiers, rythme, contrastes.",
        accent: "#F472B6",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2025-montreal.webp",
      },
      {
        id: "2025-sea-island",
        start: iso(2025, 8, 22),
        end: iso(2025, 8, 28),
        places: "Sea Island",
        country: "US",
        mood: "Ambiance insulaire. Calme & lumière.",
        accent: "#F472B6",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2025-sea-island.webp",
      },
      {
        id: "2025-lyon-sept",
        start: iso(2025, 9, 10),
        end: iso(2025, 9, 14),
        places: "Lyon",
        country: "FR",
        mood: "Retour en ville. Lignes, pierres, vie nocturne.",
        accent: "#6C1E80",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2025-lyon.webp",
      },
      {
        id: "2025-lyon-mulatiere",
        start: iso(2025, 9, 28),
        end: iso(2025, 10, 2),
        places: "Lyon · La Mulatière",
        country: "FR",
        mood: "Quartiers, passages, détails du quotidien.",
        accent: "#C084FC",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2025-mulatiere.webp",
      },
      {
        id: "2025-lyon-oct",
        start: iso(2025, 10, 26),
        end: iso(2025, 10, 30),
        places: "Lyon",
        country: "FR",
        mood: "Matières froides, lumière rasante, tempo urbain.",
        accent: "#9B1C31",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2025-lyon-oct.webp",
      },
      {
        id: "2025-londres-2",
        start: iso(2025, 10, 31),
        end: iso(2025, 11, 2),
        places: "Grand Londres · Londres",
        country: "UK",
        mood: "Retour. Même ville, autre regard.",
        accent: "#F472B6",
        lane: -1,
        kind: "Study",
        imageUrl: "/travel/2025-londres.webp",
      },
      {
        id: "2025-lyon-nov",
        start: iso(2025, 11, 23),
        end: iso(2025, 11, 27),
        places: "Lyon",
        country: "FR",
        mood: "Fin d’année qui approche. Une ville-refuge.",
        accent: "#6C1E80",
        lane: 1,
        kind: "Study",
        imageUrl: "/travel/2025-lyon-nov.webp",
      },
    ],
    []
  );

  const stops: Stop[] = useMemo(() => {
    const sorted = [...trips].sort((a, b) => parseISO(a.start) - parseISO(b.start));

    const START_OFFSET = 180;
    const BASE_GAP = 420;
    const PER_DAY = 18;
    const EXTRA_YEAR = 120;

    let x = START_OFFSET;
    let prevYear = new Date(parseISO(sorted[0]?.start ?? iso(2018, 1, 1))).getFullYear();

    return sorted.map((t) => {
      const y = new Date(parseISO(t.start)).getFullYear();
      const dur = daysBetween(t.start, t.end);

      const jump = Math.max(0, y - prevYear);
      if (jump > 0) x += jump * EXTRA_YEAR;

      const s: Stop = {
        ...t,
        x,
        year: y,
        dateLabel: formatDateRangeDeterministic(t.start, t.end, locale),
        durationDays: dur,
      };

      x += BASE_GAP + dur * PER_DAY;
      prevYear = y;
      return s;
    });
  }, [trips, locale]);

  const contentWidth = useMemo(() => {
    const last = stops[stops.length - 1];
    const end = (last?.x ?? 0) + 980;
    return Math.max(end, vw + 400);
  }, [stops, vw]);

  const target = useMotionValue(0);
  const progress = useSpring(target, { stiffness: 70, damping: 22, mass: 0.9 });

  const maxProgress = Math.max(0, contentWidth - centerX - 120);
  const minProgress = 0;

  const worldX = useTransform(progress, (p) => centerX - p);

  const viewportRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const delta = raw * 0.9;
      const next = clamp(target.get() + delta, minProgress, maxProgress);
      target.set(next);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [target, minProgress, maxProgress]);

  const dragRef = useRef<{ x: number; p: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, p: target.get() };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const next = clamp(dragRef.current.p - dx * 1.12, minProgress, maxProgress);
    target.set(next);
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const REVEAL_NEAR = 110;
  const UNLOCK_AT = 12;
  const PATH_AHEAD = 240;

  const [pNow, setPNow] = useState(0);
  useEffect(() => {
    const unsub = progress.on("change", (v) => setPNow(v));
    return () => unsub();
  }, [progress]);

  const visibleUntil = pNow + PATH_AHEAD;
  const pointXInWorld = pNow;

  const backHref = `/${locale}`;

  return (
    <section
      ref={(node) => {
        viewportRef.current = node;
      }}
      className="relative h-[100dvh] w-full overflow-hidden bg-[#0A0A0B] text-white select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 opacity-70 [background:radial-gradient(1100px_520px_at_18%_20%,rgba(155,28,49,0.18),transparent_62%),radial-gradient(900px_520px_at_92%_30%,rgba(108,30,128,0.16),transparent_64%),radial-gradient(1200px_820px_at_50%_70%,rgba(0,0,0,0.60),rgba(0,0,0,0.92))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.14),rgba(255,255,255,0.14)_1px,transparent_1px,transparent_3px)]" />
      </div>

      <Starfield density={120} />
      <ShootingStars />

      {/* ✅ Header + bouton Retour */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-[8] px-6 pt-6">
        <div className="mx-auto max-w-6xl relative">
          {/* Retour */}
          <div className="pointer-events-auto absolute left-0 top-0">
            <Link
              href={backHref}
              onPointerDown={(e) => e.stopPropagation()} // évite de déclencher le drag
              onMouseDown={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-[11px] font-mono tracking-[0.20em] text-white/85 backdrop-blur-md hover:bg-black/55 transition"
            >
              <ArrowLeft size={14} className="opacity-80" />
              RETOUR
            </Link>
          </div>

          <div className="text-[10px] font-mono tracking-[0.42em] text-white/35 uppercase text-center sm:text-left sm:pl-[110px]">
            TRAVEL <span className="mx-3 text-white/20">—</span> CHRONO
          </div>

          <h1 className="mt-3 text-5xl sm:text-6xl font-black tracking-tight text-center sm:text-left sm:pl-[110px]">
            <span className="bg-gradient-to-r from-[#9B1C31] via-[#6C1E80] to-[#ffffff] bg-clip-text text-transparent">
              Frise Vivante
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-white/60 text-center sm:text-left sm:pl-[110px]">
            Une ligne qui avance. De la brume. Des lieux qui se débloquent quand tu t’en approches.
          </p>
        </div>
      </div>

      {/* Contenu */}
      <motion.div className="absolute inset-0 z-[4]" style={{ x: worldX }} aria-hidden="true">
        <svg width={contentWidth} height={vh} viewBox={`0 0 ${contentWidth} ${vh}`} className="absolute left-0 top-0">
          <line x1={0} y1={baselineY} x2={contentWidth} y2={baselineY} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
          <line x1={0} y1={baselineY} x2={Math.max(0, visibleUntil)} y2={baselineY} stroke="rgba(155,28,49,0.65)" strokeWidth={2.5} />

          {stops.map((s) => {
            const dx = Math.abs(pointXInWorld - s.x);
            const near = dx < REVEAL_NEAR;
            const unlocked = pointXInWorld >= s.x + UNLOCK_AT;

            const showBranch = unlocked || near;

            const laneY =
              s.lane === -1 ? TOP_LANE_Y : s.lane === 1 ? BOT_LANE_Y : baselineY;

            return (
              <g key={s.id}>
                {(unlocked || near) && (
                  <>
                    <circle
                      cx={s.x}
                      cy={baselineY}
                      r={unlocked ? 6 : 4}
                      fill={unlocked ? s.accent : "rgba(255,255,255,0.25)"}
                      opacity={unlocked ? 1 : 0.7}
                    />
                    {unlocked && (
                      <circle
                        cx={s.x}
                        cy={baselineY}
                        r={16}
                        fill="transparent"
                        stroke={s.accent}
                        strokeWidth={1.2}
                        opacity={0.20}
                      />
                    )}
                  </>
                )}

                {showBranch && s.lane !== 0 && (
                  <line
                    x1={s.x}
                    y1={baselineY}
                    x2={s.x}
                    y2={laneY}
                    stroke={unlocked ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)"}
                    strokeWidth={1.6}
                  />
                )}

                {showBranch && s.lane !== 0 && (
                  <circle
                    cx={s.x}
                    cy={laneY}
                    r={unlocked ? 4 : 3}
                    fill={unlocked ? s.accent : "rgba(255,255,255,0.18)"}
                    opacity={unlocked ? 1 : 0.65}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {stops.map((s) => {
          const dx = Math.abs(pointXInWorld - s.x);
          const near = dx < REVEAL_NEAR;
          const unlocked = pointXInWorld >= s.x + UNLOCK_AT;

          const visible = unlocked || dx < 280;
          if (!visible) return null;

          return (
            <TravelCard
              key={s.id}
              stop={s}
              unlocked={unlocked}
              near={near}
              topY={TOP_LANE_Y}
              midY={MID_LANE_Y}
              botY={BOT_LANE_Y}
            />
          );
        })}
      </motion.div>

      {/* Point centre */}
      <div
        className="pointer-events-none absolute z-[6]"
        style={{
          left: centerX,
          top: baselineY,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="absolute -inset-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(155,28,49,0.14), rgba(108,30,128,0.10), transparent 72%)",
            filter: "blur(2px)",
          }}
        />
        <div className="relative grid place-items-center">
          <div
            className="h-3 w-3 rounded-full"
            style={{
              background: "#9B1C31",
              boxShadow: "0 0 24px rgba(155,28,49,0.55)",
            }}
          />
          <div className="absolute -left-10 -top-7 opacity-80">
            <MapPin size={16} className="text-white/70" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-[7] flex justify-center">
        <div className="text-[10px] font-mono tracking-[0.42em] text-white/40 uppercase">
          SCROLL / DRAG → ADVANCE
        </div>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0% { transform: scale(0.95); opacity: 0.05; }
          40% { transform: scale(1.15); opacity: 0.18; }
          100% { transform: scale(0.98); opacity: 0.08; }
        }
        @keyframes shoot {
          0% { transform: translateX(-220px) rotate(-18deg); opacity: 0; }
          12% { opacity: 1; }
          38% { opacity: 0.55; }
          55% { opacity: 0; }
          100% { transform: translateX(520px) rotate(-18deg); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
