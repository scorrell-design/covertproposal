export interface PCRData {
  clientName: string;
  preparedFor: string;

  totalPlanMembers: number;
  totalMembersWithAnyRx: number;
  membersWithOpioidRx: number;

  identifiedMembers: number;
  withdrawalSymptomMembers: number;

  catastrophicRisk: number;
  severeRisk: number;
  highRisk: number;
  moderateRisk: number;
  earlyWithdrawal: number;
  matMembers: number;

  totalPrescribersWithOpioid: number;
  identifiedPrescribers: number;
  chronicOpioidPrescribers: number;
  acuteOpioidPrescribers: number;
  prescribersExcessiveRefills: number;

  pharmaciesDispensingOpioids: number;
  pharmaciesEarlyRefills: number;
  pharmaciesHighDosage: number;
  // Pharmacies that filled an opioid Rx for the same member from multiple
  // prescribers (PCR p4 "Pharmacies > 1 Prescriber") — confirmed by Jesse 6/3/26.
  pharmaciesMultiPrescriber: number;
  crossLocationRefills: number;
  membersMultiplePrescribers: number;
  membersOver3Refills: number;

  // Withdrawal Symptom Indicators (PCR page 5)
  wsiUniqueMembers: number;
  wsiBreakdown: { name: string; count: number }[];

  // Chronic Medical Indicators in opioid-Rx members (PCR page 6)
  chronicCostFactors: number;
  chronicConditions: { name: string; count: number }[];
}

export type AppScreen = "input" | "generating" | "output";

export interface InputState {
  status: "empty" | "parsing" | "loaded";
  data: PCRData | null;
  isDemo: boolean;
}
