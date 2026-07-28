"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

interface GlobeCanvasProps {
  onLoaded: () => void;
}

function ImmersiveNetworkGlobe({ onLoaded }: { onLoaded: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  // 1. Generate crisp Fibonacci landmass / dot constellation coordinates around sphere
  const { pointsPositions, pointsColors } = useMemo(() => {
    const count = 3500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const radius = 2.0;

    const color1 = new THREE.Color("#a78bfa"); // Royal violet
    const color2 = new THREE.Color("#c084fc"); // Bright purple
    const color3 = new THREE.Color("#818cf8"); // Soft indigo

    for (let i = 0; i < count; i++) {
      // Golden ratio spiral distribution for realistic high-density globe mapping
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation across latitude
      const mixRatio = (y + radius) / (2 * radius);
      const c = mixRatio > 0.6 ? color1 : mixRatio > 0.3 ? color2 : color3;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { pointsPositions: positions, pointsColors: colors };
  }, []);

  // 2. Generate atmospheric glowing orbital network arcs (purple laser lines)
  const arcGeometries = useMemo(() => {
    const arcs: THREE.BufferGeometry[] = [];
    const arcCount = 6;
    const radius = 2.0;

    for (let a = 0; a < arcCount; a++) {
      const curvePoints: THREE.Vector3[] = [];
      const lat1 = (Math.random() - 0.5) * Math.PI;
      const lon1 = Math.random() * Math.PI * 2;
      const lat2 = (Math.random() - 0.5) * Math.PI;
      const lon2 = lon1 + Math.PI * 0.8;

      const start = new THREE.Vector3(
        radius * Math.cos(lat1) * Math.cos(lon1),
        radius * Math.sin(lat1),
        radius * Math.cos(lat1) * Math.sin(lon1)
      );
      const end = new THREE.Vector3(
        radius * Math.cos(lat2) * Math.cos(lon2),
        radius * Math.sin(lat2),
        radius * Math.cos(lat2) * Math.sin(lon2)
      );

      // Interpolate an elevated arc curve
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.45);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const pts = curve.getPoints(50);
      
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      arcs.push(geo);
    }
    return arcs;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.15;
      ring1Ref.current.rotation.x = Math.sin(t * 0.2) * 0.4 + 0.8;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.18;
      ring2Ref.current.rotation.y = Math.cos(t * 0.25) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* High density dot-constellation globe sphere */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pointsPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[pointsColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Inner glowing dark atmospheric core */}
      <mesh ref={coreMeshRef}>
        <sphereGeometry args={[1.95, 64, 64]} />
        <meshPhongMaterial
          color="#08070d"
          emissive="#2e1065"
          emissiveIntensity={0.6}
          shininess={80}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Atmospheric Fresnel outer aura glow sphere */}
      <mesh>
        <sphereGeometry args={[2.08, 64, 64]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbital laser rings (Purple & Indigo geometric tracks) */}
      <mesh ref={ring1Ref}>
        <ringGeometry args={[2.45, 2.47, 128]} />
        <meshBasicMaterial
          color="#a78bfa"
          side={THREE.DoubleSide}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={ring2Ref}>
        <ringGeometry args={[2.7, 2.715, 128]} />
        <meshBasicMaterial
          color="#c084fc"
          side={THREE.DoubleSide}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Glowing network signal arcs */}
      {arcGeometries.map((geo, idx) => {
        const lineMat = new THREE.LineBasicMaterial({
          color: "#a78bfa",
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
        });
        const lineObj = new THREE.Line(geo, lineMat);
        return <primitive key={idx} object={lineObj} />;
      })}
    </group>
  );
}

export default function GlobeCanvas({ onLoaded }: GlobeCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1.5, 2]} // High DPI crisp resolution
      >
        <Stars radius={100} depth={50} count={3500} factor={4} saturation={0} fade speed={1.5} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={2.0} color="#ddd6fe" />
        <directionalLight position={[-5, -5, -5]} intensity={1.0} color="#a78bfa" />
        <pointLight position={[0, 0, 4]} intensity={2.0} color="#c084fc" />
        <ImmersiveNetworkGlobe onLoaded={onLoaded} />
      </Canvas>
    </div>
  );
}
