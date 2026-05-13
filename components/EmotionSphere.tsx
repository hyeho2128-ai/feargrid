"use client";

import { motion } from "framer-motion";
import type { EmotionTone } from "@/constants/journey";

type EmotionSphereProps = {
  tone: EmotionTone;
  accent: string;
  size?: number;
  delay?: number;
  intensity?: number;
};

const mouths: Record<EmotionTone, string> = {
  neutral: "M 15 27 Q 24 30 33 27",
  fear: "M 16 31 Q 24 22 32 31",
  panic: "M 18 29 Q 24 34 30 29",
  greed: "M 15 25 Q 24 35 33 25",
  uncertainty: "M 16 29 Q 22 26 28 29 Q 31 31 34 28"
};

export function EmotionSphere({ tone, accent, size = 46, delay = 0, intensity = 1 }: EmotionSphereProps) {
  const shake = tone === "fear" ? 7 : tone === "panic" ? 4 : tone === "greed" ? -5 : 2;
  const roll = tone === "fear" ? 11 : tone === "panic" ? 7 : tone === "greed" ? 6 : 5;
  const duration = tone === "fear" ? 1.55 : tone === "panic" ? 2.1 : tone === "greed" ? 4.4 : 5;

  return (
    <motion.div
      animate={{
        rotate: tone === "fear" ? [-roll, roll, -roll / 2, roll / 2, 0] : [0, roll, -roll * 0.45, 0],
        scale: [1, 1.025, 1],
        x: tone === "fear" ? [-shake, shake, -shake / 2, shake / 2, 0] : [0, shake, -shake * 0.45, 0],
        y: [0, Math.abs(shake) * intensity * 0.35, 0]
      }}
      className="relative rounded-full"
      style={{
        background: `radial-gradient(circle at 32% 24%, rgba(255,255,255,0.94), ${accent} 27%, rgba(255,255,255,0.16) 58%, rgba(255,255,255,0.04) 100%)`,
        boxShadow: `inset -9px -12px 22px rgba(0,0,0,0.28), inset 8px 8px 18px rgba(255,255,255,0.3), 0 0 34px ${accent}`,
        height: size,
        width: size
      }}
      transition={{
        delay,
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror"
      }}
    >
      <span className="absolute left-[23%] top-[20%] h-[24%] w-[34%] rounded-full bg-white/55 blur-[5px]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 48 48">
        <circle cx="17" cy="22" fill="rgba(0,0,0,0.48)" r={tone === "panic" ? "1.7" : "2.2"} />
        <circle cx="31" cy="22" fill="rgba(0,0,0,0.48)" r={tone === "panic" ? "1.7" : "2.2"} />
        <path d={mouths[tone]} fill="none" stroke="rgba(0,0,0,0.42)" strokeLinecap="round" strokeWidth="2.2" />
      </svg>
    </motion.div>
  );
}
