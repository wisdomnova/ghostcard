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
    const targetScale = isMobile ? 0.95 : 1.35;
    const initialScale = isMobile ? 0.7 : 0.95;

    // Smoothly interpolate scale based on scroll
    const scale = THREE.MathUtils.lerp(initialScale, targetScale, scrollProgress);
    meshRef.current.scale.set(scale, scale, scale);

    // Target positions: Starts on the right side (1.2) and shifts to the left (-1.2) on scroll
    const targetX = isMobile ? 0 : THREE.MathUtils.lerp(1.2, -1.2, scrollProgress);
    const targetY = isMobile ? THREE.MathUtils.lerp(0.3, 0, scrollProgress) : THREE.MathUtils.lerp(0, 0, scrollProgress);
    const targetZ = 0;

    // Smooth position interpolation
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);

    // Target rotations: Start with a cool tilted profile (rotationY = -0.5) and end up flatter (rotationY = -0.15)
    const baseRotationX = THREE.MathUtils.lerp(0.3, 0.15, scrollProgress);
    const baseRotationY = THREE.MathUtils.lerp(-0.4, -0.15, scrollProgress);
    const baseRotationZ = THREE.MathUtils.lerp(-0.1, 0, scrollProgress);

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