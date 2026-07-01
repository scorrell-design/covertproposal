"use client";

import { Stethoscope } from "lucide-react";
import { PCRData } from "@/lib/types";
import { formatNumber } from "@/lib/calculations";
import SplitFlapNumber from "@/components/shared/SplitFlapNumber";

interface PrescriberPatternsProps {
  data: PCRData;
}

export default function PrescriberPatterns({ data }: PrescriberPatternsProps) {
  const flaggedPct =
    data.totalPrescribersWithOpioid > 0
      ? Math.round(
          (data.identifiedPrescribers / data.totalPrescribersWithOpioid) * 100,
        )
      : 0;

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
      {/* Subtle teal gradient wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 70% at 0% 20%, rgba(20,184,166,0.10) 0%, rgba(20,184,166,0) 60%)",
        }}
      />

      <div className="mx-auto px-6 md:px-10 lg:px-16 relative" style={{ maxWidth: "1100px" }}>
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <Stethoscope size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "var(--fs-eyebrow)",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            Prescribers Creating Risk
          </span>
        </div>

        <h2
          className="font-bold"
          style={{
            fontSize: "var(--fs-h2)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            maxWidth: "760px",
            textWrap: "balance",
          }}
        >
          Not all prescribers are creating risk.{" "}
          <span style={{ color: "var(--covert-teal)" }}>These are.</span>
        </h2>

        {/* Hero number — prescribers flagged for unsafe prescribing */}
        <div
          className="text-center min-w-0"
          style={{ marginTop: "56px", marginBottom: "56px" }}
        >
          <p
            className="font-bold"
            style={{
              fontSize: "var(--fs-display)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#FF8A8A",
            }}
          >
            <SplitFlapNumber value={data.identifiedPrescribers} />
          </p>
          <p
            style={{
              fontSize: "var(--fs-body)",
              color: "var(--on-dark-text-secondary)",
              marginTop: "16px",
              lineHeight: 1.5,
              maxWidth: "520px",
              margin: "16px auto 0",
            }}
          >
            Flagged for unsafe prescribing — {flaggedPct}% of opioid prescribers
          </p>
        </div>

        {/* Two-column cards */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "20px",
          }}
        >
          {/* Chronic Opioid Prescribers — hidden when the count is 0 */}
          {data.chronicOpioidPrescribers > 0 && (
          <div
            className="min-w-0"
            style={{
              borderRadius: "16px",
              padding: "28px",
              backgroundColor: "var(--on-dark-surface)",
              border: "1px solid var(--on-dark-border)",
              borderLeftWidth: "4px",
              borderLeftColor: "#FF8A8A",
            }}
          >
            <h3
              className="font-bold uppercase"
              style={{
                fontSize: "var(--fs-caption)",
                color: "#FF8A8A",
                letterSpacing: "0.16em",
              }}
            >
              Chronic Opioid Prescribers
            </h3>
            <p
              className="font-bold"
              style={{
                fontSize: "var(--fs-stat)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                marginTop: "12px",
                color: "#FFFFFF",
              }}
            >
              {formatNumber(data.chronicOpioidPrescribers)}
            </p>
            <p
              style={{
                fontSize: "var(--fs-label)",
                color: "var(--on-dark-text-secondary)",
                lineHeight: 1.6,
                marginTop: "16px",
              }}
            >
              Prescribers writing sustained, long-duration opioid regimens.
              These are the primary drivers of dependence and downstream
              escalation in your population.
            </p>
          </div>
          )}

          {/* Acute Opioid Prescribers — hidden when the count is 0 */}
          {data.acuteOpioidPrescribers > 0 && (
          <div
            className="min-w-0"
            style={{
              borderRadius: "16px",
              padding: "28px",
              backgroundColor: "var(--on-dark-surface)",
              border: "1px solid var(--on-dark-border)",
              borderLeftWidth: "4px",
              borderLeftColor: "#FFB36B",
            }}
          >
            <h3
              className="font-bold uppercase"
              style={{
                fontSize: "var(--fs-caption)",
                color: "#FFB36B",
                letterSpacing: "0.16em",
              }}
            >
              Acute Opioid Prescribers
            </h3>
            <p
              className="font-bold"
              style={{
                fontSize: "var(--fs-stat)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                marginTop: "12px",
                color: "#FFFFFF",
              }}
            >
              {formatNumber(data.acuteOpioidPrescribers)}
            </p>
            <p
              style={{
                fontSize: "var(--fs-label)",
                color: "var(--on-dark-text-secondary)",
                lineHeight: 1.6,
                marginTop: "16px",
              }}
            >
              Prescribers writing short-course opioids that initiate the
              dependence pathway. Typically unaware of cumulative patient-level
              patterns. Highly responsive to targeted outreach.
            </p>
          </div>
          )}
        </div>

        <p
          className="mt-6 italic"
          style={{ fontSize: "var(--fs-caption)", color: "var(--on-dark-text-muted)" }}
        >
          Based on CDC-aligned prescribing risk factors.
        </p>
      </div>
    </section>
  );
}
