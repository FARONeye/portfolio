"use client";

import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF, useProgress } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

/* ===================== Loader ===================== */
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <span className="text-[#9B1C31] font-mono text-xs">{progress.toFixed(0)}%</span>
    </Html>
  );
}

/* ===================== Normalize model ===================== */
function normalizeScene(scene: THREE.Group) {
  const cloned = scene.clone(true);

  const box = new THREE.Box3().setFromObject(cloned);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  box.getCenter(center);
  box.getSize(size);

  // Center X/Z
  cloned.position.x -= center.x;
  cloned.position.z -= center.z;

  // Put feet on ground (bottom -> 0)
  const bottomY = center.y - size.y / 2;
  cloned.position.y -= bottomY;

  // Normalize height (stable framing across screens)
  const targetHeight = 2.35;
  const currentHeight = Math.max(size.y, 1e-6);
  const s = targetHeight / currentHeight;
  cloned.scale.multiplyScalar(s);

  // Recompute bbox after scaling
  const box2 = new THREE.Box3().setFromObject(cloned);
  const size2 = new THREE.Vector3();
  box2.getSize(size2);

  return { model: cloned, box: box2, size: size2 };
}

function Model({
  onReady,
}: {
  onReady: (data: { box: THREE.Box3; size: THREE.Vector3 }) => void;
}) {
  const { scene } = useGLTF("/character.glb");
  const normalized = useMemo(() => normalizeScene(scene), [scene]);

  useEffect(() => {
    onReady({ box: normalized.box, size: normalized.size });
  }, [normalized.box, normalized.size, onReady]);

  return <primitive object={normalized.model} />;
}

/* ===================== Camera auto-fit (portrait, closer) ===================== */
function FitCamera({
  box,
  modelSize,
  controlsRef,
  fov = 34,
  margin = 1.18,
}: {
  box: THREE.Box3 | null;
  modelSize: THREE.Vector3 | null;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  fov?: number;
  margin?: number;
}) {
  const { camera, size: viewport, gl } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.12;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  useLayoutEffect(() => {
    if (!box || !modelSize) return;

    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = fov;

    const aspect = viewport.width / Math.max(1, viewport.height);

    // ✅ FIX: on vise un peu plus haut => le perso "monte" dans le cadre
    const target = new THREE.Vector3(0, modelSize.y * 0.35, 0);

    const halfH = modelSize.y / 2;
    const halfW = modelSize.x / 2;

    const fovRad = THREE.MathUtils.degToRad(cam.fov);
    const fitHeightDist = halfH / Math.tan(fovRad / 2);
    const fitWidthDist = halfW / (Math.tan(fovRad / 2) * aspect);

    const dist = Math.max(fitHeightDist, fitWidthDist) * margin;

    // ✅ FIX: caméra un poil plus haute aussi (optionnel mais aide)
    cam.position.set(-2.2, modelSize.y * 0.64, dist);

    cam.lookAt(target);
    cam.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.copy(target);
      controlsRef.current.minDistance = dist * 0.70;
      controlsRef.current.maxDistance = dist * 1.45;
      controlsRef.current.update();
    }
  }, [box, modelSize, viewport.width, viewport.height, fov, margin, camera, controlsRef]);

  return null;
}

function SceneContent() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const [box, setBox] = useState<THREE.Box3 | null>(null);
  const [modelSize, setModelSize] = useState<THREE.Vector3 | null>(null);

  const handleReady = useCallback(({ box, size }: { box: THREE.Box3; size: THREE.Vector3 }) => {
    setBox(box);
    setModelSize(size);
  }, []);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.8}
        minPolarAngle={Math.PI / 2.2}
        maxPolarAngle={Math.PI / 1.75}
      />

      <FitCamera box={box} modelSize={modelSize} controlsRef={controlsRef} fov={34} margin={1.18} />

      {/* === Lighting : violet/rouge DEVANT, blanc DERRIÈRE === */}
      <ambientLight intensity={0.04} color="#080810" />

      <directionalLight position={[-2.3, 2.7, 5.2]} intensity={2.5} color="#9B1C31" />
      <directionalLight position={[2.6, 2.0, 4.8]} intensity={2.05} color="#6C1E80" />

      <directionalLight position={[0.0, 3.4, -6.0]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[0.0, 6.0, 1.0]} intensity={0.3} color="#eaeaff" />

      <fog attach="fog" args={["#050507", 9.0, 18]} />

      <Suspense fallback={<Loader />}>
        <Model onReady={handleReady} />
      </Suspense>
    </>
  );
}

export default function ChibiModel() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        className="w-full h-full block"
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0.2, 1.4, 5.6], near: 0.1, far: 100 }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/character.glb");
