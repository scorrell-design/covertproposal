"use client";

import NavBar from "./NavBar";
import HeroSection from "./sections/HeroSection";
import ExecutiveSummary from "./sections/ExecutiveSummary";
import LiveRiskTickers from "./sections/LiveRiskTickers";
import PrescriptionUtilization from "./sections/PrescriptionUtilization";
import RiskBreakdown from "./sections/RiskBreakdown";
import PrescriberPatterns from "./sections/PrescriberPatterns";
import ClinicalWarningSigns from "./sections/ClinicalWarningSigns";
import WithdrawalIndicators from "./sections/WithdrawalIndicators";
import ChronicConditions from "./sections/ChronicConditions";
import FinancialImpact from "./sections/FinancialImpact";
import ComparisonDecision from "./sections/ComparisonDecision";
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

export default function OutputProposal({ data, onBack, onShare, onDownloaded }: OutputProposalProps) {
  const handleDownloadPDF = async () => {
    await generatePDF(data.clientName);
    onDownloaded?.();
  };

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "var(--covert-bg)" }}>
      <NavBar onBack={onBack} onShare={onShare} onDownloadPDF={handleDownloadPDF} />

      <div id="proposal-output">
        <HeroSection data={data} />
        <PrescriptionUtilization data={data} />
        <ExecutiveSummary data={data} />
        <LiveRiskTickers data={data} />
        <RiskBreakdown data={data} />
        <PrescriberPatterns data={data} />
        <ClinicalWarningSigns data={data} />
        <WithdrawalIndicators data={data} />
        <ChronicConditions data={data} />
        <FinancialImpact data={data} />
        <ComparisonDecision data={data} />
        <NextStepsCTA data={data} />
        <Footer />
      </div>
    </div>
  );
}
