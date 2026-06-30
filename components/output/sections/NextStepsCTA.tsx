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

        {/* ROI visual — the investment-to-return gap is the single most
            action-driving figure, so it leads the close as a proportional
            comparison rather than a buried bullet. */}
        <Reveal>
          <div
            style={{
              marginTop: "40px",
              backgroundColor: "var(--on-dark-surface)",
              border: "1px solid var(--on-dark-border)",
              borderTop: "3px solid var(--covert-teal)",
              borderRadius: "20px",
              padding: "clamp(28px, 4vw, 48px)",
            }}
          >
            <div
              className="grid items-center"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                gap: "clamp(28px, 4vw, 56px)",
              }}
            >
              <div>
                <span
                  className="font-bold uppercase"
                  style={{ fontSize: "12px", letterSpacing: "0.16em", color: "var(--covert-teal)" }}
                >
                  Projected 12-month return
                </span>
                <p
                  className="font-bold"
                  style={{
                    fontSize: "clamp(72px, 10vw, 124px)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                    color: "var(--covert-teal)",
                    marginTop: "12px",
                  }}
                >
                  {roi}:1
                </p>
                <p
                  style={{
                    fontSize: "clamp(16px, 1.8vw, 20px)",
                    color: "var(--on-dark-text)",
                    lineHeight: 1.45,
                    marginTop: "16px",
                    maxWidth: "var(--measure)",
                  }}
                >
                  Every <strong style={{ color: "#FFFFFF" }}>$1</strong> invested in
                  Covert prevents an estimated{" "}
                  <strong style={{ color: "var(--covert-teal)" }}>${roi}</strong> in
                  avoidable medical spend.
                </p>
              </div>

              <div>
                {/* $1 : $roi proportional bars — the gap is the message. */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                  <span style={{ width: "120px", flexShrink: 0, fontSize: "13px", color: "var(--on-dark-text-secondary)" }}>
                    $1 invested
                  </span>
                  <div style={{ flex: 1, height: "16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${100 / roi}%`, minWidth: "6px", borderRadius: "8px", backgroundColor: "#FF8A8A" }} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ width: "120px", flexShrink: 0, fontSize: "13px", color: "#FFFFFF", fontWeight: 600 }}>
                    ${roi} prevented
                  </span>
                  <div style={{ flex: 1, position: "relative" }}>
                    <div style={{ height: "16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "100%", borderRadius: "8px", background: "linear-gradient(90deg, var(--covert-teal-mid), var(--covert-teal))" }} />
                    </div>
                    {/* Break-even (1:1) reference — where return equals the $1 cost. */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: "-5px",
                        bottom: "-5px",
                        left: `${100 / roi}%`,
                        width: "0",
                        borderLeft: "2px dashed rgba(255,255,255,0.6)",
                      }}
                    />
                  </div>
                </div>
                <p style={{ fontSize: "12px", color: "var(--on-dark-text-muted)", marginTop: "10px", paddingLeft: "134px" }}>
                  ╎ Break-even (1:1) — projected return clears it ~{roi}×.
                </p>
                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--on-dark-border)" }}>
                  <p
                    className="font-bold"
                    style={{ fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: 1, letterSpacing: "-0.03em", color: "#FFFFFF" }}
                  >
                    {formatCurrency(netRoi)}
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--on-dark-text-secondary)", marginTop: "8px" }}>
                    net reduction in avoidable medical spend, year one
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Without / With comparison — two boxes cascade in */}
        <Stagger
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "20px",
            marginTop: "20px",
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
