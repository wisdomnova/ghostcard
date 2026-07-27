import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * Creates dynamic high-quality procedural textures for the credit card.
 * This avoids loading external images and ensures crisp, premium vector-like details
 * in the WebGL canvas (chip, mastercard logo, text, security lines).
 */
export function createCardTexture(isDark: boolean = true): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 648; // Standard card aspect ratio (1.58:1)
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background - Deep Obsidian Gradient
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  if (isDark) {
    grad.addColorStop(0, "#08080c");
    grad.addColorStop(0.5, "#0d0e15");
    grad.addColorStop(1, "#050508");
  } else {
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(1, "#e2e8f0");
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Holographic/Iridescent circuit lines (Understated brand pattern)
  ctx.strokeStyle = "rgba(124, 58, 237, 0.15)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    ctx.moveTo(0, 100 + i * 40);
    ctx.bezierCurveTo(300, 50 + i * 30, 700, 600 - i * 40, canvas.width, 200 + i * 20);
  }
  ctx.stroke();

  // Draw Chip (Glassmorphism & Gold/Silver plating details)
  const chipX = 120;
  const chipY = 220;
  const chipW = 120;
  const chipH = 96;
  const chipRadius = 12;

  // Chip Base
  ctx.fillStyle = "rgba(226, 232, 240, 0.1)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(chipX, chipY, chipW, chipH, chipRadius);
  ctx.fill();
  ctx.stroke();

  // Chip Inner Connections
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  // Horizontal center cut
  ctx.moveTo(chipX, chipY + chipH / 2);
  ctx.lineTo(chipX + chipW, chipY + chipH / 2);
  // Vertical cuts
  ctx.moveTo(chipX + chipW * 0.3, chipY);
  ctx.lineTo(chipX + chipW * 0.3, chipY + chipH);
  ctx.moveTo(chipX + chipW * 0.7, chipY);
  ctx.lineTo(chipX + chipW * 0.7, chipY + chipH);
  // Center block
  ctx.roundRect(chipX + chipW * 0.35, chipY + chipH * 0.25, chipW * 0.3, chipH * 0.5, 4);
  ctx.stroke();

  // Draw Mastercard Logo (Obsidian & Liquid Chrome version rather than red/yellow)
  const logoX = 840;
  const logoY = 480;
  const logoR = 48;

  ctx.globalAlpha = 0.85;
  
  // Left Circle
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.beginPath();
  ctx.arc(logoX - logoR * 0.6, logoY, logoR, 0, Math.PI * 2);
  ctx.fill();

  // Right Circle
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.beginPath();
  ctx.arc(logoX + logoR * 0.6, logoY, logoR, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1.0;

  // Mastercard Text
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = '18px "Bellota Text", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("mastercard", logoX, logoY + logoR + 25);

  // Add Cardholder Details & Branding
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = 'bold 36px "Bellota Text", sans-serif';
  ctx.textAlign = "left";
  ctx.fillText("GHOSTCARD", 120, 120);

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = '28px monospace';
  ctx.fillText("•••• •••• •••• 8888", 120, 420);

  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.font = '14px "Bellota Text", sans-serif';
  ctx.fillText("CARDHOLDER", 120, 480);
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = '18px "Bellota Text", sans-serif';
  ctx.fillText("PRIVACY FIRST", 120, 510);

  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.fillText("VALID THRU", 420, 480);
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillText("12/29", 420, 510);

  // Contactless Symbol
  const signalX = 280;
  const signalY = 240;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(signalX, signalY + 25, 15 + i * 10, -Math.PI / 4, Math.PI / 4);
    ctx.stroke();
  }

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Creates dynamic high-quality procedural texture for the BACK of the card.
 */
export function createCardBackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 648;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background
  ctx.fillStyle = "#08080c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Magnetic Stripe
  ctx.fillStyle = "#111115";
  ctx.fillRect(0, 80, canvas.width, 100);

  // Signature Strip / CVV Box
  const sigX = 80;
  const sigY = 240;
  const sigW = 600;
  const sigH = 80;

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillRect(sigX, sigY, sigW, sigH);

  // Signature stripes lines
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(sigX, sigY + 12 + i * 11);
    ctx.lineTo(sigX + sigW, sigY + 12 + i * 11);
    ctx.stroke();
  }

  // CVV Box
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.fillRect(sigX + sigW + 40, sigY, 120, sigH);

  ctx.fillStyle = "#000000";
  ctx.font = 'italic bold 28px sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("888", sigX + sigW + 100, sigY + 50);

  // CVV label
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = '14px sans-serif';
  ctx.textAlign = "left";
  ctx.fillText("SECURITY CODE", sigX + sigW + 40, sigY - 10);

  // Hologram seal
  const holoX = 840;
  const holoY = 400;
  const holoR = 60;
  const holoGrad = ctx.createRadialGradient(holoX, holoY, 5, holoX, holoY, holoR);
  holoGrad.addColorStop(0, "rgba(45, 212, 191, 0.8)");
  holoGrad.addColorStop(0.5, "rgba(129, 140, 248, 0.6)");
  holoGrad.addColorStop(1, "rgba(192, 132, 252, 0)");
  ctx.fillStyle = holoGrad;
  ctx.beginPath();
  ctx.arc(holoX, holoY, holoR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = 'bold 16px "Bellota Text", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("SECURE", holoX, holoY + 6);

  // Legal text
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.font = '12px "Bellota Text", sans-serif';
  ctx.textAlign = "left";
  const lines = [
    "Authorized signature. Not transferable. Property of GhostCard.",
    "Use of this card constitutes acceptance of the terms and privacy conditions.",
    "For support, contact us via Telegram or SimplexChat."
  ];
  lines.forEach((line, i) => {
    ctx.fillText(line, 80, 420 + i * 24);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}
