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
  calcProjectedLivesLost,
  calcProjectedAbuseAddiction,
  calcAtRiskCadence,
  formatCurrency,
  formatNumber,
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
  const livesLost = calcProjectedLivesLost(
    data.identifiedMembers,
    data.totalPlanMembers,
  );
  const abuseAddiction = calcProjectedAbuseAddiction(data.identifiedMembers);
  const cadence = calcAtRiskCadence(data.identifiedMembers);

  return (
    <section style={{ padding: "64px 0", backgroundColor: "var(--covert-bg-secondary)" }}>
      <div className="mx-auto" style={{ maxWidth: "1100px", padding: "0 24px" }}>
        <div className="flex items-center gap-2 mb-6">
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
          className="mb-6"
          style={{
            backgroundColor: "var(--covert-bg)",
            border: "1px solid var(--covert-border)",
            borderLeft: "4px solid var(--covert-teal)",
            borderRadius: "8px",
            padding: "20px 24px",
          }}
        >
          <p style={{ fontSize: "16px", lineHeight: 1.6 }}>
            Every day of inaction translates to{" "}
            <TealHighlight>{formatCurrency(dailyCost)}</TealHighlight> in
            preventable medical costs — your plan is subsidizing the
            consequences of upstream prescribing failures.
          </p>
        </div>

        {/* Ticker grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
            label="Total members identified at elevated opioid risk"
            sublabel={`~${cadence.value} new at-risk patient${cadence.value !== 1 ? "s" : ""} every ${cadence.cadence}`}
            borderColor="var(--covert-teal)"
            valueColor="var(--covert-teal)"
          />

          {/* 4: Projected lives lost (conditional) */}
          {livesLost !== null && (
            <TickerCard
              value={livesLost}
              label="Lives projected to be lost in the next 12 months without intervention"
              borderColor="#000000"
              valueColor="#000000"
            />
          )}

          {/* 5: Projected abuse/addiction */}
          <TickerCard
            value={abuseAddiction}
            label="Identified members projected to develop abuse or addiction"
            borderColor="#991B1B"
            valueColor="#991B1B"
          />

          {/* 6: Avg days between catastrophic events (static) */}
          <TickerCard
            value="18 days"
            label="Industry average between catastrophic opioid events"
            borderColor="#6D7482"
            borderStyle="dashed"
            valueColor="#6D7482"
            animate={false}
          />
        </div>
      </div>
    </section>
  );
}
