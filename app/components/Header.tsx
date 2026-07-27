"use client";

import React from "react";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent py-6 px-8 md:px-16 flex items-center justify-between pointer-events-auto">
      {/* Brand Wordmark (No icon placeholder, just clean typography matching the aesthetic) */}
      <Link
        href="/"
        className="text-lg font-bold tracking-widest text-white hover:text-zinc-300 transition-colors duration-200 font-sans"
      >
        GhostCard
      </Link>

      {/* Nav Actions (Close together as requested, transparent, clean layout) */}
      <div className="flex items-center gap-8">
        <nav className="flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm font-bold text-white/90 hover:text-white transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-bold text-white/90 hover:text-white transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            href="#contact"
            className="text-sm font-bold text-white/90 hover:text-white transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>

        {/* Separator Line */}
        <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />

        {/* Action Button */}
        <Link
          href="#apply"
          className="text-sm font-bold text-white hover:text-zinc-200 transition-all duration-200 flex items-center gap-1 group"
        >
          How to apply
          <IconChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" stroke={3.0} />
        </Link>
      </div>
    </header>
  );
}
