"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IconChevronRight, IconMenu2, IconX } from "@tabler/icons-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-gradient-to-b from-[#070709]/80 to-transparent backdrop-blur-md md:backdrop-blur-none py-4 px-5 md:py-6 md:px-24 flex items-center justify-between pointer-events-auto transition-all">
      {/* Brand Wordmark */}
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="text-base md:text-lg font-bold tracking-widest text-white hover:text-zinc-300 transition-colors duration-200 font-sans"
      >
        GhostCard
      </Link>

      {/* Desktop Navigation & Actions */}
      <div className="hidden md:flex items-center gap-8">
        <nav className="flex items-center gap-6">
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, "features")}
            className="text-sm font-bold text-white/80 hover:text-white transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={(e) => handleNavClick(e, "pricing")}
            className="text-sm font-bold text-white/80 hover:text-white transition-colors duration-200"
          >
            Pricing
          </a>
          <Link
            href="/contact"
            className="text-sm font-bold text-white/80 hover:text-white transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>

        {/* Separator Line */}
        <div className="h-4 w-[1px] bg-white/20" />

        {/* Action Button */}
        <Link
          href="#apply"
          className="text-sm font-bold text-white hover:text-zinc-200 transition-all duration-200 flex items-center gap-1 group"
        >
          How to apply
          <IconChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" stroke={3.0} />
        </Link>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-white/90 hover:text-white focus:outline-none"
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? <IconX className="w-6 h-6" /> : <IconMenu2 className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#070709]/95 backdrop-blur-xl border-b border-white/10 py-6 px-6 flex flex-col gap-5 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-left">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="text-base font-semibold text-white/90 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleNavClick(e, "pricing")}
              className="text-base font-semibold text-white/90 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-white/90 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>
          
          <div className="h-[1px] w-full bg-white/10" />

          <Link
            href="#apply"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-3 rounded-full text-sm font-bold text-[#070709] bg-gradient-to-r from-violet-300 via-slate-100 to-indigo-200 shadow-md"
          >
            How to apply
          </Link>
        </div>
      )}
    </header>
  );
}
