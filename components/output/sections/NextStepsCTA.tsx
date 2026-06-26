"use client";

import CovertLogo from "@/components/shared/CovertLogo";
import { PCRData } from "@/lib/types";
import {
  calcCovertCost,
  calcNetROI,
  calcROIRatio,
  calcProjectedLivesSaved,
  calcProjectedOUDPrevented,
  formatCurrency,
  formatNumber,
} from "@/lib/calculations";

interface NextStepsCTAProps {
  data: PCRData;
}

/**
 * "The Decision & Next Steps" — merged closing section (Jesse 6/26 + expert).
 * Combines the former "What These Numbers Mean" comparison with the Next Steps
 * CTA so the report ends on one decisive beat instead of two overlapping ones.
 * The redundant ROI stat tile was dropped (ROI lives in the comparison's
 * "Difference" column).
 */
export default function NextStepsCTA({ data }: NextStepsCTAProps) {
  const netRoi = calcNetROI(data.identifiedMembers, data.membersWithOpioidRx);
  const roi = calcROIRatio(data.identifiedMembers, data.membersWithOpioidRx);
  const cost = calcCovertCost(data.membersWithOpioidRx);
  const oudPrevented = calcProjectedOUDPrevented(data.identifiedMembers);
  const livesSaved = calcProjectedLivesSaved(
    data.identifiedMembers,
    data.totalPlanMembers,
  );

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(80px, 9vw, 120px)",
        paddingBottom: "clamp(64px, 7vw, 96px)",
        backgroundColor: "var(--covert-black)",
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
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "11px",
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

        {/* Without / With / Difference comparison */}
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
              `<strong style="color:#FFFFFF">${formatCurrency(netRoi)}</strong> reduction in avoidable medical spend`,
              `<strong style="color:#FFFFFF">${roi}:1</strong> projected ROI`,
              "Improved member outcomes",
              "Safer opioid prescribing practices",
            ]}
          />
        </div>

        {/* Transition to action */}
        <div className="text-center" style={{ marginTop: "clamp(56px, 7vw, 88px)" }}>
          <h3
            className="font-bold"
            style={{
              fontSize: "clamp(24px, 2.8vw, 32px)",
              color: "#FFFFFF",
              lineHeight: 1.25,
              textWrap: "balance",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            Your plan has{" "}
            <span style={{ color: "var(--covert-teal)" }}>
              {formatNumber(data.identifiedMembers)} members
            </span>{" "}
            directly affected by the prescribing patterns above.
          </h3>

          <p
            style={{
              marginTop: "24px",
              fontSize: "16px",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.7,
              maxWidth: "720px",
              margin: "24px auto 0",
            }}
          >
            The data in this report represents real, actionable intelligence from
            your pharmacy claims. Covert&apos;s intervention model addresses
            prescriber behavior at its source, preventing the downstream costs —
            and the human cost — that compound year over year.
          </p>

          {/* CTA Button */}
          <div
            className="flex justify-center"
            data-cta-buttons
            style={{ marginTop: "36px" }}
          >
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
                padding: "16px 32px",
                fontSize: "15px",
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

          {/* Closing stat tiles (ROI tile dropped — it's in the comparison above) */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 220px), 1fr))`,
              gap: "16px",
              marginTop: "48px",
              textAlign: "left",
            }}
          >
            <StatTile
              value={formatCurrency(cost)}
              label="Annual Covert cost"
              sublabel={`${formatNumber(data.membersWithOpioidRx)} members on opioid Rx × $600`}
            />
            <StatTile
              value={formatNumber(oudPrevented)}
              label="Projected OUD cases prevented"
              sublabel="75% of identified at-risk members"
              emphasis="primary"
            />
            {livesSaved !== null && (
              <StatTile
                value={formatNumber(livesSaved)}
                label="Projected lives saved"
                sublabel="Based on CDC mortality + Covert intervention rate"
                emphasis="primary"
              />
            )}
          </div>

          {/* Attribution */}
          <div
            className="flex items-center justify-center"
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "13px",
              marginTop: "48px",
              gap: "12px",
            }}
          >
            <CovertLogo size={20} white showWordmark={false} />
            <span>
              © 2026 Clever Ventures, LLC · Prepared for {data.clientName}
            </span>
          </div>
        </div>
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

interface StatTileProps {
  value: string;
  label: string;
  sublabel?: string;
  emphasis?: "primary" | "neutral";
}

function StatTile({ value, label, sublabel, emphasis = "neutral" }: StatTileProps) {
  const accent = emphasis === "primary" ? "var(--covert-teal)" : "#FFFFFF";
  // Auto-shrink long values (e.g. "$6,656,400") so they stay on one line.
  const scale = value.length > 7 ? Math.max(7 / value.length, 0.55) : 1;
  const maxPx = Math.round(40 * scale);
  const minPx = Math.min(28, maxPx);
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: "12px",
        padding: "24px 20px",
        textAlign: "center",
      }}
    >
      <p
        className="font-bold"
        style={{
          fontSize: `clamp(${minPx}px, 3vw, ${maxPx}px)`,
          color: accent,
          lineHeight: 1.05,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.85)",
          marginTop: "10px",
          lineHeight: 1.45,
        }}
      >
        {label}
      </p>
      {sublabel && (
        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "6px",
            lineHeight: 1.4,
          }}
        >
          {sublabel}
        </p>
      )}
    </div>
  );
}
