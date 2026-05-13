export type EmotionTone = "neutral" | "fear" | "panic" | "greed" | "uncertainty";

export type JourneySceneData = {
  id: string;
  scene: string;
  year: string;
  event: string;
  emotion: string;
  index: number;
  copy: string;
  tone: EmotionTone;
  accent: string;
  accentSoft: string;
  glow: string;
  chamberGradient: string;
  chart: number[];
};

export const journeyScenes: JourneySceneData[] = [
  {
    id: "today",
    scene: "Scene 00",
    year: "2026",
    event: "Today",
    emotion: "Greed",
    index: 66,
    copy: "Risk appetite is positive, but not euphoric.",
    tone: "greed",
    accent: "#60F0E4",
    accentSoft: "rgba(96, 240, 228, 0.18)",
    glow: "rgba(96, 240, 228, 0.32)",
    chamberGradient: "from-cyan-300/15 via-emerald-300/10 to-blue-500/10",
    chart: [44, 47, 52, 58, 61, 63, 66]
  },
  {
    id: "lehman",
    scene: "Scene 01",
    year: "2008",
    event: "Lehman Collapse",
    emotion: "Extreme Fear",
    index: 8,
    copy: "Trust collapsed faster than markets.",
    tone: "fear",
    accent: "#FF365B",
    accentSoft: "rgba(255, 54, 91, 0.18)",
    glow: "rgba(255, 54, 91, 0.34)",
    chamberGradient: "from-red-500/20 via-rose-900/20 to-zinc-950/30",
    chart: [42, 31, 24, 18, 13, 10, 8]
  },
  {
    id: "qe-rally",
    scene: "Scene 02",
    year: "2013",
    event: "QE Euphoria",
    emotion: "Extreme Greed",
    index: 94,
    copy: "Liquidity returned. Confidence became momentum.",
    tone: "greed",
    accent: "#42B8FF",
    accentSoft: "rgba(66, 184, 255, 0.22)",
    glow: "rgba(66, 184, 255, 0.38)",
    chamberGradient: "from-sky-300/22 via-cyan-600/16 to-blue-950/22",
    chart: [52, 61, 70, 82, 89, 93, 94]
  },
  {
    id: "vol-shock",
    scene: "Scene 03",
    year: "2018",
    event: "Volatility Shock",
    emotion: "Extreme Fear",
    index: 2,
    copy: "Calm broke. The market remembered gravity.",
    tone: "fear",
    accent: "#FF244F",
    accentSoft: "rgba(255, 36, 79, 0.23)",
    glow: "rgba(255, 36, 79, 0.4)",
    chamberGradient: "from-red-500/22 via-rose-950/22 to-zinc-950/25",
    chart: [46, 36, 27, 18, 9, 2, 12]
  },
  {
    id: "covid",
    scene: "Scene 04",
    year: "2020",
    event: "COVID Panic",
    emotion: "Extreme Panic",
    index: 2,
    copy: "The world paused. Markets followed.",
    tone: "fear",
    accent: "#FF174D",
    accentSoft: "rgba(255, 23, 77, 0.24)",
    glow: "rgba(255, 23, 77, 0.42)",
    chamberGradient: "from-red-500/25 via-rose-950/25 to-zinc-950/25",
    chart: [58, 42, 25, 12, 6, 2, 18]
  },
  {
    id: "retail",
    scene: "Scene 05",
    year: "2021",
    event: "Retail Euphoria",
    emotion: "Greed",
    index: 77,
    copy: "Everyone became an investor.",
    tone: "greed",
    accent: "#3D8DFF",
    accentSoft: "rgba(61, 141, 255, 0.2)",
    glow: "rgba(61, 141, 255, 0.36)",
    chamberGradient: "from-blue-400/22 via-sky-900/18 to-indigo-950/18",
    chart: [38, 45, 52, 61, 68, 73, 77]
  },
  {
    id: "inflation",
    scene: "Scene 06",
    year: "2022",
    event: "Inflation Shock",
    emotion: "Extreme Fear",
    index: 3,
    copy: "Cheap money disappeared. Reality returned.",
    tone: "fear",
    accent: "#FF2A3D",
    accentSoft: "rgba(255, 42, 61, 0.2)",
    glow: "rgba(255, 42, 61, 0.36)",
    chamberGradient: "from-red-500/22 via-orange-950/20 to-zinc-950/25",
    chart: [52, 41, 28, 17, 9, 3, 18]
  },
  {
    id: "ai-rally",
    scene: "Scene 07",
    year: "2024",
    event: "AI Rally",
    emotion: "Greed",
    index: 79,
    copy: "A new narrative replaced fear.",
    tone: "greed",
    accent: "#38C7FF",
    accentSoft: "rgba(56, 199, 255, 0.2)",
    glow: "rgba(56, 199, 255, 0.38)",
    chamberGradient: "from-cyan-300/22 via-sky-600/16 to-blue-950/22",
    chart: [51, 55, 61, 67, 72, 76, 79]
  }
];

export const insightCards = [
  {
    title: "Volatility",
    value: "High",
    copy: "Sharp emotional turns appear before the story becomes obvious.",
    accent: "#419BFF",
    chart: [22, 55, 38, 70, 48, 84]
  },
  {
    title: "Liquidity",
    value: "Thin",
    copy: "When confidence narrows, small moves start to feel cinematic.",
    accent: "#FF9D35",
    chart: [78, 72, 61, 54, 44, 39]
  },
  {
    title: "AI Momentum",
    value: "88",
    copy: "Optimism concentrates around the newest narrative engine.",
    accent: "#47E7C4",
    chart: [35, 42, 51, 64, 78, 88]
  }
];
