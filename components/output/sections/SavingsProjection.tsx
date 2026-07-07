"use client";

import { TrendingUp } from "lucide-react";
import { PCRData } from "@/lib/types";
import {
  calcAvoidableClaimsReduction,
  calcTotalClaimsExposure,
  formatCurrency,
  PREVENTABLE_REDUCTION_RATE,
} from "@/lib/calculations";
import SplitFlapNumber from "@/components/shared/SplitFlapNumber";

interface SavingsProjectionProps {
  data: PCRData;
}

/**
 * Savings snapshot directly under the hero (Jim 7/7/26): the first data the
 * reader sees is the at-risk count, what it costs the plan, and what Covert
 * saves. The savings figure is the plan cost × 0.75 — the same
 * calcAvoidableClaimsReduction shown in the Financial Impact table and the
 * Decision close, so all three always match. Members prevented from future
 * risk uses the same 75% reduction rate applied to the at-risk count.
 */
export default function SavingsProjection({ data }: SavingsProjectionProps) {
  const planCost = calcTotalClaimsExposure(data.chronicCostFactors);
  const savings = calcAvoidableClaimsReduction(data.chronicCostFactors);
  const membersPrevented = Math.round(
    data.identifiedMembers * PREVENTABLE_REDUCTION_RATE,
  );

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(52px, 6vw, 84px)",
        paddingBottom: "clamp(52px, 6vw, 84px)",
        backgroundColor: "transparent",
        color: "#FFFFFF",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 60% at 0% 40%, rgba(20,184,166,0.08) 0%, rgba(20,184,166,0) 60%)",
        }}
      />

      <div
        className="mx-auto px-6 md:px-10 lg:px-16 relative"
        style={{ maxWidth: "1100px" }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <TrendingUp size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "var(--fs-eyebrow)",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            Projected Savings
          </span>
        </div>

        {/* The problem in two tiles: how many members, at what cost. */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(16px, 2.5vw, 24px)",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--on-dark-surface)",
              border: "1px solid var(--on-dark-border)",
              borderRadius: "16px",
              padding: "clamp(22px, 2.5vw, 30px)",
            }}
          >
            <p
              className="font-bold"
              style={{
                fontSize: "var(--fs-stat)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "#FF8A8A",
              }}
            >
              <SplitFlapNumber value={data.identifiedMembers} />
            </p>
            <p
              style={{
                fontSize: "var(--fs-body)",
                color: "var(--on-dark-text-secondary)",
                lineHeight: 1.5,
                marginTop: "12px",
              }}
            >
              of your members are at risk
            </p>
          </div>

          <div
            style={{
              backgroundColor: "var(--on-dark-surface)",
              border: "1px solid var(--on-dark-border)",
              borderRadius: "16px",
              padding: "clamp(22px, 2.5vw, 30px)",
            }}
          >
            {/* Label above the figure, per Jim's 7/7 wireframe. */}
            <p
              style={{
                fontSize: "var(--fs-body)",
                color: "var(--on-dark-text-secondary)",
                lineHeight: 1.5,
              }}
            >
              Costing your plan
            </p>
            <p
              className="font-bold"
              style={{
                fontSize: "var(--fs-stat)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "var(--covert-amber)",
                marginTop: "12px",
              }}
            >
              {formatCurrency(planCost)}
            </p>
          </div>
        </div>

        {/* The payoff — Covert's savings and the members kept out of risk. */}
        <div style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
          <p
            className="font-semibold"
            style={{
              fontSize: "var(--fs-lead)",
              color: "#FFFFFF",
              lineHeight: 1.35,
            }}
          >
            Covert will save you
          </p>
          <p
            className="font-bold"
            style={{
              fontSize: "var(--fs-display)",
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              color: "var(--covert-teal)",
              marginTop: "16px",
            }}
          >
            <SplitFlapNumber value={savings} prefix="$" />
          </p>

          <p
            className="font-semibold"
            style={{
              fontSize: "var(--fs-lead)",
              color: "#FFFFFF",
              lineHeight: 1.35,
              marginTop: "clamp(28px, 3.5vw, 40px)",
            }}
          >
            and prevent
          </p>
          <p
            className="font-bold"
            style={{
              fontSize: "var(--fs-stat-lg)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "var(--covert-teal)",
              marginTop: "12px",
            }}
          >
            <SplitFlapNumber value={membersPrevented} />
          </p>
          <p
            style={{
              fontSize: "var(--fs-lead)",
              color: "var(--on-dark-text-secondary)",
              lineHeight: 1.5,
              maxWidth: "var(--measure)",
              marginTop: "12px",
            }}
          >
            of your plan members from being at risk in the future.
          </p>
        </div>
      </div>
    </section>
  );
}
