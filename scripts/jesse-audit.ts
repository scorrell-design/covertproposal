import { readFileSync } from "fs";
import { globSync } from "glob";

const results: { check: string; pass: boolean; detail?: string }[] = [];

function check(name: string, pass: boolean, detail?: string) {
  results.push({ check: name, pass, detail });
}

const allSource = globSync("{app,components,lib,src}/**/*.{ts,tsx,js,jsx}", {
  ignore: ["**/node_modules/**", "**/.next/**"],
}).map((f) => ({ file: f, src: readFileSync(f, "utf8") }));

const joined = allSource.map((f) => f.src).join("\n");

// 1. $23,000 savings rate
check(
  "SAVINGS_PER_WITHDRAWAL_MEMBER = 23000 exists",
  /SAVINGS_PER_WITHDRAWAL_MEMBER\s*=\s*23[_,]?000/.test(joined),
);

// 2. $600 per member on opioid
check(
  "COST_PER_MEMBER_ON_OPIOID = 600 exists",
  /COST_PER_MEMBER_ON_OPIOID\s*=\s*600/.test(joined),
);

// 3. Overdose-death projection: withdrawal members ÷ 820, suppressed under
//    300 members (Jesse 5/28/26 — supersedes the prior 825 / 9,000 lives-lost rule).
const hasOverdoseDivisor = /OVERDOSE_DEATH_DIVISOR\s*=\s*820/.test(joined);
const hasOverdoseThreshold = /OVERDOSE_MIN_POPULATION\s*=\s*300/.test(joined);
const hasOverdoseGate = /totalPlanMembers\s*<\s*OVERDOSE_MIN_POPULATION/.test(joined);
check(
  "Overdose-death projection uses ÷820 and is gated under 300 members",
  hasOverdoseDivisor && hasOverdoseThreshold && hasOverdoseGate,
);

// 4. calcAtRiskCadence helper exists
check(
  "calcAtRiskCadence helper exists",
  /function\s+calcAtRiskCadence|const\s+calcAtRiskCadence\s*=/.test(joined),
);

// 5. Prescription utilization inner label
check(
  'Inner circle label = "Pharmacies dispensing opioids"',
  /Pharmacies/.test(joined) && /dispensing opioids/.test(joined),
);

// 6. CDC asterisk footnote
check(
  "CDC-aligned prescribing risk factors footnote present",
  /CDC-aligned prescribing risk factors/.test(joined),
);

// 7. Recommended Interventions REMOVED
const riRegex =
  /Recommended Intervention|recommendedInterventions|RecommendedInterventions/;
const riHits = allSource.filter((f) => riRegex.test(f.src)).map((f) => f.file);
check(
  "Recommended Interventions section removed",
  riHits.length === 0,
  riHits.length > 0 ? `Found in: ${riHits.join(", ")}` : undefined,
);

// 8. CTA headline uses identifiedMembers + "directly affected"
check(
  "CTA headline interpolates identifiedMembers",
  /identifiedMembers/.test(joined) && /directly affected/.test(joined),
);

// 9. Data type has pharmaciesDispensingOpioids
check(
  "Data type includes pharmaciesDispensingOpioids",
  /pharmaciesDispensingOpioids\s*:/.test(joined),
);

// 10. 25% abuse/addiction rate constant
check(
  "ABUSE_ADDICTION_RATE = 0.25 exists",
  /ABUSE_ADDICTION_RATE\s*=\s*0\.25/.test(joined),
);

// Report
const failed = results.filter((r) => !r.pass);
console.log("\n=== JESSE FEEDBACK AUDIT ===\n");
for (const r of results) {
  console.log(`${r.pass ? "✓" : "✗"} ${r.check}`);
  if (r.detail) console.log(`    ${r.detail}`);
}
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed\n`,
);

if (failed.length > 0) {
  console.error(
    `✗ ${failed.length} Jesse feedback item(s) missing or incorrect`,
  );
  process.exit(1);
}
console.log("✓ All Jesse feedback verified");
process.exit(0);
