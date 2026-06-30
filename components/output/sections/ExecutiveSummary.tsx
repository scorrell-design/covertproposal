"use client";

import { FileSearch } from "lucide-react";
import { PCRData } from "@/lib/types";
import { formatNumber } from "@/lib/calculations";
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
              fontSize: "13px",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            What the Data Shows
          </span>
        </div>

        {/* Headline graphic (Jesse 6/26): the plan's own at-risk share, computed
            live, paired with a cited cost-multiplier benchmark. Replaces the old
            hardcoded "30% vs industry average of 30%" placeholder. */}
        <div
          className="flex flex-wrap items-center"
          style={{ gap: "clamp(16px, 2vw, 28px)", marginTop: "8px" }}
        >
          <p
            className="font-bold"
            style={{
              // Sized to match the at-risk hero number below it, and set in the
              // warning coral rather than brand teal so the risk reads instantly
              // (Jesse 6/29).
              fontSize: "clamp(80px, 12vw, 160px)",
              lineHeight: 0.92,
              letterSpacing: "-0.05em",
              color: "#FF8A8A",
            }}
          >
            {atRiskShare}%
          </p>
          <p
            style={{
              fontSize: "clamp(18px, 2vw, 26px)",
              color: "#FFFFFF",
              lineHeight: 1.3,
              maxWidth: "440px",
              fontWeight: 500,
            }}
          >
            of your opioid recipients show clinical risk indicators driving
            avoidable medical spend
          </p>
        </div>
        <p
          style={{
            fontSize: "16px",
            color: "var(--on-dark-text-secondary)",
            marginTop: "20px",
            lineHeight: 1.55,
            maxWidth: "560px",
          }}
        >
          Chronic opioid users incur roughly{" "}
          <strong style={{ color: "#FFFFFF" }}>6x more medical cost</strong> than
          non-users.
          <sup style={{ fontSize: "9px" }}>†</sup>
        </p>

        <div
          aria-hidden
          style={{
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.12)",
            margin: "clamp(40px, 5vw, 64px) 0",
          }}
        />

        {/* Hero number — the at-risk population */}
        <p
          className="font-bold"
          style={{
            fontSize: "clamp(80px, 12vw, 160px)",
            lineHeight: 0.92,
            letterSpacing: "-0.05em",
            color: "var(--covert-teal)",
          }}
        >
          <SplitFlapNumber value={data.identifiedMembers} />
        </p>

        <h2
          className="font-bold"
          style={{
            fontSize: "clamp(28px, 3.2vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            maxWidth: "820px",
            marginTop: "20px",
            textWrap: "balance",
          }}
        >
          members in your plan are on a trajectory that ends in{" "}
          <span style={{ color: "var(--covert-teal)" }}>preventable harm.</span>
        </h2>

        <div
          className="mt-6 flex flex-col gap-5"
          style={{
            fontSize: "16px",
            color: "var(--on-dark-text-secondary)",
            lineHeight: 1.7,
            maxWidth: "820px",
          }}
        >
          <p>
            {formatNumber(data.membersWithOpioidRx)} of your members are
            currently filling opioid prescriptions. Within that group,{" "}
            {formatNumber(data.identifiedMembers)} show clinical indicators of
            escalation — severe withdrawal symptoms, cross-location refills,
            multiple prescribers, early refills, and dosages exceeding CDC
            guidance.
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
            fontSize: "13px",
            color: "var(--on-dark-text-secondary)",
            marginTop: "32px",
            lineHeight: 1.6,
          }}
        >
          *Based on Covert client data. † Healthcare costs and utilization
          associated with high-risk prescription opioid use — a retrospective
          cohort study (PMC, 2018).
        </p>
      </div>
    </section>
  );
}
