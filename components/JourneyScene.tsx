"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { CountingYear } from "@/components/CountingYear";
import { LineChart } from "@/components/LineChart";
import { SphereRain } from "@/components/SphereRain";
import type { JourneySceneData } from "@/constants/journey";

type JourneySceneProps = {
  data: JourneySceneData;
  order: number;
};

export function JourneyScene({ data, order }: JourneySceneProps) {
  const ref = useRef<HTMLElement>(null);
  const [yearCycle, setYearCycle] = useState(0);
  const isFearZone = data.index < 50;
  const isBlueGreedZone = data.index >= 70;
  const accent = isFearZone
    ? data.index <= 3
      ? "#FF174D"
      : data.accent
    : isBlueGreedZone
      ? data.index >= 80
        ? "#42B8FF"
        : "#38C7FF"
      : data.accent;
  const accentSoft = isFearZone
    ? data.index <= 3
      ? "rgba(255, 23, 77, 0.24)"
      : data.accentSoft
    : isBlueGreedZone
      ? "rgba(66, 184, 255, 0.22)"
      : data.accentSoft;
  const glow = isFearZone
    ? data.index <= 3
      ? "rgba(255, 23, 77, 0.42)"
      : data.glow
    : isBlueGreedZone
      ? data.index >= 80
        ? "rgba(66, 184, 255, 0.42)"
        : "rgba(56, 199, 255, 0.38)"
      : data.glow;
  const tone = isFearZone ? "fear" : data.tone;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yearY = useTransform(scrollYProgress, [0, 0.45, 1], [80, 0, -70]);
  const chamberY = useTransform(scrollYProgress, [0, 1], [48, -34]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.12, 0.92]);

  return (
    <motion.section
      className="snap-start relative flex h-[100svh] min-h-[720px] items-center overflow-hidden px-5 py-10 sm:px-8 md:py-8 lg:px-10"
      id={data.id}
      onViewportEnter={() => setYearCycle((current) => current + 1)}
      ref={ref}
      style={{ backgroundColor: order === 0 ? "#020807" : "#020306" }}
      viewport={{ amount: 0.52, once: false }}
    >
      <motion.div
        aria-hidden="true"
        className="liquid-mask absolute left-1/2 top-1/2 h-[58rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${glow}, transparent 58%)`,
          scale: glowScale
        }}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-br ${data.chamberGradient} opacity-80`}
      />
      <motion.div
        animate={{ x: [-40, 34, -40], y: [0, -26, 0] }}
        aria-hidden="true"
        className="absolute right-[-12rem] top-20 h-[34rem] w-[42rem] rounded-full opacity-30 blur-3xl"
        style={{ background: accent }}
        transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-6 md:grid-cols-[0.8fr_1fr] xl:grid-cols-[0.95fr_1.1fr_0.72fr]">
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0, y: 34 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.45, once: false }}
        >
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.42em]" style={{ color: accent }}>
            {data.scene}
          </p>
          <motion.div
            className="overflow-hidden text-[5.8rem] font-semibold leading-none tracking-normal text-white sm:text-[8rem] lg:text-[140px]"
            style={{ y: yearY }}
          >
            <CountingYear cycle={yearCycle} energetic={order === 0} value={data.year} />
          </motion.div>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-white sm:text-5xl">{data.event}</h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-white/62 lg:text-xl">{data.copy}</p>
          <div className="mt-7 inline-flex items-center gap-4 rounded-[1.5rem] border border-white/12 bg-white/[0.07] px-5 py-4 backdrop-blur-2xl">
            <span className="text-5xl font-semibold leading-none" style={{ color: accent }}>
              {data.index}
            </span>
            <span className="text-left text-xs font-bold uppercase tracking-[0.24em] text-white/58">
              {data.emotion}
              <br />
              Fear & Greed Index
            </span>
          </div>
        </motion.div>

        <motion.div className="relative mx-auto w-full max-w-[34rem]" style={{ y: chamberY }}>
          <div
            className="glass-border relative h-[28rem] overflow-hidden rounded-[2.4rem] bg-white/[0.065] backdrop-blur-3xl sm:h-[30rem] xl:h-[34rem]"
            style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.24), 0 0 110px ${glow}` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/14 via-transparent to-black/25" />
            <motion.div
              animate={{ x: [-50, 45, -50], opacity: [0.26, 0.48, 0.26] }}
              className="absolute left-[-25%] top-20 h-36 w-[150%] rounded-[50%] border border-white/10 blur-sm"
              style={{ background: `linear-gradient(90deg, transparent, ${accentSoft}, transparent)` }}
              transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
            />
            <div className="absolute left-1/2 top-7 h-11 w-44 -translate-x-1/2 rounded-full border border-white/20 bg-gradient-to-b from-white/80 to-white/20 shadow-2xl backdrop-blur-xl" />
            <div className="absolute inset-x-9 top-24 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-white/55">{data.emotion}</p>
              <p className="mt-2 text-6xl font-semibold leading-none text-white">{data.index}</p>
            </div>
            <SphereRain accent={accent} index={data.index} tone={tone} />
          </div>
        </motion.div>

        <motion.div
          className="mx-auto hidden w-full max-w-sm xl:mx-0 xl:block"
          initial={{ opacity: 0, y: 34 }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5, once: false }}
        >
          <GlassCard className="p-6">
            <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: accent }}>
              Flow
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{data.year} Signal</h3>
            <p className="mt-3 text-sm leading-6 text-white/54">{data.copy}</p>
            <div className="mt-8 h-28">
              <LineChart accent={accent} label={`${data.year} emotion flow`} values={data.chart} />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.section>
  );
}
