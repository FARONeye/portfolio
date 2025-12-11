"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

// Petit loader visuel pendant le chargement du modèle
function Loader() {
  const { progress } = useProgress();
  return <Html center><span className="text-[#9B1C31] font-mono text-xs">{progress.toFixed(0)}%</span></Html>;
}

function ImportedModel() {
  const { scene } = useGLTF("/character.glb");
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      // Rotation continue du personnage uniquement
      modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      // TES RÉGLAGES APPLIQUÉS ICI :
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
        shadows={false} // Désactivé pour gagner des FPS (les lumières suffisent pour le relief)
        dpr={[1, 2]} // Optimisation pour écrans Retina (évite de calculer trop de pixels)
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.5, 7], fov: 50 }} // Caméra fixe
      >
        <OrbitControls 
            enableZoom={true}
            minDistance={4}
            maxDistance={12}
            enablePan={false}
            // On limite l'angle vertical pour éviter de voir sous les pieds ou trop au dessus
            minPolarAngle={Math.PI / 3} 
            maxPolarAngle={Math.PI / 1.8}
        />
        
        {/* --- ÉCLAIRAGE FIXE (Ne tourne pas) --- */}
        {/* Ces lumières sont définies dans la scène globale, elles ne bougent pas */}
        
        {/* 1. Ambiance Cyber sombre */}
        <ambientLight intensity={0.2} color="#111122" /> 

        {/* 2. Key Light (Bleue Tech) - Fixe à gauche */}
        <directionalLight 
          position={[-2, 2, 5]} 
          intensity={2} 
          color="#d1e8ff" 
        />

        {/* 3. Rim Light (Rouge) - Fixe derrière pour la silhouette */}
        <spotLight 
          position={[-5, 5, -5]} 
          intensity={15} 
          color="#9B1C31" 
          distance={15} 
          angle={0.8} 
          penumbra={0.2} 
        />

        {/* 4. Fill Light (Violette) - Fixe à droite */}
        <pointLight 
          position={[5, 0, 2]} 
          intensity={5} 
          color="#6C1E80" 
          distance={10} 
        />

        {/* 5. Top Light (Vert Matrix) - Fixe au zénith */}
        <directionalLight 
          position={[0, 5, 0]} 
          intensity={0.5} 
          color="#00ffcc" 
        />
        
        {/* Chargement asynchrone du modèle */}
        <Suspense fallback={<Loader />}>
            <ImportedModel />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Préchargement du fichier pour que ça aille plus vite
useGLTF.preload("/character.glb");