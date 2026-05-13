"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

type CountingYearProps = {
  cycle?: number;
  energetic?: boolean;
  value: string;
};

export function CountingYear({ cycle = 0, energetic = false, value }: CountingYearProps) {
  const numericYear = Number(value);
  const count = useMotionValue(Number.isFinite(numericYear) ? numericYear : 0);
  const display = useTransform(count, (latest) => {
    if (!Number.isFinite(numericYear)) {
      return value;
    }

    return String(Math.round(latest));
  });
  const [animationKey, setAnimationKey] = useState(cycle);

  useEffect(() => {
    setAnimationKey(cycle);
  }, [cycle]);

  useEffect(() => {
    if (!Number.isFinite(numericYear)) {
      return;
    }

    if (animationKey === 0) {
      count.set(numericYear);
      return;
    }

    const startOffset = energetic ? 34 : 16;
    const startYear = Math.max(1900, numericYear - startOffset);
    count.set(startYear);
    const controls = animate(count, numericYear, {
      duration: energetic ? 1.65 : 1.2,
      ease: [0.16, 1, 0.3, 1]
    });

    return controls.stop;
  }, [animationKey, count, energetic, numericYear]);

  return (
    <motion.span
      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      className="relative inline-block tabular-nums"
      initial={{ filter: "blur(12px)", opacity: 0, y: "0.24em" }}
      key={`${value}-${animationKey}`}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-[0.82em] text-white/10">
        {Number.isFinite(numericYear) ? numericYear + 1 : value}
      </span>
      <motion.span aria-hidden="true" className="relative block">
        {display}
      </motion.span>
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[0.82em] text-white/10">
        {Number.isFinite(numericYear) ? numericYear - 1 : value}
      </span>
      <span className="sr-only">{value}</span>
    </motion.span>
  );
}
