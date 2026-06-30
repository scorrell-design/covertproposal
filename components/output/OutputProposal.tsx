"use client";

import NavBar from "./NavBar";
import Reveal from "@/components/shared/Reveal";
import ScrollProgress from "@/components/shared/ScrollProgress";
import OnThisPageNav, { NavSection } from "./OnThisPageNav";
import HeroSection from "./sections/HeroSection";
import ExecutiveSummary from "./sections/ExecutiveSummary";
import LiveRiskTickers from "./sections/LiveRiskTickers";
import RiskBreakdown from "./sections/RiskBreakdown";
import PrescriberPatterns from "./sections/PrescriberPatterns";
import ClinicalWarningSigns from "./sections/ClinicalWarningSigns";
import WithdrawalIndicators from "./sections/WithdrawalIndicators";
import ChronicConditions from "./sections/ChronicConditions";
import FinancialImpact from "./sections/FinancialImpact";
import NextStepsCTA from "./sections/NextStepsCTA";
import Footer from "./sections/Footer";
import { PCRData } from "@/lib/types";
import { generatePDF } from "@/lib/pdfExport";

interface OutputProposalProps {
  data: PCRData;
  /** Owner views pass a back-to-dashboard handler; the public prospect view omits it. */
  onBack?: () => void;
  /** Owner view: copy the public share link + mark the proposal sent. */
  onShare?: () => Promise<void> | void;
  /** Fired after a successful PDF export (owner view logs a DOWNLOADED event). */
  onDownloaded?: () => void;
}

const NAV_SECTIONS: NavSection[] = [
  { id: "sec-overview", label: "Overview" },
  { id: "sec-risk", label: "Risk Breakdown" },
  { id: "sec-prescribers", label: "Prescribers" },
  { id: "sec-warning", label: "Warning Signs" },
  { id: "sec-live", label: "Live Risk" },
  { id: "sec-withdrawal", label: "Withdrawal" },
  { id: "sec-chronic", label: "Chronic Disease" },
  { id: "sec-financial", label: "Financial Impact" },
  { id: "sec-next", label: "Next Steps" },
];

export default function OutputProposal({ data, onBack, onShare, onDownloaded }: OutputProposalProps) {
  const handleDownloadPDF = async () => {
    await generatePDF(data.clientName);
    onDownloaded?.();
  };

  return (
    <div
      className="w-full min-h-screen"
      style={{
        // Dark canvas base so scroll-revealed sections rise against a
        // continuous surface (never a flash of white) and the whole report
        // reads as one fluid page rather than stacked slabs.
        background:
          "linear-gradient(180deg, #141417 0%, #121214 50%, #141417 100%)",
      }}
    >
      <NavBar onBack={onBack} onShare={onShare} onDownloadPDF={handleDownloadPDF} />
      <ScrollProgress />
      <OnThisPageNav sections={NAV_SECTIONS} />

      {/* Section order per Jesse (6/29): the Member Risk Breakdown follows the
          "What the Data Shows" narrative directly (Scope → who's at risk →
          prescribers causing it → clinical signs → cost → action).

          Single-block sections rise as one via Reveal. Grid-heavy sections
          (ClinicalWarningSigns, LiveRiskTickers, FinancialImpact, NextStepsCTA)
          are NOT wrapped here — they reveal their header and stagger their
          cards internally, so the cards cascade in one-by-one. */}
      <div id="proposal-output">
        <HeroSection data={data} />
        <div id="sec-overview"><Reveal><ExecutiveSummary data={data} /></Reveal></div>
        <div id="sec-risk"><Reveal><RiskBreakdown data={data} /></Reveal></div>
        <div id="sec-prescribers"><Reveal><PrescriberPatterns data={data} /></Reveal></div>
        <div id="sec-warning"><ClinicalWarningSigns data={data} /></div>
        <div id="sec-live"><LiveRiskTickers data={data} /></div>
        <div id="sec-withdrawal"><Reveal><WithdrawalIndicators data={data} /></Reveal></div>
        <div id="sec-chronic"><Reveal><ChronicConditions data={data} /></Reveal></div>
        <div id="sec-financial"><FinancialImpact data={data} /></div>
        <div id="sec-next"><NextStepsCTA data={data} /></div>
        <Footer />
      </div>
    </div>
  );
}
