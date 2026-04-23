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
    <div ref={ref} className="flex-1 text-center py-4">
      <p className="font-bold" style={{ fontSize, color, lineHeight: 1.1 }}>
        {prefix}{count.toLocaleString()}
      </p>
      <p
        className="mt-2 mx-auto"
        style={{
          fontSize: "14px",
          color: "var(--covert-text-secondary)",
          lineHeight: 1.5,
          maxWidth: "200px",
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
    <section style={{ padding: "64px 0", backgroundColor: "var(--covert-bg)" }}>
      <div className="mx-auto" style={{ maxWidth: "1100px", padding: "0 24px" }}>
        <SectionLabel icon={DollarSign} text="Clinical and Financial Impact" />
        <h2 className="font-bold mt-2" style={{ fontSize: "28px", lineHeight: 1.25 }}>
          The Cost of Doing Nothing. The Return of Correcting It.
        </h2>

        {/* Four stats row with dividers */}
        <div
          className="flex flex-wrap mt-10 mb-8"
          style={{ gap: "0" }}
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
            padding: "16px 24px",
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
          className="mt-6 italic text-center"
          style={{ fontSize: "15px", color: "var(--covert-text-secondary)" }}
        >
          Every month of delay adds ~<strong>{formatCurrency(monthly)}</strong>{" "}
          to your plan&apos;s preventable spend.
        </p>
      </div>
    </section>
  );
}
