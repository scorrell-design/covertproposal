"use client";

import { PCRData } from "@/lib/types";
import Reveal from "@/components/shared/Reveal";
import Stagger from "@/components/shared/Stagger";
import {
  calcNetROI,
  calcROIRatio,
  formatCurrency,
} from "@/lib/calculations";

interface NextStepsCTAProps {
  data: PCRData;
}

/**
 * "The Decision & Next Steps" — the report's close (Jesse 6/29).
 * Reduced to one decisive beat: the heading, three boxes of data
 * (Without / With / The Difference), and the Request button. Everything above
 * and below those elements was removed per Jesse.
 */
export default function NextStepsCTA({ data }: NextStepsCTAProps) {
  const netRoi = calcNetROI(data.identifiedMembers, data.membersWithOpioidRx);
  const roi = calcROIRatio(data.identifiedMembers, data.membersWithOpioidRx);

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(60px, 7vw, 92px)",
        paddingBottom: "clamp(52px, 6vw, 80px)",
        backgroundColor: "transparent",
      }}
    >
      {/* Subtle teal gradient wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 20%, rgba(20,184,166,0.14) 0%, rgba(20,184,166,0) 65%), radial-gradient(40% 50% at 100% 100%, rgba(20,184,166,0.08) 0%, rgba(20,184,166,0) 60%)",
        }}
      />
      <div
        className="mx-auto px-6 md:px-10 lg:px-16 relative"
        style={{ maxWidth: "1100px" }}
      >
        <Reveal>
          <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
            <span
              className="font-bold uppercase"
              style={{
                fontSize: "13px",
                color: "var(--covert-teal)",
                letterSpacing: "0.16em",
              }}
            >
              The Decision &amp; Next Steps
            </span>
          </div>

          <h2
            className="font-bold"
            style={{
              fontSize: "clamp(28px, 3.2vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              textWrap: "balance",
            }}
          >
            The decision in front of{" "}
            <span style={{ color: "var(--covert-teal)" }}>you.</span>
          </h2>
        </Reveal>

        {/* Without / With / Difference comparison — three boxes cascade in */}
        <Stagger
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
              `<strong style="color:#FFFFFF">${formatCurrency(netRoi)}</strong> reduction in avoidable medical spend`,
              `<strong style="color:#FFFFFF">${roi}:1</strong> projected ROI`,
              "Improved member outcomes",
              "Safer opioid prescribing practices",
            ]}
          />
        </Stagger>

        {/* Request button — the report's final beat (Jesse 6/29) */}
        <Reveal
          className="flex justify-center"
          style={{ marginTop: "clamp(48px, 6vw, 72px)" }}
        >
          <div className="flex justify-center" data-cta-buttons>
            <a
              href="https://covertplan.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors duration-200 font-semibold"
              style={{
                backgroundColor: "var(--covert-teal)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "999px",
                padding: "18px 40px",
                fontSize: "16px",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--covert-teal-dark)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--covert-teal)")
              }
            >
              Request Client Service Agreement →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
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
          fontSize: "12px",
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
            <span
              className="min-w-0"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
