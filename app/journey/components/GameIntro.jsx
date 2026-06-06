'use client';

// Game Intro overlay for the Platform station (index 0).
// Replaces the static platform background with an animated, cinematic
// "Press Start" / "Scroll to Begin" title screen sequence.

import { useState } from 'react';
import { useIsMounted } from '@/lib/use-is-mounted';

export default function GameIntro({ scrollT, index }) {
  const opacity = Math.max(0, 1 - Math.abs(scrollT - index));
  const active = opacity > 0.5;

  const mounted = useIsMounted();

  return (
    <section
      className="overflow-hidden bg-[#050505] text-white"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        // Fill the whole area including where the diorama is, so it's a full screen intro
        bottom: 0,
        zIndex: 5, // Above bg but below the diorama canvas if we want diorama on top? Wait, diorama is z: 1. Let's make this z: 0 to act as a background.
        opacity,
        pointerEvents: active ? 'auto' : 'none',
      }}
      aria-hidden={!active}
    >
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Content wrapper */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center pt-[10vh] pb-[20vh]">
        
        {/* Title Sequence */}
        <div className={`transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-center font-mono text-[10px] uppercase tracking-[0.5em] text-white/50 mb-6">
            Interactive Portfolio · 2026
          </h1>
          
          <div className="relative">
            <h2 className="text-6xl sm:text-8xl md:text-9xl font-light tracking-tighter text-white/90" style={{ textShadow: '0 0 40px rgba(255,255,255,0.2)' }}>
              JOURNEY
            </h2>
            {/* Glitch/Accent effect */}
            <div className="absolute -left-4 top-1/2 h-[1px] w-12 bg-primary"></div>
            <div className="absolute -right-4 top-1/2 h-[1px] w-12 bg-primary"></div>
          </div>
        </div>

        {/* Start Action */}
        <div className={`absolute bottom-32 flex flex-col items-center gap-4 transition-all duration-1000 delay-500 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="animate-bounce">
            <span className="block h-10 w-[1px] bg-gradient-to-b from-white/0 via-white/50 to-white/0"></span>
          </div>
          <p className="animate-pulse font-mono text-[11px] uppercase tracking-[0.3em] text-white/80 border border-white/20 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm">
            Scroll to Board
          </p>
        </div>

      </div>
    </section>
  );
}
