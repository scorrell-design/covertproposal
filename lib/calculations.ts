// === RATES — confirmed by Jesse Lisson (VP, Covert), 2026 ===
export const COST_PER_MEMBER_ON_OPIOID = 600;
// ROI ratio inputs — per Jesse (6/3/26). The fixed-ROI claim is retired; the
// ROI is now avoided medical spend ÷ cost, where:
//   cost    = members with an opioid Rx × $600  (COST_PER_MEMBER_ON_OPIOID)
//   savings = at-risk (identified) members × $23,790
export const SAVINGS_PER_AT_RISK_MEMBER = 23790;
export const PREVENTABLE_REDUCTION_RATE = 0.75;
// Overdose-death projection — per Jesse (5/28/26): members managing withdrawal
// symptoms ÷ 820, suppressed entirely when the plan has < 300 members.
export const OVERDOSE_DEATH_DIVISOR = 820;
export const OVERDOSE_MIN_POPULATION = 300;
export const ABUSE_ADDICTION_RATE = 0.25;
// Catastrophic-risk exposure per member — per Jesse (6/30/26): members nearing
// a catastrophic event are trending toward overdose death or a major medical
// event, each carrying ~$100,000 in projected exposure.
export const CATASTROPHIC_EXPOSURE_PER_MEMBER = 100000;

// Preventable spend = 75% of the annual exposure. Annual exposure is the
// at-risk basis (Jesse 6/26): identified members × $23,790.
export function calcPreventableSpend(identifiedMembers: number): number {
  return Math.round(
    calcAvoidedMedicalSpend(identifiedMembers) * PREVENTABLE_REDUCTION_RATE,
  );
}

// Net ROI (Jesse 6/26) = preventable spend (at-risk basis) − Covert cost
// (members currently on an opioid Rx × $600).
export function calcNetROI(
  identifiedMembers: number,
  membersWithOpioidRx: number,
): number {
  return (
    calcPreventableSpend(identifiedMembers) - calcCovertCost(membersWithOpioidRx)
  );
}

/**
 * Projected opioid-overdose deaths in the next 12 months.
 * Formula (Jesse, 5/28/26): members managing withdrawal symptoms ÷ 820.
 * Returns null when the plan is under 300 members (stat is suppressed).
 */
export function calcProjectedOverdoseDeaths(
  withdrawalMembers: number,
  totalPlanMembers: number,
): number | null {
  if (totalPlanMembers < OVERDOSE_MIN_POPULATION) return null;
  const value = Math.round(withdrawalMembers / OVERDOSE_DEATH_DIVISOR);
  return value > 0 ? value : null;
}

export function calcProjectedAbuseAddiction(
  identifiedMembers: number,
): number {
  return Math.round(identifiedMembers * ABUSE_ADDICTION_RATE);
}

/** Avoided medical spend (Jesse 6/3/26): at-risk members × $23,790. */
export function calcAvoidedMedicalSpend(identifiedMembers: number): number {
  return identifiedMembers * SAVINGS_PER_AT_RISK_MEMBER;
}

/** Covert cost basis (Jesse 6/3/26): members with an opioid Rx × $600. */
export function calcCovertCost(membersWithOpioidRx: number): number {
  return membersWithOpioidRx * COST_PER_MEMBER_ON_OPIOID;
}

/** Catastrophic-risk projected exposure (Jesse 6/30/26): members × $100,000. */
export function calcCatastrophicExposure(catastrophicRiskMembers: number): number {
  return catastrophicRiskMembers * CATASTROPHIC_EXPOSURE_PER_MEMBER;
}

/**
 * ROI ratio (Jesse 6/3/26) = avoided medical spend ÷ cost.
 *   savings = identified (at-risk) members × $23,790
 *   cost    = members with an opioid Rx × $600
 */
export function calcROIRatio(
  identifiedMembers: number,
  membersWithOpioidRx: number,
): number {
  const cost = calcCovertCost(membersWithOpioidRx);
  if (cost <= 0) return 0;
  return Math.round(calcAvoidedMedicalSpend(identifiedMembers) / cost);
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
