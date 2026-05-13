"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { LineChart } from "@/components/LineChart";
import { insightCards } from "@/constants/journey";

export function InsightCards() {
  return (
    <section
      className="snap-start relative flex h-[100svh] min-h-[720px] items-center overflow-hidden px-5 py-20 sm:px-8"
      id="insights"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(65,155,255,0.16),transparent_28rem),radial-gradient(circle_at_85%_60%,rgba(71,231,196,0.13),transparent_30rem),#05070B]" />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.45, once: false }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-cyan-200/75">Insight Layer</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-white sm:text-6xl">
            Emotion becomes visible before it becomes consensus.
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {insightCards.map((card, index) => (
            <motion.div
              initial={{ opacity: 0, y: 34 }}
              key={card.title}
              transition={{ delay: index * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.45, once: false }}
            >
              <GlassCard className="h-full p-7">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: card.accent }}>
                      {card.title}
                    </p>
                    <p className="mt-5 text-6xl font-semibold leading-none text-white">{card.value}</p>
                  </div>
                  <span
                    className="mt-1 h-3 w-3 rounded-full"
                    style={{ background: card.accent, boxShadow: `0 0 26px ${card.accent}` }}
                  />
                </div>
                <p className="mt-8 min-h-16 text-sm leading-6 text-white/56">{card.copy}</p>
                <div className="mt-8 h-24">
                  <LineChart accent={card.accent} label={`${card.title} miniature chart`} values={card.chart} />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
