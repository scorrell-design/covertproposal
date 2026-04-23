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
  chronicHighRisk: number;
  commonButConcerning: number;
  prescribersExcessiveRefills: number;

  pharmaciesDispensingOpioids: number;
  pharmaciesEarlyRefills: number;
  pharmaciesHighDosage: number;
  crossLocationRefills: number;
  membersMultiplePrescribers: number;
  membersOver3Refills: number;
}

export type AppScreen = "input" | "generating" | "output";

export interface InputState {
  status: "empty" | "parsing" | "loaded";
  data: PCRData | null;
  isDemo: boolean;
}
