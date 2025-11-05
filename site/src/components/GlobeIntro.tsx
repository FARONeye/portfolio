"use client";

import { Suspense, useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, QuadraticBezierLine, Points, PointMaterial } from "@react-three/drei";

/* =========================================
   Utils & types
========================================= */
type V3 = [number, number, number];
const degToRad = (d: number) => (d * Math.PI) / 180;

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

/* =========================================
   Data
========================================= */
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

/* =========================================
   Graticule (wireframe latitude/longitude)
========================================= */
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

/* =========================================
   Orbital particles — sobres, toujours visibles
========================================= */
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

  return (
    <Points positions={positions} stride={3} frustumCulled={false} renderOrder={1}>
      <PointMaterial
        color="#BB69FF"
        size={0.02}
        sizeAttenuation={false}
        depthWrite={false}
        depthTest={false}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </Points>
  );
}

/* =========================================
   Node ping (activité des nœuds)
========================================= */
function NodePing({ position }: { position: THREE.Vector3 }) {
  const { camera } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const a = (t % 1.6) / 1.6;
    if (!ref.current) return;
    ref.current.lookAt(camera.position);
    ref.current.scale.setScalar(0.16 + 0.45 * a);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.9 * (1 - a);
  });

  return (
    <mesh ref={ref} position={position.toArray()} renderOrder={3}>
      <ringGeometry args={[0.014, 0.085, 32 ]} />
      <meshBasicMaterial
        color="#C084FC"
        transparent
        opacity={0.8}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/* =========================================
   ArcTraffic — MAJ via attribute ref (pas d’immutabilité hook)
========================================= */
function ArcTraffic({
  start,
  mid,
  end,
  count = 18,
  baseSpeed = 0.35,
  size = 0.058,
  color = "#F472B6",
  progress = 0,
}: {
  start: THREE.Vector3;
  mid: THREE.Vector3;
  end: THREE.Vector3;
  count?: number;
  baseSpeed?: number;
  size?: number;
  color?: string;
  progress?: number;
}) {
  // buffer initial (une seule fois)
  const initialPositions = useMemo(() => new Float32Array(count * 3), [count]);

  // geometry & attribute refs
  const geomRef = useRef<THREE.BufferGeometry>(null!);
  const attrRef = useRef<THREE.BufferAttribute | null>(null);

  // seeds deterministes
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        o: hash01(i * 2.13 + 0.17),
        s: 0.6 + hash01(i * 7.7 + 0.29),
      })),
    [count]
  );

  // récupérer l’attribut 'position' une fois monté
  useLayoutEffect(() => {
    if (!geomRef.current) return;
    attrRef.current = geomRef.current.getAttribute("position") as THREE.BufferAttribute;
  }, []);

  // animer en modifiant l’array de l’attribut (pas la valeur d’un hook)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speedBoost = 0.6 + 0.8 * progress;
    const attr = attrRef.current;
    if (!attr) return;

    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const u = (seeds[i].o + t * baseSpeed * seeds[i].s * speedBoost) % 1;
      const p = quadPoint(start, mid, end, u);
      arr[i * 3 + 0] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    }
    attr.needsUpdate = true;
  });

  // géométrie native (pas d’accès ref en render, pas de mutation de hook)
  return (
    <points frustumCulled={false} renderOrder={4}>
      <bufferGeometry ref={geomRef}>
        {/* IMPORTANT: utiliser 'args' plutôt que 'array' pour éviter l’erreur TS */}
        <bufferAttribute attach="attributes-position" args={[initialPositions, 3]} />
      </bufferGeometry>
      <PointMaterial
        color={color}
        size={size}
        sizeAttenuation={false}
        transparent
        opacity={0.95}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/* =========================================
   Background starfield (camera-anchored)
========================================= */
function BackgroundStars({
  count = 3800,
  radius = 90,
  jitter = 28,
}: { count?: number; radius?: number; jitter?: number }) {
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const seed = 1337;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = hash01(i * 12.9898 + seed);
      const v = hash01(i * 78.233 + seed * 0.73);
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const rad = radius + (hash01(i * 91.7 + seed * 1.37) - 0.5) * jitter;
      arr[i * 3 + 0] = rad * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = rad * Math.cos(phi);
      arr[i * 3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count, radius, jitter]);

  useFrame(() => {
    if (group.current) group.current.position.copy(camera.position);
  });

  return (
    <group ref={group} renderOrder={-1} frustumCulled={false}>
      <Points positions={positions} stride={3}>
        <PointMaterial
          size={0.015}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </Points>
    </group>
  );
}

/* =========================================
   Globe 3D scene (driven by progress 0..100)
========================================= */
function GlobeScene({ progress }: { progress: number }) {
  const p = Math.max(0, Math.min(1, progress / 100));

  const root = useRef<THREE.Group>(null);
  const fineGridRef = useRef<THREE.Group>(null);
  const coarseGridRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Mouse parallax target
  const mouseTarget = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseTarget.current.x = nx;
      mouseTarget.current.y = ny;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

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
      // rotation pilotée par le scroll (spinT) + léger parallax
      const lerp = 1 - Math.pow(0.0005, dt);
      const targetRx = spinT * 0.35 + mouseTarget.current.y * 0.1;
      const targetRy = spinT * Math.PI * 2 + mouseTarget.current.x * 0.2;
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, targetRx, lerp);
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, targetRy, lerp);

      const s = 1 + Math.sin(t * 0.9) * 0.015; // breathing
      root.current.scale.setScalar(s);
    }

    const drift = 1 - zoomT;
    if (coarseGridRef.current) coarseGridRef.current.rotation.y += dt * 0.03 * drift;
    if (fineGridRef.current) fineGridRef.current.rotation.y -= dt * 0.05 * drift;
    if (ringsRef.current) ringsRef.current.rotation.z += dt * 0.04 * drift;

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
      {/* soft halo — n’écrit plus dans le depth buffer */}
      <mesh>
        <sphereGeometry args={[1.38, 64, 32]} />
        <meshBasicMaterial
          color={"#6C1E80"}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      {/* grids */}
      <group ref={coarseGridRef}>
        <LatLongGrid step={10} color="#9E8AFF" opacity={0.28} />
      </group>
      <group ref={fineGridRef}>
        <LatLongGrid step={5} color="#6C1E80" opacity={0.12} />
      </group>

      {/* rings */}
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

      {/* orbital particles */}
      <OrbitalParticles count={700} r={1.36} />

      {/* pulses sur les nœuds */}
      {Object.values(cities).map((pos, i) => (
        <NodePing key={i} position={pos} />
      ))}

      {/* arcs + trafic net */}
      {LINKS.map(([a, b], i) => {
        const start = cities[a];
        const end = cities[b];
        const mid = start
          .clone()
          .add(end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(2.0);
        return (
          <group key={i}>
            <QuadraticBezierLine
              start={start.toArray() as V3}
              end={end.toArray() as V3}
              mid={mid.toArray() as V3}
              color="#C084FC"
              lineWidth={1.4}
              dashed
              dashScale={1}
              dashSize={0.12}
              dashOffset={-(p * 8)}
              transparent
              opacity={0.55}
            />

            {/* Aller */}
            <ArcTraffic
              start={start}
              mid={mid}
              end={end}
              count={28}
              baseSpeed={0.55}
              size={0.10}
              color="#F9A8D4"
              progress={p}
            />

            {/* Retour (bidirectionnel) */}
            <ArcTraffic
              start={end}
              mid={mid}
              end={start}
              count={18}
              baseSpeed={0.4}
              size={2}
              color="#C084FC"
              progress={p}
            />
          </group>
        );
      })}
    </group>
  );
}

/* =========================================
   Canvas sticky
========================================= */
function StickyCanvas({ progress }: { progress: number }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 3.8], fov: 45 }}>
        <Suspense fallback={null}>
          <BackgroundStars count={3800} radius={90} jitter={28} />
          <ambientLight intensity={0.9} />
          <pointLight color={"#9B1C31"} intensity={2} position={[2, 1, 2]} />
          <pointLight color={"#6C1E80"} intensity={1.8} position={[-2, -1, -2]} />
          <GlobeScene progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* =========================================
   Intro 0..100 + lock/unlock scroll + re-entry snap
========================================= */
export default function GlobeIntro() {
  const [progress, setProgress] = useState(0); // 0 → 100
  const [locked, setLocked] = useState(true);
  const attachedRef = useRef(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const afterTopRef = useRef<number | null>(null);
  const snappingRef = useRef(false);
  const exitingRef = useRef(false);

  const SAFE_OFFSET = 220;
  const REENTRY_SNAP_ZONE = 180;

  const getSectionTop = () => {
    const el = sectionRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return r.top + window.scrollY;
  };

  useEffect(() => {
    const computeAfterTop = () => {
      const el = document.getElementById("after-intro");
      afterTopRef.current = el ? el.getBoundingClientRect().top + window.scrollY : null;
    };
    computeAfterTop();
    window.addEventListener("resize", computeAfterTop);
    return () => window.removeEventListener("resize", computeAfterTop);
  }, []);

  // re-entry quand on revient tout en haut
  useEffect(() => {
    const onScroll = () => {
      if (locked || snappingRef.current) return;
      const sectionTop = getSectionTop();
      if (window.scrollY <= sectionTop + REENTRY_SNAP_ZONE) {
        snappingRef.current = true;
        window.scrollTo({ top: sectionTop, behavior: "auto" });
        setProgress(0);
        setLocked(true);
        requestAnimationFrame(() => (snappingRef.current = false));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [locked]);

  // lock inputs jusqu’à la fin de l’intro
  useEffect(() => {
    if (!locked) return;

    const clamp100 = (v: number) => Math.max(0, Math.min(100, v));
    const opts: AddEventListenerOptions = { passive: false };
    let touchStartY = 0;

    const unlockBody = () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };

    const exitToContent = () => {
      if (exitingRef.current) return;
      exitingRef.current = true;

      const anchorTop = afterTopRef.current ?? getSectionTop();

      // unlock immédiatement
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      setLocked(false);

      requestAnimationFrame(() => {
        const root = document.documentElement;
        const prev = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, anchorTop + SAFE_OFFSET);
        root.style.scrollBehavior = prev;

        setTimeout(() => (exitingRef.current = false), 0);
      });
    };

    // on lock maintenant
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const advance = (delta: number) => {
      if (exitingRef.current) return;
      setProgress((p) => {
        const next = clamp100(p + delta);
        if (delta > 0 && next >= 99) {
          requestAnimationFrame(() => exitToContent());
          return 100;
        }
        return next;
      });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      advance(e.deltaY * 0.12);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        advance(+6);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        advance(-6);
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? touchStartY;
      const dy = touchStartY - y;
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
    <section
      ref={sectionRef}
      className="relative h-screen bg-[#0A0A0B]"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% 40%, rgba(108,30,128,.22), transparent 60%), radial-gradient(1000px 500px at 50% 80%, rgba(155,28,49,.18), transparent 60%), #0A0A0B",
      }}
    >
      <StickyCanvas progress={progress} />
      <div className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center pb-8">
        <div className="text-[10px] tracking-[0.35em] text-zinc-300/80">
          {locked ? (progress < 100 ? "SCROLL" : "END") : "READY"}
        </div>
      </div>
    </section>
  );
}
