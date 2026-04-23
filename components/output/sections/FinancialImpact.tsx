"use client";

import { DollarSign } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
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
        style={{ fontSize, color, lineHeight: 1.1, wordBreak: "break-word" }}
      >
        {prefix}{count.toLocaleString()}
      </p>
      <p
        style={{
          fontSize: "14px",
          color: "var(--covert-text-secondary)",
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
    <section className="w-full" style={{ padding: "80px 0", backgroundColor: "var(--covert-bg)" }}>
      <div className="mx-auto px-6 md:px-10 lg:px-16" style={{ maxWidth: "1100px" }}>
        <SectionLabel icon={DollarSign} text="Clinical and Financial Impact" />
        <h2
          className="font-bold"
          style={{
            fontSize: "28px",
            lineHeight: 1.25,
            marginTop: "8px",
            textWrap: "balance",
          }}
        >
          The Cost of Doing Nothing. The Return of Correcting It.
        </h2>

        {/* Four stats row with dividers */}
        <div
          className="flex flex-wrap"
          style={{ gap: "0", marginTop: "48px", marginBottom: "40px" }}
        >
          <StatColumn
            value={exposure}
            label="Medical spend attributable to opioid withdrawal"
            color="var(--covert-red)"
            fontSize="38px"
          />
          <div
            className="hidden md:block self-stretch my-4"
            style={{ width: "1px", backgroundColor: "var(--covert-border)" }}
          />
          <StatColumn
            value={opioidCost}
            label="Plan cost per member currently prescribed an opioid"
            color="var(--covert-orange)"
            fontSize="32px"
          />
          <div
            className="hidden md:block self-stretch my-4"
            style={{ width: "1px", backgroundColor: "var(--covert-border)" }}
          />
          <StatColumn
            value={caseMgmt}
            label={`${data.identifiedMembers} cases × $400/case investment`}
            color="var(--covert-text-secondary)"
            fontSize="28px"
          />
          <div
            className="hidden md:block self-stretch my-4"
            style={{ width: "1px", backgroundColor: "var(--covert-border)" }}
          />
          <StatColumn
            value={netRoi}
            label="After Covert engagement — 75% reduction in preventable spend"
            color="var(--covert-green)"
            fontSize="44px"
          />
        </div>

        {/* Savings banner */}
        <div
          className="text-center"
          style={{
            backgroundColor: "var(--covert-teal)",
            color: "#FFFFFF",
            borderRadius: "10px",
            padding: "20px 32px",
            fontWeight: 600,
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          These savings are achieved without member disruption, utilization
          management, or claims denial — by correcting prescribing behavior at
          the source.
        </div>

        <p
          className="italic text-center"
          style={{
            fontSize: "15px",
            color: "var(--covert-text-secondary)",
            marginTop: "24px",
          }}
        >
          Every month of delay adds ~<strong>{formatCurrency(monthly)}</strong>{" "}
          to your plan&apos;s preventable spend.
        </p>
      </div>
    </section>
  );
}
