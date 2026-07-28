"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createCardTexture, createCardBackTexture } from "./textures";

interface GhostCard3DProps {
  scrollProgress: number; // 0 to 1 indicating scroll depth
}

export default function GhostCard3D({ scrollProgress }: GhostCard3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  // Create front and back textures procedurally
  const frontTexture = useMemo(() => createCardTexture(true), []);
  const backTexture = useMemo(() => createCardBackTexture(), []);

  // Define geometric parameters for standard card ratio (width: 1.58, height: 1)
  const width = 1.58 * 1.5;
  const height = 1 * 1.5;
  const thickness = 0.04;
  const radius = 0.12; // Bevel/rounded corner radius

  // Track cursor position to add dynamic subtle rotation response
  const mouse = useRef({ x: 0, y: 0 });

  // Create front shape geometry
  const frontShapeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const geometry = new THREE.ShapeGeometry(shape);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const sizeVec = new THREE.Vector3();
    box.getSize(sizeVec);

    const attPos = geometry.attributes.position;
    const attUv = geometry.attributes.uv;

    for (let i = 0; i < attPos.count; i++) {
      const px = attPos.getX(i);
      const py = attPos.getY(i);
      const u = (px - box.min.x) / sizeVec.x;
      const v = (py - box.min.y) / sizeVec.y;
      attUv.setXY(i, u, v);
    }
    attUv.needsUpdate = true;
    return geometry;
  }, [width, height, radius]);

  // Create back shape geometry (individually instanced to prevent sharing buffer attributes)
  const backShapeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const geometry = new THREE.ShapeGeometry(shape);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const sizeVec = new THREE.Vector3();
    box.getSize(sizeVec);

    const attPos = geometry.attributes.position;
    const attUv = geometry.attributes.uv;

    for (let i = 0; i < attPos.count; i++) {
      const px = attPos.getX(i);
      const py = attPos.getY(i);
      const u = (px - box.min.x) / sizeVec.x;
      const v = (py - box.min.y) / sizeVec.y;
      attUv.setXY(i, u, v);
    }
    attUv.needsUpdate = true;
    return geometry;
  }, [width, height, radius]);

  // Create extrude geometry path for outer rim
  const extrudeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    return new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: false,
    });
  }, [width, height, radius, thickness]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Calculate dynamic responsive layout adjustments based on viewport width
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;
    
    // Scale down for smaller screens
    const mobileScaleMult = isMobile ? 0.65 : isTablet ? 0.9 : 1.0;
    const responsiveXMult = isMobile ? 0 : isTablet ? 1.2 : 1.85;

    let scale = 1.0;
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let baseRotationX = 0.3;
    let baseRotationY = -0.4;
    let baseRotationZ = -0.1;

    if (scrollProgress <= 1.0) {
      // PHASE 1: Hero (Right) -> Section 2 (Left)
      // Adds a 180-degree flip on Y with a dynamic Z spin during transition
      const t = scrollProgress; // 0 to 1
      const initialScale = 0.95 * mobileScaleMult;
      const targetScale = 1.35 * mobileScaleMult;
      scale = THREE.MathUtils.lerp(initialScale, targetScale, t);

      targetX = THREE.MathUtils.lerp(responsiveXMult, -responsiveXMult, t);
      targetY = isMobile ? THREE.MathUtils.lerp(0.8, -0.6, t) : 0;

      // Spin spike during transition center (sin wave rotation pulse)
      const spinPulse = Math.sin(t * Math.PI) * 0.8;

      baseRotationX = THREE.MathUtils.lerp(0.3, 0.15, t) + spinPulse * 0.2;
      baseRotationY = THREE.MathUtils.lerp(-0.4, -0.15 + Math.PI, t); // Flip to reveal back/profile details
      baseRotationZ = THREE.MathUtils.lerp(-0.1, 0.25, t) + spinPulse * 0.35;
    } else if (scrollProgress <= 2.0) {
      // PHASE 2: Section 2 (Left) -> Section 3 (Right)
      // Sweeping 360-degree reverse spin with dynamic pitch tilt
      const t = scrollProgress - 1.0; // 0 to 1
      const initialScale = 1.35 * mobileScaleMult;
      const targetScale = 1.5 * mobileScaleMult;
      scale = THREE.MathUtils.lerp(initialScale, targetScale, t);

      targetX = THREE.MathUtils.lerp(-responsiveXMult, responsiveXMult, t);
      targetY = isMobile ? THREE.MathUtils.lerp(-0.6, 0.6, t) : THREE.MathUtils.lerp(0, -0.2, t);

      const tiltPulse = Math.sin(t * Math.PI) * 0.6;

      baseRotationX = THREE.MathUtils.lerp(0.15, 0.55, t) + tiltPulse * 0.3;
      baseRotationY = THREE.MathUtils.lerp(-0.15 + Math.PI, -0.75, t); // Unflips back to front face
      baseRotationZ = THREE.MathUtils.lerp(0.25, -0.3, t);
    } else if (scrollProgress <= 3.0) {
      // PHASE 3: Section 3 (Right) -> Section 4 (Left)
      // Sleek isometric tilt skew with coin-spin momentum
      const t = scrollProgress - 2.0; // 0 to 1
      const initialScale = 1.5 * mobileScaleMult;
      const targetScale = 1.3 * mobileScaleMult;
      scale = THREE.MathUtils.lerp(initialScale, targetScale, t);

      targetX = THREE.MathUtils.lerp(responsiveXMult, -responsiveXMult, t);
      targetY = isMobile ? THREE.MathUtils.lerp(0.6, -0.6, t) : THREE.MathUtils.lerp(-0.2, 0.1, t);

      const skewPulse = Math.sin(t * Math.PI) * 0.7;

      baseRotationX = THREE.MathUtils.lerp(0.55, 0.25, t) - skewPulse * 0.4;
      baseRotationY = THREE.MathUtils.lerp(-0.75, 0.65, t); // Diagonal sweep rotation
      baseRotationZ = THREE.MathUtils.lerp(-0.3, 0.2, t) + skewPulse * 0.5;
    } else if (scrollProgress <= 4.0) {
      // PHASE 4: Section 4 (Left) -> Section 5 (Centered)
      // Frontal presentation roll into center spot
      const t = scrollProgress - 3.0; // 0 to 1
      const initialScale = 1.3 * mobileScaleMult;
      const targetScale = 1.45 * mobileScaleMult;
      scale = THREE.MathUtils.lerp(initialScale, targetScale, t);

      targetX = THREE.MathUtils.lerp(-responsiveXMult, 0, t);
      targetY = isMobile ? THREE.MathUtils.lerp(-0.6, 0.7, t) : THREE.MathUtils.lerp(0, 0.4, t);

      baseRotationX = THREE.MathUtils.lerp(0.25, 0.5, t);
      baseRotationY = THREE.MathUtils.lerp(0.65, 0.15, t); // Aligns straight facing user
      baseRotationZ = THREE.MathUtils.lerp(0.2, -0.1, t);
    } else if (scrollProgress <= 5.0) {
      // PHASE 5: Section 5 (Centered) -> Section 6 (Left)
      // Dynamic side-skew into Pricing dashboard
      const t = scrollProgress - 4.0; // 0 to 1
      const initialScale = 1.45 * mobileScaleMult;
      const targetScale = 1.25 * mobileScaleMult;
      scale = THREE.MathUtils.lerp(initialScale, targetScale, t);

      targetX = THREE.MathUtils.lerp(0, -responsiveXMult, t);
      targetY = isMobile ? THREE.MathUtils.lerp(0.7, -0.7, t) : THREE.MathUtils.lerp(0.4, 0, t);

      const rollPulse = Math.sin(t * Math.PI) * 0.5;

      baseRotationX = THREE.MathUtils.lerp(0.5, 0.35, t) + rollPulse * 0.25;
      baseRotationY = THREE.MathUtils.lerp(0.15, -0.65, t);
      baseRotationZ = THREE.MathUtils.lerp(-0.1, 0.3, t);
    } else if (scrollProgress <= 6.0) {
      // PHASE 6: Section 6 (Pricing) -> Section 7 (Limits)
      const t = scrollProgress - 5.0; // 0 to 1
      const initialScale = 1.25 * mobileScaleMult;
      const targetScale = 1.35 * mobileScaleMult;
      scale = THREE.MathUtils.lerp(initialScale, targetScale, t);

      targetX = -responsiveXMult;
      targetY = isMobile ? -0.7 : 0;

      baseRotationX = THREE.MathUtils.lerp(0.35, 0.65, t);
      baseRotationY = THREE.MathUtils.lerp(-0.65, -0.2, t);
      baseRotationZ = THREE.MathUtils.lerp(0.3, -0.25, t);
    } else {
      // PHASE 7: Section 7 -> Section 8 (Footer Stage - Kite Exit)
      const t = scrollProgress - 6.0; // 0 to 1
      const initialScale = 1.35 * mobileScaleMult;
      scale = THREE.MathUtils.lerp(initialScale, 0.1, t);

      targetX = THREE.MathUtils.lerp(-responsiveXMult, 4.5, t);
      targetY = THREE.MathUtils.lerp(isMobile ? -0.7 : 0, 3.8, t);
      targetZ = THREE.MathUtils.lerp(0, -3.5, t);

      baseRotationX = THREE.MathUtils.lerp(0.65, 2.8, t);
      baseRotationY = THREE.MathUtils.lerp(-0.2, 3.2, t);
      baseRotationZ = THREE.MathUtils.lerp(-0.25, -2.0, t);
    }

    meshRef.current.scale.set(scale, scale, scale);

    // Smooth position interpolation
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);

    // Add cursor parallax feedback
    const mouseInfluenceX = mouse.current.y * 0.18;
    const mouseInfluenceY = mouse.current.x * 0.18;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      baseRotationX + mouseInfluenceX,
      0.08
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      baseRotationY + mouseInfluenceY,
      0.08
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      baseRotationZ,
      0.08
    );
  });

  // Build high quality card mesh with separate front, back, and edge materials
  return (
    <group ref={meshRef}>
      {/* Front Face (offset slightly extra to avoid z-fighting with the box edges) */}
      <mesh position={[0, 0, thickness / 2 + 0.003]}>
        <primitive object={frontShapeGeometry} attach="geometry" />
        <meshPhysicalMaterial
          map={frontTexture}
          roughness={0.12}
          metalness={0.75}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Back Face (offset slightly extra to avoid z-fighting with the box edges) */}
      <mesh position={[0, 0, -(thickness / 2 + 0.003)]} rotation={[0, Math.PI, 0]}>
        <primitive object={backShapeGeometry} attach="geometry" />
        <meshPhysicalMaterial
          map={backTexture}
          roughness={0.2}
          metalness={0.4}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Outer Rim (Beveled Edge) to give true 3D volume */}
      <mesh position={[0, 0, -thickness / 2]}>
        <primitive object={extrudeGeometry} attach="geometry" />
        <meshPhysicalMaterial
          color="#0f1015"
          roughness={0.5}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
}