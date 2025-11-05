"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Points, PointMaterial } from "@react-three/drei";

/* =================== Const & utils =================== */
const R_GLOBE = 1.35;
const GLOBE_BASE_SCALE = 0.80;

// Intro length: lower = longer
const WHEEL_FACTOR = 0.04;
const KEY_STEP = 2;
const TOUCH_FACTOR = 0.12;
const MAX_WHEEL_DELTA = 60;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const degToRad = (d: number) => (d * Math.PI) / 180;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smoothWindow = (p: number, a: number, b: number, k = 0.08) => {
  const i0 = THREE.MathUtils.smoothstep(p, a - k, a + k);
  const i1 = 1 - THREE.MathUtils.smoothstep(p, b - k, b + k);
  return clamp01(i0 * i1);
};
const hash01 = (x: number) => {
  const s = Math.sin(x) * 43758.5453123;
  return s - Math.floor(s);
};

function latLngToVec3(lat: number, lon: number, r = R_GLOBE): THREE.Vector3 {
  const phi = degToRad(90 - lat);
  const theta = degToRad(lon + 180);
  const x = -r * Math.sin(phi) * Math.cos(theta);
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/** Great-circle with lift (never intersects the globe) */
function greatCirclePoint(a: THREE.Vector3, b: THREE.Vector3, t: number, r = R_GLOBE, lift = 0.18) {
  const u = a.clone().normalize();
  const v = b.clone().normalize();
  const dot = clamp(u.dot(v), -1, 1);
  const ang = Math.acos(dot);
  if (ang < 1e-4) return u.clone().multiplyScalar(r);
  const s1 = Math.sin((1 - t) * ang) / Math.sin(ang);
  const s2 = Math.sin(t * ang) / Math.sin(ang);
  const dir = u.multiplyScalar(s1).add(v.multiplyScalar(s2)).normalize();
  const radius = r * (1 + lift * Math.sin(Math.PI * t));
  return dir.multiplyScalar(radius);
}
function greatCirclePoints(a: THREE.Vector3, b: THREE.Vector3, seg = 64, r = R_GLOBE, lift = 0.18) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) pts.push(greatCirclePoint(a, b, i / seg, r, lift));
  return pts;
}

/* =================== Data =================== */
const CITIES = {
  paris: { lat: 48.8566, lon: 2.3522 },
  london: { lat: 51.5072, lon: -0.1276 },
  nyc: { lat: 40.7128, lon: -74.006 },
  tokyo: { lat: 35.6762, lon: 139.6503 },
  sydney: { lat: -33.8688, lon: 151.2093 },
  saoPaulo: { lat: -23.5505, lon: -46.6333 },
} as const;
type CityKey = keyof typeof CITIES;

const LINKS_BASE: Array<[CityKey, CityKey]> = [
  ["paris", "london"],
  ["paris", "nyc"],
  ["paris", "tokyo"],
  ["paris", "sydney"],
  ["paris", "saoPaulo"],
  ["nyc", "tokyo"],
];

function buildAutoLinks(n = 36) {
  const pairs: Array<[THREE.Vector3, THREE.Vector3]> = [];
  const seed = 20251105;
  let i = 0;
  while (pairs.length < n && i < n * 5) {
    const u1 = hash01(seed + i * 1.37);
    const v1 = hash01(seed + i * 2.71);
    const u2 = hash01(seed + i * 3.11);
    const v2 = hash01(seed + i * 4.53);
    const theta1 = 2 * Math.PI * u1;
    const phi1 = Math.acos(2 * v1 - 1);
    const theta2 = 2 * Math.PI * u2;
    const phi2 = Math.acos(2 * v2 - 1);
    const a = new THREE.Vector3(
      R_GLOBE * Math.sin(phi1) * Math.cos(theta1),
      R_GLOBE * Math.cos(phi1),
      R_GLOBE * Math.sin(phi1) * Math.sin(theta1)
    );
    const b = new THREE.Vector3(
      R_GLOBE * Math.sin(phi2) * Math.cos(theta2),
      R_GLOBE * Math.cos(phi2),
      R_GLOBE * Math.sin(phi2) * Math.sin(theta2)
    );
    const ang = a.clone().normalize().dot(b.clone().normalize());
    const deg = (Math.acos(clamp(ang, -1, 1)) * 180) / Math.PI;
    if (deg > 25 && deg < 155) pairs.push([a, b]);
    i++;
  }
  return pairs;
}

/* =================== Graticule =================== */
function buildLatitude(latDeg: number, seg = 128, r = R_GLOBE) {
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
function buildLongitude(lonDeg: number, seg = 128, r = R_GLOBE) {
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
function LatLongGrid({ step = 10, color = "#8A7CFF", opacity = 0.45 }: { step?: number; color?: string; opacity?: number }) {
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

/* =================== Orbital particles =================== */
function OrbitalParticles({ count = 700, r = R_GLOBE + 0.01 }: { count?: number; r?: number }) {
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
        size={0.025}
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

/* =================== Node ping =================== */
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
      <ringGeometry args={[0.014, 0.045, 32]} />
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

/* =================== ArcTraffic (INSTANCED) =================== */
type InstancedSphere = THREE.InstancedMesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
function ArcTrafficInstanced({
  start, end, lift = 0.2, count = 36, baseSpeed = 0.55, dotRadius = 0.06, color = "#F9A8D4", progress = 0,
}: {
  start: THREE.Vector3; end: THREE.Vector3; lift?: number; count?: number; baseSpeed?: number; dotRadius?: number; color?: string; progress?: number;
}) {
  const meshRef = useRef<InstancedSphere>(null!);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 10, 10), []);
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false }),
    []
  );
  useEffect(() => { mat.color.set(color); }, [color, mat]);

  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => ({ o: hash01(i * 2.13 + 0.17), s: 0.7 + hash01(i * 7.7 + 0.29) })), [count]);

  const mtx = useMemo(() => new THREE.Matrix4(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const scl = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speedBoost = 0.6 + 0.8 * progress;
    const m = meshRef.current; if (!m) return;

    for (let i = 0; i < count; i++) {
      const u = (seeds[i].o + t * baseSpeed * seeds[i].s * speedBoost) % 1;
      const p = greatCirclePoint(start, end, u, R_GLOBE, lift);
      pos.copy(p);
      const s = dotRadius * (1.0 + 0.25 * Math.sin((t + i) * 2.1));
      scl.set(s, s, s);
      mtx.compose(pos, quat, scl);
      m.setMatrixAt(i, mtx);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geo, mat, count]} frustumCulled={false} renderOrder={4} />;
}

/* =================== Background stars =================== */
function BackgroundStars({ count = 3800, radius = 90, jitter = 28 }: { count?: number; radius?: number; jitter?: number }) {
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
  useFrame(() => { if (group.current) group.current.position.copy(camera.position); });
  return (
    <group ref={group} renderOrder={-1} frustumCulled={false}>
      <Points positions={positions} stride={3}>
        <PointMaterial size={0.015} sizeAttenuation transparent opacity={0.85} depthWrite={false} depthTest={false} toneMapped={false} />
      </Points>
    </group>
  );
}

/* =================== Responsive helper =================== */
function useIsSmall(px = 700) {
  const [small, setSmall] = useState(false);
  useLayoutEffect(() => {
    const mql = window.matchMedia(`(max-width:${px}px)`);
    const update = () => setSmall(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [px]);
  return small;
}

/* =================== TYPO OVERLAY (wipe → reveal) =================== */
type Headline = {
  text: string;
  side: "left" | "right" | "center";
  y: string;
  window: [number, number]; // 0..1
  accent?: boolean;
};

function HeadlineBlock({ h, p, isSmall }: { h: Headline; p: number; isSmall: boolean }) {
  const a = smoothWindow(p, h.window[0], h.window[1], 0.08); // presence
  const enter = easeOut(a);
  const reveal = clamp01((p - h.window[0]) / Math.max(1e-6, h.window[1] - h.window[0])); // 0..1

  // On phones, always center the anchor so long lines wrap nicely.
  const anchorSide: "left" | "right" | "center" = isSmall ? "center" : h.side;
  const fromX = anchorSide === "left" ? -60 : anchorSide === "right" ? 60 : 0;

  const basePos =
    anchorSide === "left"
      ? { left: "6%", right: "auto" as const }
      : anchorSide === "right"
      ? { right: "6%", left: "auto" as const }
      : { left: "50%", transform: `translateX(-50%)` };

  const x = (1 - enter) * fromX;
  const y = (1 - enter) * 8;
  const scale = 0.98 + 0.04 * enter;

  const clip = `inset(0 ${100 - reveal * 100}% 0 0)`;

  const fontSize = isSmall ? "clamp(20px, 6.2vw, 34px)" : "clamp(40px, 4.5vw, 64px)";
  const topY = isSmall ? `calc(${h.y} - 8%)` : h.y;

  return (
    <div className="absolute" style={{ top: topY, ...basePos }}>
      {h.accent && (
        <div
          className="absolute -z-10"
          style={{
            left: anchorSide === "center" ? "-10%" : "-4%",
            top: "38%",
            width: anchorSide === "center" ? "120%" : "108%",
            height: "36%",
            background: "linear-gradient(90deg, rgba(236,72,153,0.18), rgba(124,58,237,0.18))",
            filter: "blur(12px)",
            opacity: enter * 0.9,
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale * 1.02})`,
            transition: "transform 120ms linear, opacity 120ms linear",
          }}
        />
      )}

      <div
        className="relative"
        style={{
          opacity: enter,
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transition: "transform 120ms linear, opacity 120ms linear",
          textShadow: "0 10px 30px rgba(0,0,0,0.35)",
          willChange: "transform, opacity, clip-path",
          clipPath: clip,
        }}
      >
        <div
          style={{
            fontFamily: "ui-sans-serif, system-ui, Sora, Space Grotesk, Inter, Arial",
            fontSize,
            lineHeight: isSmall ? 1.12 : 1.04,
            letterSpacing: isSmall ? "-0.01em" : "-0.02em",
            fontWeight: 900,
            whiteSpace: isSmall ? "normal" : "nowrap",
            textAlign: anchorSide === "center" ? "center" : "left",
            maxWidth: isSmall ? "86vw" : "none",
          }}
        >
          {h.text}
        </div>

        {/* White wipe covering 100% initially, sliding out to the right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#fff",
            transform: `translate3d(${reveal * 102}%, 0, 0)`,
            transition: "transform 120ms linear",
            boxShadow: "0 0 30px rgba(255,255,255,0.35)",
            willChange: "transform",
            opacity: 1 - THREE.MathUtils.smoothstep(reveal, 0.9, 1.0),
            pointerEvents: "none",
            borderRadius: 4,
          }}
        />

        {/* Glint */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            height: "70%",
            width: 10,
            left: 0,
            background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.85), rgba(255,255,255,0))",
            transform: `translate3d(${reveal * 100}%, 0, 0)`,
            transition: "transform 120ms linear",
            filter: "blur(1px)",
            opacity: 0.8 * (1 - THREE.MathUtils.smoothstep(reveal, 0.85, 1.0)),
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

function HeadlineOverlay({ progress, isSmall }: { progress: number; isSmall: boolean }) {
  const p = progress / 100;
  const headlines: Headline[] = [
    { text: "BONJOUR, JE SUIS MATHIS.", side: "left",   y: "16%", window: [0.06, 0.32], accent: true },
    { text: "JE RÉINVENTE L’INTERFACE PAR LE CODE.",   side: "center", y: "46%", window: [0.32, 0.64], accent: false },
    { text: "FAIS DÉFILER POUR DÉCOLLER.",             side: "right",  y: "76%", window: [0.64, 0.92], accent: true },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-40 select-none">
      {headlines.map((h, i) => <HeadlineBlock key={i} h={h} p={p} isSmall={isSmall} />)}
    </div>
  );
}

/* =================== Globe scene =================== */
function GlobeScene({ progress, isSmall }: { progress: number; isSmall: boolean }) {
  const p = clamp01(progress / 100);

  const root = useRef<THREE.Group>(null);
  const fineGridRef = useRef<THREE.Group>(null);
  const coarseGridRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

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

  const cities: Record<CityKey, THREE.Vector3> = useMemo(() => {
    const entries = Object.entries(CITIES) as [CityKey, { lat: number; lon: number }][];
    return Object.fromEntries(entries.map(([k, v]) => [k, latLngToVec3(v.lat, v.lon)])) as Record<CityKey, THREE.Vector3>;
  }, []);

  const AUTO_ARCS = useMemo(() => buildAutoLinks(isSmall ? 22 : 36), [isSmall]);
  const spinT = Math.min(p / 0.8, 1);
  const zoomT = THREE.MathUtils.clamp((p - 0.8) / 0.2, 0, 1);
  const france = useMemo(() => latLngToVec3(46.2276, 2.2137), []);

  useFrame((_, dt) => {
    const t = performance.now() / 1000;
    if (root.current) {
      const lerp = 1 - Math.pow(0.00065, dt);
      const targetRx = spinT * 0.35 + mouseTarget.current.y * 0.1;
      const targetRy = spinT * Math.PI * 2 + mouseTarget.current.x * 0.2;
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, targetRx, lerp);
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, targetRy, lerp);
      root.current.scale.setScalar(GLOBE_BASE_SCALE * (1 + Math.sin(t * 0.9) * 0.015));
    }
    const drift = 1 - zoomT;
    if (coarseGridRef.current) coarseGridRef.current.rotation.y += dt * 0.03 * drift;
    if (fineGridRef.current)  fineGridRef.current.rotation.y -= dt * 0.05 * drift;
    if (ringsRef.current)     ringsRef.current.rotation.z += dt * 0.04 * drift;

    const baseDist = 3.8, closeDist = 1.8;
    const dist = THREE.MathUtils.lerp(baseDist, closeDist, zoomT);
    const targetPos = france.clone().normalize().multiplyScalar(dist);
    camera.position.lerp(targetPos, 1 - Math.pow(0.00008, dt));
    camera.lookAt(france);
    camera.updateProjectionMatrix();
  });

  return (
    <group ref={root}>
      {/* halo */}
      <mesh>
        <sphereGeometry args={[R_GLOBE + 0.03, 64, 32]} />
        <meshBasicMaterial color={"#6C1E80"} transparent opacity={0.06} depthWrite={false} />
      </mesh>

      {/* grilles */}
      <group ref={coarseGridRef}><LatLongGrid step={10} color="#9E8AFF" opacity={0.28} /></group>
      <group ref={fineGridRef}><LatLongGrid step={5} color="#6C1E80" opacity={0.12} /></group>

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

      <OrbitalParticles count={700} r={R_GLOBE + 0.01} />
      {Object.values(cities).map((pos, i) => <NodePing key={i} position={pos} />)}

      {/* Villes */}
      {LINKS_BASE.map(([a, b], i) => {
        const start = cities[a];
        const end   = cities[b];
        const lift = 0.2;
        const pts = greatCirclePoints(start, end, 64, R_GLOBE, lift);
        return (
          <group key={`city-${i}`}>
            <Line points={pts} color="#C084FC" lineWidth={1.4} dashed dashScale={1} dashSize={0.12} dashOffset={-(p * 8)} transparent opacity={0.55} />
            <ArcTrafficInstanced start={start} end={end} lift={lift} count={16} baseSpeed={0.05} dotRadius={0.006} color="#F9A8D4" progress={p} />
            <ArcTrafficInstanced start={end} end={start} lift={lift} count={18} baseSpeed={0.15} dotRadius={0.0052} color="#C084FC" progress={p} />
          </group>
        );
      })}

      {/* Arcs auto */}
      {AUTO_ARCS.map(([a, b], i) => {
        const lift = 0.22;
        const pts = greatCirclePoints(a, b, 48, R_GLOBE, lift);
        return (
          <group key={`auto-${i}`}>
            <Line points={pts} color="#7C3AED" lineWidth={1} dashed dashScale={1} dashSize={0.1} dashOffset={-(p * 6)} transparent opacity={0.35} />
            <ArcTrafficInstanced start={a} end={b} lift={lift} count={isSmall ? 18 : 26} baseSpeed={0.5} dotRadius={0.001} color="#E879F9" progress={p} />
          </group>
        );
      })}
    </group>
  );
}

/* =================== Canvas sticky =================== */
function StickyCanvas({ progress, isSmall }: { progress: number; isSmall: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={isSmall ? [1, 1.3] : [1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.8], fov: 45 }}
      >
        <Suspense fallback={null}>
          <BackgroundStars count={isSmall ? 2400 : 3800} radius={90} jitter={28} />
          <ambientLight intensity={0.9} />
          <pointLight color={"#9B1C31"} intensity={2} position={[2, 1, 2]} />
          <pointLight color={"#6C1E80"} intensity={1.8} position={[-2, -1, -2]} />
          <GlobeScene progress={progress} isSmall={isSmall} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* =================== Intro controller =================== */
export default function GlobeIntro() {
  const [progress, setProgress] = useState(0);
  const [locked, setLocked] = useState(true);
  const attachedRef = useRef(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const afterTopRef = useRef<number | null>(null);
  const snappingRef = useRef(false);
  const exitingRef = useRef(false);

  const isSmall = useIsSmall(700);

  const SAFE_OFFSET = 220;
  const REENTRY_SNAP_ZONE = 180;
  const EXIT_AT = 99;

  const getSectionTop = () => {
    const el = sectionRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return r.top + window.scrollY;
  };

  // force snap to top (mobile-friendly)
  const forceSnapToIntro = () => {
    const top = getSectionTop();
    let tries = 0;
    const snap = () => {
      window.scrollTo({ top, left: 0, behavior: "auto" });
      tries++;
      if (Math.abs(window.scrollY - top) > 1 && tries < 10) {
        requestAnimationFrame(snap);
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(snap));
  };

  // Always return to top on refresh (desktop + mobile/BFCache)
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      (history as History & { scrollRestoration: "auto" | "manual" }).scrollRestoration = "manual";
    }
    const onPageShow = () => forceSnapToIntro();
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("load", forceSnapToIntro, { once: true });
    forceSnapToIntro();
    return () => {
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  // Overflow manager
  useEffect(() => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [locked]);

  useEffect(() => {
    const computeAfterTop = () => {
      const el = document.getElementById("after-intro");
      afterTopRef.current = el ? el.getBoundingClientRect().top + window.scrollY : null;
    };
    computeAfterTop();
    window.addEventListener("resize", computeAfterTop);
    return () => window.removeEventListener("resize", computeAfterTop);
  }, []);

  // fix after rotation
  useEffect(() => {
    const onRotate = () => setTimeout(forceSnapToIntro, 60);
    window.addEventListener("orientationchange", onRotate);
    return () => window.removeEventListener("orientationchange", onRotate);
  }, []);

  // re-entry
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

  // controls when locked = true
  useEffect(() => {
    if (!locked) return;

    const clamp100 = (v: number) => Math.max(0, Math.min(100, v));
    const opts: AddEventListenerOptions = { passive: false };
    let touchStartY = 0;

    const exitToContent = () => {
      if (exitingRef.current) return;
      exitingRef.current = true;
      const anchorTop = afterTopRef.current ?? getSectionTop();
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

    const advance = (delta: number) => {
      if (exitingRef.current) return;
      setProgress((p) => {
        const next = clamp100(p + delta);
        if (delta > 0 && next >= EXIT_AT) {
          requestAnimationFrame(() => exitToContent());
          return 100;
        }
        return next;
      });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = Math.max(-MAX_WHEEL_DELTA, Math.min(MAX_WHEEL_DELTA, e.deltaY));
      advance(dy * WHEEL_FACTOR);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); advance(+KEY_STEP); }
      else if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); advance(-KEY_STEP); }
    };
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0]?.clientY ?? 0; };
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? touchStartY;
      const dy = touchStartY - y;
      advance(dy * TOUCH_FACTOR);
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
    };
  }, [locked]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0A0A0B]"
      style={{
        height: "100svh",
        minHeight: "100svh",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        background:
          "radial-gradient(1200px 600px at 50% 40%, rgba(108,30,128,.22), transparent 60%), radial-gradient(1000px 500px at 50% 80%, rgba(155,28,49,.18), transparent 60%), #0A0A0B",
      }}
    >
      <StickyCanvas progress={progress} isSmall={isSmall} />
      <HeadlineOverlay progress={progress} isSmall={isSmall} />

      <div className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center pb-8">
        <div className="text-[10px] tracking-[0.35em] text-zinc-300/80">
          {locked ? (progress < 100 ? "SCROLL" : "END") : "READY"}
        </div>
      </div>
    </section>
  );
}
