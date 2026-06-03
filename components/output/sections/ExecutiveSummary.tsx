"use client";

import { FileSearch } from "lucide-react";
import { PCRData } from "@/lib/types";
import { formatNumber } from "@/lib/calculations";
import { useCountUp } from "@/lib/hooks";

interface ExecutiveSummaryProps {
  data: PCRData;
}

export default function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  const { count, ref } = useCountUp(data.identifiedMembers);

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
      <div
        className="mx-auto px-6 md:px-10 lg:px-16 relative"
        style={{ maxWidth: "1100px" }}
      >
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

        {/* Hero number — everything sits below it */}
        <p
          ref={ref}
          className="font-bold"
          style={{
            fontSize: "clamp(80px, 12vw, 160px)",
            lineHeight: 0.92,
            letterSpacing: "-0.05em",
            color: "var(--covert-teal)",
            marginTop: "8px",
          }}
        >
          {formatNumber(count)}
        </p>

        <h2
          className="font-bold"
          style={{
            fontSize: "clamp(28px, 3.2vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            maxWidth: "820px",
            marginTop: "20px",
            textWrap: "balance",
          }}
        >
          members in your plan are on a trajectory that ends in{" "}
          <span style={{ color: "var(--covert-teal)" }}>preventable harm.</span>
        </h2>

        <div
          className="mt-6 flex flex-col gap-5"
          style={{
            fontSize: "16px",
            color: "var(--on-dark-text-secondary)",
            lineHeight: 1.7,
            maxWidth: "820px",
          }}
        >
          <p>
            Of your {formatNumber(data.totalPlanMembers)} covered lives,{" "}
            {formatNumber(data.membersWithOpioidRx)} are currently filling
            opioid prescriptions. Within that group,{" "}
            {formatNumber(data.identifiedMembers)} show clinical indicators of
            escalation — severe withdrawal symptoms, cross-location refills,
            multiple prescribers, early refills, and dosages exceeding CDC
            guidance.
          </p>
          <p>
            This is not random. This is the downstream effect of prescriber
            behavior operating without oversight. It is measurable,
            predictable, and correctable.
          </p>
        </div>
      </div>
    </section>
  );
}
