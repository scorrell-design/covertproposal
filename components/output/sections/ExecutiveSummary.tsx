"use client";

import { FileSearch } from "lucide-react";
import { PCRData } from "@/lib/types";
import { formatNumber } from "@/lib/calculations";
import { useCountUp } from "@/lib/hooks";

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
  const { count, ref } = useCountUp(data.identifiedMembers);

  // Headline stat (Jesse 6/26): the plan's OWN share of opioid recipients
  // flagged with clinical risk indicators — computed, not a borrowed benchmark.
  const atRiskShare =
    data.membersWithOpioidRx > 0
      ? Math.round((data.identifiedMembers / data.membersWithOpioidRx) * 100)
      : 0;
  const opioidPercentage =
    data.totalMembersWithAnyRx > 0
      ? Math.round(
          (data.membersWithOpioidRx / data.totalMembersWithAnyRx) * 100,
        )
      : 0;
  const withdrawalPercentage =
    data.membersWithOpioidRx > 0
      ? Math.round(
          (data.withdrawalSymptomMembers / data.membersWithOpioidRx) * 100,
        )
      : 0;

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(72px, 8vw, 112px)",
        paddingBottom: "clamp(72px, 8vw, 112px)",
        backgroundColor: "var(--covert-black)",
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
              fontSize: "11px",
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
              fontSize: "clamp(72px, 9vw, 120px)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              color: "var(--covert-teal)",
            }}
          >
            {atRiskShare}%
          </p>
          <p
            style={{
              fontSize: "clamp(18px, 2vw, 24px)",
              color: "#FFFFFF",
              lineHeight: 1.35,
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
            fontSize: "13px",
            color: "var(--on-dark-text-secondary)",
            marginTop: "16px",
            lineHeight: 1.5,
            maxWidth: "560px",
          }}
        >
          Chronic opioid users incur roughly{" "}
          <strong style={{ color: "#FFFFFF" }}>
            40% higher total medical cost
          </strong>{" "}
          than non-users.
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
          ref={ref}
          className="font-bold"
          style={{
            fontSize: "clamp(80px, 12vw, 160px)",
            lineHeight: 0.92,
            letterSpacing: "-0.05em",
            color: "var(--covert-teal)",
          }}
        >
          {formatNumber(count)}
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

        {/* Two key stat tiles — carried over from Prescription Utilization */}
        <div
          className="grid"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "20px",
            marginTop: "48px",
          }}
        >
          <StatTile
            eyebrow="Members with opioid Rx"
            eyebrowColor="var(--covert-teal)"
            value={data.membersWithOpioidRx.toLocaleString()}
            percent={`${opioidPercentage}%`}
            note="versus average of 10%"
            accent="var(--covert-teal)"
          />
          <StatTile
            eyebrow="Members with severe withdrawal symptoms"
            eyebrowColor="#FF8A8A"
            value={data.withdrawalSymptomMembers.toLocaleString()}
            percent={`${withdrawalPercentage}% of opioid Rx`}
            note="Identified via cross-class prescribing pattern analysis"
            accent="var(--covert-red)"
          />
        </div>

        <p
          className="italic"
          style={{
            fontSize: "11px",
            color: "var(--on-dark-text-muted)",
            marginTop: "24px",
            lineHeight: 1.5,
          }}
        >
          *Based on CDC-aligned prescribing risk factors. † Healthcare costs and
          utilization associated with high-risk prescription opioid use — a
          retrospective cohort study (PMC, 2018).
        </p>
      </div>
    </section>
  );
}

interface StatTileProps {
  eyebrow: string;
  eyebrowColor: string;
  value: string;
  percent: string;
  note: string;
  accent: string;
}

function StatTile({
  eyebrow,
  eyebrowColor,
  value,
  percent,
  note,
  accent,
}: StatTileProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--on-dark-surface)",
        border: "1px solid var(--on-dark-border)",
        borderRadius: "16px",
        padding: "22px 24px",
      }}
    >
      <p
        className="font-semibold uppercase"
        style={{
          fontSize: "11px",
          color: eyebrowColor,
          letterSpacing: "0.12em",
        }}
      >
        {eyebrow}
      </p>
      <div
        className="flex items-center"
        style={{ gap: "12px", marginTop: "10px", flexWrap: "wrap" }}
      >
        <span
          className="font-bold"
          style={{
            fontSize: "clamp(34px, 3.6vw, 46px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
          }}
        >
          {value}
        </span>
        <span
          className="inline-flex items-center justify-center font-semibold"
          style={{
            fontSize: "13px",
            color: "#FFFFFF",
            backgroundColor: accent,
            borderRadius: "999px",
            padding: "6px 14px",
            lineHeight: 1,
            minHeight: "26px",
            whiteSpace: "nowrap",
          }}
        >
          {percent}
        </span>
      </div>
      <p
        className="italic"
        style={{
          fontSize: "12px",
          color: "var(--on-dark-text-muted)",
          marginTop: "8px",
        }}
      >
        {note}
      </p>
    </div>
  );
}
