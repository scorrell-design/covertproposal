"use client";

import { DollarSign } from "lucide-react";
import { PCRData } from "@/lib/types";
import Reveal from "@/components/shared/Reveal";
import Stagger from "@/components/shared/Stagger";
import {
  calcPreventableSpend,
  calcProjectedAbuseAddiction,
  calcProjectedOverdoseDeaths,
  formatCurrency,
  formatNumber,
} from "@/lib/calculations";

interface FinancialImpactProps {
  data: PCRData;
}

interface ImpactRow {
  display: string;
  label: string;
  color: string;
  emphasis?: boolean;
}

/**
 * "The cost of doing nothing. The return of correcting it." (Jesse 6/29)
 *
 * Restructured into two mirrored blocks so the data reads cleanly instead of
 * blending dollar stats and member counts. The left block annualizes member
 * harm if nothing changes; the right block annualizes the return once Covert
 * corrects prescribing at the source (each return = its basis × 0.75, the
 * preventable-reduction rate).
 */
export default function FinancialImpact({ data }: FinancialImpactProps) {
  const overdoseDeaths = calcProjectedOverdoseDeaths(
    data.withdrawalSymptomMembers,
    data.totalPlanMembers,
  );

  // The cost of doing nothing — annualized member harm.
  const costRows: ImpactRow[] = [
    {
      display: formatNumber(calcProjectedAbuseAddiction(data.identifiedMembers)),
      label: "members become addicted to opioids",
      color: "#FF8A8A",
    },
    {
      display: formatNumber(data.withdrawalSymptomMembers),
      label: "members begin managing severe withdrawal symptoms",
      color: "#FFB36B",
    },
    {
      display: formatNumber(data.chronicCostFactors),
      label: "members experience chronic conditions and opioid withdrawal symptoms",
      color: "#FCD34D",
    },
    ...(overdoseDeaths !== null
      ? [
          {
            display: formatNumber(overdoseDeaths),
            label: `member${overdoseDeaths !== 1 ? "s die" : " dies"} of an opioid overdose`,
            color: "#FFFFFF",
            emphasis: true,
          },
        ]
      : []),
  ];

  // The return of correcting it — each value is its basis × 0.75.
  const discontinue = Math.round(data.identifiedMembers * 0.75);
  const prescribersAdopting = Math.round(data.identifiedPrescribers * 0.75);
  const avoidableReduction = calcPreventableSpend(data.identifiedMembers);

  const returnRows: ImpactRow[] = [
    {
      display: formatNumber(discontinue),
      label:
        "members safely discontinue use before their risk escalates to abuse or addiction",
      color: "var(--covert-teal)",
    },
    {
      display: formatNumber(prescribersAdopting),
      label: "prescribers adopt CDC Best Practices",
      color: "var(--covert-teal)",
    },
    {
      display: formatCurrency(avoidableReduction),
      label: "reduction in avoidable medical spend",
      color: "var(--covert-teal)",
    },
    ...(overdoseDeaths !== null
      ? [
          {
            display: formatNumber(overdoseDeaths),
            label: `${overdoseDeaths !== 1 ? "lives" : "life"} saved`,
            color: "var(--covert-teal)",
            emphasis: true,
          },
        ]
      : []),
  ];

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(60px, 7vw, 92px)",
        paddingBottom: "clamp(60px, 7vw, 92px)",
        backgroundColor: "transparent",
        color: "#FFFFFF",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 80% at 90% 0%, rgba(20,184,166,0.14) 0%, rgba(20,184,166,0) 60%), radial-gradient(50% 60% at 0% 100%, rgba(255,138,138,0.08) 0%, rgba(255,138,138,0) 60%)",
        }}
      />

      <div
        className="mx-auto px-6 md:px-10 lg:px-16 relative"
        style={{ maxWidth: "1100px" }}
      >
        <Reveal>
          <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
            <DollarSign size={14} style={{ color: "var(--covert-teal)" }} />
            <span
              className="font-bold uppercase"
              style={{
                fontSize: "13px",
                color: "var(--covert-teal)",
                letterSpacing: "0.16em",
              }}
            >
              Clinical and Financial Impact
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
              maxWidth: "760px",
            }}
          >
            The cost of doing nothing.{" "}
            <span style={{ color: "var(--covert-teal)" }}>
              The return of correcting it.
            </span>
          </h2>
        </Reveal>

        {/* Two mirrored blocks — cascade in side by side */}
        <Stagger
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "24px",
            marginTop: "clamp(40px, 5vw, 56px)",
          }}
          step={140}
        >
          <ImpactCard
            heading="The cost of doing nothing."
            subhead="What this means for your members — annualized"
            accent="#FF8A8A"
            rows={costRows}
          />
          <ImpactCard
            heading="The return of correcting it."
            subhead="What Covert delivers in the first 12 months"
            accent="var(--covert-teal)"
            rows={returnRows}
          />
        </Stagger>

        {/* Savings banner — teal accent panel */}
        <Reveal>
          <div
            className="text-center"
            style={{
              backgroundColor: "rgba(20,184,166,0.12)",
              border: "1px solid rgba(20,184,166,0.35)",
              color: "#FFFFFF",
              borderRadius: "16px",
              padding: "24px 32px",
              fontWeight: 500,
              fontSize: "15px",
              lineHeight: 1.6,
              maxWidth: "880px",
              margin: "clamp(32px, 4vw, 48px) auto 0",
            }}
          >
            Savings are achieved by correcting prescribing behavior at the
            source — not through member disruption, utilization management, or
            claims denials.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

interface ImpactCardProps {
  heading: string;
  subhead: string;
  accent: string;
  rows: ImpactRow[];
}

function ImpactCard({ heading, subhead, accent, rows }: ImpactCardProps) {
  return (
    <div
      className="min-w-0"
      style={{
        backgroundColor: "var(--on-dark-surface)",
        border: "1px solid var(--on-dark-border)",
        borderTop: `3px solid ${accent}`,
        borderRadius: "20px",
        padding: "clamp(28px, 3.5vw, 40px)",
      }}
    >
      <h3
        className="font-bold"
        style={{
          fontSize: "clamp(20px, 2.2vw, 26px)",
          letterSpacing: "-0.02em",
          color: accent,
          lineHeight: 1.15,
        }}
      >
        {heading}
      </h3>
      <p
        className="font-semibold uppercase"
        style={{
          fontSize: "12px",
          color: "var(--on-dark-text-muted)",
          letterSpacing: "0.12em",
          marginTop: "8px",
        }}
      >
        {subhead}
      </p>

      <div
        className="flex flex-col"
        style={{ marginTop: "28px", gap: "20px" }}
      >
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-baseline min-w-0"
            style={{
              gap: "16px",
              paddingTop: i === 0 ? 0 : "20px",
              borderTop:
                i === 0 ? "none" : "1px solid var(--on-dark-border)",
            }}
          >
            <span
              className="font-bold flex-shrink-0 text-right"
              style={{
                fontSize: row.emphasis
                  ? "clamp(36px, 4vw, 52px)"
                  : "clamp(28px, 3vw, 40px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: row.color,
                minWidth: "clamp(72px, 9vw, 116px)",
              }}
            >
              {row.display}
            </span>
            <span
              className="min-w-0"
              style={{
                fontSize: "14px",
                lineHeight: 1.45,
                color: "var(--on-dark-text-secondary)",
                alignSelf: "center",
              }}
            >
              {row.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
