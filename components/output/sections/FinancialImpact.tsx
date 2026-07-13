"use client";

import { DollarSign } from "lucide-react";
import { PCRData } from "@/lib/types";
import Reveal from "@/components/shared/Reveal";
import Stagger from "@/components/shared/Stagger";
import {
  calcAvoidableClaimsReduction,
  calcEstimatedLivesSaved,
  calcProjectedAbuseAddiction,
  calcProjectedChronicWithdrawal,
  calcProjectedOverdoseDeaths,
  calcTotalClaimsExposure,
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
  // Overdose deaths (Jesse 7/2): at-risk members × 0.0167 (CDC/SAMHSA 2023).
  const overdoseDeaths = calcProjectedOverdoseDeaths(
    data.identifiedMembers,
    data.totalPlanMembers,
  );
  // Last return row (Jesse 7/2): 75% of the estimated annual overdose deaths.
  const livesSaved = calcEstimatedLivesSaved(
    data.identifiedMembers,
    data.totalPlanMembers,
  );

  // The cost of doing nothing — annualized member harm.
  // Rows per Jesse 7/13: row 1 is 25% of the at-risk population, row 2 is the
  // remaining 75% (at-risk minus row 1), and row 3 is the Total Medical
  // Claims Exposure in dollars (total at-risk members × $23,790).
  const costRows: ImpactRow[] = [
    {
      display: formatNumber(calcProjectedAbuseAddiction(data.identifiedMembers)),
      label: "members abuse or become addicted to opioids",
      color: "#FF8A8A",
    },
    {
      display: formatNumber(
        calcProjectedChronicWithdrawal(data.identifiedMembers),
      ),
      label: "members experience chronic conditions and opioid withdrawal symptoms",
      color: "#FFB36B",
    },
    {
      display: formatCurrency(calcTotalClaimsExposure(data.identifiedMembers)),
      label: "total medical claims exposure caused by opioid overprescribing",
      // Brand amber — must match the same figure's stat in "What the Data Shows".
      color: "var(--covert-amber)",
    },
    ...(overdoseDeaths !== null
      ? [
          {
            display: formatNumber(overdoseDeaths),
            label: "estimated annual opioid overdose deaths",
            color: "#FFFFFF",
            emphasis: true,
          },
        ]
      : []),
  ];

  // The return of correcting it — each value is its basis × 0.75. Row 3 is
  // 75% of the Total Medical Claims Exposure shown opposite (Jesse 7/13) and
  // must always match the figure in the Decision close.
  const discontinue = Math.round(data.identifiedMembers * 0.75);
  const prescribersAdopting = Math.round(data.identifiedPrescribers * 0.75);
  const avoidableReduction = calcAvoidableClaimsReduction(data.identifiedMembers);

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
      label: "reduction in avoidable medical claims",
      color: "var(--covert-teal)",
    },
    ...(livesSaved !== null
      ? [
          {
            display: formatNumber(livesSaved),
            label: "estimated lives saved",
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
                fontSize: "var(--fs-eyebrow)",
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
              fontSize: "var(--fs-h2)",
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

        {/* Results banner — teal accent panel ("Savings"→"Results", Jesse 7/9) */}
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
              fontSize: "var(--fs-body)",
              lineHeight: 1.6,
              maxWidth: "880px",
              margin: "clamp(32px, 4vw, 48px) auto 0",
            }}
          >
            Results are achieved by correcting prescribing behavior at the
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
      className="min-w-0 h-full flex flex-col"
      style={{
        backgroundColor: "var(--on-dark-surface)",
        border: "1px solid var(--on-dark-border)",
        borderTop: `3px solid ${accent}`,
        borderRadius: "20px",
        padding: "clamp(28px, 3.5vw, 40px)",
      }}
    >
      {/* Fixed-height header so both cards' row regions start at the same line. */}
      <div style={{ minHeight: "104px" }}>
        <h3
          className="font-bold"
          style={{
            fontSize: "var(--fs-h3)",
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
            fontSize: "var(--fs-eyebrow)",
            color: "var(--on-dark-text-muted)",
            letterSpacing: "0.12em",
            marginTop: "8px",
          }}
        >
          {subhead}
        </p>
      </div>

      {/* Equal-height rows (1fr each) — with both cards stretched to the same
          height and the same row count, row N aligns across both cards. */}
      <div
        className="grid flex-1"
        style={{
          marginTop: "24px",
          gridTemplateRows: `repeat(${rows.length}, 1fr)`,
        }}
      >
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center min-w-0"
            style={{
              gap: "16px",
              borderTop: i === 0 ? "none" : "1px solid var(--on-dark-border)",
            }}
          >
            <span
              className="font-bold flex-shrink-0 text-right"
              style={{
                fontSize: row.emphasis
                  ? "var(--fs-stat)"
                  : "var(--fs-h3)",
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
                fontSize: "var(--fs-label)",
                lineHeight: 1.45,
                color: "var(--on-dark-text-secondary)",
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
