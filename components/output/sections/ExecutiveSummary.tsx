"use client";

import { FileSearch } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import { PCRData } from "@/lib/types";
import { formatNumber } from "@/lib/calculations";

interface ExecutiveSummaryProps {
  data: PCRData;
}

export default function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  return (
    <section className="w-full" style={{ padding: "64px 0", backgroundColor: "var(--covert-bg)" }}>
      <div className="mx-auto px-6 md:px-10 lg:px-16" style={{ maxWidth: "1100px" }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]" style={{ gap: "40px" }}>
          {/* Left column */}
          <div className="flex flex-col">
            <SectionLabel icon={FileSearch} text="What the Data Shows" />

            <h2
              className="font-bold"
              style={{ fontSize: "28px", lineHeight: 1.25 }}
            >
              {formatNumber(data.identifiedMembers)} members in your plan are on
              a trajectory that ends in preventable harm.
            </h2>

            <div
              className="mt-6 flex flex-col gap-5"
              style={{
                fontSize: "16px",
                color: "var(--covert-text-secondary)",
                lineHeight: 1.7,
              }}
            >
              <p>
                Of your {formatNumber(data.totalPlanMembers)} covered lives,{" "}
                {formatNumber(data.membersWithOpioidRx)} are currently filling
                opioid prescriptions. Within that group,{" "}
                {formatNumber(data.identifiedMembers)} show clinical indicators
                of escalation — cross-location refills, multiple prescribers,
                early fills, or dosages exceeding CDC guidance.
              </p>
              <p>
                This is not random. This is the downstream effect of prescriber
                behavior operating without oversight. It is measurable,
                predictable, and correctable.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{ backgroundColor: "var(--covert-border)" }}
            className="hidden md:block"
          />

          {/* Right column */}
          <div className="flex items-center">
            <div
              className="w-full"
              style={{
                border: "3px solid var(--covert-black)",
                borderRadius: "12px",
                padding: "28px",
              }}
            >
              <span
                className="font-semibold uppercase"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.8px",
                  color: "var(--covert-text-secondary)",
                }}
              >
                Upstream Cause
              </span>

              <p
                className="font-bold mt-3"
                style={{ fontSize: "72px", lineHeight: 1, color: "var(--covert-black)" }}
              >
                {data.identifiedPrescribers}
              </p>
              <p className="mt-2" style={{ fontSize: "16px", lineHeight: 1.5 }}>
                prescribers are generating the risk in your member population.
              </p>
              <p
                className="mt-1 italic"
                style={{ fontSize: "14px", color: "var(--covert-text-secondary)" }}
              >
                Not member behavior. Not chance.
              </p>

              <div
                className="my-4"
                style={{
                  height: "1px",
                  backgroundColor: "var(--covert-border)",
                }}
              />

              <ul className="flex flex-col gap-2.5">
                {[
                  "Cross-location refills in the same pharmacy chain",
                  "Early refills before therapeutic exhaustion",
                  "Multiple concurrent prescribers per patient",
                  "Dosages exceeding CDC guidance (>50 MME/day)",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5"
                    style={{ fontSize: "14px", lineHeight: 1.5 }}
                  >
                    <span
                      className="mt-1.5 flex-shrink-0 rounded-full"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: "var(--covert-teal)",
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
