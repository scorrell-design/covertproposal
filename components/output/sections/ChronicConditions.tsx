"use client";

import { HeartPulse } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PCRData } from "@/lib/types";
import { formatNumber } from "@/lib/calculations";
import { useCountUp, useContainerWidth } from "@/lib/hooks";

interface ChronicConditionsProps {
  data: PCRData;
}

export default function ChronicConditions({ data }: ChronicConditionsProps) {
  const { count, ref } = useCountUp(data.chronicCostFactors);
  const { ref: chartRef, width: chartWidth } = useContainerWidth();
  const sorted = [...data.chronicConditions].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count ?? 0;
  const chartHeight = 320;

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "clamp(72px, 8vw, 112px)",
        paddingBottom: "clamp(72px, 8vw, 112px)",
        backgroundColor: "var(--covert-black)",
        color: "#FFFFFF",
      }}
    >
      {/* Subtle teal gradient wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 70% at 100% 50%, rgba(20,184,166,0.08) 0%, rgba(20,184,166,0) 60%)",
        }}
      />

      <div className="mx-auto px-6 md:px-10 lg:px-16 relative" style={{ maxWidth: "1100px" }}>
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <HeartPulse size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "11px",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            Chronic Conditions Impacted by Opioids
          </span>
        </div>

        <h2
          className="font-bold"
          style={{
            fontSize: "clamp(28px, 3.2vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            maxWidth: "780px",
          }}
        >
          Opioid use is{" "}
          <span style={{ color: "var(--covert-teal)" }}>
            compounding chronic disease cost.
          </span>
        </h2>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "2fr minmax(240px, 1fr)",
            gap: "48px",
            marginTop: "48px",
            alignItems: "center",
          }}
        >
          {/* Horizontal bar chart */}
          <div ref={chartRef} className="min-w-0" style={{ width: "100%", height: chartHeight }}>
            {chartWidth > 0 && (
              <BarChart
                width={chartWidth}
                height={chartHeight}
                data={sorted}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "rgba(255,255,255,0.55)" }}
                  stroke="rgba(255,255,255,0.15)"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 12, fill: "#FFFFFF" }}
                  stroke="rgba(255,255,255,0.15)"
                />
                <Tooltip
                  cursor={{ fill: "rgba(20,184,166,0.08)" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "var(--covert-black)",
                  }}
                  itemStyle={{ color: "var(--covert-black)" }}
                  labelStyle={{ color: "var(--covert-black)", fontWeight: 600 }}
                  formatter={(v) => [`${formatNumber(Number(v))}`, "Members"]}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {sorted.map((entry, idx) => {
                    const opacity = 0.5 + (entry.count / max) * 0.5;
                    return (
                      <Cell
                        key={`cell-${idx}`}
                        fill="var(--covert-teal)"
                        fillOpacity={opacity}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            )}
          </div>

          {/* Hero stat */}
          <div ref={ref} className="min-w-0">
            <p
              className="font-bold"
              style={{
                fontSize: "clamp(64px, 7vw, 96px)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "var(--covert-teal)",
              }}
            >
              {formatNumber(count)}
            </p>
            <p
              className="font-semibold"
              style={{
                fontSize: "15px",
                color: "#FFFFFF",
                marginTop: "12px",
                lineHeight: 1.4,
              }}
            >
              Members experiencing worsening chronic conditions driven by
              opioid withdrawal
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "var(--on-dark-text-secondary)",
                marginTop: "12px",
                lineHeight: 1.6,
              }}
            >
              Substance-dependence co-morbidity drives chronic-condition cost
              up to <strong style={{ color: "#FF8A8A" }}>+367%</strong>{" "}
              versus baseline.
            </p>
          </div>
        </div>

        {/* Cost amplification callout */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
            gap: "12px",
            marginTop: "40px",
          }}
        >
          {[
            { condition: "Depression", amp: "+304%" },
            { condition: "Diabetes", amp: "+352%" },
            { condition: "Asthma", amp: "+82%" },
            { condition: "COPD", amp: "+359%" },
            { condition: "CAD", amp: "+147%" },
            { condition: "CHF", amp: "+367%" },
          ].map((item) => (
            <div
              key={item.condition}
              style={{
                borderRadius: "12px",
                padding: "16px 18px",
                backgroundColor: "var(--on-dark-surface)",
                border: "1px solid var(--on-dark-border)",
                textAlign: "center",
              }}
            >
              <p
                className="font-bold"
                style={{
                  fontSize: "24px",
                  color: "#FF8A8A",
                  letterSpacing: "-0.02em",
                }}
              >
                {item.amp}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--on-dark-text-secondary)",
                  marginTop: "4px",
                }}
              >
                {item.condition}
              </p>
            </div>
          ))}
        </div>

        <p
          className="italic"
          style={{
            fontSize: "11px",
            color: "var(--on-dark-text-muted)",
            marginTop: "16px",
          }}
        >
          Cost amplification source: Ingenix Consulting, 20M commercial plan
          lives — substance dependence co-morbidity vs. baseline.
        </p>
      </div>
    </section>
  );
}
