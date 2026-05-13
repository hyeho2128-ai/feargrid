"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

type CountingYearProps = {
  cycle?: number;
  energetic?: boolean;
  value: string;
};

type RollingDigitProps = {
  cycle: number;
  energetic: boolean;
  index: number;
  target: number;
};

function RollingDigit({ cycle, energetic, index, target }: RollingDigitProps) {
  const reel = useMotionValue(target);
  const display = useTransform(reel, (latest) => {
    const digit = Math.round(latest) % 10;
    return String(digit < 0 ? digit + 10 : digit);
  });

  useEffect(() => {
    if (cycle === 0) {
      reel.set(target);
      return;
    }

    const rotations = energetic ? 18 + index * 3 : 11 + index * 2;
    reel.set(target - rotations);
    const controls = animate(reel, target, {
      delay: index * (energetic ? 0.13 : 0.09),
      duration: energetic ? 1.05 + index * 0.16 : 0.9 + index * 0.1,
      ease: [0.16, 1, 0.3, 1]
    });

    return controls.stop;
  }, [cycle, energetic, index, reel, target]);

  return (
    <motion.span
      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      className="inline-block w-[0.64em] overflow-hidden text-center tabular-nums"
      initial={{ filter: "blur(10px)", opacity: 0, y: "0.18em" }}
      key={`${cycle}-${index}-${target}`}
      transition={{
        delay: index * (energetic ? 0.08 : 0.05),
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <motion.span className="block leading-none">{display}</motion.span>
    </motion.span>
  );
}

export function CountingYear({ cycle = 0, energetic = false, value }: CountingYearProps) {
  const characters = value.split("");

  return (
    <>
      <span aria-hidden="true" className="inline-flex items-baseline leading-none tabular-nums">
        {characters.map((character, index) =>
          /\d/.test(character) ? (
            <RollingDigit
              cycle={cycle}
              energetic={energetic}
              index={index}
              key={`${index}-${character}`}
              target={Number(character)}
            />
          ) : (
            <span className="inline-block" key={`${index}-${character}`}>
              {character}
            </span>
          )
        )}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
