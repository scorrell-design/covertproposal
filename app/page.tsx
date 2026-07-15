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
  // Outcome of the generate action, set once the work resolves. The calculating
  // screen walks all four steps and only advances once this is ready, so a real
  // proposal no longer jumps straight past the steps (Jesse 6/26).
  const [genReady, setGenReady] = useState<
    null | { kind: "demo" } | { kind: "saved"; id: string } | { kind: "error" }
  >(null);

  // Deep-link demo output for QA: visit ?preview=output
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "output") {
      setData(DEMO_DATA);
      setScreen("output");
    }
  }, []);

  const handleGenerate = async (pcrData: PCRData, opts: GenerateOptions) => {
    setData(pcrData);
    setScreen("generating");
    setGenerationStep(0);
    setGenReady(null);

    if (opts.isDemo) {
      setGenReady({ kind: "demo" });
      return;
    }

    // Real proposal: persist it. Navigation waits for both this result and the
    // step animation to finish (see the effects below).
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: pcrData.clientName,
          preparedFor: pcrData.preparedFor,
          pcrData,
          provenance: opts.provenance,
          sourceFileName: opts.sourceFileName,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Could not save the proposal.");
      }
      const { id } = (await res.json()) as { id: string };
      setGenReady({ kind: "saved", id });
    } catch {
      // Fall back to a local preview so work isn't lost if the save fails.
      setGenReady({ kind: "error" });
    }
  };

  // Walk the four calculating-screen steps (~800ms each) for every generation —
  // demo and real alike — then hold the spinner on the last step.
  useEffect(() => {
    if (screen !== "generating") return;
    const interval = setInterval(() => {
      setGenerationStep((prev) =>
        Math.min(prev + 1, GENERATION_STEPS.length - 1),
      );
    }, 800);
    return () => clearInterval(interval);
  }, [screen]);

  // Once the steps have finished AND the work has resolved, advance: a real save
  // opens /proposals/[id]; demo and save-failures fall back to the in-page view.
  useEffect(() => {
    if (screen !== "generating" || !genReady) return;
    if (generationStep < GENERATION_STEPS.length - 1) return;
    const t = setTimeout(() => {
      if (genReady.kind === "saved") {
        router.push(`/proposals/${genReady.id}`);
      } else {
        setScreen("output");
      }
    }, 600);
    return () => clearTimeout(t);
  }, [screen, genReady, generationStep, router]);

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
