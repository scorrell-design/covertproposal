"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, AlertTriangle, HeartPulse } from "lucide-react";
import LabelWithDescription from "@/components/shared/LabelWithDescription";
import { PCRData } from "@/lib/types";
import { formatNumber, formatCurrency } from "@/lib/calculations";

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
        paddingTop: "clamp(72px, 8vw, 112px)",
        paddingBottom: "clamp(72px, 8vw, 112px)",
        backgroundColor: "var(--covert-black)",
        color: "#FFFFFF",
      }}
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16" style={{ maxWidth: "1100px" }}>
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <ShieldAlert size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "11px",
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
            fontSize: "clamp(28px, 3.2vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            textWrap: "balance",
          }}
        >
          <span style={{ color: "var(--covert-teal)" }}>
            {formatNumber(data.identifiedMembers)}
          </span>{" "}
          plan members need case management
        </h2>

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
                  fontSize: "12px",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                {tier.label}: {tier.count}
              </div>
            </div>
          ))}
        </div>

        {/* Tier breakdown list */}
        <div className="flex flex-col" style={{ gap: "10px", marginTop: "32px" }}>
          {tierData.map((tier) => (
            <div
              key={tier.key}
              className="flex items-center min-w-0"
              style={{
                borderRadius: "12px",
                padding: "16px 20px",
                backgroundColor: "var(--on-dark-surface)",
                border: "1px solid var(--on-dark-border)",
                borderLeftWidth: "4px",
                borderLeftColor: tier.color,
                gap: "16px",
              }}
            >
              <div className="flex-1 min-w-0">
                <LabelWithDescription
                  label={tier.label}
                  description={tier.desc}
                  labelColor={tier.textColor}
                  descriptionColor="var(--on-dark-text-secondary)"
                  descriptionSize="14px"
                />
              </div>
              <span
                className="font-bold flex-shrink-0"
                style={{
                  fontSize: "22px",
                  color: tier.textColor,
                  letterSpacing: "-0.02em",
                }}
              >
                {tier.count}
              </span>
            </div>
          ))}
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
              style={{ fontSize: "15px", lineHeight: 1.6, color: "#FFFFFF" }}
            >
              <strong>
                {data.catastrophicRisk} member
                {data.catastrophicRisk !== 1 ? "s" : ""}
              </strong>{" "}
              {data.catastrophicRisk !== 1 ? "are" : "is"} nearing a
              catastrophic opioid event. These members show patterns consistent
              with imminent overdose risk. Projected exposure:{" "}
              <strong>
                ~{formatCurrency(data.catastrophicRisk * 100000)}.
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
              style={{ fontSize: "15px", lineHeight: 1.6, color: "#FFFFFF" }}
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
