"use client";

interface LabelWithDescriptionProps {
  label: string;
  description: string;
  separator?: "dash" | "break";
  labelColor?: string;
  descriptionColor?: string;
  labelSize?: string;
  descriptionSize?: string;
}

export default function LabelWithDescription({
  label,
  description,
  separator = "dash",
  labelColor = "var(--covert-black)",
  descriptionColor = "var(--covert-text-secondary)",
  labelSize = "var(--fs-label)",
  descriptionSize = "var(--fs-caption)",
}: LabelWithDescriptionProps) {
  if (separator === "break") {
    return (
      <div>
        <div
          className="font-semibold"
          style={{ fontSize: labelSize, color: labelColor }}
        >
          {label}
        </div>
        <div
          style={{
            marginTop: "4px",
            fontSize: descriptionSize,
            color: descriptionColor,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-2 flex-wrap min-w-0">
      <span
        className="font-semibold flex-shrink-0"
        style={{ fontSize: labelSize, color: labelColor }}
      >
        {label}
      </span>
      <span style={{ color: "var(--covert-border)", fontSize: descriptionSize }}>
        —
      </span>
      <span
        className="min-w-0"
        style={{
          fontSize: descriptionSize,
          color: descriptionColor,
          lineHeight: 1.5,
        }}
      >
        {description}
      </span>
    </div>
  );
}
