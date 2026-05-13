"use client";

import { motion } from "framer-motion";
import type { JourneySceneData } from "@/constants/journey";

type DotNavigationProps = {
  scenes: JourneySceneData[];
  activeIndex: number;
};

export function DotNavigation({ scenes, activeIndex }: DotNavigationProps) {
  return (
    <nav
      aria-label="Journey sections"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-5 lg:flex"
    >
      {scenes.map((scene, index) => {
        const active = index === activeIndex;

        return (
          <a
            aria-current={active ? "true" : undefined}
            className="group flex items-center justify-end gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/50"
            href={`#${scene.id}`}
            key={scene.id}
          >
            <span className={`transition duration-500 ${active ? "text-white" : "opacity-0 group-hover:opacity-100"}`}>
              {scene.year}
            </span>
            <motion.span
              animate={{
                boxShadow: active ? `0 0 22px ${scene.accent}` : "0 0 0 rgba(255,255,255,0)",
                scale: active ? 1.55 : 1
              }}
              className="h-2.5 w-2.5 rounded-full border border-white/20 bg-white/50"
              style={{ background: active ? scene.accent : "rgba(255,255,255,0.48)" }}
            />
          </a>
        );
      })}
    </nav>
  );
}
