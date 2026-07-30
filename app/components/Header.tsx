"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IconChevronRight, IconMenu2, IconX } from "@tabler/icons-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/contact") {
      setActiveSection("contact");
      return;
    }

    const handleScroll = () => {
      const featuresEl = document.getElementById("features");
      const pricingEl = document.getElementById("pricing");

      if (featuresEl && pricingEl) {
        const featuresRect = featuresEl.getBoundingClientRect();
        const pricingRect = pricingEl.getBoundingClientRect();

        if (pricingRect.top <= window.innerHeight * 0.5 && pricingRect.bottom >= 0) {
          setActiveSection("pricing");
        } else if (featuresRect.top <= window.innerHeight * 0.5 && featuresRect.bottom >= 0) {
          setActiveSection("features");
        } else {
          setActiveSection("");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-gradient-to-b from-[#070709]/80 to-transparent backdrop-blur-md md:backdrop-blur-none py-4 px-5 md:py-6 md:px-24 flex items-center justify-between pointer-events-auto transition-all">
      {/* Brand Wordmark & Logo */}
      <Link
        href="/"
        onClick={(e) => {
          if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        className="flex items-center gap-3.5 text-base md:text-xl font-bold tracking-widest text-white hover:text-zinc-300 transition-colors duration-200 font-sans group"
      >
        <div className="relative w-12 h-12 md:w-14 md:h-14">
          <Image
            src="/logo.png"
            alt="GhostCard Logo"
            fill
            className="object-contain"
          />
        </div>
        <span>GhostCard</span>
      </Link>

      {/* Desktop Navigation & Actions */}
      <div className="hidden md:flex items-center gap-8">
        <nav className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-full backdrop-blur-lg">
          <a
            href="/#pricing"
            onClick={(e) => handleNavClick(e, "pricing")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 relative ${
              activeSection === "pricing"
                ? "text-white bg-gradient-to-r from-violet-600/80 to-indigo-600/80 shadow-[0_0_20px_rgba(167,139,250,0.4)] border border-violet-400/30"
                : "text-white/70 hover:text-white"
            }`}
          >
            Pricing
          </a>
          <a
            href="/#features"
            onClick={(e) => handleNavClick(e, "features")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 relative ${
              activeSection === "features"
                ? "text-white bg-gradient-to-r from-violet-600/80 to-indigo-600/80 shadow-[0_0_20px_rgba(167,139,250,0.4)] border border-violet-400/30"
                : "text-white/70 hover:text-white"
            }`}
          >
            Features
          </a>
          <Link
            href="/contact"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 relative ${
              activeSection === "contact"
                ? "text-white bg-gradient-to-r from-violet-600/80 to-indigo-600/80 shadow-[0_0_20px_rgba(167,139,250,0.4)] border border-violet-400/30"
                : "text-white/70 hover:text-white"
            }`}
          >
            Contact
          </Link>
        </nav>
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
          <nav className="flex flex-col gap-2 text-left">
            <a
              href="/#pricing"
              onClick={(e) => handleNavClick(e, "pricing")}
              className={`text-base font-semibold py-2 px-4 rounded-xl transition-all ${
                activeSection === "pricing"
                  ? "text-white bg-gradient-to-r from-violet-600/80 to-indigo-600/80 border border-violet-400/30 font-bold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Pricing
            </a>
            <a
              href="/#features"
              onClick={(e) => handleNavClick(e, "features")}
              className={`text-base font-semibold py-2 px-4 rounded-xl transition-all ${
                activeSection === "features"
                  ? "text-white bg-gradient-to-r from-violet-600/80 to-indigo-600/80 border border-violet-400/30 font-bold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Features
            </a>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-semibold py-2 px-4 rounded-xl transition-all ${
                activeSection === "contact"
                  ? "text-white bg-gradient-to-r from-violet-600/80 to-indigo-600/80 border border-violet-400/30 font-bold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
