"use client";

import { Scale } from "lucide-react";
import { formatCurrency, calcNetROI } from "@/lib/calculations";
import { PCRData } from "@/lib/types";

interface ComparisonDecisionProps {
  data: PCRData;
}

interface ColumnProps {
  heading: string;
  headingColor: string;
  accent: string;
  items: string[];
}

function Column({ heading, headingColor, accent, items }: ColumnProps) {
  return (
    <div
      className="min-w-0"
      style={{
        backgroundColor: "var(--on-dark-surface)",
        border: "1px solid var(--on-dark-border)",
        borderTop: `3px solid ${accent}`,
        borderRadius: "16px",
        padding: "28px",
      }}
    >
      <h3
        className="font-bold uppercase"
        style={{
          fontSize: "11px",
          color: headingColor,
          letterSpacing: "0.16em",
          marginBottom: "20px",
        }}
      >
        {heading}
      </h3>
      <ul className="flex flex-col" style={{ gap: "14px" }}>
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start min-w-0"
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              gap: "10px",
              color: "var(--on-dark-text-secondary)",
            }}
          >
            <span
              className="flex-shrink-0 rounded-full"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: accent,
                marginTop: "8px",
              }}
            />
            <span className="min-w-0" dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ComparisonDecision({ data }: ComparisonDecisionProps) {
  const netRoi = calcNetROI(data.withdrawalSymptomMembers, data.identifiedMembers);

  return (
    <section
      className="w-full"
      style={{
        paddingTop: "clamp(72px, 8vw, 112px)",
        paddingBottom: "clamp(72px, 8vw, 112px)",
        backgroundColor: "#0B0B0B",
        color: "#FFFFFF",
      }}
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16" style={{ maxWidth: "1100px" }}>
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <Scale size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "11px",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            What These Numbers Mean
          </span>
        </div>

        <h2
          className="font-bold"
          style={{
            fontSize: "clamp(28px, 3.2vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
          }}
        >
          The decision in front of{" "}
          <span style={{ color: "var(--covert-teal)" }}>you.</span>
        </h2>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <Column
            heading="Without Covert"
            headingColor="#FF8A8A"
            accent="#FF8A8A"
            items={[
              "Medical spend keeps growing",
              "Prescribers remain uncorrected",
              "Members escalate to higher risk",
              "Catastrophic events remain likely",
            ]}
          />

          <Column
            heading="With Covert — 12 Months"
            headingColor="var(--covert-teal)"
            accent="var(--covert-teal)"
            items={[
              "75% reduction in avoidable spend",
              "Prescriber behavior corrected at the source",
              "Members safely stepped down",
              "Catastrophic events prevented",
            ]}
          />

          <Column
            heading="The Difference"
            headingColor="#FFFFFF"
            accent="#FFFFFF"
            items={[
              `<strong style="color:#FFFFFF">${formatCurrency(netRoi)}</strong> net ROI`,
              "No utilization management",
              "No claims denial",
              "No member disruption",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
