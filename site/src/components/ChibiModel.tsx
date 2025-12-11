"use client";
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

function Loader() {
  const { progress } = useProgress();
  return <Html center><span className="text-[#9B1C31] font-mono text-xs">{progress.toFixed(0)}%</span></Html>;
}

function ImportedModel() {
  const { scene } = useGLTF("/character.glb");
  const modelRef = useRef<THREE.Group>(null);

  // Rotation désactivée pour te laisser le contrôle manuel
  // useFrame((state) => { if (modelRef.current) modelRef.current.rotation.y += 0.005; });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={3} 
      position={[0.3, 0, 0]} 
    />
  );
}

export default function ChibiModel() {
  return (
    <div className="w-full h-full relative">
      <Canvas 
        className="w-full h-full block"
        shadows={false} 
        dpr={[1, 2]} 
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <OrbitControls 
            enableZoom={true}
            minDistance={4}
            maxDistance={12}
            enablePan={false}
            minPolarAngle={Math.PI / 3} 
            maxPolarAngle={Math.PI / 1.8}
        />
        
        {/* --- CAMÉRA AVEC LUMIÈRES FIXES (HUD Lighting) --- */}
        {/* Les lumières sont enfants de la caméra, donc elles bougent avec elle */}
        <PerspectiveCamera makeDefault position={[0, 0.5, 7]} fov={50}>
            
            {/* 1. Key Light (Principale) - Blanche/Bleutée - Vient de la gauche écran */}
            <directionalLight 
              position={[-5, 2, -2]} // X négatif = Gauche
              intensity={4} 
              color="#d1e8ff" 
            />

            {/* 2. Fill Light (Secondaire) - Violette - Vient de la droite écran */}
            <directionalLight 
              position={[5, 0, -2]} // X positif = Droite
              intensity={3} 
              color="#6C1E80" 
            />

            {/* 3. Front Light - Pour être sûr qu'on voit bien le visage */}
            <directionalLight 
              position={[0, 0, 0]} // Directement depuis la caméra
              intensity={1} 
              color="white" 
            />

            {/* 4. Rim Light (Contour) - Rouge - Vient de derrière le sujet */}
            {/* Z négatif fort = derrière le sujet dans l'espace caméra local */}
            <directionalLight 
                position={[0, 5, -10]} 
                intensity={5} 
                color="#9B1C31" 
            />

        </PerspectiveCamera>

        {/* Ambiance de base pour éviter les noirs totaux */}
        <ambientLight intensity={0.4} color="#111122" /> 
        
        <Suspense fallback={<Loader />}>
            <ImportedModel />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/character.glb");