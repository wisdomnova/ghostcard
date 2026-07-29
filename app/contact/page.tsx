"use client";

import React from "react";
import Header from "../components/Header";
import StarsCanvas from "../components/StarsCanvas";

export default function ContactPage() {
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
      <main className="relative z-20 pt-32 pb-24 px-6 md:px-24 flex-grow flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center flex flex-col items-center gap-6">
          <span className="text-zinc-500 text-xs md:text-sm font-semibold tracking-widest uppercase">
            Get in Touch
          </span>

          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white font-sans leading-tight">
            Contact Support
          </h1>

          <p className="text-zinc-400 text-base md:text-xl max-w-xl leading-relaxed font-medium">
            Have questions about GhostCard ordering, delivery, or custom crypto top-ups? We are ready to help.
          </p>
        </div>
      </main>
    </div>
  );
}
