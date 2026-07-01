"use client";

import { Activity, Info } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import TickerCard from "@/components/shared/TickerCard";
import Reveal from "@/components/shared/Reveal";
import Stagger from "@/components/shared/Stagger";
import SplitFlapNumber from "@/components/shared/SplitFlapNumber";
import { PCRData } from "@/lib/types";
import {
  calcAvoidedMedicalSpend,
  calcProjectedOverdoseDeaths,
  calcProjectedAbuseAddiction,
} from "@/lib/calculations";
import { useState } from "react";

interface LiveRiskTickersProps {
  data: PCRData;
}

export default function LiveRiskTickers({ data }: LiveRiskTickersProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Per Jesse (6/29): every category is now shown as a MONTHLY figure — its
  // annual basis ÷ 12 — except the projected overdose-death box, which stays a
  // 12-month total and is pulled out below the rest.
  //
  // Box 1 (static): medical spend attributable to opioid withdrawal symptoms
  // (at-risk basis, identified members × $23,790) ÷ 12.
  const monthlyMedicalSpend = Math.round(
    calcAvoidedMedicalSpend(data.identifiedMembers) / 12,
  );
  // Box 2: newly identified at-risk members per month.
  const monthlyIdentified = Math.round(data.identifiedMembers / 12);
  // Box 3: members entering a path to abuse or addiction per month.
  const monthlyAbuseAddiction = Math.round(
    calcProjectedAbuseAddiction(data.identifiedMembers) / 12,
  );
  // Overdose deaths: members managing withdrawal ÷ 820, hidden < 300 members.
  // Kept as an annual (next-12-months) figure — not divided by 12.
  const overdoseDeaths = calcProjectedOverdoseDeaths(
    data.withdrawalSymptomMembers,
    data.totalPlanMembers,
  );

  return (
    <section
      className="w-full"
      style={{
        paddingTop: "clamp(52px, 6vw, 84px)",
        paddingBottom: "clamp(52px, 6vw, 84px)",
        backgroundColor: "transparent",
        color: "#FFFFFF",
      }}
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16" style={{ maxWidth: "1100px" }}>
       <Reveal>
        <div className="flex items-center gap-2" style={{ marginBottom: "24px" }}>
          <SectionLabel icon={Activity} text="Live Risk Tickers" />
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="flex items-center justify-center"
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                border: "1px solid var(--covert-text-secondary)",
                background: "none",
                cursor: "help",
                // SectionLabel carries a 16px bottom margin, which shifts its
                // text ~8px above the flex line-center; pull the icon up to match.
                marginTop: "-8px",
              }}
              aria-label="How tickers are calculated"
            >
              <Info size={11} style={{ color: "var(--covert-text-secondary)" }} />
            </button>
            {showTooltip && (
              <div
                className="absolute left-6 top-0 z-10 animate-fade-in"
                style={{
                  width: "280px",
                  padding: "12px 16px",
                  backgroundColor: "var(--covert-black)",
                  color: "rgba(255,255,255,0.9)",
                  borderRadius: "8px",
                  fontSize: "var(--fs-caption)",
                  lineHeight: 1.6,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                Tickers are calculated from your PCR data using CDC-aligned risk
                models and actuarial rates updated for 2026. The live cost
                ticker increments based on elapsed time since report generation.
              </div>
            )}
          </div>
        </div>

        {/* Urgency banner */}
        <div
          style={{
            marginBottom: "32px",
            backgroundColor: "var(--on-dark-surface)",
            border: "1px solid var(--on-dark-border)",
            borderLeft: "4px solid var(--covert-teal)",
            borderRadius: "12px",
            padding: "20px 24px",
          }}
        >
          <p
            style={{
              fontSize: "var(--fs-body)",
              lineHeight: 1.6,
              color: "var(--on-dark-text)",
            }}
          >
            Every month of inaction allows opioid risk to grow across your
            health plan.
          </p>
        </div>
       </Reveal>

        {/* Monthly ticker grid — each category broken down per month (Jesse 6/29).
            Cards cascade in one-by-one and their figures split-flap into place. */}
        <Stagger
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "24px",
          }}
        >
          {/* 1: Monthly medical spend */}
          <TickerCard
            value={monthlyMedicalSpend}
            prefix="$"
            label="Medical cost lost every month without action"
            sublabel="Medical spend attributable to opioid withdrawal symptoms, per month"
            borderColor="var(--covert-amber)"
            valueColor="var(--covert-amber)"
          />

          {/* 2: Newly identified at-risk members per month */}
          <TickerCard
            value={monthlyIdentified}
            label="Newly identified at-risk members"
            sublabel="Members entering elevated opioid risk each month"
            borderColor="var(--covert-teal)"
            valueColor="var(--covert-teal)"
          />

          {/* 3: Members entering a path to abuse/addiction per month */}
          <TickerCard
            value={monthlyAbuseAddiction}
            label="Members on a path to abuse or addiction"
            sublabel="New members each month"
            borderColor="#FF8A8A"
            valueColor="#FF8A8A"
          />
        </Stagger>

        {/* Projected overdose deaths — pulled out below, larger (Jesse 6/29).
            Annual (next-12-months) figure, not a monthly breakdown. */}
        {overdoseDeaths !== null && (
          <Reveal style={{ marginTop: "24px" }}>
            <div
              className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left"
              style={{
                backgroundColor: "var(--on-dark-surface)",
                border: "1px solid var(--on-dark-border)",
                borderTop: "3px solid #FFFFFF",
                borderRadius: "16px",
                padding: "clamp(32px, 5vw, 48px)",
                gap: "clamp(16px, 4vw, 48px)",
              }}
            >
              <p
                className="font-bold"
                style={{
                  fontSize: "var(--fs-display)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: "#FFFFFF",
                  flexShrink: 0,
                }}
              >
                <SplitFlapNumber value={overdoseDeaths} />
              </p>
              <p
                style={{
                  fontSize: "var(--fs-lead)",
                  lineHeight: 1.4,
                  color: "var(--on-dark-text)",
                  fontWeight: 500,
                  maxWidth: "520px",
                }}
              >
                health plan member{overdoseDeaths !== 1 ? "s" : ""} projected to
                die from opioid overdose in the next 12 months.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
