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
    <section className="w-full" style={{ padding: "80px 0", backgroundColor: "var(--covert-bg-secondary)" }}>
      <div className="mx-auto px-6 md:px-10 lg:px-16" style={{ maxWidth: "1100px" }}>
        <SectionLabel icon={Stethoscope} text="Prescriber Patterns" />
        <h2
          className="font-bold"
          style={{ fontSize: "28px", lineHeight: 1.25, marginTop: "8px" }}
        >
          Not all prescribers are creating risk. These are.
        </h2>

        {/* Two large stats */}
        <div
          className="grid text-center"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "32px",
            marginTop: "48px",
            marginBottom: "48px",
          }}
        >
          <div ref={totalRef} className="min-w-0">
            <p className="font-bold" style={{ fontSize: "64px", lineHeight: 1 }}>
              {totalCount}
            </p>
            <p
              style={{
                fontSize: "15px",
                color: "var(--covert-text-secondary)",
                marginTop: "12px",
              }}
            >
              Total prescribers writing opioid Rx in your plan
            </p>
          </div>
          <div ref={flaggedRef} className="min-w-0">
            <p
              className="font-bold"
              style={{ fontSize: "64px", lineHeight: 1, color: "var(--covert-red)" }}
            >
              {flaggedCount}
            </p>
            <p
              style={{
                fontSize: "15px",
                color: "var(--covert-text-secondary)",
                marginTop: "12px",
              }}
            >
              Flagged for unsafe prescribing patterns — {flaggedPct}% of total
            </p>
          </div>
        </div>

        {/* Two-column cards */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "28px",
          }}
        >
          {/* Chronic High-Risk */}
          <div
            className="bg-white min-w-0"
            style={{
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
            <p
              className="font-bold"
              style={{ fontSize: "56px", lineHeight: 1, marginTop: "16px" }}
            >
              {data.chronicHighRisk}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "var(--covert-text-secondary)",
                lineHeight: 1.6,
                marginTop: "16px",
              }}
            >
              Prescribers writing chronic refills to members with 3+ risk
              factors. These are the primary drivers of escalation in your
              population.
            </p>
          </div>

          {/* Common but Concerning */}
          <div
            className="bg-white min-w-0"
            style={{
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
            <p
              className="font-bold"
              style={{ fontSize: "56px", lineHeight: 1, marginTop: "16px" }}
            >
              {data.commonButConcerning}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "var(--covert-text-secondary)",
                lineHeight: 1.6,
                marginTop: "16px",
              }}
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
