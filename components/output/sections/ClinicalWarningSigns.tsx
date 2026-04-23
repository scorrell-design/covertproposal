"use client";

import { AlertTriangle } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import { PCRData } from "@/lib/types";
import { useInView } from "react-intersection-observer";

interface ClinicalWarningSignsProps {
  data: PCRData;
}

interface RingIndicatorProps {
  value: number;
  label: string;
  color: string;
  animate: boolean;
}

function RingIndicator({ value, label, color, animate }: RingIndicatorProps) {
  const circumference = 2 * Math.PI * 50;
  const fillPercent = Math.min(value / 100, 1);
  const offset = circumference * (1 - fillPercent);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label={`${value} — ${label}`}>
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="var(--covert-border)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? offset : circumference}
          transform="rotate(-90 60 60)"
          style={{
            transition: "stroke-dashoffset 1.2s ease-out",
            ["--circumference" as string]: circumference,
            ["--target-offset" as string]: offset,
          }}
        />
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--covert-black)"
          fontFamily="Cabin, sans-serif"
          fontSize="28"
          fontWeight="700"
        >
          {value}
        </text>
      </svg>
      <p
        className="text-center"
        style={{
          fontSize: "13px",
          color: "var(--covert-text-secondary)",
          maxWidth: "140px",
          lineHeight: 1.4,
        }}
      >
        {label}
      </p>
    </div>
  );
}

export default function ClinicalWarningSigns({
  data,
}: ClinicalWarningSignsProps) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  const rings = [
    {
      value: data.prescribersExcessiveRefills,
      label: "Prescribers writing >3 refills",
      color: "var(--covert-red)",
    },
    {
      value: data.crossLocationRefills,
      label: "Cross-location pharmacy refills",
      color: "var(--covert-red)",
    },
    {
      value: data.pharmaciesEarlyRefills,
      label: "Pharmacies providing early refills",
      color: "#EF4444",
    },
    {
      value: data.pharmaciesHighDosage,
      label: "Pharmacies dispensing >50 MME/day",
      color: "var(--covert-black)",
    },
  ];

  return (
    <section
      ref={ref}
      style={{ padding: "64px 0", backgroundColor: "var(--covert-bg)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "1100px", padding: "0 24px" }}>
        <SectionLabel icon={AlertTriangle} text="Clinical Warning Signs" />
        <h2 className="font-bold mt-2" style={{ fontSize: "28px", lineHeight: 1.25 }}>
          Clinical Red Flags in Your Population
        </h2>

        <div
          className="flex justify-center flex-wrap gap-10 mt-12"
        >
          {rings.map((ring) => (
            <RingIndicator
              key={ring.label}
              value={ring.value}
              label={ring.label}
              color={ring.color}
              animate={inView}
            />
          ))}
        </div>

        <p
          className="mt-10 text-center mx-auto"
          style={{
            fontSize: "15px",
            color: "var(--covert-text-secondary)",
            maxWidth: "720px",
            lineHeight: 1.7,
          }}
        >
          These indicators, when present in combination, constitute clinical
          evidence of systemic prescribing failures — actionable intervention
          points, not member behavioral issues.
        </p>
      </div>
    </section>
  );
}
