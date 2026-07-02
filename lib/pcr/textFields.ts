import { PdfText } from "./text";
import { FieldResult, PCRScalarField } from "./types";

/** Parse "11,094" / "5,028" → 11094 / 5028. Returns null if not a clean integer. */
function toInt(s: string | undefined): number | null {
  if (!s) return null;
  const n = Number(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

interface Matcher {
  field: PCRScalarField;
  /** Run against the whitespace-collapsed full-document text. Capture group 1 = the number. */
  pattern: RegExp;
  /** Default high; drop to medium for positional / less-anchored matches. */
  confidence?: "high" | "medium";
}

/**
 * Label-anchored matchers for the scalar fields the PCR prints as plain text
 * (member counts, prescriber/pharmacy analysis on pages 3-4, the catastrophic
 * count on page 9, the WSI/chronic totals). Each anchors on the PCR's own label
 * so a number can't be grabbed from the wrong context.
 *
 * NOT here (handled by the vision pass — these live in chart/image pages or are
 * positionally ambiguous): the risk-tier breakdown (catastrophic tier / severe /
 * high / moderate / withdrawal / MAT), the prescriber star split (chronic vs
 * acute), membersMultiplePrescribers / membersOver3Refills, and the WSI +
 * chronic-condition breakdown arrays.
 */
const MATCHERS: Matcher[] = [
  { field: "totalMembersWithAnyRx", pattern: /([\d,]+)\s+Members? with a prescription/i },
  { field: "membersWithOpioidRx", pattern: /Members? with Opioid Rx\s+([\d,]+)/i },
  { field: "identifiedMembers", pattern: /Identified Members?\s+at Risk\s+([\d,]+)/i },

  { field: "totalPrescribersWithOpioid", pattern: /Prescribers? with Opioid Rx:\s*([\d,]+)/i },
  { field: "identifiedPrescribers", pattern: /Identified:\s*([\d,]+)\s*\(\s*\d+\s*%\)/i },
  { field: "prescribersExcessiveRefills", pattern: /([\d,]+)\s+Prescribers? with\s*>\s*3\s+Opioid Refills/i },

  { field: "pharmaciesDispensingOpioids", pattern: /Dispensed Opioid Rx:\s*([\d,]+)/i },
  { field: "crossLocationRefills", pattern: /([\d,]+)\s+Pharmacies\s*>\s*1\s+Pharmacy/i },
  { field: "pharmaciesMultiPrescriber", pattern: /([\d,]+)\s+Pharmacies\s*>\s*1\s+Prescriber/i },
  { field: "pharmaciesEarlyRefills", pattern: /([\d,]+)\s+Pharmacies\s*>\s*2\s+Days\s+Early Refill/i },
  { field: "pharmaciesHighDosage", pattern: /([\d,]+)\s+Pharmacies\s*>\s*50\s+MME/i },
  { field: "pharmaciesOver3Refills", pattern: /([\d,]+)\s+Pharmacies\s*>\s*3\s+Refills/i },

  { field: "catastrophicRisk", pattern: /total of\s+([\d,]+)\s+(?:high\s+)?catastrophic member/i },
  // pdf.js reading order detaches these totals from their headline labels and
  // glues them to the chart caption, so anchor on the caption text instead.
  { field: "chronicCostFactors", pattern: /COST FACTORS WITH OPIOID Rx\s*([\d,]+)/i },
  { field: "wsiUniqueMembers", pattern: /Withdrawal Symptom Indicators \(WSI\)\s*([\d,]+)/i },
];

/**
 * Run all text matchers against the extracted PDF text.
 * Returns a partial provenance map — only fields that produced a value.
 */
export function extractTextFields(text: PdfText): Partial<Record<PCRScalarField, FieldResult>> {
  const out: Partial<Record<PCRScalarField, FieldResult>> = {};
  for (const { field, pattern, confidence } of MATCHERS) {
    const m = text.normalized.match(pattern);
    const value = toInt(m?.[1]);
    if (value !== null) {
      out[field] = {
        value,
        source: "text",
        confidence: confidence ?? "high",
        raw: m?.[0]?.trim(),
      };
    }
  }
  // totalPlanMembers: the RxSense PCR has no separate "covered lives" figure;
  // it reports members-with-a-prescription, which the proposal uses as the
  // population baseline. Mirror that here so downstream math has a value.
  if (out.totalMembersWithAnyRx && !out.totalPlanMembers) {
    out.totalPlanMembers = {
      ...out.totalMembersWithAnyRx,
      confidence: "medium",
      raw: `${out.totalMembersWithAnyRx.raw} (used as total plan members — PCR reports no separate covered-lives count)`,
    };
  }
  return out;
}
