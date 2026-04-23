"use client";

import { ShieldAlert, AlertTriangle, HeartPulse } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import LabelWithDescription from "@/components/shared/LabelWithDescription";
import { PCRData } from "@/lib/types";
import { formatNumber, formatCurrency } from "@/lib/calculations";
import { useInView } from "react-intersection-observer";

interface RiskBreakdownProps {
  data: PCRData;
}

const TIERS = [
  { key: "catastrophicRisk", label: "Catastrophic", color: "var(--covert-red)", desc: "Imminent overdose risk indicators present" },
  { key: "severeRisk", label: "Severe", color: "var(--covert-orange)", desc: "Multiple high-risk prescribing patterns converging" },
  { key: "highRisk", label: "High", color: "#F59E0B", desc: "Escalating utilization with unsafe prescriber overlap" },
  { key: "moderateRisk", label: "Moderate", color: "#FCD34D", desc: "Early-stage risk factors requiring monitoring" },
  { key: "earlyWithdrawal", label: "Early Withdrawal", color: "#FEF3C7", desc: "Active withdrawal management indicators" },
  { key: "matMembers", label: "MAT Enrolled", color: "var(--covert-green)", desc: "Currently enrolled in Medication-Assisted Treatment" },
] as const;

export default function RiskBreakdown({ data }: RiskBreakdownProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
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
      ref={ref}
      className="w-full"
      style={{ padding: "80px 0", backgroundColor: "var(--covert-bg)" }}
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16" style={{ maxWidth: "1100px" }}>
        <SectionLabel icon={ShieldAlert} text="Member Risk Breakdown" />
        <h2
          className="font-bold"
          style={{ fontSize: "28px", lineHeight: 1.25, marginTop: "8px" }}
        >
          {formatNumber(data.identifiedMembers)} plan members need case
          management
        </h2>

        {/* Stacked bar */}
        <div
          className="overflow-hidden"
          style={{
            height: "52px",
            borderRadius: "12px",
            display: "flex",
            backgroundColor: "var(--covert-bg-secondary)",
            marginTop: "32px",
          }}
        >
          {barTiers.map((tier) => (
            <div
              key={tier.key}
              className="relative group"
              style={{
                width: inView ? `${tier.pct}%` : "0%",
                backgroundColor: tier.color,
                transition: "width 1s ease-out",
                minWidth: tier.count > 0 ? "4px" : "0",
              }}
            >
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                style={{
                  backgroundColor: "var(--covert-black)",
                  color: "#FFFFFF",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  marginBottom: "8px",
                }}
              >
                {tier.label}: {tier.count}
              </div>
            </div>
          ))}
        </div>

        {/* Tier breakdown list */}
        <div className="flex flex-col" style={{ gap: "12px", marginTop: "32px" }}>
          {tierData.map((tier) => (
            <div
              key={tier.key}
              className="flex items-center bg-white min-w-0"
              style={{
                borderRadius: "8px",
                padding: "16px 20px",
                border: "1px solid var(--covert-border)",
                borderLeftWidth: "4px",
                borderLeftColor: tier.color,
                gap: "16px",
              }}
            >
              <div className="flex-1 min-w-0">
                <LabelWithDescription
                  label={tier.label}
                  description={tier.desc}
                  labelColor={tier.color}
                />
              </div>
              <span
                className="font-bold flex-shrink-0"
                style={{ fontSize: "22px", color: tier.color }}
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
              backgroundColor: "var(--covert-red-light)",
              borderLeft: "4px solid var(--covert-red)",
              borderRadius: "8px",
              padding: "20px 24px",
              marginTop: "24px",
              gap: "12px",
            }}
          >
            <AlertTriangle
              size={20}
              style={{
                color: "var(--covert-red)",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <p className="min-w-0" style={{ fontSize: "15px", lineHeight: 1.6 }}>
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
              backgroundColor: "var(--covert-green-light)",
              borderLeft: "4px solid var(--covert-green)",
              borderRadius: "8px",
              padding: "20px 24px",
              marginTop: "16px",
              gap: "12px",
            }}
          >
            <HeartPulse
              size={20}
              style={{
                color: "var(--covert-green)",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <p className="min-w-0" style={{ fontSize: "15px", lineHeight: 1.6 }}>
              <strong>{data.matMembers} members</strong>{" "}
              are currently enrolled in Medication-Assisted Treatment — a
              positive indicator of active intervention.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
