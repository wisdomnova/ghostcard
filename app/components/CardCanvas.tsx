"use client";

import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Stars } from "@react-three/drei";
import * as THREE from "three";
import GhostCard3D from "./GhostCard3D";

interface CardCanvasProps {
  scrollProgress: number;
}

function ShootingComets({ scrollProgress }: { scrollProgress: number }) {
  const cometsRef = React.useRef<THREE.Group>(null);
  
  // Generate random trajectories for shooting stars / comets
  const cometsData = React.useMemo(() => {
    return Array.from({ length: 8 }).map(() => ({
      startPos: new THREE.Vector3(
        (Math.random() - 0.5) * 20 + 5,
        (Math.random() - 0.5) * 15 + 5,
        (Math.random() - 0.5) * 10 - 5
      ),
      speed: Math.random() * 0.15 + 0.1,
      length: Math.random() * 2 + 1.5,
    }));
  }, []);

  const cometGeometries = React.useMemo(() => {
    return cometsData.map((data) => {
      const pts = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-data.length, -data.length * 0.5, -data.length * 0.2),
      ];
      return new THREE.BufferGeometry().setFromPoints(pts);
    });
  }, [cometsData]);

  useFrame((state) => {
    if (cometsRef.current) {
      const isFooter = scrollProgress > 5.5;
      cometsRef.current.visible = isFooter;

      if (isFooter) {
        cometsRef.current.children.forEach((child, idx) => {
          const data = cometsData[idx];
          child.position.x -= data.speed;
          child.position.y -= data.speed * 0.5;

          // Reset comet trajectory when it moves past viewport bounds
          if (child.position.x < -15 || child.position.y < -10) {
            child.position.copy(data.startPos);
          }
        });
      }
    }
  });

  return (
    <group ref={cometsRef}>
      {cometGeometries.map((geo, idx) => {
        const mat = new THREE.LineBasicMaterial({
          color: "#a78bfa",
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
        });
        const line = new THREE.Line(geo, mat);
        line.position.copy(cometsData[idx].startPos);
        return <primitive key={idx} object={line} />;
      })}
    </group>
  );
}

function ParallaxStars({ scrollProgress }: { scrollProgress: number }) {
  const starsGroupRef = React.useRef<THREE.Group>(null);

  useFrame(() => {
    if (starsGroupRef.current) {
      // Slower background parallax rate: stars drift at a fraction of page scroll speed
      const targetZ = scrollProgress * 3.5;
      const targetY = -scrollProgress * 1.5;
      const targetRotY = scrollProgress * 0.15;
      const targetRotX = scrollProgress * 0.08;

      starsGroupRef.current.position.z = THREE.MathUtils.lerp(
        starsGroupRef.current.position.z,
        targetZ,
        0.05
      );
      starsGroupRef.current.position.y = THREE.MathUtils.lerp(
        starsGroupRef.current.position.y,
        targetY,
        0.05
      );
      starsGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        starsGroupRef.current.rotation.y,
        targetRotY,
        0.05
      );
      starsGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        starsGroupRef.current.rotation.x,
        targetRotX,
        0.05
      );
    }
  });

  // Fade out density in footer stage to depict far-edge deep dark space
  const isFooterStage = scrollProgress > 6.0;

  return (
    <group ref={starsGroupRef}>
      <Stars
        radius={100}
        depth={50}
        count={isFooterStage ? 800 : 3500}
        factor={isFooterStage ? 2 : 4}
        saturation={0}
        fade
        speed={isFooterStage ? 0.5 : 1.5}
      />
    </group>
  );
}

export default function CardCanvas({ scrollProgress }: CardCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ParallaxStars scrollProgress={scrollProgress} />
        <ShootingComets scrollProgress={scrollProgress} />

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
