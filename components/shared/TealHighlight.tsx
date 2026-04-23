"use client";

interface TealHighlightProps {
  children: React.ReactNode;
}

export default function TealHighlight({ children }: TealHighlightProps) {
  return (
    <span
      className="relative inline-block"
      style={{ paddingInline: "4px" }}
    >
      <span
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "3px",
          backgroundColor: "var(--covert-teal)",
          borderRadius: "2px",
        }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}
