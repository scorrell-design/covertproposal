"use client";

import { FileSearch } from "lucide-react";
import { PCRData } from "@/lib/types";
import { formatNumber } from "@/lib/calculations";

interface ExecutiveSummaryProps {
  data: PCRData;
}

export default function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
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
      <div className="mx-auto px-6 md:px-10 lg:px-16 relative" style={{ maxWidth: "1100px" }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]" style={{ gap: "48px" }}>
          {/* Left column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2" style={{ marginBottom: "12px" }}>
              <FileSearch size={14} style={{ color: "var(--covert-teal)" }} />
              <span
                className="font-bold uppercase"
                style={{
                  fontSize: "11px",
                  color: "var(--covert-teal)",
                  letterSpacing: "0.16em",
                }}
              >
                What the Data Shows
              </span>
            </div>

            <h2
              className="font-bold"
              style={{
                fontSize: "clamp(28px, 3.2vw, 40px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
              }}
            >
              {formatNumber(data.identifiedMembers)} members in your plan are on
              a trajectory that ends in{" "}
              <span style={{ color: "var(--covert-teal)" }}>preventable harm.</span>
            </h2>

            <div
              className="mt-6 flex flex-col gap-5"
              style={{
                fontSize: "16px",
                color: "var(--on-dark-text-secondary)",
                lineHeight: 1.7,
              }}
            >
              <p>
                Of your {formatNumber(data.totalPlanMembers)} covered lives,{" "}
                {formatNumber(data.membersWithOpioidRx)} are currently filling
                opioid prescriptions. Within that group,{" "}
                {formatNumber(data.identifiedMembers)} show clinical indicators
                of escalation — cross-location refills, multiple prescribers,
                early fills, dosages exceeding CDC guidance, and severe
                withdrawal symptoms.
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
            style={{ backgroundColor: "var(--on-dark-border)" }}
            className="hidden md:block"
          />

          {/* Right column */}
          <div className="flex items-center">
            <div
              className="w-full"
              style={{
                border: "1px solid var(--on-dark-border)",
                backgroundColor: "var(--on-dark-surface)",
                borderRadius: "16px",
                padding: "32px",
              }}
            >
              <span
                className="font-semibold uppercase"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.16em",
                  color: "var(--on-dark-text-muted)",
                }}
              >
                Upstream Cause
              </span>

              <p
                className="font-bold mt-3"
                style={{
                  fontSize: "72px",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: "#FFFFFF",
                }}
              >
                {data.identifiedPrescribers}
              </p>
              <p
                className="mt-2"
                style={{ fontSize: "16px", lineHeight: 1.5, color: "#FFFFFF" }}
              >
                prescribers are generating the risk in your member population.
              </p>
              <p
                className="mt-1 italic"
                style={{ fontSize: "14px", color: "var(--on-dark-text-muted)" }}
              >
                Not member behavior. Not chance.
              </p>

              <div
                className="my-4"
                style={{
                  height: "1px",
                  backgroundColor: "var(--on-dark-border)",
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
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.5,
                      color: "var(--on-dark-text-secondary)",
                    }}
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
