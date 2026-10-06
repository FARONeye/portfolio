// src/components/EnergySphere3D.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

function Blob({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null);

  // Rotation + scale en fonction du scroll (pas de "any")
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.18;
    group.current.rotation.x += delta * 0.08;

    const s = 1 + progress * 0.28; // 1 → 1.28 selon le scroll
    group.current.scale.set(s, s, s);
  });

  const distort = 0.25 + progress * 0.55; // 0.25 → 0.8
  const speed = 1.2 + progress * 1.6;     // 1.2 → 2.8

  return (
    <group ref={group}>
      <Sphere args={[1.25, 128, 128]}>
        <MeshDistortMaterial
          color="#9B1C31"
          emissive="#6C1E80"
          emissiveIntensity={1.2}
          roughness={0.3}
          metalness={0.2}
          transparent
          opacity={0.95}
          toneMapped={false}
          distort={distort}
          speed={speed}
        />
      </Sphere>
    </group>
  );
}

export default function EnergySphere3D() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 mix-blend-screen opacity-90">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4], fov: 45 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <pointLight color="#9B1C31" intensity={2.2} position={[2, 1, 2]} />
          <pointLight color="#6C1E80" intensity={2.0} position={[-2, -1, -2]} />
          <Blob progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
