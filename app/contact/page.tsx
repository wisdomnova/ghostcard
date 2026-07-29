"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import StarsCanvas from "../components/StarsCanvas";
import { QRCodeSVG } from "qrcode.react";
import { IconExternalLink, IconBrandTelegram, IconMessageCircle2 } from "@tabler/icons-react";

export default function ContactPage() {
  // Simple mouse tilt interaction state for 3D card perspective effect
  const [simplexRotate, setSimplexRotate] = useState({ x: 0, y: 0 });
  const [telegramRotate, setTelegramRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    setter: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setter({ x: y * -18, y: x * 18 });
  };

  const handleMouseLeave = (
    setter: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  ) => {
    setter({ x: 0, y: 0 });
  };

  const simplexUrl = "https://smp12.simplex.im/a#AdpCgPtdbSFH6gbYQklMFOsxRr1PYkcxn--hfFBH2JA";
  const telegramUrl = "https://t.me/ghostcard_official";

  return (
    <div className="relative min-h-screen w-full bg-[#070709] text-white overflow-x-hidden selection:bg-violet-500/30 flex flex-col justify-between">
      {/* Header component */}
      <Header />

      {/* Background ambient lighting glows matching main page design */}
      <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] left-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Fixed Background Canvas holding the twinkling 3D starfield */}
      <div className="fixed inset-0 w-screen h-screen z-10 pointer-events-none">
        <StarsCanvas />
      </div>

      {/* Main Content Area */}
      <main className="relative z-20 pt-28 pb-20 px-6 md:px-16 flex-grow flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full text-center flex flex-col items-center gap-10">
          
          <div className="flex flex-col items-center gap-3">
            <span className="text-zinc-500 text-xs md:text-sm font-semibold tracking-widest uppercase">
              Card Order & Inquiries
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-sans">
              Apply for GhostCard
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-lg leading-relaxed font-medium">
              Scan a QR code or click a direct link below to start your GhostCard application with our team.
            </p>
          </div>

          {/* 3D Interactive Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl perspective-1000">
            
            {/* Card 1: SimpleX Chat */}
            <div
              onMouseMove={(e) => handleMouseMove(e, setSimplexRotate)}
              onMouseLeave={() => handleMouseLeave(setSimplexRotate)}
              style={{
                transform: `rotateX(${simplexRotate.x}deg) rotateY(${simplexRotate.y}deg)`,
                transformStyle: "preserve-3d",
              }}
              className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-200 ease-out group"
            >
              <div className="flex items-center gap-2.5">
                <IconMessageCircle2 className="w-5 h-5 text-violet-400" />
                <h3 className="text-xl font-bold text-white font-sans">SimpleX Chat</h3>
              </div>

              {/* Styled 3D QR Container */}
              <div 
                className="relative bg-[#0d0d12] p-4 rounded-2xl border border-violet-500/30 shadow-[0_0_30px_rgba(167,139,250,0.15)] group-hover:shadow-[0_0_40px_rgba(167,139,250,0.3)] transition-shadow duration-300"
                style={{ transform: "translateZ(30px)" }}
              >
                <QRCodeSVG
                  value={simplexUrl}
                  size={160}
                  bgColor="#0d0d12"
                  fgColor="#ffffff"
                  level="H"
                  marginSize={1}
                />
              </div>

              <p className="text-xs text-zinc-400 font-medium">
                Encrypted & Metadata-free support chat
              </p>

              {/* Direct Hyperlink */}
              <a
                href={simplexUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-200"
                style={{ transform: "translateZ(20px)" }}
              >
                <span>Open SimpleX Chat</span>
                <IconExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Card 2: Telegram */}
            <div
              onMouseMove={(e) => handleMouseMove(e, setTelegramRotate)}
              onMouseLeave={() => handleMouseLeave(setTelegramRotate)}
              style={{
                transform: `rotateX(${telegramRotate.x}deg) rotateY(${telegramRotate.y}deg)`,
                transformStyle: "preserve-3d",
              }}
              className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-200 ease-out group"
            >
              <div className="flex items-center gap-2.5">
                <IconBrandTelegram className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-bold text-white font-sans">Telegram</h3>
              </div>

              {/* Styled 3D QR Container */}
              <div 
                className="relative bg-[#0d0d12] p-4 rounded-2xl border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] group-hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-shadow duration-300"
                style={{ transform: "translateZ(30px)" }}
              >
                <QRCodeSVG
                  value={telegramUrl}
                  size={160}
                  bgColor="#0d0d12"
                  fgColor="#ffffff"
                  level="H"
                  marginSize={1}
                />
              </div>

              <p className="text-xs text-zinc-400 font-medium">
                Official Telegram support channel
              </p>

              {/* Direct Hyperlink */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-200"
                style={{ transform: "translateZ(20px)" }}
              >
                <span>@ghostcard_official</span>
                <IconExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
