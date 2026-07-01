"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, AlertTriangle, HeartPulse } from "lucide-react";
import { PCRData } from "@/lib/types";
import {
  formatNumber,
  formatCurrency,
  calcCatastrophicExposure,
} from "@/lib/calculations";

interface RiskBreakdownProps {
  data: PCRData;
}

const TIERS = [
  { key: "catastrophicRisk", label: "Catastrophic", color: "#FF6B6B", textColor: "#FF6B6B", desc: "Imminent overdose risk indicators present" },
  { key: "severeRisk", label: "Severe", color: "#FFB36B", textColor: "#FFB36B", desc: "Multiple high-risk prescribing patterns converging" },
  { key: "highRisk", label: "High", color: "#F59E0B", textColor: "#FCD34D", desc: "Escalating utilization with unsafe prescriber overlap" },
  { key: "moderateRisk", label: "Moderate", color: "#FCD34D", textColor: "#FDE68A", desc: "Early-stage risk factors requiring monitoring" },
  { key: "earlyWithdrawal", label: "Medically Emergent Withdrawal", color: "#FEF3C7", textColor: "#FEF3C7", desc: "Active withdrawal management indicators" },
  { key: "matMembers", label: "MAT Enrolled", color: "#FFB36B", textColor: "#FFB36B", desc: "Existing prescribing patterns have escalated to opioid addiction" },
] as const;

export default function RiskBreakdown({ data }: RiskBreakdownProps) {
  // Fill the distribution bar on mount rather than on scroll-into-view: the
  // IntersectionObserver doesn't reliably fire before a PDF capture or when the
  // section is off-screen, which left the bar rendered empty.
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(true), []);
  const total = data.identifiedMembers;
  // So-what: how concentrated is the risk in the most urgent tiers?
  const topTiers =
    data.catastrophicRisk + data.severeRisk + data.highRisk;
  const topPct = total > 0 ? Math.round((topTiers / total) * 100) : 0;

  const tierData = TIERS.filter(
    (t) => t.key !== "matMembers" || data.matMembers > 0,
  ).map((tier) => ({
    ...tier,
    count: data[tier.key] as number,
    pct: total > 0 ? ((data[tier.key] as number) / total) * 100 : 0,
  }));

  const barTiers = tierData.filter((t) => t.key !== "matMembers");

  return (
    <section
      className="w-full"
      style={{
        paddingTop: "clamp(52px, 6vw, 84px)",
        paddingBottom: "clamp(52px, 6vw, 84px)",
        backgroundColor: "transparent",
        color: "#FFFFFF",
      }}
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16" style={{ maxWidth: "1100px" }}>
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <ShieldAlert size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "var(--fs-eyebrow)",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            Member Risk Breakdown
          </span>
        </div>

        <h2
          className="font-bold"
          style={{
            fontSize: "var(--fs-h2)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            textWrap: "balance",
          }}
        >
          Not all risk is equal.{" "}
          <span style={{ color: "var(--covert-teal)" }}>Here's the breakdown.</span>
        </h2>
        {/* The 5,028 is the focal hero of the prior section; here it's a small
            contextual caption so the two sections don't repeat the same giant
            number back-to-back. */}
        <p
          style={{
            fontSize: "var(--fs-body)",
            color: "var(--on-dark-text-secondary)",
            lineHeight: 1.6,
            marginTop: "16px",
            maxWidth: "640px",
          }}
        >
          <strong style={{ color: "#FFFFFF" }}>
            {formatNumber(topTiers)} members ({topPct}%)
          </strong>{" "}
          are already at High risk or above — risk is concentrated at the top.
          All {formatNumber(data.identifiedMembers)} identified members need
          active case management, but the deeper the tier, the more urgent the
          intervention.
        </p>

        {/* Stacked bar */}
        <div
          className="overflow-hidden"
          style={{
            height: "52px",
            borderRadius: "12px",
            display: "flex",
            backgroundColor: "var(--on-dark-surface)",
            border: "1px solid var(--on-dark-border)",
            marginTop: "40px",
          }}
        >
          {barTiers.map((tier) => (
            <div
              key={tier.key}
              className="relative group"
              style={{
                width: animate ? `${tier.pct}%` : "0%",
                backgroundColor: tier.color,
                transition: "width 1s ease-out",
                minWidth: tier.count > 0 ? "4px" : "0",
              }}
            >
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "var(--covert-black)",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "var(--fs-caption)",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                {tier.label}: {tier.count}
              </div>
            </div>
          ))}
        </div>

        {/* Tier breakdown list — each tier carries a severity status pill
            (color + label, colorblind-safe; the most severe tier is a solid
            fill, the rest tinted) so severity reads without relying on color
            alone (WCAG 1.4.1; Atlassian lozenge). */}
        <div className="flex flex-col" style={{ gap: "10px", marginTop: "32px" }}>
          {tierData.map((tier) => {
            const solid = tier.key === "catastrophicRisk";
            return (
              <div
                key={tier.key}
                className="min-w-0"
                style={{
                  borderRadius: "12px",
                  padding: "16px 20px",
                  backgroundColor: "var(--on-dark-surface)",
                  border: "1px solid var(--on-dark-border)",
                  borderLeftWidth: "4px",
                  borderLeftColor: tier.color,
                }}
              >
                {/* Pill + count share a line so the number sits right beside the
                    tier it quantifies, not floating at the far edge. */}
                <div className="flex items-center" style={{ gap: "14px" }}>
                  <span
                    className="inline-flex items-center font-bold uppercase"
                    style={{
                      gap: "7px",
                      padding: "5px 11px",
                      borderRadius: "999px",
                      fontSize: "var(--fs-caption)",
                      letterSpacing: "0.05em",
                      backgroundColor: solid
                        ? tier.color
                        : `color-mix(in srgb, ${tier.color} 15%, transparent)`,
                      color: solid ? "#17171A" : tier.textColor,
                      border: solid
                        ? "none"
                        : `1px solid color-mix(in srgb, ${tier.color} 40%, transparent)`,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "999px",
                        backgroundColor: solid ? "#17171A" : tier.color,
                      }}
                    />
                    {tier.label}
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      fontSize: "var(--fs-h3)",
                      color: tier.textColor,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {formatNumber(tier.count)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "var(--fs-label)",
                    color: "var(--on-dark-text-secondary)",
                    lineHeight: 1.45,
                    marginTop: "8px",
                  }}
                >
                  {tier.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Catastrophic callout */}
        {data.catastrophicRisk > 0 && (
          <div
            className="flex items-start"
            style={{
              backgroundColor: "rgba(255,107,107,0.10)",
              borderLeft: "4px solid #FF6B6B",
              border: "1px solid rgba(255,107,107,0.25)",
              borderRadius: "12px",
              padding: "20px 24px",
              marginTop: "24px",
              gap: "12px",
            }}
          >
            <AlertTriangle
              size={20}
              style={{
                color: "#FF6B6B",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <p
              className="min-w-0"
              style={{ fontSize: "var(--fs-body)", lineHeight: 1.6, color: "#FFFFFF" }}
            >
              <strong>
                {data.catastrophicRisk} member
                {data.catastrophicRisk !== 1 ? "s" : ""}
              </strong>{" "}
              {data.catastrophicRisk !== 1 ? "are" : "is"} nearing a
              catastrophic opioid event. These members show patterns consistent
              with imminent overdose risk. Projected exposure:{" "}
              <strong>
                ~{formatCurrency(calcCatastrophicExposure(data.catastrophicRisk))}.
              </strong>
            </p>
          </div>
        )}

        {/* MAT callout */}
        {data.matMembers > 0 && (
          <div
            className="flex items-start"
            style={{
              backgroundColor: "rgba(255,179,107,0.10)",
              borderLeft: "4px solid #FFB36B",
              border: "1px solid rgba(255,179,107,0.25)",
              borderRadius: "12px",
              padding: "20px 24px",
              marginTop: "16px",
              gap: "12px",
            }}
          >
            <HeartPulse
              size={20}
              style={{
                color: "#FFB36B",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <p
              className="min-w-0"
              style={{ fontSize: "var(--fs-body)", lineHeight: 1.6, color: "#FFFFFF" }}
            >
              <strong>{data.matMembers} members</strong>{" "}
              are enrolled in Medication-Assisted Treatment. These patients
              show existing prescribing patterns have escalated to opioid
              addiction.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
