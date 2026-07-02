"use client";

import { FileSearch } from "lucide-react";
import { PCRData } from "@/lib/types";
import {
  calcTotalClaimsExposure,
  formatCurrency,
  formatNumber,
} from "@/lib/calculations";
import SplitFlapNumber from "@/components/shared/SplitFlapNumber";

interface ExecutiveSummaryProps {
  data: PCRData;
}

/**
 * "What the Data Shows" — the combined data section (Jesse 6/26).
 * Merges the former Prescription Utilization section into this one:
 * the headline graphic sits on top, the narrative follows, and two key
 * stat tiles close it out. The donut/pharmacy chart was dropped.
 */
export default function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  // Headline stat (Jesse 6/26): the plan's OWN share of opioid recipients
  // flagged with clinical risk indicators — computed, not a borrowed benchmark.
  const atRiskShare =
    data.membersWithOpioidRx > 0
      ? Math.round((data.identifiedMembers / data.membersWithOpioidRx) * 100)
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
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 60% at 100% 30%, rgba(20,184,166,0.08) 0%, rgba(20,184,166,0) 60%)",
        }}
      />

      <div
        className="mx-auto px-6 md:px-10 lg:px-16 relative"
        style={{ maxWidth: "1100px" }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <FileSearch size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "var(--fs-eyebrow)",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            What the Data Shows
          </span>
        </div>

        {/* Row 1 — at-risk share (left) balanced by the cost-multiplier
            comparison (right). Two distinct facts; no repeated figures. The
            5,028 at-risk count lives in the Member Risk Breakdown section. */}
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
            gap: "clamp(28px, 4vw, 56px)",
            marginTop: "8px",
          }}
        >
          <div>
            <p
              className="font-bold"
              style={{
                // Coral rather than brand teal so the risk reads instantly (Jesse 6/29).
                fontSize: "var(--fs-display)",
                lineHeight: 0.9,
                letterSpacing: "-0.05em",
                color: "#FF8A8A",
              }}
            >
              {atRiskShare}%
            </p>
            <p
              style={{
                fontSize: "var(--fs-lead)",
                color: "#FFFFFF",
                lineHeight: 1.35,
                maxWidth: "var(--measure)",
                fontWeight: 500,
                marginTop: "16px",
              }}
            >
              of your opioid recipients show clinical risk indicators driving
              avoidable medical spend
            </p>
          </div>

          {/* Cost-multiplier comparison — bar length carries the 6× (Knaflic). */}
          <div
            style={{
              backgroundColor: "var(--on-dark-surface)",
              border: "1px solid var(--on-dark-border)",
              borderRadius: "16px",
              padding: "clamp(22px, 2.5vw, 30px)",
            }}
          >
            <span
              className="font-bold uppercase"
              style={{ fontSize: "var(--fs-eyebrow)", letterSpacing: "0.14em", color: "var(--on-dark-text-muted)" }}
            >
              Medical cost vs. non-users
            </span>
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "var(--fs-caption)", color: "var(--on-dark-text-secondary)", width: "150px", flexShrink: 0 }}>
                  Non-users
                </span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ height: "12px", width: "16%", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.22)" }} />
                  <span style={{ fontSize: "var(--fs-caption)", color: "var(--on-dark-text-muted)" }}>1×</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "var(--fs-caption)", color: "#FFFFFF", width: "150px", flexShrink: 0 }}>
                  Chronic opioid users
                </span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ height: "12px", width: "92%", borderRadius: "6px", background: "linear-gradient(90deg, #FF8A8A, #FF6B6B)" }} />
                  <span style={{ fontSize: "var(--fs-label)", color: "#FF8A8A", fontWeight: 700 }}>6×</span>
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: "var(--fs-caption)",
                color: "var(--on-dark-text-secondary)",
                marginTop: "16px",
                lineHeight: 1.5,
              }}
            >
              Chronic opioid users incur roughly{" "}
              <strong style={{ color: "#FFFFFF" }}>6× more medical cost</strong>{" "}
              than non-users.<sup style={{ fontSize: "var(--fs-caption)" }}>*</sup>
            </p>
          </div>
        </div>

        <div
          aria-hidden
          style={{
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.12)",
            margin: "clamp(40px, 5vw, 64px) 0",
          }}
        />

        {/* Key finding — the at-risk population. Stands out as the section's
            focal number; the body refers back to it rather than restating it,
            and the tiered breakdown of this same 5,028 follows in the next
            section. */}
        <p
          className="font-bold"
          style={{
            fontSize: "var(--fs-display)",
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            color: "var(--covert-teal)",
          }}
        >
          <SplitFlapNumber value={data.identifiedMembers} />
        </p>

        <h2
          className="font-bold"
          style={{
            fontSize: "var(--fs-h2)",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            maxWidth: "820px",
            marginTop: "16px",
            textWrap: "balance",
          }}
        >
          members in your plan are on a trajectory that ends in{" "}
          <span style={{ color: "var(--covert-teal)" }}>preventable harm.</span>
        </h2>

        {/* Supporting narrative — one full-width block, single reading path
            (Steph 7/2: side-by-side columns left no clear place to start). */}
        <div
          className="flex flex-col"
          style={{
            gap: "16px",
            marginTop: "28px",
            fontSize: "var(--fs-body)",
            color: "var(--on-dark-text-secondary)",
            lineHeight: 1.7,
          }}
        >
          <p>
            {formatNumber(data.membersWithOpioidRx)} of your members are
            currently filling opioid prescriptions. The flagged group above
            shows clinical indicators of escalation — severe withdrawal
            symptoms, use of multiple pharmacy locations, multiple prescribers,
            early refills, and high dosage prescriptions.
          </p>
          <p>
            This is not random. This is the downstream effect of prescriber
            behavior operating without oversight. It is measurable,
            predictable, and correctable.
          </p>
        </div>

        <p
          className="italic"
          style={{
            fontSize: "var(--fs-caption)",
            color: "var(--on-dark-text-secondary)",
            marginTop: "32px",
            lineHeight: 1.6,
          }}
        >
          *Based on Covert client data. † Healthcare costs and utilization
          associated with high-risk prescription opioid use — a retrospective
          cohort study (PMC, 2018).
        </p>

        {/* Section close (Jesse 7/2): the plan's total avoidable medical spend
            directly under the references. Contained in an amber-accented card
            (mirrors the overdose pull-out) at stat-lg — a third naked
            display-size figure floating over the caption line above hijacked
            the reading flow (Steph 7/2). No reference mark on the stat itself
            — at stat size the † reads as a stray plus sign. */}
        <div
          className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left"
          style={{
            marginTop: "clamp(32px, 4vw, 48px)",
            backgroundColor: "var(--on-dark-surface)",
            border: "1px solid var(--on-dark-border)",
            borderTop: "3px solid var(--covert-amber)",
            borderRadius: "16px",
            padding: "clamp(28px, 4vw, 44px)",
            gap: "clamp(16px, 4vw, 48px)",
          }}
        >
          <p
            className="font-bold"
            style={{
              fontSize: "var(--fs-stat-lg)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "var(--covert-amber)",
              flexShrink: 0,
            }}
          >
            {formatCurrency(calcTotalClaimsExposure(data.chronicCostFactors))}
          </p>
          <div>
            <p
              className="font-semibold"
              style={{
                fontSize: "var(--fs-lead)",
                color: "#FFFFFF",
                lineHeight: 1.35,
              }}
            >
              Total avoidable medical spend
            </p>
            <p
              style={{
                fontSize: "var(--fs-label)",
                color: "var(--on-dark-text-secondary)",
                lineHeight: 1.6,
                maxWidth: "560px",
                marginTop: "10px",
              }}
            >
              The estimated medical spend attributable to your health plan
              members identified as at risk due to opioid overprescribing.
              This includes healthcare costs associated with opioid withdrawal
              symptoms and related healthcare utilization during the past 12
              months.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
