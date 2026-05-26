"use client";

import { DollarSign } from "lucide-react";
import { PCRData } from "@/lib/types";
import {
  calcMedicalSpendFromWithdrawal,
  calcOpioidExposureCost,
  calcCaseManagementCost,
  calcNetROI,
  calcPreventableSpend,
  calcMonthlyPreventable,
  formatCurrency,
} from "@/lib/calculations";
import { useCountUp } from "@/lib/hooks";

interface FinancialImpactProps {
  data: PCRData;
}

interface StatColumnProps {
  value: number;
  label: string;
  color: string;
  fontSize: string;
  prefix?: string;
}

function StatColumn({ value, label, color, fontSize, prefix = "$" }: StatColumnProps) {
  const { count, ref } = useCountUp(value);

  return (
    <div ref={ref} className="flex-1 min-w-0 text-center" style={{ padding: "16px 8px" }}>
      <p
        className="font-bold"
        style={{
          fontSize,
          color,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          wordBreak: "break-word",
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
  const exposure = calcMedicalSpendFromWithdrawal(data.withdrawalSymptomMembers);
  const opioidCost = calcOpioidExposureCost(data.membersWithOpioidRx);
  const caseMgmt = calcCaseManagementCost(data.identifiedMembers);
  const netRoi = calcNetROI(data.withdrawalSymptomMembers, data.identifiedMembers);
  const preventable = calcPreventableSpend(data.withdrawalSymptomMembers);
  const monthly = calcMonthlyPreventable(preventable);

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

        {/* Four stats row with dividers */}
        <div
          className="flex flex-wrap"
          style={{ gap: "0", marginTop: "56px", marginBottom: "40px" }}
        >
          <StatColumn
            value={exposure}
            label="Medical spend attributable to opioid withdrawal"
            color="#FF8A8A"
            fontSize="38px"
          />
          <div
            className="hidden md:block self-stretch my-4"
            style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.12)" }}
          />
          <StatColumn
            value={opioidCost}
            label="Plan cost per member currently prescribed an opioid"
            color="#FFB36B"
            fontSize="32px"
          />
          <div
            className="hidden md:block self-stretch my-4"
            style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.12)" }}
          />
          <StatColumn
            value={caseMgmt}
            label="Plan cost per at-risk member"
            color="rgba(255,255,255,0.78)"
            fontSize="28px"
          />
          <div
            className="hidden md:block self-stretch my-4"
            style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.12)" }}
          />
          <StatColumn
            value={netRoi}
            label="After Covert engagement — 75% reduction in preventable spend"
            color="var(--covert-teal)"
            fontSize="44px"
          />
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
          These savings are achieved without member disruption, utilization
          management, or claims denial — by correcting prescribing behavior at
          the source.
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
