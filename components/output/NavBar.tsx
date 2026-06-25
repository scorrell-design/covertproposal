"use client";

import { useState } from "react";
import { ArrowLeft, Download, Loader2, Link2, Check } from "lucide-react";
import CovertLogo from "@/components/shared/CovertLogo";

interface NavBarProps {
  onBack?: () => void;
  onShare?: () => Promise<void> | void;
  onDownloadPDF: () => Promise<void>;
}

export default function NavBar({ onBack, onShare, onDownloadPDF }: NavBarProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shared, setShared] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await onDownloadPDF();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!onShare) return;
    await onShare();
    setShared(true);
    setTimeout(() => setShared(false), 2200);
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: "var(--covert-black)" }}
    >
      <div
        className="mx-auto flex items-center justify-between px-6 md:px-10 lg:px-16"
        style={{ height: "64px", maxWidth: "1100px" }}
      >
        <div className="flex items-center">
          <CovertLogo size={28} white showWordmark />
        </div>

        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-80"
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                cursor: "pointer",
                padding: "8px 12px",
              }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}

          {onShare && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 transition-opacity duration-150 hover:opacity-80"
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#FFFFFF",
                borderRadius: "999px",
                padding: "8px 16px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {shared ? (
                <>
                  <Check size={16} />
                  Link copied
                </>
              ) : (
                <>
                  <Link2 size={16} />
                  Share link
                </>
              )}
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 transition-colors duration-200"
            style={{
              backgroundColor: "var(--covert-teal)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "999px",
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: isGenerating ? "wait" : "pointer",
              opacity: isGenerating ? 0.8 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isGenerating)
                e.currentTarget.style.backgroundColor =
                  "var(--covert-teal-dark)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--covert-teal)";
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download size={16} />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
