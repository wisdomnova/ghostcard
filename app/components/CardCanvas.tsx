"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import GhostCard3D from "./GhostCard3D";

interface CardCanvasProps {
  scrollProgress: number;
}

export default function CardCanvas({ scrollProgress }: CardCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        // Manually override with null or a THREE.Timer once R3F supports it natively, or suppress log
      >
        {/* Stronger ambient light for base detail visibility */}
        <ambientLight intensity={0.9} />

        {/* Dynamic Studio Key Light (Front Right) */}
        <directionalLight position={[6, 4, 8]} intensity={2.5} castShadow />

        {/* Studio Fill Light (Front Left - intensified to illuminate the shifted position on the left) */}
        <directionalLight position={[-6, 4, 8]} intensity={2.8} color="#cbd5e1" />

        {/* Left Side Highlight Accent Light (specifically to catch highlights when card is shifted left) */}
        <directionalLight position={[-8, 0, 4]} intensity={2.0} color="#ffffff" />

        {/* Backlight / Rim Light (creates crisp glowing borders) */}
        <directionalLight position={[0, 8, -6]} intensity={2.2} color="#a78bfa" />

        {/* Floating Top Softbox Light */}
        <directionalLight position={[0, 10, 2]} intensity={2.0} />

        {/* Point Light to track metallic reflections */}
        <pointLight position={[0, 0, 5]} intensity={2.5} color="#ffffff" decay={1.2} />

        <Suspense fallback={null}>
          <GhostCard3D scrollProgress={scrollProgress} />
          {/* Environment map for high quality reflections on the physical card surface */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
