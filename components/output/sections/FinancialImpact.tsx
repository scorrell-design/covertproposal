"use client";

import { DollarSign } from "lucide-react";
import { PCRData } from "@/lib/types";
import {
  calcAvoidedMedicalSpend,
  calcCovertCost,
  calcNetROI,
  calcPreventableSpend,
  calcMonthlyPreventable,
  calcProjectedAbuseAddiction,
  calcProjectedOverdoseDeaths,
  formatCurrency,
  formatNumber,
} from "@/lib/calculations";
import { useCountUp } from "@/lib/hooks";

interface FinancialImpactProps {
  data: PCRData;
}

interface StatColumnProps {
  value: number;
  label: string;
  color: string;
  /** Base font size in px; shrinks automatically for long figures. */
  fontSize: number;
  prefix?: string;
}

function StatColumn({ value, label, color, fontSize, prefix = "$" }: StatColumnProps) {
  const { count, ref } = useCountUp(value);

  // Keep the figure on one line: scale the font down as the final string grows
  // (e.g. "$74,138,860"), so big numbers never wrap inside the column.
  const finalStr = `${prefix}${value.toLocaleString()}`;
  const scale = finalStr.length > 9 ? Math.max(9 / finalStr.length, 0.58) : 1;
  const fontPx = Math.round(fontSize * scale);

  return (
    <div ref={ref} className="flex-1 min-w-0 text-center" style={{ padding: "16px 8px" }}>
      <p
        className="font-bold"
        style={{
          fontSize: `${fontPx}px`,
          color,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          whiteSpace: "nowrap",
        }}
      >
        {prefix}{count.toLocaleString()}
      </p>
      <p
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
          maxWidth: "240px",
          margin: "12px auto 0",
        }}
      >
        {label}
      </p>
    </div>
  );
}

export default function FinancialImpact({ data }: FinancialImpactProps) {
  // Per Jesse (6/26): exposure = identified members × $23,790; plan cost =
  // members currently on an opioid Rx × $600. The standalone "cost per member
  // prescribed an opioid" tile was removed.
  const exposure = calcAvoidedMedicalSpend(data.identifiedMembers);
  const planCost = calcCovertCost(data.membersWithOpioidRx);
  const netRoi = calcNetROI(data.identifiedMembers, data.membersWithOpioidRx);
  const preventable = calcPreventableSpend(data.identifiedMembers);
  const monthly = calcMonthlyPreventable(preventable);

  // Annualized member-impact figures (Jesse 5/28/26). The overdose figure is
  // suppressed when the plan is under 300 members.
  const overdoseDeaths = calcProjectedOverdoseDeaths(
    data.withdrawalSymptomMembers,
    data.totalPlanMembers,
  );
  const memberImpact = [
    {
      value: calcProjectedAbuseAddiction(data.identifiedMembers),
      label: "members become addicted to opioids",
      color: "#FF8A8A",
    },
    {
      value: data.withdrawalSymptomMembers,
      label: "members manage severe withdrawal symptoms",
      color: "#FFB36B",
    },
    {
      value: data.chronicCostFactors,
      label: "members experience worsening chronic conditions",
      color: "#FFFFFF",
    },
    ...(overdoseDeaths !== null
      ? [
          {
            value: overdoseDeaths,
            label: "members at risk of opioid overdose death",
            color: "var(--covert-teal)",
          },
        ]
      : []),
  ];

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(80px, 9vw, 120px)",
        paddingBottom: "clamp(80px, 9vw, 120px)",
        backgroundColor: "var(--covert-black)",
        color: "#FFFFFF",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 80% at 90% 0%, rgba(20,184,166,0.14) 0%, rgba(20,184,166,0) 60%), radial-gradient(50% 60% at 0% 100%, rgba(20,184,166,0.08) 0%, rgba(20,184,166,0) 60%)",
        }}
      />

      <div
        className="mx-auto px-6 md:px-10 lg:px-16 relative"
        style={{ maxWidth: "1100px" }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <DollarSign size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "11px",
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

        {/* Three stats row with dividers — order & contents per Jesse (6/26) */}
        <div
          className="flex flex-wrap"
          style={{ gap: "0", marginTop: "56px", marginBottom: "40px" }}
        >
          <StatColumn
            value={planCost}
            label="Plan investment to manage opioid risk"
            color="rgba(255,255,255,0.78)"
            fontSize={32}
          />
          <div
            className="hidden md:block self-stretch my-4"
            style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.12)" }}
          />
          <StatColumn
            value={exposure}
            label="Medical spend attributable to opioid withdrawal symptoms"
            color="#FF8A8A"
            fontSize={38}
          />
          <div
            className="hidden md:block self-stretch my-4"
            style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.12)" }}
          />
          <StatColumn
            value={netRoi}
            label="After Covert engagement — 75% reduction in preventable spend"
            color="var(--covert-teal)"
            fontSize={44}
          />
        </div>

        {/* Annualized member-impact row */}
        <div style={{ marginBottom: "40px" }}>
          <p
            className="font-semibold uppercase text-center"
            style={{
              fontSize: "11px",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
              marginBottom: "24px",
            }}
          >
            What this means for your members — annualized
          </p>
          <div
            className="grid"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: "16px",
            }}
          >
            {memberImpact.map((stat) => (
              <div
                key={stat.label}
                className="text-center min-w-0"
                style={{
                  backgroundColor: "var(--on-dark-surface)",
                  border: "1px solid var(--on-dark-border)",
                  borderRadius: "16px",
                  padding: "24px 20px",
                }}
              >
                <p
                  className="font-bold"
                  style={{
                    fontSize: "clamp(34px, 3.6vw, 46px)",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    color: stat.color,
                  }}
                >
                  {formatNumber(stat.value)}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--on-dark-text-secondary)",
                    lineHeight: 1.45,
                    marginTop: "12px",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Savings banner — teal accent panel */}
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
            margin: "0 auto",
          }}
        >
          Savings are achieved by correcting prescribing behavior at the
          source — not through member disruption, utilization management, or
          claims denials.
        </div>

        <p
          className="italic text-center"
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.55)",
            marginTop: "24px",
          }}
        >
          Every month of delay adds ~
          <strong style={{ color: "#FFFFFF" }}>{formatCurrency(monthly)}</strong>{" "}
          to your plan&apos;s preventable spend.
        </p>
      </div>
    </section>
  );
}
