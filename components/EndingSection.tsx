"use client";

import { motion } from "framer-motion";
import { FloatingParticles } from "@/components/FloatingParticles";
import { LineChart } from "@/components/LineChart";

export function EndingSection() {
  return (
    <section
      className="snap-start relative flex h-[100svh] min-h-[720px] items-center justify-center overflow-hidden px-5 py-24 text-center"
      id="ending"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_26rem),radial-gradient(circle_at_70%_20%,rgba(159,99,255,0.14),transparent_28rem),#020306]" />
      <FloatingParticles accent="#B9F7FF" count={42} />
      <motion.div
        animate={{ opacity: [0.15, 0.4, 0.15], y: [18, -18, 18] }}
        className="absolute bottom-24 h-40 w-[70rem] max-w-[88vw]"
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      >
        <LineChart accent="#B9F7FF" label="Fading cycle line" values={[48, 35, 70, 28, 83, 52, 88, 44]} />
      </motion.div>
      <motion.div
        className="relative z-10 mx-auto max-w-5xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.55, once: false }}
      >
        <h2 className="text-balance text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-7xl lg:text-8xl">
          Every market cycle begins with emotion.
        </h2>
        <p className="mx-auto mt-8 max-w-2xl whitespace-pre-line text-lg leading-8 text-white/62 sm:text-xl">
          {`Fear and greed never disappear.
They only change shape.`}
        </p>
      </motion.div>
    </section>
  );
}
