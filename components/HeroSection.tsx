"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FloatingParticles } from "@/components/FloatingParticles";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (!window.location.hash || window.location.hash === "#hero") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.dataset.heroIntro = prefersReducedMotion ? "revealed" : "hidden";
    setIsRevealed(prefersReducedMotion);

    const revealHero = () => {
      document.documentElement.dataset.heroIntro = "revealed";
      setIsRevealed(true);
    };

    window.addEventListener("feargrid:reveal-hero", revealHero);
    return () => {
      window.removeEventListener("feargrid:reveal-hero", revealHero);
    };
  }, []);

  return (
    <section
      className="snap-start relative flex h-[100svh] min-h-[720px] items-center justify-center overflow-hidden px-5 py-10 sm:py-24"
      id="hero"
      ref={ref}
    >
      <FloatingParticles accent="#60F0E4" count={34} />
      <motion.div
        animate={{ rotate: [0, 8, -4, 0], scale: [1, 1.08, 1] }}
        aria-hidden="true"
        className="liquid-mask absolute left-1/2 top-1/2 h-[58rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            "conic-gradient(from 120deg, rgba(255,54,91,0.18), rgba(65,155,255,0.22), rgba(71,231,196,0.22), rgba(159,99,255,0.18), rgba(255,54,91,0.18))"
        }}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.div
        animate={{
          opacity: 1,
          scale: isRevealed ? 0.2 : 1,
          x: "-50%",
          y: isRevealed ? "-72%" : "-50%"
        }}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-0 h-[120vmax] w-[120vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 34% 24%, rgba(255,255,255,0.94), rgba(119,255,232,0.92) 10%, rgba(61,167,255,0.62) 31%, rgba(74,38,129,0.48) 56%, rgba(4,9,18,0.96) 82%)",
          boxShadow:
            "inset -8vmax -9vmax 16vmax rgba(0,0,0,0.62), inset 5vmax 4vmax 12vmax rgba(255,255,255,0.22), 0 0 18vmax rgba(91,244,226,0.28), 0 0 32vmax rgba(57,125,255,0.18)"
        }}
        transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="absolute left-[30%] top-[20%] h-[18vmax] w-[28vmax] rounded-full bg-white/35 blur-[3vmax]" />
        <motion.span
          animate={{ opacity: [0.16, 0.36, 0.18], x: ["-10%", "8%", "-10%"] }}
          className="absolute bottom-[22%] left-1/2 h-[2.2vmax] w-[24vmax] -translate-x-1/2 rounded-full bg-white/65 blur-[1.5vmax]"
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
        />
        <span className="absolute inset-[14%] rounded-full border border-white/10" />
      </motion.div>

      <motion.div
        animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.98, y: isRevealed ? 0 : 32 }}
        className="relative z-10 flex w-full max-w-7xl flex-col items-center text-center"
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 18 }}
          className="mb-5 max-w-[calc(100vw-2rem)] rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/85 backdrop-blur-xl sm:text-xs sm:tracking-[0.24em]"
          transition={{ delay: isRevealed ? 0.12 : 0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hidden sm:inline">Current state - 2026 - Greed 66</span>
          <span className="sm:hidden">2026 - Greed 66</span>
        </motion.p>

        <motion.h1
          animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 28 }}
          className="w-full max-w-5xl text-balance text-3xl font-semibold leading-[1.02] tracking-normal text-white min-[420px]:text-5xl sm:text-7xl lg:text-[80px] lg:leading-[0.98]"
          transition={{ delay: isRevealed ? 0.18 : 0, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          Fear creates crashes.
          <br />
          Greed creates bubbles.
        </motion.h1>

        <motion.p
          animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 22 }}
          className="mt-7 w-full max-w-[19rem] text-base leading-7 text-white/64 sm:max-w-2xl sm:text-xl sm:leading-8"
          transition={{ delay: isRevealed ? 0.28 : 0, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          A visual journey through market emotion.
        </motion.p>

      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-white/55 sm:bottom-10"
        animate={{ opacity: isRevealed ? 0.56 : 0.9 }}
        transition={{ duration: 0.8 }}
      >
        <span className="relative flex h-11 w-7 rounded-full border border-white/35 bg-white/[0.03] shadow-[0_0_28px_rgba(96,240,228,0.22)] backdrop-blur-md">
          <motion.span
            animate={{ opacity: [1, 0.28, 1], y: [6, 18, 6] }}
            className="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white"
            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          />
        </span>
        <span>{isRevealed ? "Continue" : "Scroll"}</span>
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black to-transparent"
      />
    </section>
  );
}
