"use client";

import { useState } from "react";
import {
  User,
  Users,
  ShieldAlert,
  Stethoscope,
  HeartPulse,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react";
import { PCRData } from "@/lib/types";
import {
  calcMedicalSpendFromWithdrawal,
  calcPreventableSpend,
  calcCaseManagementCost,
  calcNetROI,
  formatCurrency,
} from "@/lib/calculations";

interface DataFormSectionsProps {
  data: PCRData;
  onChange: (data: PCRData) => void;
  isAutoFilled: boolean;
}

interface FormFieldProps {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: "text" | "number";
  required?: boolean;
  autoFilled?: boolean;
  readOnly?: boolean;
  autoLabel?: string;
}

function FormField({
  label,
  value,
  onChange,
  type = "number",
  required = false,
  autoFilled = false,
  readOnly = false,
  autoLabel,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="flex items-center gap-2 font-semibold"
        style={{ fontSize: "13px", color: "var(--covert-text-secondary)" }}
      >
        {label}
        {required && <span style={{ color: "var(--covert-red)" }}>*</span>}
        {autoLabel && (
          <span
            style={{
              fontSize: "11px",
              color: "var(--covert-text-secondary)",
              fontWeight: 400,
            }}
          >
            ({autoLabel})
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className="w-full transition-all duration-150"
          style={{
            border: "1px solid var(--covert-border)",
            borderRadius: "8px",
            padding: "10px 14px",
            paddingRight: autoFilled ? "110px" : "14px",
            fontSize: "15px",
            fontFamily: "'Satoshi', sans-serif",
            backgroundColor: readOnly
              ? "var(--covert-bg-secondary)"
              : autoFilled
                ? "var(--covert-teal-light)"
                : "var(--covert-bg)",
            outline: "none",
            color: readOnly
              ? "var(--covert-text-secondary)"
              : "var(--covert-black)",
          }}
          onFocus={(e) => {
            if (!readOnly) {
              e.currentTarget.style.borderColor = "var(--covert-teal)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(18,170,158,0.12)";
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--covert-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {autoFilled && !readOnly && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1"
            style={{
              fontSize: "11px",
              color: "var(--covert-teal)",
              fontWeight: 600,
            }}
          >
            <Check size={12} />
            Auto-filled
          </span>
        )}
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        border: "1px solid var(--covert-border)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full text-left transition-colors duration-150"
        style={{
          padding: "16px 20px",
          backgroundColor: isOpen
            ? "var(--covert-bg)"
            : "var(--covert-bg-secondary)",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span style={{ color: "var(--covert-teal)" }}>{icon}</span>
        <span className="font-bold flex-1" style={{ fontSize: "15px" }}>
          {title}
        </span>
        {isOpen ? (
          <ChevronDown size={18} style={{ color: "var(--covert-text-secondary)" }} />
        ) : (
          <ChevronRight size={18} style={{ color: "var(--covert-text-secondary)" }} />
        )}
      </button>
      {isOpen && (
        <div
          className="grid gap-4 animate-fade-in"
          style={{ padding: "20px", paddingTop: "8px" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function DataFormSections({
  data,
  onChange,
  isAutoFilled,
}: DataFormSectionsProps) {
  const update = (field: keyof PCRData, value: string) => {
    const parsed =
      field === "clientName" || field === "preparedFor"
        ? value
        : Number(value) || 0;
    onChange({ ...data, [field]: parsed });
  };

  const exposure = calcMedicalSpendFromWithdrawal(data.withdrawalSymptomMembers);
  const preventable = calcPreventableSpend(data.withdrawalSymptomMembers);
  const caseMgmt = calcCaseManagementCost(data.identifiedMembers);
  const netRoi = calcNetROI(data.withdrawalSymptomMembers, data.identifiedMembers);

  return (
    <div className="flex flex-col gap-4">
      <CollapsibleSection title="Client Information" icon={<User size={18} />}>
        <FormField
          label="Client Name"
          value={data.clientName}
          onChange={(v) => update("clientName", v)}
          type="text"
          required
          autoFilled={isAutoFilled}
        />
        <FormField
          label="Prepared For"
          value={data.preparedFor}
          onChange={(v) => update("preparedFor", v)}
          type="text"
          autoFilled={isAutoFilled && !!data.preparedFor}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Population & Utilization"
        icon={<Users size={18} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Total Plan Members"
            value={data.totalPlanMembers}
            onChange={(v) => update("totalPlanMembers", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Members with Any Rx"
            value={data.totalMembersWithAnyRx}
            onChange={(v) => update("totalMembersWithAnyRx", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Members with Opioid Rx"
            value={data.membersWithOpioidRx}
            onChange={(v) => update("membersWithOpioidRx", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Identified Members at Risk"
            value={data.identifiedMembers}
            onChange={(v) => update("identifiedMembers", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Members with Withdrawal Symptoms"
            value={data.withdrawalSymptomMembers}
            onChange={(v) => update("withdrawalSymptomMembers", v)}
            autoFilled={isAutoFilled}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Risk Breakdown"
        icon={<ShieldAlert size={18} />}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <FormField
            label="Catastrophic"
            value={data.catastrophicRisk}
            onChange={(v) => update("catastrophicRisk", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Severe"
            value={data.severeRisk}
            onChange={(v) => update("severeRisk", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="High"
            value={data.highRisk}
            onChange={(v) => update("highRisk", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Moderate"
            value={data.moderateRisk}
            onChange={(v) => update("moderateRisk", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Early Withdrawal"
            value={data.earlyWithdrawal}
            onChange={(v) => update("earlyWithdrawal", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="MAT Members"
            value={data.matMembers}
            onChange={(v) => update("matMembers", v)}
            autoFilled={isAutoFilled}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Prescriber & Pharmacy Data"
        icon={<Stethoscope size={18} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Total Prescribers with Opioid Rx"
            value={data.totalPrescribersWithOpioid}
            onChange={(v) => update("totalPrescribersWithOpioid", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Identified Prescribers"
            value={data.identifiedPrescribers}
            onChange={(v) => update("identifiedPrescribers", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Chronic Opioid Prescribers"
            value={data.chronicOpioidPrescribers}
            onChange={(v) => update("chronicOpioidPrescribers", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Acute Opioid Prescribers"
            value={data.acuteOpioidPrescribers}
            onChange={(v) => update("acuteOpioidPrescribers", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Pharmacies Dispensing Opioids"
            value={data.pharmaciesDispensingOpioids}
            onChange={(v) => update("pharmaciesDispensingOpioids", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Pharmacies Early Refills"
            value={data.pharmaciesEarlyRefills}
            onChange={(v) => update("pharmaciesEarlyRefills", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Pharmacies High Dosage"
            value={data.pharmaciesHighDosage}
            onChange={(v) => update("pharmaciesHighDosage", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Cross-Location Refills"
            value={data.crossLocationRefills}
            onChange={(v) => update("crossLocationRefills", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Members Using Multiple Prescribers"
            value={data.membersMultiplePrescribers}
            onChange={(v) => update("membersMultiplePrescribers", v)}
            autoFilled={isAutoFilled}
          />
          <FormField
            label="Members Receiving >3 Refills"
            value={data.membersOver3Refills}
            onChange={(v) => update("membersOver3Refills", v)}
            autoFilled={isAutoFilled}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Clinical Warning Signs"
        icon={<HeartPulse size={18} />}
      >
        <FormField
          label="Prescribers Writing >3 Refills"
          value={data.prescribersExcessiveRefills}
          onChange={(v) => update("prescribersExcessiveRefills", v)}
          autoFilled={isAutoFilled}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Financial Context"
        icon={<DollarSign size={18} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Annual Exposure from Withdrawal"
            value={formatCurrency(exposure)}
            onChange={() => {}}
            type="text"
            readOnly
            autoLabel="auto-calculated"
          />
          <FormField
            label="Preventable Medical Spend"
            value={formatCurrency(preventable)}
            onChange={() => {}}
            type="text"
            readOnly
            autoLabel="auto-calculated"
          />
          <FormField
            label="Case Management Investment"
            value={formatCurrency(caseMgmt)}
            onChange={() => {}}
            type="text"
            readOnly
            autoLabel="auto-calculated"
          />
          <FormField
            label="Net ROI"
            value={formatCurrency(netRoi)}
            onChange={() => {}}
            type="text"
            readOnly
            autoLabel="auto-calculated"
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
