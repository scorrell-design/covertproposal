"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputScreen, { GenerateOptions } from "@/components/input/InputScreen";
import OutputProposal from "@/components/output/OutputProposal";
import CovertLogo from "@/components/shared/CovertLogo";
import { PCRData, AppScreen } from "@/lib/types";
import { DEMO_DATA } from "@/lib/demoData";
import { Check, Loader2 } from "lucide-react";

const GENERATION_STEPS = [
  "Reading the PCR",
  "Identifying risk patterns",
  "Extracting financial figures",
  "Generating proposal",
];

export default function Home() {
  const router = useRouter();
  const [screen, setScreen] = useState<AppScreen>("input");
  const [data, setData] = useState<PCRData | null>(null);
  const [generationStep, setGenerationStep] = useState(0);
  // Demo runs as a client-only preview; a real upload is saved to the DB.
  const [isDemo, setIsDemo] = useState(false);

  // Deep-link demo output for QA: visit ?preview=output
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "output") {
      setData(DEMO_DATA);
      setIsDemo(true);
      setScreen("output");
    }
  }, []);

  const handleGenerate = async (pcrData: PCRData, opts: GenerateOptions) => {
    setData(pcrData);
    setIsDemo(opts.isDemo);
    setScreen("generating");
    setGenerationStep(0);

    if (opts.isDemo) return; // animation effect transitions to the preview

    // Real proposal: persist it, then open the saved view.
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: pcrData.clientName,
          preparedFor: pcrData.preparedFor,
          pcrData,
          provenance: opts.provenance,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Could not save the proposal.");
      }
      const { id } = (await res.json()) as { id: string };
      router.push(`/proposals/${id}`);
    } catch {
      // Fall back to a local preview so work isn't lost if the save fails.
      setScreen("output");
    }
  };

  useEffect(() => {
    // Only the demo/preview path auto-advances to the in-page output; a real
    // save navigates to /proposals/[id] when the request resolves.
    if (screen !== "generating" || !isDemo) return;

    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev >= GENERATION_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setScreen("output"), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [screen, isDemo]);

  const handleBack = () => {
    setScreen("input");
    window.scrollTo(0, 0);
  };

  if (screen === "generating") {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center mx-auto"
        style={{ backgroundColor: "var(--covert-bg)" }}
      >
        <div className="flex flex-col items-center gap-8">
          <CovertLogo size={40} />
          <div className="flex flex-col gap-4" style={{ minWidth: "320px" }}>
            {GENERATION_STEPS.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-3"
                style={{
                  opacity: i <= generationStep ? 1 : 0.3,
                  transition: "opacity 0.3s ease",
                }}
              >
                {i < generationStep ? (
                  <Check size={18} style={{ color: "var(--covert-teal)" }} />
                ) : i === generationStep ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                    style={{ color: "var(--covert-teal)" }}
                  />
                ) : (
                  <div style={{ width: "18px", height: "18px" }} />
                )}
                <span
                  className={i <= generationStep ? "font-semibold" : ""}
                  style={{
                    fontSize: "15px",
                    color:
                      i <= generationStep
                        ? "var(--covert-black)"
                        : "var(--covert-text-secondary)",
                  }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "output" && data) {
    return <OutputProposal data={data} onBack={handleBack} />;
  }

  return <InputScreen onGenerate={handleGenerate} />;
}
