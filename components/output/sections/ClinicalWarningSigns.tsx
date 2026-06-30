"use client";

import { AlertTriangle } from "lucide-react";
import { PCRData } from "@/lib/types";
import { useInView } from "react-intersection-observer";
import { usePrefersReducedMotion } from "@/lib/hooks";
import Reveal from "@/components/shared/Reveal";
import { formatNumber } from "@/lib/calculations";

interface ClinicalWarningSignsProps {
  data: PCRData;
}

interface WarningBarProps {
  value: number;
  label: string;
  color: string;
  /** Largest value in the set — the shared scale all bars are measured against. */
  max: number;
  animate: boolean;
  /** Stagger offset in ms. */
  delay: number;
}

/**
 * One ranked horizontal bar. Length encodes the count against a shared scale,
 * so any two indicators are directly comparable at a glance (Cleveland: length
 * against a common baseline beats angle/area). Replaces the old radial rings,
 * which filled completely for any value >100 and carried no information.
 */
function WarningBar({ value, label, color, max, animate, delay }: WarningBarProps) {
  const reduced = usePrefersReducedMotion();
  const pct = max > 0 ? (value / max) * 100 : 0;
  const grown = reduced || animate;

  return (
    <div
      className="grid items-center"
      style={{ gridTemplateColumns: "minmax(0, 280px) 1fr", gap: "24px" }}
    >
      <span
        className="font-medium"
        style={{
          fontSize: "17px",
          color: "var(--on-dark-text)",
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
      <div className="flex items-center" style={{ gap: "14px" }}>
        <div
          style={{
            flex: 1,
            height: "12px",
            borderRadius: "6px",
            backgroundColor: "rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: "6px",
              backgroundColor: color,
              width: grown ? `${Math.max(pct, 1.5)}%` : "0%",
              transition: reduced
                ? "none"
                : `width 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
            }}
          />
        </div>
        <span
          className="font-bold"
          style={{
            fontSize: "20px",
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            minWidth: "62px",
            textAlign: "right",
          }}
        >
          {formatNumber(value)}
        </span>
      </div>
    </div>
  );
}

export default function ClinicalWarningSigns({
  data,
}: ClinicalWarningSignsProps) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  const indicators = [
    {
      value: data.prescribersExcessiveRefills,
      label: "Prescribers writing >3 refills",
      color: "#FF8A8A",
    },
    // (Jesse 6/29): pharmacies dispensing opioid Rx with >3 refills.
    // Hidden when the figure isn't present in the data.
    ...(typeof data.pharmaciesOver3Refills === "number"
      ? [
          {
            value: data.pharmaciesOver3Refills,
            label: "Pharmacies dispensing >3 refills",
            color: "#FF8A8A",
          },
        ]
      : []),
    {
      value: data.crossLocationRefills,
      label: "Cross-location pharmacy refills",
      color: "#FFB36B",
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
  ]
    // Ranked largest-first on a shared scale (Knaflic: "order in the sort").
    .sort((a, b) => b.value - a.value);

  const max = indicators[0]?.value ?? 0;

  return (
    <section
      ref={ref}
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(52px, 6vw, 84px)",
        paddingBottom: "clamp(52px, 6vw, 84px)",
        backgroundColor: "transparent",
        color: "#FFFFFF",
      }}
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16 relative" style={{ maxWidth: "1100px" }}>
        <Reveal>
          <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
            <AlertTriangle size={14} style={{ color: "var(--covert-teal)" }} />
            <span
              className="font-bold uppercase"
              style={{
                fontSize: "13px",
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
        </Reveal>

        {/* Ranked horizontal bars on a shared scale — any two indicators are
            directly comparable by length. Bars grow in as the section reveals. */}
        <div
          className="flex flex-col"
          style={{ gap: "22px", marginTop: "56px" }}
        >
          {indicators.map((ind, i) => (
            <WarningBar
              key={ind.label}
              value={ind.value}
              label={ind.label}
              color={ind.color}
              max={max}
              animate={inView}
              delay={i * 80}
            />
          ))}
        </div>

        <Reveal>
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
        </Reveal>
      </div>
    </section>
  );
}
