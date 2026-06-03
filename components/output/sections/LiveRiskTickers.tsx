"use client";

import { Activity, Info } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import TealHighlight from "@/components/shared/TealHighlight";
import TickerCard from "@/components/shared/TickerCard";
import { useLiveTicker } from "@/lib/hooks";
import { PCRData } from "@/lib/types";
import {
  calcPreventableSpend,
  calcDailyCostOfInaction,
  calcProjectedOverdoseDeaths,
  calcProjectedAbuseAddiction,
  calcAtRiskCadence,
  formatCurrency,
} from "@/lib/calculations";
import { useState } from "react";

interface LiveRiskTickersProps {
  data: PCRData;
}

export default function LiveRiskTickers({ data }: LiveRiskTickersProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const preventable = calcPreventableSpend(data.withdrawalSymptomMembers);
  const dailyCost = calcDailyCostOfInaction(preventable);
  const accumulated = useLiveTicker(dailyCost);
  // Box 5 — overdose deaths: members managing withdrawal ÷ 820, hidden < 300 members.
  const overdoseDeaths = calcProjectedOverdoseDeaths(
    data.withdrawalSymptomMembers,
    data.totalPlanMembers,
  );
  const abuseAddiction = calcProjectedAbuseAddiction(data.identifiedMembers);
  const cadence = calcAtRiskCadence(data.identifiedMembers);
  // TODO(jesse): "break these down by month" — pending confirmation of which
  // figures to show as a per-month breakdown on this section.

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
                marginTop: "-4px",
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
                  fontSize: "12px",
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
              fontSize: "16px",
              lineHeight: 1.6,
              color: "var(--on-dark-text)",
            }}
          >
            Every day of inaction translates to{" "}
            <TealHighlight>{formatCurrency(dailyCost)}</TealHighlight> in
            preventable medical costs — your plan is subsidizing the
            consequences of upstream prescribing failures.
          </p>
        </div>

        {/* Ticker grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "24px",
          }}
        >
          {/* 1: Daily cost lost — live incrementing */}
          <TickerCard
            value={`$${(dailyCost + accumulated).toLocaleString()}`}
            label="Medical cost lost every day without action"
            borderColor="#DC2626"
            valueColor="#DC2626"
            animate={false}
            liveAccumulator={
              accumulated > 0
                ? `+ $${accumulated.toLocaleString()} since this report was generated`
                : undefined
            }
          />

          {/* 2: Preventable spend */}
          <TickerCard
            value={formatCurrency(preventable)}
            label="Preventable spend accumulating right now"
            borderColor="#F59E0B"
            valueColor="#F59E0B"
          />

          {/* 3: Members at elevated risk */}
          <TickerCard
            value={data.identifiedMembers}
            label="Members identified at elevated opioid risk"
            sublabel={`~${cadence.value} new at-risk patient${cadence.value !== 1 ? "s" : ""} every ${cadence.cadence}`}
            borderColor="var(--covert-teal)"
            valueColor="var(--covert-teal)"
          />

          {/* 4: Projected abuse/addiction */}
          <TickerCard
            value={abuseAddiction}
            label="Members on a path to abuse or addiction"
            borderColor="#FF8A8A"
            valueColor="#FF8A8A"
          />

          {/* 5: Projected overdose deaths (conditional — hidden < 300 members) */}
          {overdoseDeaths !== null && (
            <TickerCard
              value={overdoseDeaths}
              label="Health plan members projected to die from opioid overdose in the next 12 months"
              borderColor="#FFFFFF"
              valueColor="#FFFFFF"
            />
          )}
        </div>
      </div>
    </section>
  );
}
