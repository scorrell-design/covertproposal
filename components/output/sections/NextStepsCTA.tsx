"use client";

import CovertLogo from "@/components/shared/CovertLogo";
import { PCRData } from "@/lib/types";
import {
  calcPreventableSpend,
  calcMonthlyPreventable,
  formatCurrency,
  formatNumber,
} from "@/lib/calculations";

interface NextStepsCTAProps {
  data: PCRData;
}

export default function NextStepsCTA({ data }: NextStepsCTAProps) {
  const preventable = calcPreventableSpend(data.withdrawalSymptomMembers);
  const monthly = calcMonthlyPreventable(preventable);

  return (
    <section
      style={{
        paddingTop: "80px",
        paddingBottom: "64px",
        backgroundColor: "var(--covert-black)",
      }}
    >
      <div
        className="mx-auto text-center"
        style={{ maxWidth: "760px", padding: "0 24px" }}
      >
        <span
          className="font-bold uppercase"
          style={{
            fontSize: "10px",
            color: "var(--covert-teal)",
            letterSpacing: "0.8px",
          }}
        >
          Next Steps
        </span>

        <h2
          className="font-bold mt-5"
          style={{
            fontSize: "32px",
            color: "#FFFFFF",
            lineHeight: 1.25,
          }}
        >
          Your plan has{" "}
          <span style={{ color: "var(--covert-teal)" }}>
            {formatNumber(data.identifiedMembers)} members
          </span>{" "}
          directly affected by the prescribing patterns above.
        </h2>

        <p
          className="mt-6"
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.7,
          }}
        >
          The data in this report represents real, actionable intelligence from
          your pharmacy claims — {formatNumber(data.identifiedMembers)}{" "}
          identified members, {formatNumber(data.identifiedPrescribers)}{" "}
          prescribers contributing to the pattern, and{" "}
          <strong>{formatCurrency(preventable)}</strong> in preventable annual
          spend. Every month of delay adds ~
          <strong>{formatCurrency(monthly)}</strong> to your exposure.
          Covert&apos;s intervention model addresses prescriber behavior at its
          source, preventing the downstream costs that compound year over year.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap justify-center gap-4 mt-8"
          data-cta-buttons
        >
          <button
            className="flex items-center gap-2 transition-colors duration-200 font-semibold"
            style={{
              backgroundColor: "var(--covert-teal)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "7px",
              padding: "14px 28px",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--covert-teal-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--covert-teal)")
            }
          >
            Engage Covert Today →
          </button>
          <button
            className="transition-opacity duration-200 hover:opacity-80 font-semibold"
            style={{
              backgroundColor: "transparent",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "7px",
              padding: "14px 28px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Schedule a Review
          </button>
        </div>

        {/* Attribution */}
        <div
          className="flex items-center justify-center gap-3 mt-10"
          style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}
        >
          <CovertLogo size={20} white showWordmark={false} />
          <span>
            © 2026 Clever Ventures, LLC · Prepared for {data.clientName}
          </span>
        </div>
      </div>
    </section>
  );
}
