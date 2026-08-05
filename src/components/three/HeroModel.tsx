"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Icosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={2.2}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.15}
          roughness={0.2}
          metalness={0.8}
          distort={0.25}
          speed={2}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Inner solid icosahedron */}
      <mesh scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={0.9}
          distort={0.15}
          speed={3}
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

export function HeroModel() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#00f0ff" />
        <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#8b5cf6" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#00f0ff" />
        <Icosahedron />
      </Canvas>
    </div>
  );
}
