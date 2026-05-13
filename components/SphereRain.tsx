"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EmotionSphere } from "@/components/EmotionSphere";
import type { EmotionTone } from "@/constants/journey";

type SphereRainProps = {
  accent: string;
  index: number;
  tone: EmotionTone;
};

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export function SphereRain({ accent, index, tone }: SphereRainProps) {
  const [isMounted, setIsMounted] = useState(false);
  const columns = 8;
  const sphereCount = index <= 10
    ? index
    : index >= 80
      ? Math.min(42, Math.round(index / 2.35))
      : Math.min(30, Math.max(14, Math.round(10 + index / 6)));
  const fillHeight = index >= 80 ? Math.min(82, index * 0.68) : Math.min(70, Math.max(8, index * 0.52));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-[2.4rem]"
      aria-label="Falling emotion spheres"
      initial="hidden"
      viewport={{ amount: 0.35, once: false }}
      whileInView="visible"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 rounded-b-[2.4rem] opacity-90 blur-2xl"
        style={{
          background: `linear-gradient(to top, ${accent}55, transparent)`,
          height: `${fillHeight}%`
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-10 bottom-10 h-24 rounded-[50%] opacity-70 blur-3xl"
        style={{ background: accent }}
      />
      {isMounted && Array.from({ length: sphereCount }).map((_, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const rowOffset = row % 2 === 0 ? 0 : 0.5;
        const left = ((col + 0.5 + rowOffset) / columns) * 100;
        const bottom = 30 + row * 58;
        const size = row % 2 === 0 ? 44 : 40;
        const randomA = seededRandom(index + Math.round(index * 3.7) + tone.length);
        const randomB = seededRandom(index * 9 + Math.round(index * 2.1) + tone.length);
        const randomC = seededRandom(index * 13 + Math.round(index * 4.3) + tone.length);
        const delay = 0.035 * index + randomA * 0.26;
        const startX = (randomB - 0.5) * 360;
        const startY = -420 - randomC * 280;
        const driftX = (randomA - 0.5) * 18;

        return (
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.72, x: startX, y: startY },
              visible: { opacity: 1, scale: 1, x: 0, y: 0 }
            }}
            className="absolute"
            key={`${tone}-${index}`}
            style={{
              bottom: `${bottom}px`,
              left: `${Math.min(92, left)}%`,
              translateX: "-50%"
            }}
            transition={{
              delay,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <motion.div
              animate={{ x: [0, driftX, -driftX * 0.45, 0] }}
              transition={{
                delay: delay + 0.88,
                duration: 3.6 + randomB,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <EmotionSphere
                accent={accent}
                delay={delay + 0.9}
                intensity={0.35 + (index % 5) * 0.1}
                size={size}
                tone={tone}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
