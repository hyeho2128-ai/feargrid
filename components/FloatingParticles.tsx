"use client";

import { motion } from "framer-motion";

type FloatingParticlesProps = {
  accent?: string;
  count?: number;
};

export function FloatingParticles({ accent = "#60F0E4", count = 26 }: FloatingParticlesProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, index) => {
        const left = (index * 37) % 100;
        const top = (index * 19) % 100;
        const size = 2 + (index % 4);

        return (
          <motion.span
            animate={{
              opacity: [0.08, 0.38, 0.12],
              scale: [0.8, 1.2, 0.9],
              y: [0, -18 - (index % 5) * 6, 0]
            }}
            className="absolute rounded-full"
            key={index}
            style={{
              background: accent,
              boxShadow: `0 0 ${size * 5}px ${accent}`,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              width: size
            }}
            transition={{
              duration: 8 + (index % 7),
              ease: "easeInOut",
              repeat: Infinity
            }}
          />
        );
      })}
    </div>
  );
}
