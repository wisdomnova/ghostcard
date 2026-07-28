"use client";

import React, { useState, useEffect, useRef } from "react";
import CardCanvas from "./components/CardCanvas";
import Header from "./components/Header";
import { IconShield } from "@tabler/icons-react";
import { ScrollRevealText } from "./components/ScrollRevealText";
import GlobeCanvas from "./components/GlobeCanvas";
import { createCardTexture, createCardBackTexture } from "./components/textures";

import Lenis from "lenis";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPreloaderActive, setIsPreloaderActive] = useState(true);
  const [isCardLoaded, setIsCardLoaded] = useState(false);
  const [startRevealAnimation, setStartRevealAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger preloading of 3D card textures synchronously on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Warm up canvas drawing caches synchronously
      const front = createCardTexture(true);
      const back = createCardBackTexture();
      
      // Mark card textures as ready
      setTimeout(() => {
        setIsCardLoaded(true);
      }, 1000);
    }
  }, []);

  // When card is loaded, trigger the page-flip reveal sequence
  useEffect(() => {
    if (isCardLoaded) {
      const revealTimeout = setTimeout(() => {
        setStartRevealAnimation(true);
      }, 1200);

      const hideTimeout = setTimeout(() => {
        setIsPreloaderActive(false);
      }, 2500); // Wait for transition animation to complete

      return () => {
        clearTimeout(revealTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [isCardLoaded]);

  // Lock scroll position to top on mount and while preloader is active
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      if (isPreloaderActive) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }, [isPreloaderActive]);

  // Smooth Controlled Scroll with Lenis to enforce controlled rate regardless of scroll wheel velocity
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.5, // Controlled scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential smooth deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.85, // Dampens aggressive wheel flicking
      touchMultiplier: 1.5,
    });

    if (isPreloaderActive) {
      lenis.stop();
      window.scrollTo(0, 0);
    } else {
      lenis.start();
    }

    const updateScroll = (e?: any) => {
      const scrolled = e?.scroll ?? window.scrollY;
      const totalHeight = window.innerHeight;
      const progress = Math.min(Math.max(scrolled / totalHeight, 0), 7);
      setScrollProgress(progress);
    };

    lenis.on("scroll", updateScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    // Initial check
    updateScroll();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.body.style.overflow = "";
    };
  }, [isPreloaderActive]);

  return (
    <div ref={containerRef} className="relative min-h-[800vh] w-full bg-[#070709] text-white overflow-x-hidden selection:bg-violet-500/30">
      {/* 3D Preloader Cover Overlay with Pure Blur Out Animation */}
      {isPreloaderActive && (
        <div 
          className="fixed inset-0 w-screen h-screen z-50 flex flex-col items-center justify-center bg-[#070709] transition-all duration-[1000ms] ease-out"
          style={{
            opacity: startRevealAnimation ? 0 : 1,
            filter: startRevealAnimation ? "blur(30px)" : "blur(0px)",
            transform: startRevealAnimation ? "scale(1.08)" : "scale(1)",
            pointerEvents: startRevealAnimation ? "none" : "auto",
          }}
        >
          {/* HD Interactive Globe in loading phase - 100vw x 100vh canvas container */}
          <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center pointer-events-none">
            <GlobeCanvas onLoaded={() => {}} />
          </div>
        </div>
      )}

      {/* Header component */}
      <Header />

      {/* Background ambient lighting glows */}
      <div className="absolute top-[3%] right-[10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[15%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[45%] left-[15%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[72%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[82%] left-[10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

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

        {/* Section 2: Scrolled view (Features anchor) */}
        <section id="features" className="h-screen w-full flex items-center justify-end px-8 md:px-24 pointer-events-none">
          <div className="max-w-md w-full text-left pointer-events-auto flex flex-col gap-2 relative">

            {/* Aesthetic pointers/floating items similar to the screenshot design */}
            {/* Green pointer 'Chris' style */}
            <div className="absolute -top-16 -left-12 flex items-center gap-1.5 opacity-90 scale-90">
              <svg className="w-4 h-4 text-emerald-400 transform -rotate-45 fill-current" viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold font-sans">
                Discreet
              </span>
            </div>

            {/* Blue pointer 'Marc' style */}
            <div className="absolute -bottom-16 right-16 flex items-center gap-1.5 opacity-90 scale-90">
              <svg className="w-4 h-4 text-indigo-400 transform rotate-45 fill-current" viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold font-sans">
                Global Drop
              </span>
            </div>

            <span className="text-zinc-500 text-sm font-semibold tracking-wider">
              Physical Card
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              <ScrollRevealText
                text="Real plastic NFC card shipped discreetly to your preferred drop or postbox."
                sectionIndex={1}
                scrollProgress={scrollProgress}
              />
            </h2>
          </div>
        </section>

        {/* Section 3: Third scroll stage (Card shifts back to the right, showing No-KYC layout details) */}
        <section className="h-screen w-full flex items-center justify-start px-8 md:px-24 pointer-events-none">
          <div className="max-w-md w-full text-left pointer-events-auto flex flex-col gap-2 relative">
            {/* Pink pointer 'Alicia' style */}
            <div className="absolute -top-16 right-8 flex items-center gap-1.5 opacity-90 scale-90">
              <svg className="w-4 h-4 text-rose-400 transform rotate-90 fill-current" viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-bold font-sans">
                Anonymous
              </span>
            </div>

            <span className="text-zinc-500 text-sm font-semibold tracking-wider">
              No-KYC
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              <ScrollRevealText
                text="No ID, passport, or personal information required."
                sectionIndex={2}
                scrollProgress={scrollProgress}
              />
            </h2>
          </div>
        </section>

        {/* Section 4: Fourth scroll stage (Card shifts left, text moves to the right showing Worldwide usability details) */}
        <section className="h-screen w-full flex items-center justify-end px-8 md:px-24 pointer-events-none">
          <div className="max-w-md w-full text-left pointer-events-auto flex flex-col gap-2 relative">
            {/* Green pointer 'Chris' style */}
            <div className="absolute -top-16 -left-8 flex items-center gap-1.5 opacity-90 scale-90">
              <svg className="w-4 h-4 text-emerald-400 transform -rotate-12 fill-current" viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold font-sans">
                Worldwide
              </span>
            </div>

            <span className="text-zinc-500 text-sm font-semibold tracking-wider">
              Usability
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              <ScrollRevealText
                text="Works at any physical store, online merchant, or ATM that accepts Mastercard."
                sectionIndex={3}
                scrollProgress={scrollProgress}
              />
            </h2>
          </div>
        </section>

        {/* Section 5: Fifth scroll stage (Card is centered in screen, text centered above/below it representing crypto-backing) */}
        <section className="h-screen w-full flex flex-col items-center justify-end pb-32 px-8 pointer-events-none">
          <div className="max-w-xl text-center pointer-events-auto flex flex-col items-center gap-3 relative">
            {/* Blue pointer 'Marc' style */}
            <div className="absolute -top-12 flex items-center gap-1.5 opacity-95">
              <svg className="w-4 h-4 text-indigo-400 transform -rotate-90 fill-current" viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-bold font-sans">
                Instant Top-up
              </span>
            </div>

            <span className="text-zinc-500 text-sm font-semibold tracking-wider">
              Crypto-Backed
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-lg">
              <ScrollRevealText
                text="Instantly top-up using BTC, ETH, SOL, USDT or other cryptos."
                sectionIndex={4}
                scrollProgress={scrollProgress}
              />
            </h2>
          </div>
        </section>

        {/* Section 6: Sixth scroll stage (Pricing anchor) */}
        <section id="pricing" className="h-screen w-full flex items-center justify-end px-8 md:px-24 pointer-events-none">
          <div className="max-w-2xl w-full text-left pointer-events-auto flex flex-col md:flex-row items-center gap-12">

            {/* Left side column: layout title & short info */}
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-zinc-500 text-sm font-semibold tracking-wider uppercase">
                Pricing & Trust
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                <ScrollRevealText
                  text="Transparent Conditions"
                  sectionIndex={5}
                  scrollProgress={scrollProgress}
                />
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mt-2 font-medium">
                Secure transaction options built entirely around user protection and escrow support.
              </p>
            </div>

            {/* Right side column: Pill dashboard lists matching screenshot format */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              {/* Pill 1: Activation */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-5 rounded-full shadow-lg">
                <h3 className="text-2xl font-bold text-white font-sans">$500</h3>
                <p className="text-white/80 text-xs font-semibold">Activation Price</p>
              </div>

              {/* Pill 2: Fees */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-5 rounded-full shadow-lg">
                <h3 className="text-2xl font-bold text-white font-sans">6% Flat</h3>
                <p className="text-white/80 text-xs font-semibold">Top-up Fee (No hidden fees)</p>
              </div>

              {/* Pill 3: Escrow */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-8 py-5 rounded-full shadow-lg">
                <h3 className="text-lg font-bold text-white leading-tight">Dread Escrow</h3>
                <p className="text-white/80 text-xs font-semibold">Fair Trade Escrow Preferred</p>
              </div>
            </div>

          </div>
        </section>

        {/* Section 7: Seventh scroll stage (Card limits & restrictions, card on the left, pill list on the right) */}
        <section className="h-screen w-full flex items-center justify-end px-8 md:px-24 pointer-events-none">
          <div className="max-w-2xl w-full text-left pointer-events-auto flex flex-col md:flex-row items-center gap-12">

            {/* Left side column: layout title & short info */}
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-zinc-500 text-sm font-semibold tracking-wider uppercase">
                Card Limits
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                <ScrollRevealText
                  text="High Capacity Spending"
                  sectionIndex={6}
                  scrollProgress={scrollProgress}
                />
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mt-2 font-medium">
                Generous daily and monthly thresholds designed for seamless transactions.
              </p>
            </div>

            {/* Right side column: Pill dashboard lists representing limits */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              {/* Limit Pill 1: ATM */}
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-5 rounded-full shadow-lg">
                <h3 className="text-2xl font-bold text-white font-sans">$500</h3>
                <p className="text-white/80 text-xs font-semibold">Daily ATM Withdrawal Limit</p>
              </div>

              {/* Limit Pill 2: Daily Spending */}
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-8 py-5 rounded-full shadow-lg">
                <h3 className="text-2xl font-bold text-white font-sans">$5,000</h3>
                <p className="text-white/80 text-xs font-semibold">Daily Spending Limit</p>
              </div>

              {/* Limit Pill 3: Monthly Spending */}
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-5 rounded-full shadow-lg">
                <h3 className="text-2xl font-bold text-white font-sans">$25,000</h3>
                <p className="text-white/80 text-xs font-semibold">Monthly Spending Limit</p>
              </div>
            </div>

          </div>
        </section>

        {/* Section 8: Eighth scroll stage - Hard Footer (Merchant blocks & Restricted countries, card animates out of view) */}
        <footer className="h-screen w-full flex items-center justify-center px-8 md:px-24 pointer-events-none relative border-t border-white/5 bg-[#0a0a0f]">
          <div className="max-w-6xl w-full text-left pointer-events-auto grid grid-cols-1 md:grid-cols-2 gap-16 py-12">

            {/* Column 1: Blocked Merchant Categories */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <h3 className="text-rose-400 font-bold text-sm tracking-wider uppercase">Blocked Merchant Categories</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                Gambling, casinos, lotteries, betting, Pawn shops, Money transfers and wire transfers, Crypto purchases, Escort and dating services, Weapons and explosives, Drugs and pharmaceuticals, Political and religious organizations, Debt collection.
              </p>
            </div>

            {/* Column 2: Restricted Countries */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <h3 className="text-orange-400 font-bold text-sm tracking-wider uppercase">Restricted Countries</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                Afghanistan, Albania, Belarus, Bosnia and Herzegovina, Bulgaria, Burkina Faso, Burma/Myanmar, Cameroon, Central African Republic, China, Croatia, Cuba, Democratic Republic of the Congo, Ethiopia, Guinea-Bissau, Haiti, Iran, Iraq, Jamaica, Kenya, Lebanon, Libya, Mali, Moldova, Monaco, Montenegro, Montserrat, Mozambique, Namibia, Nicaragua, Nigeria, North Korea, North Macedonia, Panama, Philippines, Romania, Russia, Senegal, Serbia, Slovenia, Somalia, South Africa, South Sudan, Syria, Tanzania, Tunisia, Ukraine (Donetsk and Luhansk regions), Venezuela, Vietnam, Yemen, Zimbabwe.
              </p>
            </div>

          </div>
        </footer>
      </div>
    </div>
  );
}
