"use client";

import { AlertTriangle } from "lucide-react";
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
      <svg width="128" height="128" viewBox="0 0 120 120" role="img" aria-label={`${value} — ${label}`}>
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="rgba(255,255,255,0.10)"
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
          fill="#FFFFFF"
          fontFamily="Satoshi, sans-serif"
          fontSize="28"
          fontWeight="700"
          letterSpacing="-1"
        >
          {value}
        </text>
      </svg>
      <p
        className="text-center"
        style={{
          fontSize: "13px",
          color: "var(--on-dark-text-secondary)",
          maxWidth: "150px",
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
      color: "#FF8A8A",
    },
    {
      value: data.crossLocationRefills,
      label: "Cross-location pharmacy refills",
      color: "#FF8A8A",
    },
    {
      value: data.pharmaciesEarlyRefills,
      label: "Pharmacies providing early refills",
      color: "#FFB36B",
    },
    {
      value: data.pharmaciesHighDosage,
      label: "Pharmacies dispensing >50 MME/day",
      color: "var(--covert-teal)",
    },
    // Pharmacies that filled an opioid Rx for the same member from multiple
    // prescribers (confirmed by Jesse 6/3/26 — PCR p4 "Pharmacies > 1 Prescriber").
    {
      value: data.pharmaciesMultiPrescriber,
      label: "Pharmacies missing multi-prescriber activity",
      color: "var(--covert-teal)",
    },
  ];

  return (
    <section
      ref={ref}
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(72px, 8vw, 112px)",
        paddingBottom: "clamp(72px, 8vw, 112px)",
        backgroundColor: "#0B0B0B",
        color: "#FFFFFF",
      }}
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16 relative" style={{ maxWidth: "1100px" }}>
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <AlertTriangle size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "11px",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            Clinical Warning Signs
          </span>
        </div>

        <h2
          className="font-bold"
          style={{
            fontSize: "clamp(28px, 3.2vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            textWrap: "balance",
            maxWidth: "640px",
          }}
        >
          Clinical red flags in{" "}
          <span style={{ color: "var(--covert-teal)" }}>your population.</span>
        </h2>

        <div
          className="flex justify-center flex-wrap"
          style={{ gap: "40px", marginTop: "56px" }}
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
          className="text-center"
          style={{
            fontSize: "16px",
            color: "var(--on-dark-text-secondary)",
            maxWidth: "780px",
            margin: "48px auto 0",
            lineHeight: 1.7,
          }}
        >
          These indicators constitute clinical evidence of systemic
          prescribing failures preventable by early intervention.
        </p>
      </div>
    </section>
  );
}
