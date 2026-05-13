type LineChartProps = {
  values: number[];
  accent: string;
  height?: number;
  label?: string;
};

export function LineChart({ values, accent, height = 92, label }: LineChartProps) {
  const width = 320;
  const padding = 10;
  const max = 100;
  const points = values
    .map((value, index) => {
      const x = padding + (index / (values.length - 1)) * (width - padding * 2);
      const y = height - padding - (value / max) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const area = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <svg
      aria-label={label ?? "Emotion trend chart"}
      className="h-full w-full overflow-visible"
      role="img"
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <linearGradient id={`line-${accent.replace("#", "")}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="55%" stopColor={accent} stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.82" />
        </linearGradient>
        <linearGradient id={`area-${accent.replace("#", "")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 50, 75].map((y) => (
        <line
          key={y}
          stroke="rgba(255,255,255,0.09)"
          strokeDasharray="4 8"
          strokeWidth="1"
          x1="8"
          x2={width - 8}
          y1={height - padding - (y / max) * (height - padding * 2)}
          y2={height - padding - (y / max) * (height - padding * 2)}
        />
      ))}
      <polygon fill={`url(#area-${accent.replace("#", "")})`} points={area} />
      <polyline
        fill="none"
        points={points}
        stroke={`url(#line-${accent.replace("#", "")})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      {values.map((value, index) => {
        const x = padding + (index / (values.length - 1)) * (width - padding * 2);
        const y = height - padding - (value / max) * (height - padding * 2);
        return <circle cx={x} cy={y} fill="#ffffff" key={`${value}-${index}`} r="2.4" />;
      })}
    </svg>
  );
}
