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
  onBack: () => void;
}

export default function OutputProposal({ data, onBack }: OutputProposalProps) {
  const handleDownloadPDF = async () => {
    await generatePDF(data.clientName);
  };

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "var(--covert-bg)" }}>
      <NavBar onBack={onBack} onDownloadPDF={handleDownloadPDF} />

      <div id="proposal-output">
        <HeroSection clientName={data.clientName} />
        <ExecutiveSummary data={data} />
        <LiveRiskTickers data={data} />
        <PrescriptionUtilization data={data} />
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
