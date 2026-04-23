"use client";

import { Scale } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import { formatCurrency, calcNetROI } from "@/lib/calculations";
import { PCRData } from "@/lib/types";

interface ComparisonDecisionProps {
  data: PCRData;
}

interface ColumnProps {
  heading: string;
  headingColor: string;
  bgColor: string;
  dotColor: string;
  items: string[];
}

function Column({ heading, headingColor, bgColor, dotColor, items }: ColumnProps) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderRadius: "12px",
        padding: "24px",
      }}
    >
      <h3
        className="font-bold"
        style={{ fontSize: "14px", color: headingColor, marginBottom: "16px" }}
      >
        {heading}
      </h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5"
            style={{ fontSize: "14px", lineHeight: 1.6 }}
          >
            <span
              className="mt-2 flex-shrink-0 rounded-full"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: dotColor,
              }}
            />
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ComparisonDecision({ data }: ComparisonDecisionProps) {
  const netRoi = calcNetROI(data.withdrawalSymptomMembers, data.identifiedMembers);

  return (
    <section style={{ padding: "64px 0", backgroundColor: "var(--covert-bg)" }}>
      <div className="mx-auto" style={{ maxWidth: "1100px", padding: "0 24px" }}>
        <SectionLabel icon={Scale} text="What These Numbers Mean" />
        <h2 className="font-bold mt-2" style={{ fontSize: "28px", lineHeight: 1.25 }}>
          The Decision in Front of You
        </h2>

        <div
          className="grid gap-5 mt-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          <Column
            heading="Without Covert"
            headingColor="var(--covert-red)"
            bgColor="var(--covert-red-light)"
            dotColor="var(--covert-red)"
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
            bgColor="var(--covert-teal-light)"
            dotColor="var(--covert-teal)"
            items={[
              "75% reduction in avoidable spend",
              "Prescriber behavior corrected at the source",
              "Members safely stepped down",
              "Catastrophic events prevented",
            ]}
          />

          <Column
            heading="The Difference"
            headingColor="var(--covert-green)"
            bgColor="var(--covert-green-light)"
            dotColor="var(--covert-green)"
            items={[
              `<strong>${formatCurrency(netRoi)}</strong> net ROI`,
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
