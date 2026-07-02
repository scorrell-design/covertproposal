"use client";

import SplitFlapNumber from "@/components/shared/SplitFlapNumber";
import { useFitText } from "@/lib/hooks";

interface TickerCardProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel?: string;
  borderColor: string;
  valueColor?: string;
  borderStyle?: "solid" | "dashed";
}

export default function TickerCard({
  value,
  prefix,
  suffix,
  label,
  sublabel,
  borderColor,
  valueColor,
  borderStyle = "solid",
}: TickerCardProps) {
  // Big figures (e.g. "$9,968,010") must never escape the card — shrink the
  // font to the card's width when the one-line figure is too wide (Steph 7/2).
  const valueRef = useFitText<HTMLParagraphElement>("var(--fs-stat)", [
    value,
    prefix,
    suffix,
  ]);

  return (
    <div
      data-ticker
      className="transition-all duration-200 hover:-translate-y-0.5 min-w-0 h-full"
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
        ref={valueRef}
        className="font-bold"
        style={{
          fontSize: "var(--fs-stat)",
          color: valueColor || borderColor,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
        }}
      >
        <SplitFlapNumber value={value} prefix={prefix} suffix={suffix} />
      </p>
      <p
        style={{
          fontSize: "var(--fs-label)",
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
            fontSize: "var(--fs-caption)",
            color: "var(--on-dark-text-muted)",
            marginTop: "6px",
          }}
        >
          {sublabel}
        </p>
      )}
    </div>
  );
}
