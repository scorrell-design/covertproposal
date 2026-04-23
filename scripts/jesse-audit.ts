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

// 3. Lives-lost ticker gated on 9,000 members (may use named constant)
const hasThresholdConst = /LARGE_POPULATION_THRESHOLD\s*=\s*9[_,]?000/.test(joined);
const hasLiteralGate = /totalPlanMembers\s*[<>=]+\s*9[_,]?000/.test(joined);
const hasConstGate = /totalPlanMembers\s*<\s*LARGE_POPULATION_THRESHOLD/.test(joined);
check(
  "Lives-lost ticker gated on totalPlanMembers >= 9000",
  (hasLiteralGate || (hasThresholdConst && hasConstGate)) &&
    /825/.test(joined),
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
