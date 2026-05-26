"use client";

import { useCountUp } from "@/lib/hooks";

interface TickerCardProps {
  value: string | number;
  label: string;
  sublabel?: string;
  borderColor: string;
  valueColor?: string;
  borderStyle?: "solid" | "dashed";
  animate?: boolean;
  liveAccumulator?: string;
}

export default function TickerCard({
  value,
  label,
  sublabel,
  borderColor,
  valueColor,
  borderStyle = "solid",
  animate = true,
  liveAccumulator,
}: TickerCardProps) {
  const numericValue =
    typeof value === "number" ? value : parseInt(value.replace(/[^0-9]/g, ""));
  const isFormatted = typeof value === "string" && value.startsWith("$");
  const { count, ref } = useCountUp(
    numericValue,
    1500,
    animate,
  );

  const displayValue =
    typeof value === "string" && !animate
      ? value
      : isFormatted
        ? `$${count.toLocaleString()}`
        : count.toLocaleString();

  return (
    <div
      ref={ref}
      data-ticker
      className="transition-all duration-200 hover:-translate-y-0.5 min-w-0"
      style={{
        backgroundColor: "var(--on-dark-surface)",
        border: "1px solid var(--on-dark-border)",
        borderRadius: "16px",
        borderTop: `3px ${borderStyle} ${borderColor}`,
        padding: "28px 28px 24px",
        backdropFilter: "blur(4px)",
      }}
    >
      <p
        className="font-bold"
        style={{
          fontSize: "clamp(34px, 3.4vw, 44px)",
          color: valueColor || borderColor,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          wordBreak: "break-word",
        }}
      >
        {displayValue}
      </p>
      <p
        style={{
          fontSize: "14px",
          color: "var(--on-dark-text-secondary)",
          lineHeight: 1.5,
          marginTop: "14px",
        }}
      >
        {label}
      </p>
      {sublabel && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--on-dark-text-muted)",
            marginTop: "6px",
          }}
        >
          {sublabel}
        </p>
      )}
      {liveAccumulator && (
        <p style={{ fontSize: "12px", color: "#FF8A8A", marginTop: "10px" }}>
          {liveAccumulator}
        </p>
      )}
    </div>
  );
}
