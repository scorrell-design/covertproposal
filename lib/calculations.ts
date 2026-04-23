// === RATES — updated per Jesse Lisson (VP, Covert), 2026 ===
export const SAVINGS_PER_WITHDRAWAL_MEMBER = 23000;
export const COST_PER_MEMBER_ON_OPIOID = 600;
export const CASE_MANAGEMENT_COST_PER_CASE = 400;
export const PREVENTABLE_REDUCTION_RATE = 0.75;
export const DEATHS_PER_IDENTIFIED_MEMBERS = 1 / 825;
export const ABUSE_ADDICTION_RATE = 0.25;
export const LARGE_POPULATION_THRESHOLD = 9000;

export function calcMedicalSpendFromWithdrawal(
  withdrawalMembers: number,
): number {
  return withdrawalMembers * SAVINGS_PER_WITHDRAWAL_MEMBER;
}

export function calcPreventableSpend(withdrawalMembers: number): number {
  return Math.round(
    calcMedicalSpendFromWithdrawal(withdrawalMembers) *
      PREVENTABLE_REDUCTION_RATE,
  );
}

export function calcCaseManagementCost(membersAtRisk: number): number {
  return membersAtRisk * CASE_MANAGEMENT_COST_PER_CASE;
}

export function calcOpioidExposureCost(membersWithOpioidRx: number): number {
  return membersWithOpioidRx * COST_PER_MEMBER_ON_OPIOID;
}

export function calcNetROI(
  withdrawalMembers: number,
  membersAtRisk: number,
): number {
  return (
    calcPreventableSpend(withdrawalMembers) -
    calcCaseManagementCost(membersAtRisk)
  );
}

export function calcDailyCostOfInaction(preventableSpend: number): number {
  return Math.round(preventableSpend / 365);
}

export function calcMonthlyPreventable(preventableSpend: number): number {
  return Math.round(preventableSpend / 12);
}

export function calcProjectedLivesLost(
  identifiedMembers: number,
  totalPlanMembers: number,
): number | null {
  if (totalPlanMembers < LARGE_POPULATION_THRESHOLD) return null;
  return Math.round(identifiedMembers * DEATHS_PER_IDENTIFIED_MEMBERS);
}

export function calcProjectedAbuseAddiction(
  identifiedMembers: number,
): number {
  return Math.round(identifiedMembers * ABUSE_ADDICTION_RATE);
}

export function calcAtRiskCadence(identifiedMembers: number): {
  value: number;
  cadence: "day" | "month" | "year";
} {
  const perDay = identifiedMembers / 365;
  const perMonth = identifiedMembers / 12;
  if (perDay >= 1) return { value: Math.round(perDay), cadence: "day" };
  if (perMonth >= 1) return { value: Math.round(perMonth), cadence: "month" };
  return { value: identifiedMembers, cadence: "year" };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
