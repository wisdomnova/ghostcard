"use client";

import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

function BackgroundStars() {
  const starsGroupRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (starsGroupRef.current) {
      starsGroupRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      starsGroupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.05;
    }
  });

  return (
    <group ref={starsGroupRef}>
      <Stars
        radius={100}
        depth={50}
        count={3500}
        factor={4}
        saturation={0}
        fade
        speed={1.5}
      />
    </group>
  );
}

export default function StarsCanvas() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <BackgroundStars />
        </Suspense>
      </Canvas>
    </div>
  );
}
