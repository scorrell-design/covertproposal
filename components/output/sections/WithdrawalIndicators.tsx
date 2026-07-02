"use client";

import { Activity } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PCRData } from "@/lib/types";
import { formatNumber } from "@/lib/calculations";
import { useContainerWidth } from "@/lib/hooks";
import SplitFlapNumber from "@/components/shared/SplitFlapNumber";

interface WithdrawalIndicatorsProps {
  data: PCRData;
}

export default function WithdrawalIndicators({
  data,
}: WithdrawalIndicatorsProps) {
  const { ref: chartRef, width: chartWidth } = useContainerWidth();
  const sorted = [...data.wsiBreakdown]
    // Drop any symptom with a 0 count — an empty bar reads as a data error.
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count ?? 0;
  // Scale with the indicator count so every bar keeps a readable row height —
  // a fixed height made recharts drop every other category label (Jesse 7/1).
  const chartHeight = Math.max(320, sorted.length * 34);

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
        <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
          <Activity size={14} style={{ color: "var(--covert-teal)" }} />
          <span
            className="font-bold uppercase"
            style={{
              fontSize: "var(--fs-eyebrow)",
              color: "var(--covert-teal)",
              letterSpacing: "0.16em",
            }}
          >
            Withdrawal Symptom Indicators
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
          Prescribing patterns that{" "}
          <span style={{ color: "var(--covert-teal)" }}>mask or manage</span>{" "}
          active withdrawal
        </h2>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "minmax(240px, 1fr) 2fr",
            gap: "48px",
            marginTop: "48px",
            alignItems: "center",
          }}
        >
          {/* Hero stat */}
          <div className="min-w-0">
            <p
              className="font-bold"
              style={{
                fontSize: "var(--fs-stat-lg)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "#FF8A8A",
              }}
            >
              <SplitFlapNumber value={data.wsiUniqueMembers} />
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
              Uniquely identified members with severe withdrawal symptoms
              indicators
            </p>
            <p
              style={{
                fontSize: "var(--fs-caption)",
                color: "var(--on-dark-text-secondary)",
                marginTop: "12px",
                lineHeight: 1.6,
              }}
            >
              These aren&apos;t standalone scripts — they&apos;re cross-class
              prescribing patterns members use to manage opioid withdrawal. Some
              members carry more than one indicator.
            </p>
          </div>

          {/* Horizontal bar chart */}
          <div ref={chartRef} className="min-w-0" style={{ width: "100%", height: chartHeight }}>
            {chartWidth > 0 && (
              <BarChart
                width={chartWidth}
                height={chartHeight}
                data={sorted}
                layout="vertical"
                // Right margin fits the count label beside the longest bar.
                margin={{ top: 4, right: 56, left: 8, bottom: 4 }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="rgba(255,255,255,0.08)"
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 13, fill: "rgba(255,255,255,0.7)" }}
                  stroke="rgba(255,255,255,0.25)"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  // Wide enough for the longest PCR indicator name
                  // ("PhenothiazineAntihistamines") — 150px clipped it.
                  width={190}
                  // Force a tick per indicator — the default interval skips
                  // labels when they crowd, hiding every other symptom (Jesse 7/1).
                  interval={0}
                  tick={{
                    fontSize: 13,
                    fill: "#FFFFFF",
                  }}
                  stroke="rgba(255,255,255,0.25)"
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,138,138,0.08)" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "var(--fs-caption)",
                    color: "var(--covert-black)",
                  }}
                  itemStyle={{ color: "var(--covert-black)" }}
                  labelStyle={{ color: "var(--covert-black)", fontWeight: 600 }}
                  formatter={(v) => [`${formatNumber(Number(v))} Rx`, "Count"]}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {sorted.map((entry, idx) => {
                    // Keep a high opacity floor so every bar — including the
                    // smallest indicators — stays clearly visible (Jesse 6/29).
                    const opacity = 0.7 + (entry.count / max) * 0.3;
                    return (
                      <Cell
                        key={`cell-${idx}`}
                        fill="#FF8A8A"
                        fillOpacity={opacity}
                      />
                    );
                  })}
                  <LabelList
                    dataKey="count"
                    position="right"
                    fill="#FFFFFF"
                    fontSize={13}
                    formatter={(v) => formatNumber(Number(v))}
                  />
                </Bar>
              </BarChart>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
