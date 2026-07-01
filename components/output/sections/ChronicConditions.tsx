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
import { useContainerWidth } from "@/lib/hooks";
import SplitFlapNumber from "@/components/shared/SplitFlapNumber";

interface ChronicConditionsProps {
  data: PCRData;
}

export default function ChronicConditions({ data }: ChronicConditionsProps) {
  const { ref: chartRef, width: chartWidth } = useContainerWidth();
  const sorted = [...data.chronicConditions].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count ?? 0;
  const chartHeight = 320;

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
              fontSize: "var(--fs-eyebrow)",
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
            fontSize: "var(--fs-h2)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            maxWidth: "780px",
          }}
        >
          Chronic disease and{" "}
          <span style={{ color: "var(--covert-teal)" }}>
            opioid withdrawal symptoms.
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
                  tick={{ fontSize: 13, fill: "rgba(255,255,255,0.55)" }}
                  stroke="rgba(255,255,255,0.15)"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 13, fill: "#FFFFFF" }}
                  stroke="rgba(255,255,255,0.15)"
                />
                <Tooltip
                  cursor={{ fill: "rgba(20,184,166,0.08)" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "var(--fs-caption)",
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
          <div className="min-w-0">
            <p
              className="font-bold"
              style={{
                fontSize: "var(--fs-stat-lg)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "var(--covert-teal)",
              }}
            >
              <SplitFlapNumber value={data.chronicCostFactors} />
            </p>
            <p
              className="font-semibold"
              style={{
                fontSize: "var(--fs-label)",
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
                fontSize: "var(--fs-caption)",
                color: "var(--on-dark-text-secondary)",
                marginTop: "12px",
                lineHeight: 1.6,
              }}
            >
              Comorbid substance-use disorders multiply chronic-condition costs{" "}
              <strong style={{ color: "#FF8A8A" }}>2–3×</strong>, and members
              with opioid use disorder cost roughly{" "}
              <strong style={{ color: "#FF8A8A" }}>$14,800</strong> more per
              year than matched peers.
            </p>
          </div>
        </div>

        <p
          className="italic"
          style={{
            fontSize: "var(--fs-caption)",
            color: "var(--on-dark-text-secondary)",
            marginTop: "32px",
          }}
        >
          Sources: Milliman, integrated medical–behavioral cost analysis (2018);
          Scarpati et al., American Journal of Managed Care (2017).
        </p>
      </div>
    </section>
  );
}
