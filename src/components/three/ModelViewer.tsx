"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* Placeholder geometry — swap in your real GLB model.
   Example with a real model:
   import { useGLTF } from "@react-three/drei";
   function YourModel() {
     const { scene } = useGLTF("/models/your-model.glb");
     return <primitive object={scene} scale={1} />;
   }
*/

function PlaceholderModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* 🔄 SWAP: Replace this placeholder geometry with your real GLB model */}
        <mesh scale={1.5}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <MeshDistortMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.2}
            roughness={0.15}
            metalness={0.9}
            distort={0.2}
            speed={1.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#00f0ff" />
      <directionalLight position={[-3, 3, -3]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, -2, 3]} intensity={0.3} color="#00f0ff" />
      <PlaceholderModel />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />
    </>
  );
}

export function ModelViewer({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
            Loading 3D Viewer...
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
