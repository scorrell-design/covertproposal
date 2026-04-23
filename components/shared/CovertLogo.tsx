"use client";

interface CovertLogoProps {
  size?: number;
  white?: boolean;
  showWordmark?: boolean;
}

export default function CovertLogo({
  size = 32,
  white = false,
  showWordmark = true,
}: CovertLogoProps) {
  const color = white ? "#FFFFFF" : "var(--covert-teal)";
  const textColor = white ? "#FFFFFF" : "var(--covert-black)";
  const r1 = size / 2;
  const r2 = r1 * 0.65;
  const r3 = r1 * 0.35;
  const dot = r1 * 0.15;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex items-center gap-2.5" role="img" aria-label="Covert logo">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r1 - 1}
          stroke={color}
          strokeWidth={1.5}
          fill="none"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r2}
          stroke={color}
          strokeWidth={1.5}
          fill="none"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r3}
          stroke={color}
          strokeWidth={1.5}
          fill="none"
        />
        <circle cx={cx} cy={cy} r={dot} fill={color} />
      </svg>
      {showWordmark && (
        <span
          className="font-bold tracking-tight"
          style={{
            color: textColor,
            fontSize: size * 0.6,
            lineHeight: 1,
          }}
        >
          Covert
        </span>
      )}
    </div>
  );
}
