"use client";

import React from "react";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  /**
   * Section index (0 to 7) to determine when this text begins to animate.
   * Animation will center around the scrollProgress reaching this index.
   */
  sectionIndex: number;
  /**
   * The global scroll progress state (0 to 7).
   */
  scrollProgress: number;
}

export function ScrollRevealText({
  text,
  className = "",
  sectionIndex,
  scrollProgress,
}: ScrollRevealTextProps) {
  // Split words first, then letters
  const words = text.split(" ");
  
  // We calculate styles dynamically relative to scrollProgress.
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, wordIdx) => {
        const letters = Array.from(word);
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {letters.map((char, charIdx) => {
              // Tighter stagger for much faster text reveal speed
              const charOffset = (charIdx * 0.015) + (wordIdx * 0.03);
              
              // Define the scroll range where this character animates:
              // Start revealing early and complete 100% of the reveal WAY before reaching the middle
              const startScroll = Math.max(0, sectionIndex - 0.9 + charOffset);
              const endScroll = sectionIndex - 0.55 + charOffset;
              const exitScroll = sectionIndex + 0.6 + charOffset;

              // Compute letter opacity (fast reveal, hold 100% opacity in middle)
              let opacity = 0;
              if (scrollProgress < startScroll) {
                opacity = 0;
              } else if (scrollProgress <= endScroll) {
                // Rapid fade in interpolation (0 -> 1)
                const range = endScroll - startScroll;
                opacity = range > 0 ? (scrollProgress - startScroll) / range : 1;
              } else if (scrollProgress < exitScroll) {
                // Hold 100% full opacity across middle of screen
                opacity = 1;
              } else {
                // Fade out as section exits
                const range = 0.3;
                opacity = Math.max(0, 1 - (scrollProgress - exitScroll) / range);
              }

              // Compute letter blur (clears much earlier)
              let blurVal = 10;
              if (scrollProgress < startScroll) {
                blurVal = 10;
              } else if (scrollProgress <= endScroll) {
                const range = endScroll - startScroll;
                const ratio = range > 0 ? (scrollProgress - startScroll) / range : 1;
                blurVal = 10 * (1 - ratio);
              } else {
                blurVal = 0;
              }

              // Translate letter Y (rises up smoothly earlier)
              let translateY = 15;
              if (scrollProgress < startScroll) {
                translateY = 15;
              } else if (scrollProgress <= endScroll) {
                const range = endScroll - startScroll;
                const ratio = range > 0 ? (scrollProgress - startScroll) / range : 1;
                translateY = 15 * (1 - ratio);
              } else {
                translateY = 0;
              }

              return (
                <span
                  key={charIdx}
                  className="inline-block transition-all duration-75 ease-out"
                  style={{
                    opacity: opacity,
                    filter: `blur(${blurVal}px)`,
                    transform: `translateY(${translateY}px)`,
                    willChange: "opacity, filter, transform",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
