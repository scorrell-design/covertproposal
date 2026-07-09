"use client";

import { TrendingUp } from "lucide-react";
import { PCRData } from "@/lib/types";
import {
  calcAvoidableClaimsReduction,
  calcTotalClaimsExposure,
  formatCurrency,
  formatNumber,
  PREVENTABLE_REDUCTION_RATE,
} from "@/lib/calculations";

interface SavingsProjectionProps {
  data: PCRData;
}

/**
 * Savings snapshot directly under the hero (Jim 7/7/26): the first data the
 * reader sees is the at-risk count, what it costs the plan, and what Covert
 * saves. The savings figure is the plan cost × 0.75 — the same
 * calcAvoidableClaimsReduction shown in the Financial Impact table and the
 * Decision close, so all three always match. Members prevented from future
 * risk uses the same 75% reduction rate applied to the at-risk count.
 *
 * Layout (Steph 7/7): a before/after pair of cards — "Your plan today"
 * (problem, warm accents) beside "With Covert" (payoff, teal) — with each
 * figure inline next to the words it quantifies, rather than display-size
 * numbers stacked over small captions.
 */
export default function SavingsProjection({ data }: SavingsProjectionProps) {
  const planCost = calcTotalClaimsExposure(data.chronicCostFactors);
  const savings = calcAvoidableClaimsReduction(data.chronicCostFactors);
  const membersPrevented = Math.round(
    data.identifiedMembers * PREVENTABLE_REDUCTION_RATE,
  );

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(52px, 6vw, 84px)",
        paddingBottom: "clamp(52px, 6vw, 84px)",
        backgroundColor: "transparent",
        color: "#FFFFFF",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 60% at 0% 40%, rgba(20,184,166,0.08) 0%, rgba(20,184,166,0) 60%)",
        }}
      />

      <div
        className="mx-auto px-6 md:px-10 lg:px-16 relative"
        style={{ maxWidth: "1100px" }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <TrendingUp size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "var(--fs-eyebrow)",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            Projected Savings
          </span>
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "24px",
            marginTop: "8px",
          }}
        >
          <SnapshotCard
            kicker="Your plan today"
            accent="#FF8A8A"
            rows={[
              {
                label: "Members at risk",
                display: formatNumber(data.identifiedMembers),
                color: "#FF8A8A",
              },
              {
                label: "Costing your plan",
                display: formatCurrency(planCost),
                color: "var(--covert-amber)",
              },
            ]}
          />
          <SnapshotCard
            kicker="With Covert"
            accent="var(--covert-teal)"
            rows={[
              {
                label: "Covert will save you",
                display: formatCurrency(savings),
                color: "var(--covert-teal)",
              },
              {
                label: "Members prevented from future risk",
                display: formatNumber(membersPrevented),
                color: "var(--covert-teal)",
              },
            ]}
          />
        </div>

        {/* Source note lives here, under the savings boxes (Jesse 7/9); the
            study citation was trimmed to its title only. */}
        <p
          className="italic"
          style={{
            fontSize: "var(--fs-caption)",
            color: "var(--on-dark-text-secondary)",
            marginTop: "24px",
            lineHeight: 1.6,
          }}
        >
          *Based on Covert client data. † Healthcare costs and utilization
          associated with high-risk prescription opioid use.
        </p>
      </div>
    </section>
  );
}

interface SnapshotRow {
  display: string;
  label: string;
  color: string;
}

interface SnapshotCardProps {
  kicker: string;
  accent: string;
  rows: SnapshotRow[];
}

function SnapshotCard({ kicker, accent, rows }: SnapshotCardProps) {
  return (
    <div
      className="min-w-0 h-full flex flex-col"
      style={{
        backgroundColor: "var(--on-dark-surface)",
        border: "1px solid var(--on-dark-border)",
        borderTop: `3px solid ${accent}`,
        borderRadius: "20px",
        padding: "clamp(24px, 3vw, 36px)",
      }}
    >
      <p
        className="font-bold uppercase"
        style={{
          fontSize: "var(--fs-eyebrow)",
          color: accent,
          letterSpacing: "0.14em",
        }}
      >
        {kicker}
      </p>

      {/* Equal-height rows so row N aligns across both cards. */}
      <div
        className="grid flex-1"
        style={{
          marginTop: "18px",
          gridTemplateRows: `repeat(${rows.length}, 1fr)`,
        }}
      >
        {/* Label above figure, both full width — inline figure+text squeezed
            the labels into one-word-per-line columns beside wide dollar
            figures (Steph 7/7). */}
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex flex-col justify-center min-w-0"
            style={{
              gap: "10px",
              padding: "18px 0",
              borderTop: i === 0 ? "none" : "1px solid var(--on-dark-border)",
            }}
          >
            <span
              className="font-medium"
              style={{
                fontSize: "var(--fs-lead)",
                lineHeight: 1.35,
                color: "#FFFFFF",
              }}
            >
              {row.label}
            </span>
            <span
              className="font-bold"
              style={{
                fontSize: "var(--fs-stat)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: row.color,
              }}
            >
              {row.display}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
