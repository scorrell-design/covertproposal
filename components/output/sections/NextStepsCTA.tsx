"use client";

import CovertLogo from "@/components/shared/CovertLogo";
import { PCRData } from "@/lib/types";
import {
  calcCovertCost,
  calcProjectedLivesSaved,
  calcProjectedOUDPrevented,
  calcROIRatio,
  formatCurrency,
  formatNumber,
} from "@/lib/calculations";

interface NextStepsCTAProps {
  data: PCRData;
}

interface StatTileProps {
  value: string;
  label: string;
  sublabel?: string;
  emphasis?: "primary" | "neutral";
}

function StatTile({ value, label, sublabel, emphasis = "neutral" }: StatTileProps) {
  const accent =
    emphasis === "primary" ? "var(--covert-teal)" : "#FFFFFF";
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
          fontSize: "clamp(30px, 3vw, 40px)",
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

export default function NextStepsCTA({ data }: NextStepsCTAProps) {
  // Cost basis (Jesse 6/3/26): members with an opioid Rx × $600.
  const cost = calcCovertCost(data.membersWithOpioidRx);
  const roi = calcROIRatio(data.identifiedMembers, data.membersWithOpioidRx);
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
        className="mx-auto text-center px-6 md:px-10 lg:px-16 relative"
        style={{ maxWidth: "1100px" }}
      >
        <span
          className="font-bold uppercase"
          style={{
            fontSize: "10px",
            color: "var(--covert-teal)",
            letterSpacing: "0.8px",
          }}
        >
          Next Steps
        </span>

        <h2
          className="font-bold"
          style={{
            fontSize: "32px",
            color: "#FFFFFF",
            lineHeight: 1.25,
            marginTop: "20px",
            textWrap: "balance",
          }}
        >
          Your plan has{" "}
          <span style={{ color: "var(--covert-teal)" }}>
            {formatNumber(data.identifiedMembers)} members
          </span>{" "}
          directly affected by the prescribing patterns above.
        </h2>

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
          <button
            className="flex items-center gap-2 transition-colors duration-200 font-semibold"
            style={{
              backgroundColor: "var(--covert-teal)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "999px",
              padding: "16px 32px",
              fontSize: "15px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--covert-teal-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--covert-teal)")
            }
          >
            Request Client Service Agreement →
          </button>
        </div>

        {/* Stat tiles */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${
              livesSaved !== null ? "200px" : "220px"
            }), 1fr))`,
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
            value={`${roi}:1`}
            label="Projected ROI"
            sublabel="Avoided medical spend ÷ Covert cost"
            emphasis="primary"
          />
          <StatTile
            value={formatNumber(oudPrevented)}
            label="Projected OUD cases prevented"
            sublabel="75% of identified at-risk members"
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
    </section>
  );
}
