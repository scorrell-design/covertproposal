"use client";

import { Stethoscope } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import { PCRData } from "@/lib/types";
import { useCountUp } from "@/lib/hooks";

interface PrescriberPatternsProps {
  data: PCRData;
}

export default function PrescriberPatterns({ data }: PrescriberPatternsProps) {
  const { count: totalCount, ref: totalRef } = useCountUp(
    data.totalPrescribersWithOpioid,
  );
  const { count: flaggedCount, ref: flaggedRef } = useCountUp(
    data.identifiedPrescribers,
  );

  const flaggedPct =
    data.totalPrescribersWithOpioid > 0
      ? Math.round(
          (data.identifiedPrescribers / data.totalPrescribersWithOpioid) * 100,
        )
      : 0;

  return (
    <section style={{ padding: "64px 0", backgroundColor: "var(--covert-bg-secondary)" }}>
      <div className="mx-auto" style={{ maxWidth: "1100px", padding: "0 24px" }}>
        <SectionLabel icon={Stethoscope} text="Prescriber Patterns" />
        <h2 className="font-bold mt-2" style={{ fontSize: "28px", lineHeight: 1.25 }}>
          Not all prescribers are creating risk. These are.
        </h2>

        {/* Two large stats */}
        <div
          className="grid gap-8 mt-10 mb-10 text-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
        >
          <div ref={totalRef}>
            <p className="font-bold" style={{ fontSize: "64px", lineHeight: 1 }}>
              {totalCount}
            </p>
            <p
              className="mt-2"
              style={{ fontSize: "15px", color: "var(--covert-text-secondary)" }}
            >
              Total prescribers writing opioid Rx in your plan
            </p>
          </div>
          <div ref={flaggedRef}>
            <p
              className="font-bold"
              style={{ fontSize: "64px", lineHeight: 1, color: "var(--covert-red)" }}
            >
              {flaggedCount}
            </p>
            <p
              className="mt-2"
              style={{ fontSize: "15px", color: "var(--covert-text-secondary)" }}
            >
              Flagged for unsafe prescribing patterns — {flaggedPct}% of total
            </p>
          </div>
        </div>

        {/* Two-column cards */}
        <div
          className="grid gap-7"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {/* Chronic High-Risk */}
          <div
            className="bg-white"
            style={{
              borderLeft: "4px solid var(--covert-red)",
              borderRadius: "12px",
              padding: "28px",
              border: "1px solid var(--covert-border)",
              borderLeftWidth: "4px",
              borderLeftColor: "var(--covert-red)",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3 className="font-bold" style={{ fontSize: "18px", color: "var(--covert-red)" }}>
              Chronic High-Risk (1-Star)
            </h3>
            <p className="font-bold mt-3" style={{ fontSize: "56px", lineHeight: 1 }}>
              {data.chronicHighRisk}
            </p>
            <p
              className="mt-3"
              style={{ fontSize: "14px", color: "var(--covert-text-secondary)", lineHeight: 1.6 }}
            >
              Prescribers writing chronic refills to members with 3+ risk
              factors. These are the primary drivers of escalation in your
              population.
            </p>
          </div>

          {/* Common but Concerning */}
          <div
            className="bg-white"
            style={{
              borderLeft: "4px solid var(--covert-orange)",
              borderRadius: "12px",
              padding: "28px",
              border: "1px solid var(--covert-border)",
              borderLeftWidth: "4px",
              borderLeftColor: "var(--covert-orange)",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              className="font-bold"
              style={{ fontSize: "18px", color: "var(--covert-orange)" }}
            >
              Common but Concerning
            </h3>
            <p className="font-bold mt-3" style={{ fontSize: "56px", lineHeight: 1 }}>
              {data.commonButConcerning}
            </p>
            <p
              className="mt-3"
              style={{ fontSize: "14px", color: "var(--covert-text-secondary)", lineHeight: 1.6 }}
            >
              Prescribers exhibiting 1–2 risk indicators. Typically unaware of
              cumulative patient-level patterns. Highly responsive to targeted
              outreach.
            </p>
          </div>
        </div>

        <p
          className="mt-6 italic"
          style={{ fontSize: "12px", color: "var(--covert-text-secondary)" }}
        >
          Based on CDC-aligned prescribing risk factors. 1–4 star ratings map
          directly to frequency of high-risk behaviors.
        </p>
      </div>
    </section>
  );
}
