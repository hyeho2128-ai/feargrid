import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={`glass-border rounded-[1.75rem] bg-white/[0.055] p-5 text-white shadow-glow backdrop-blur-2xl transition duration-700 ease-premium hover:-translate-y-1 hover:bg-white/[0.075] ${className}`}
    >
      {children}
    </div>
  );
}
