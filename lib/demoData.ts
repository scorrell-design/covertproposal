import { PCRData } from "./types";

// Demo data sourced from the real RxSense Prescription Compliance Report
// (PCR - Covert-RxSense, 07/01/2025 – 12/31/2025). Every figure below is read
// directly off the PCR — the tool extracts and places these numbers; it does
// not derive them. See docs/PRD-outline.md "No math on our end".
export const DEMO_DATA: PCRData = {
  clientName: "RxSense",
  preparedFor: "",
  // PCR p3 headline: "97,301 Members with a prescription".
  // NOTE: the PCR does not state total covered lives separately, so the
  // population figure below reflects members-with-a-prescription.
  totalPlanMembers: 97301,
  totalMembersWithAnyRx: 97301,
  membersWithOpioidRx: 11094,
  identifiedMembers: 5028,
  // "Withdrawal" risk tier (PCR p7) — members managing severe withdrawal symptoms.
  withdrawalSymptomMembers: 2049,
  // Identified-member risk tiers (PCR p7). Sum = 5,028 = identifiedMembers.
  catastrophicRisk: 22,
  severeRisk: 430,
  highRisk: 1729,
  moderateRisk: 798,
  earlyWithdrawal: 2049,
  matMembers: 0, // No MAT-enrolled category on this PCR.
  // Prescriber analysis (PCR p4) + Physician Star Report (PCR p8).
  totalPrescribersWithOpioid: 6887,
  identifiedPrescribers: 2741, // 40% identified — the count "flagged" for unsafe prescribing.
  chronicOpioidPrescribers: 1022, // 1- + 2-star (chronic opioid prescribing).
  acuteOpioidPrescribers: 1719, // 3- + 4-star (acute opioid prescribing).
  prescribersExcessiveRefills: 1338, // Prescribers with >3 opioid refills.
  // Pharmacy analysis (PCR p4).
  pharmaciesDispensingOpioids: 2042,
  pharmaciesEarlyRefills: 127, // Pharmacies >2 days early refill.
  pharmaciesHighDosage: 643, // Pharmacies >50 MME/day.
  pharmaciesOver3Refills: 771, // Pharmacies dispensing opioid Rx with >3 refills (PCR p4: "771 Pharmacies > 3 Refills").
  pharmaciesMultiPrescriber: 713, // Pharmacies >1 prescriber (same member) — confirmed by Jesse.
  crossLocationRefills: 516, // Pharmacies >1 pharmacy.
  membersMultiplePrescribers: 997, // Members tied to >1 opioid prescriber.
  membersOver3Refills: 1257, // Members tied to >3 opioid refills.
  // Withdrawal symptom indicators (PCR p5). 2,121 uniquely identified members.
  wsiUniqueMembers: 2121,
  wsiBreakdown: [
    { name: "AntiDepressants", count: 1375 },
    { name: "Muscle Relaxants", count: 1125 },
    { name: "Nausea", count: 1006 },
    { name: "AntiAnxiety", count: 443 },
    { name: "AntiPsychotics", count: 211 },
    { name: "Antihistamines", count: 190 },
    { name: "Non-Opioid Pain", count: 169 },
    { name: "Laxatives", count: 113 },
  ],
  // Chronic medical cost factors in opioid-Rx members (PCR p6). 3,335 members.
  chronicCostFactors: 3335,
  chronicConditions: [
    { name: "Depression", count: 2139 },
    { name: "GI Ulcer", count: 960 },
    { name: "Asthma", count: 630 },
    { name: "Diabetes", count: 463 },
    { name: "CAD", count: 70 },
    { name: "CHF", count: 11 },
  ],
};
