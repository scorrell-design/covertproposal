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
      className="bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg min-w-0"
      style={{
        border: "1px solid var(--covert-border)",
        borderRadius: "12px",
        borderTop: `3px ${borderStyle} ${borderColor}`,
        padding: "32px",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}
    >
      <p
        className="font-bold"
        style={{
          fontSize: "40px",
          color: valueColor || borderColor,
          lineHeight: 1.1,
        }}
      >
        {displayValue}
      </p>
      <p
        style={{
          fontSize: "14px",
          color: "var(--covert-text-secondary)",
          lineHeight: 1.5,
          marginTop: "12px",
        }}
      >
        {label}
      </p>
      {sublabel && (
        <p style={{ fontSize: "12px", color: "var(--covert-text-secondary)", marginTop: "6px" }}>
          {sublabel}
        </p>
      )}
      {liveAccumulator && (
        <p style={{ fontSize: "12px", color: "#DC2626", marginTop: "10px" }}>
          {liveAccumulator}
        </p>
      )}
    </div>
  );
}
