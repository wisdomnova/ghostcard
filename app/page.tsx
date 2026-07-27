"use client";

import React, { useState, useEffect, useRef } from "react";
import CardCanvas from "./components/CardCanvas";
import Header from "./components/Header";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = window.innerHeight;
      
      // Calculate how far we have scrolled relative to 1 full screen height
      // progress goes from 0 (at top) to 1 (scrolled down 1 screen height)
      const scrolled = window.scrollY;
      const progress = Math.min(Math.max(scrolled / totalHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on load
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[200vh] w-full bg-[#070709] text-white overflow-x-hidden selection:bg-violet-500/30">
      {/* Header component */}
      <Header />

      {/* Background ambient lighting glows */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] left-[20%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sticky Canvas Container holding the 3D scene */}
      <div className="fixed inset-0 w-screen h-screen z-10 pointer-events-none">
        {/* Enable mouse interaction with Canvas elements inside by removing pointer-events-none for canvas wrapper */}
        <div className="w-full h-full pointer-events-auto">
          <CardCanvas scrollProgress={scrollProgress} />
        </div>
      </div>


      {/* Scrollable Layout Content Triggers */}
      <div className="relative z-20 w-full">
        {/* Section 1: Hero view (Card is centered in canvas) */}
        <section className="h-screen w-full flex items-center justify-start px-8 md:px-24 pointer-events-none">
          <div className="max-w-2xl text-left pointer-events-auto flex flex-col gap-6">
            {/* Outline typographic main header */}
            <div className="flex flex-col gap-2 font-sans font-bold leading-none tracking-tight">
              <span 
                className="text-5xl md:text-8xl text-transparent block"
                style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.95)" }}
              >
                YOUR MONEY.
              </span>
              <span 
                className="text-5xl md:text-8xl text-transparent block"
                style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.95)" }}
              >
                YOUR RULES.
              </span>
              {/* Highlight purple accent glow border for NO-KYC */}
              <span 
                className="text-5xl md:text-8xl text-transparent block"
                style={{ WebkitTextStroke: "1.5px #a78bfa" }}
              >
                NO-KYC.
              </span>
            </div>

            <p className="text-zinc-400 text-sm md:text-lg max-w-lg leading-relaxed font-medium">
              A physical Mastercard funded with crypto built for cash access, everyday spending, and total privacy.
            </p>

            {/* Reusable premium design button matching Brand Identity document */}
            <a
              href="#apply"
              className="w-fit px-8 py-3.5 rounded-full text-sm font-bold text-[#070709] bg-gradient-to-r from-violet-300 via-slate-100 to-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_30px_rgba(167,139,250,0.2)]"
            >
              GET YOUR GHOSTCARD
            </a>
          </div>
        </section>

        {/* Section 2: Scrolled view (Card is shifted to the left, showing layout details) */}
        <section className="h-screen w-full flex items-center justify-end px-8 md:px-24 pointer-events-none">
          <div className="max-w-md w-full text-left pointer-events-auto bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/5 shadow-2xl">
            <span className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-2 block">
              Financial Liberty
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Money. Your Terms.
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-6 font-medium">
              A physical Mastercard funded with crypto built for cash access, everyday spending, and absolute privacy.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between py-2 border-b border-white/5 font-semibold">
                <span className="text-zinc-400">Card Limit</span>
                <span className="text-white">Mastercard Standard</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 font-semibold">
                <span className="text-zinc-400">Daily ATM Limit</span>
                <span className="text-white">$500</span>
              </div>
              <div className="flex justify-between py-2 font-semibold">
                <span className="text-zinc-400">Daily Spending</span>
                <span className="text-white">$5,000</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
