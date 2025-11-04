"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, QuadraticBezierLine, Points, PointMaterial } from "@react-three/drei";

/* =========================
   Utils & Types
========================= */

type V3 = [number, number, number];
const degToRad = (d: number) => (d * Math.PI) / 180;

// bruit déterministe (pas de Math.random dans le render)
function hash01(x: number) {
  const s = Math.sin(x) * 43758.5453123;
  return s - Math.floor(s);
}

function latLngToVec3(lat: number, lon: number, r = 1.35): THREE.Vector3 {
  const phi = degToRad(90 - lat);
  const theta = degToRad(lon + 180);
  const x = -r * Math.sin(phi) * Math.cos(theta);
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function quadPoint(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, t: number) {
  const ab = a.clone().lerp(b, t);
  const bc = b.clone().lerp(c, t);
  return ab.lerp(bc, t);
}

/* =========================
   Données villes & routes
========================= */

const CITIES = {
  paris: { lat: 48.8566, lon: 2.3522 },
  london: { lat: 51.5072, lon: -0.1276 },
  nyc: { lat: 40.7128, lon: -74.006 },
  tokyo: { lat: 35.6762, lon: 139.6503 },
  sydney: { lat: -33.8688, lon: 151.2093 },
  saoPaulo: { lat: -23.5505, lon: -46.6333 },
} as const;
type CityKey = keyof typeof CITIES;

const LINKS: Array<[CityKey, CityKey]> = [
  ["paris", "london"],
  ["paris", "nyc"],
  ["paris", "tokyo"],
  ["paris", "sydney"],
  ["paris", "saoPaulo"],
  ["nyc", "tokyo"],
];

/* =========================
   Wireframe (parallèles + méridiens)
========================= */

function buildLatitude(latDeg: number, seg = 128, r = 1.35) {
  const pts: THREE.Vector3[] = [];
  const lat = degToRad(latDeg);
  const y = r * Math.sin(lat);
  const pr = r * Math.cos(lat);
  for (let i = 0; i <= seg; i++) {
    const t = (i / seg) * Math.PI * 2;
    pts.push(new THREE.Vector3(pr * Math.cos(t), y, pr * Math.sin(t)));
  }
  return pts;
}
function buildLongitude(lonDeg: number, seg = 128, r = 1.35) {
  const pts: THREE.Vector3[] = [];
  const lon = degToRad(lonDeg);
  for (let i = 0; i <= seg; i++) {
    const t = -Math.PI / 2 + (i / seg) * Math.PI;
    const y = r * Math.sin(t);
    const pr = r * Math.cos(t);
    pts.push(new THREE.Vector3(pr * Math.cos(lon), y, pr * Math.sin(lon)));
  }
  return pts;
}

function LatLongGrid({
  step = 10,
  color = "#8A7CFF",
  opacity = 0.45,
}: {
  step?: number;
  color?: string;
  opacity?: number;
}) {
  const lats = useMemo(() => {
    const arr: THREE.Vector3[][] = [];
    for (let lat = -80; lat <= 80; lat += step) arr.push(buildLatitude(lat));
    return arr;
  }, [step]);
  const lons = useMemo(() => {
    const arr: THREE.Vector3[][] = [];
    for (let lon = -180; lon < 180; lon += step) arr.push(buildLongitude(lon));
    return arr;
  }, [step]);

  return (
    <group>
      {lats.map((pts, i) => (
        <Line key={`lat-${step}-${i}`} points={pts} color={color} transparent opacity={opacity} lineWidth={1} />
      ))}
      {lons.map((pts, i) => (
        <Line key={`lon-${step}-${i}`} points={pts} color={color} transparent opacity={opacity} lineWidth={1} />
      ))}
    </group>
  );
}

/* =========================
   Particules en orbite
========================= */

function OrbitalParticles({ count = 700, r = 1.36 }: { count?: number; r?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = hash01(i * 12.9898 + 1.0);
      const v = hash01(i * 78.233 + 2.0);
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count, r]);

  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.05;
    group.current.rotation.x += dt * 0.015;
  });

  return (
    <group ref={group}>
      <Points positions={positions} stride={3}>
        <PointMaterial color="#BB69FF" size={0.01} sizeAttenuation depthWrite={false} transparent opacity={0.75} />
      </Points>
    </group>
  );
}

/* =========================
   Dots qui glissent sur les arcs
========================= */

function FlowDots({
  start,
  mid,
  end,
  count = 2,
}: {
  start: THREE.Vector3;
  mid: THREE.Vector3;
  end: THREE.Vector3;
  count?: number;
}) {
  const params = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        offset: hash01(i * 3.1 + 0.1) + i * 0.35,
        speed: 0.35 + 0.25 * hash01(i * 7.7 + 0.2),
        scale: 0.02 + 0.02 * hash01(i * 11.3 + 0.3),
      })),
    [count]
  );

  const meshes = useRef<THREE.Mesh[]>([]);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    params.forEach((d, i) => {
      const u = (t * d.speed + d.offset) % 1;
      const p = quadPoint(start, mid, end, u);
      const m = meshes.current[i];
      if (m) {
        m.position.copy(p);
        const s = d.scale * (0.5 + 0.5 * Math.sin((u + t) * 6));
        m.scale.setScalar(s);
      }
    });
  });

  return (
    <group>
      {params.map((_, i) => (
        <mesh key={i} ref={(m) => m && (meshes.current[i] = m)}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#FF477E" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* =========================
   Scène 3D du globe (pilotée par progress 0..100)
========================= */

function GlobeScene({ progress }: { progress: number }) {
  // normalise en 0..1 pour les calculs internes
  const p = Math.max(0, Math.min(1, progress / 100));

  const root = useRef<THREE.Group>(null);
  const fineGridRef = useRef<THREE.Group>(null);
  const coarseGridRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const cities = useMemo(() => {
    const entries = Object.entries(CITIES) as [CityKey, { lat: number; lon: number }][];
    return Object.fromEntries(entries.map(([k, v]) => [k, latLngToVec3(v.lat, v.lon)])) as Record<
      CityKey,
      THREE.Vector3
    >;
  }, []);

  const spinT = Math.min(p / 0.8, 1);
  const zoomT = THREE.MathUtils.clamp((p - 0.8) / 0.2, 0, 1);
  const france = useMemo(() => latLngToVec3(46.2276, 2.2137), []);

  useFrame((_, dt) => {
    const t = performance.now() / 1000;

    if (root.current) {
      root.current.rotation.y = spinT * Math.PI * 2;
      root.current.rotation.x = spinT * 0.35;
      const s = 1 + Math.sin(t * 0.9) * 0.015; // respiration
      root.current.scale.setScalar(s);
    }

    // amortit les drifts à l’approche de la fin
    const drift = 1 - zoomT; // 1 au début → 0 à la fin
    if (coarseGridRef.current) coarseGridRef.current.rotation.y += dt * 0.03 * drift;
    if (fineGridRef.current) fineGridRef.current.rotation.y -= dt * 0.05 * drift;
    if (ringsRef.current) ringsRef.current.rotation.z += dt * 0.04 * drift;

    // travel caméra
    const baseDist = 3.8;
    const closeDist = 1.8;
    const dist = THREE.MathUtils.lerp(baseDist, closeDist, zoomT);
    const targetPos = france.clone().normalize().multiplyScalar(dist);
    camera.position.lerp(targetPos, 1 - Math.pow(0.00008, dt));
    camera.lookAt(france);
    camera.updateProjectionMatrix();
  });

  return (
    <group ref={root}>
      {/* halo doux */}
      <mesh>
        <sphereGeometry args={[1.38, 64, 32]} />
        <meshBasicMaterial color={"#6C1E80"} transparent opacity={0.06} />
      </mesh>

      {/* grilles */}
      <group ref={coarseGridRef}>
        <LatLongGrid step={10} color="#9E8AFF" opacity={0.35} />
      </group>
      <group ref={fineGridRef}>
        <LatLongGrid step={5} color="#6C1E80" opacity={0.18} />
      </group>

      {/* anneaux */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.6, 0.0025, 8, 256]} />
          <meshBasicMaterial color="#6C1E80" transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[-Math.PI / 6, 0, Math.PI / 8]}>
          <torusGeometry args={[1.8, 0.0025, 8, 256]} />
          <meshBasicMaterial color="#9B1C31" transparent opacity={0.25} />
        </mesh>
      </group>

      {/* particules */}
      <OrbitalParticles count={700} r={1.36} />

      {/* arcs + flux */}
      {LINKS.map(([a, b], i) => {
        const start = cities[a];
        const end = cities[b];
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.0);
        return (
          <group key={i}>
            <QuadraticBezierLine
              start={start.toArray() as V3}
              end={end.toArray() as V3}
              mid={mid.toArray() as V3}
              color={"#FF477E"}
              lineWidth={1.3}
              dashed
              dashScale={1}
              dashSize={0.12}
              dashOffset={-p * 8}
              transparent
              opacity={0.9}
            />
            <FlowDots start={start} mid={mid} end={end} count={2} />
          </group>
        );
      })}
    </group>
  );
}

/* =========================
   Canvas sticky
========================= */

function StickyCanvas({ progress }: { progress: number }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 3.8], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.9} />
          <pointLight color={"#9B1C31"} intensity={2} position={[2, 1, 2]} />
          <pointLight color={"#6C1E80"} intensity={1.8} position={[-2, -1, -2]} />
          <GlobeScene progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* =========================
   Intro : 0..100 + sortie ferme + snap de ré-entrée
========================= */

export default function GlobeIntro() {
const [progress, setProgress] = useState(0);  // 0 → 100
const [locked, setLocked] = useState(true);
const attachedRef = useRef(false);

const sectionRef = useRef<HTMLElement | null>(null);
const afterTopRef = useRef<number | null>(null);
const snappingRef = useRef(false);
const exitingRef = useRef(false);

// NEW: mémorise la direction du dernier input
const lastDirRef = useRef<'down' | 'up'>('down');

// paramètres (légèrement augmentés)
const SAFE_OFFSET = 220;        // marge sous l’ancre
const REENTRY_SNAP_ZONE = 180;  // ré-entrée quand on revient près du haut
const EXIT_AT = 99;
const EXIT_FREEZE_MS = 0;

// NEW: poussée supplémentaire pour bien rentrer dans le contenu
const EXIT_EXTRA_PUSH_MIN = 0;    // px mini
const EXIT_EXTRA_PUSH_VH  = 0.00;

  const getSectionTop = () => {
    const el = sectionRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return r.top + window.scrollY;
  };

  // calcule la position de l’ancre de contenu
  useEffect(() => {
    const computeAfterTop = () => {
      const el = document.getElementById("after-intro");
      afterTopRef.current = el ? el.getBoundingClientRect().top + window.scrollY : null;
    };
    computeAfterTop();
    window.addEventListener("resize", computeAfterTop);
    return () => window.removeEventListener("resize", computeAfterTop);
  }, []);

  // Ré-entrée : on re-lock uniquement quand on est quasi en haut de la section
  useEffect(() => {
    const onScroll = () => {
      if (locked || snappingRef.current) return;
      const sectionTop = getSectionTop();
      if (window.scrollY <= sectionTop + REENTRY_SNAP_ZONE) {
        snappingRef.current = true;
        // snap en haut de la section puis reset anim
        window.scrollTo({ top: sectionTop, behavior: "auto" });
        setProgress(0);
        setLocked(true);
        requestAnimationFrame(() => (snappingRef.current = false));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [locked]);

  // Verrouillage des entrées tant que l’intro n’est pas terminée
  useEffect(() => {
    if (!locked) return;

    const clamp100 = (v: number) => Math.max(0, Math.min(100, v));
    const opts: AddEventListenerOptions = { passive: false };
    let touchStartY = 0;

    const lockBody = () => {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
    };
    const unlockBody = () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
    };

    const exitToContent = () => {
        if (exitingRef.current) return;
        exitingRef.current = true;

        // on calcule l’ancre la plus fraîche
        const anchorTop = afterTopRef.current ?? getSectionTop();
        const push = Math.max(window.innerHeight * EXIT_EXTRA_PUSH_VH, EXIT_EXTRA_PUSH_MIN);

        // déverrouille immédiatement
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        setLocked(false);

        requestAnimationFrame(() => {
            // 1) saut *instantané* (pas smooth) juste sous l’ancre
            const root = document.documentElement;
            const prevBehavior = root.style.scrollBehavior;
            root.style.scrollBehavior = "auto";
            window.scrollTo(0, anchorTop + SAFE_OFFSET);
            root.style.scrollBehavior = prevBehavior;

            // 2) petite frame plus tard: *grosse poussée* smooth pour être bien dans le contenu
            requestAnimationFrame(() => {
            window.scrollBy({ top: push, behavior: "smooth" });
            });

            // anti rebond
            setTimeout(() => (exitingRef.current = false), EXIT_FREEZE_MS);
        });
        };


    lockBody();

    const advance = (delta: number) => {
        if (exitingRef.current) return; // ignore pendant la sortie
        setProgress((p) => {
        const next = clamp100(p + delta);
        if (delta > 0 && next >= EXIT_AT) {
            // fige à 100 et on sort
            requestAnimationFrame(() => exitToContent());
            return 100;
        }
        return next;
        });
    };

    const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        lastDirRef.current = e.deltaY > 0 ? "down" : "up";
        advance(e.deltaY * 0.12);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        lastDirRef.current = "down";
        advance(+6);
        } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        lastDirRef.current = "up";
        advance(-6);
        }
    };

    const onTouchStart = (e: TouchEvent) => {
        touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const y = e.touches[0]?.clientY ?? touchStartY;
        const dy = touchStartY - y; // bas: + / haut: -
        lastDirRef.current = dy > 0 ? "down" : "up";
        advance(dy * 0.3);
        touchStartY = y;
    };

    if (!attachedRef.current) {
        attachedRef.current = true;
        window.addEventListener("wheel", onWheel, opts);
        window.addEventListener("keydown", onKeyDown, opts);
        window.addEventListener("touchstart", onTouchStart, opts);
        window.addEventListener("touchmove", onTouchMove, opts);
    }

    return () => {
        if (attachedRef.current) {
        attachedRef.current = false;
        window.removeEventListener("wheel", onWheel, opts);
        window.removeEventListener("keydown", onKeyDown, opts);
        window.removeEventListener("touchstart", onTouchStart, opts);
        window.removeEventListener("touchmove", onTouchMove, opts);
        }
        unlockBody();
    };
    }, [locked]);

  return (
    <section ref={sectionRef} className="relative h-screen bg-[#0A0A0B]">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% 40%, rgba(108,30,128,.22), transparent 60%), radial-gradient(1000px 500px at 50% 80%, rgba(155,28,49,.18), transparent 60%), #0A0A0B",
        }}
      />
      <StickyCanvas progress={progress} />
      <div className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center pb-8">
        <div className="text-[10px] tracking-[0.35em] text-zinc-300/80">
          {locked ? (progress < 100 ? "SCROLL" : "END") : "READY"}
        </div>
      </div>
    </section>
  );
}