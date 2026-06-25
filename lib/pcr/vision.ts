import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { pcrExtractionSchema, PCRExtraction } from "./schema";

/**
 * Claude reads the PCR PDF directly (native PDF document block — handles both
 * the text pages and the chart/image pages that text extraction can't, like the
 * risk-tier wheel and the prescriber star report). Structured output is
 * constrained to {@link pcrExtractionSchema}, so the result is validated, not
 * parsed by hand. Used to fill the fields the text pass can't reach and to
 * cross-check the ones it can.
 *
 * Returns null if no ANTHROPIC_API_KEY is configured (so the text-only pass
 * still works in dev) or if the model declines the request.
 */
export async function extractWithClaude(
  pdfBytes: Uint8Array
): Promise<PCRExtraction | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const client = new Anthropic();
  const base64 = Buffer.from(pdfBytes).toString("base64");

  const instruction = [
    "This is a Covert Prescription Compliance Report (PCR) for an employer health plan.",
    "Extract the figures into the provided schema. Every number you return must be",
    "printed in the PCR — read it off the page, do not calculate, infer, or estimate.",
    "Key locations: member counts (97,301 / opioid Rx / identified at risk) on the",
    "Member Analysis page; prescriber & pharmacy counts (with Opioid Rx, identified,",
    "> N refills/prescribers, pharmacy flags) on the Prescriber & Pharmacy Analysis page;",
    "the risk-tier breakdown (catastrophic / severe / high / moderate / withdrawal / MAT)",
    "and the prescriber star split (chronic = 1+2 star, acute = 3+4 star) live in CHARTS —",
    "read the chart values. The WSI breakdown and chronic-condition breakdown are bar charts;",
    "return each labeled bar as {name, count}. membersMultiplePrescribers is the members",
    "count tied to '> 1 Opioid Prescriber'; membersOver3Refills is the members count tied to",
    "'> 3 Opioid Refills'. withdrawalSymptomMembers is the count in the 'Withdrawal' risk",
    "tier on the Identified Member Analysis page (the SAME figure as earlyWithdrawal), NOT the",
    "WSI 'uniquely identified members' total (that figure is wsiUniqueMembers).",
    "If a figure is genuinely absent from this PCR, return null for it",
    "(for example matMembers when there is no MAT category) — never guess.",
  ].join(" ");

  const message = await client.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { format: zodOutputFormat(pcrExtractionSchema) },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: base64 },
          },
          { type: "text", text: instruction },
        ],
      },
    ],
  });

  if (message.stop_reason === "refusal") return null;
  return message.parsed_output ?? null;
}
