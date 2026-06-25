# PCR extraction engine

Turns an uploaded PCR PDF into `PCRData` (the shape the proposal UI consumes),
with per-field provenance so the salesperson can review before finalizing.

## How it works — hybrid extraction

| Pass | Module | Handles | Cost |
|------|--------|---------|------|
| **Text** | `text.ts` + `textFields.ts` | The ~60% of fields the PCR prints as label-anchored text (member/prescriber/pharmacy counts, catastrophic count, WSI & chronic totals). Deterministic, offline, instant. | Free |
| **Vision** | `vision.ts` + `schema.ts` | Everything in charts/images or positionally ambiguous: the risk-tier breakdown, the prescriber star split, `997/1,257 members`, and the WSI + chronic-condition bar charts. Claude reads the PDF natively. | ~Anthropic tokens / PCR |

`extract.ts` orchestrates both and **merges** them:

- text only → `high` confidence
- vision only → `medium` (chart read — reviewer should glance)
- both agree → `high`
- both disagree → `low` + `conflict`, keeps the text value (label-anchored beats OCR)

The result carries a `needsReview` list (missing / low-confidence / conflicting
fields) for the review screen. If `ANTHROPIC_API_KEY` is unset, the vision pass
is skipped and its fields land in `needsReview` for manual entry — so dev works
offline and a key outage never blocks a proposal.

## Where it runs

Server-side only, via `POST /api/parse` (`app/api/parse/route.ts`) — keeps the
API key off the client. The browser posts the PDF through
`lib/pcrParser.ts → parsePCRFileDetailed()`.

## Testing against a real PCR

```bash
npm run test:extract                       # text pass only — diffs vs DEMO_DATA
npm run test:extract -- --full             # full hybrid (needs ANTHROPIC_API_KEY)
npm run test:extract -- "/path/to/PCR.pdf" # a different PCR
```

The text pass currently extracts 15/15 of its target fields correctly on the
RxSense sample. Use `--full` once a key is set to validate the chart fields and
breakdowns end-to-end.

## Adding a new vendor's PCR format

1. Run `npm run test:extract -- "/path/to/new-vendor.pdf"` and see which scalars
   the text matchers miss.
2. For misses that are plain text, add/adjust a matcher in `textFields.ts`
   (anchor on the vendor's own label).
3. Chart/image fields are already covered by the Claude pass — verify with
   `--full`. The prompt in `vision.ts` may need a note about the new layout.
