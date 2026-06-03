# Covert Proposal — Product Requirements Outline

**For:** Brennan
**Owner:** Stephanie Correll
**Status:** Outline, pending Jesse + Stephanie review
**Live demo (current):** https://covertproposal.vercel.app
**Repo:** https://github.com/scorrell-design/covertproposal

---

## 1. What we're building, in plain English

A web tool that lets the Covert sales team turn a client's pharmacy claims data into a polished, client-ready proposal document in under a minute. The salesperson uploads a PCR (Pharmacy Claims Review) file, the app pulls the numbers it needs, and out comes a Covert-branded report showing the prospect:

- How much opioid risk is hidden in their pharmacy data
- Who's driving it (prescribers, pharmacies)
- What it costs them today vs. what Covert prevents
- A clear next step to engage Covert

The output exists in two places:
1. An **interactive web report** the salesperson can share or screen-share with a prospect (dark theme, animated, matches covertplan.com)
2. A **downloadable PDF** of the same report in a clean white-background format suitable for printing or emailing

What exists today is a **prototype**: the front-end is built and styled, demo data comes from a real RxSense PCR, and the PDF download works. What's missing is the backend, real data ingestion, authentication, and CRM hooks. That's the scope of this build.

> **No math on our end.** The PCR already contains every computed figure the proposal shows — risk tiers, prescriber/pharmacy counts, projected cost savings ($57.25M @ 75% on the RxSense sample), cost-per-member, catastrophic exposure, etc. The tool's job is to **read those numbers out of the PCR PDF and place them in the right slots** — not to build calculators. The only on-our-side arithmetic is trivial display math (percentages, and the overdose-death projection: members managing withdrawal ÷ 820).
>
> **Input is a single PDF.** Jesse plugs in one PCR PDF (e.g. `PCR - Covert-RxSense-07-122025.pdf`); the upload accepts PDF only (no CSV/XLSX).

---

## 2. Who uses it

- **Primary user:** Covert sales team (e.g. Jesse, account execs)
  - Logs in, uploads a PCR, generates a proposal, sends it to a prospect
- **Possible future user:** Partner brokers (AssuredPartners-style) generating Covert proposals for their own clients on behalf of Covert
  - Decision pending — see Open Questions

The prospect (the employer being sold to) **doesn't use this app**. They just receive a PDF or a link.

---

## 3. The flow we're building

**Today (working in the prototype):**
1. Salesperson goes to the app
2. Uploads any file (currently ignored, demo data used) OR clicks "Try Demo"
3. App pretends to parse for 2.5 seconds, shows generation animation
4. Renders the proposal output (dark theme, full Covert brand)
5. Salesperson clicks Download PDF → gets a light-mode PDF

**What we need to build for production:**
1. Salesperson logs in (auth)
2. Lands on a dashboard showing their existing proposals
3. Clicks "New proposal," enters client name + uploads the PCR PDF
4. App actually reads the PCR PDF and extracts the figures it needs (no calculation — the PCR already has them)
5. App generates the proposal (same UI we already have)
6. Salesperson can optionally tweak numbers/copy before finalizing
7. Salesperson saves the proposal (stored against their account)
8. Salesperson sends it — either downloads the PDF, emails it directly to the prospect, or shares a unique view-only link
9. When the prospect clicks "Request Client Service Agreement," Jesse (or the assigned AE) gets notified
10. Sales person can come back later and see which proposals have been viewed / acted on

---

## 4. What needs to work

### Must-have (V1 launch)

1. **Authentication.** Email + password login. Just for internal Covert team to start. Use whatever's simplest — Clerk, Auth.js, Supabase Auth.
2. **PCR ingestion (PDF only).** Accept a single PCR **PDF** upload and **extract** these data points (the PCR already contains them — no derivation):
   - Total plan members
   - Total members with any Rx
   - Members with opioid Rx
   - Identified at-risk members
   - Members with withdrawal symptom indicators
   - Risk tier breakdown (catastrophic, severe, high, moderate, medically emergent withdrawal, MAT)
   - Prescriber counts (total opioid prescribers, identified, chronic, acute)
   - Pharmacy counts (dispensing opioids, early refills, high dosage)
   - Cross-location refills, multi-prescriber members, members over 3 refills
   - Withdrawal symptom indicator breakdown (14 categories per PCR p5)
   - Chronic condition counts in opioid-Rx members (per PCR p6)
   - See `lib/types.ts` (PCRData interface) for the full schema
   - Projected cost savings / total cost impact / cost-per-member (PCR "Projected Cost Savings" page — already computed, just read them)
   - See `lib/types.ts` (`PCRData` interface) for the full schema; `lib/demoData.ts` shows the real RxSense mapping
3. **Proposal generation.** Use the existing front-end. Feed in extracted PCR data → render proposal. No new UI work needed.
4. **Manual edit step.** Before finalizing, let the salesperson tweak the client name and any numbers that look wrong (the extracted data won't be perfect every time). Inline edits, saved on submit.
5. **Save + retrieve.** Each proposal is stored against the user account. Dashboard lists all their proposals with status (draft, sent, viewed, acted on).
6. **PDF download.** Already working. Uses existing `lib/pdfExport.ts`.
7. **Shareable link.** Each saved proposal has a unique, view-only URL the salesperson can send to a prospect. Track when the link is opened.
8. **"Request Client Service Agreement" → notification.** When a prospect clicks the CTA in the live proposal, email Jesse (and the proposal's owner) with the prospect's contact info. Capture the contact info via a small form modal triggered by the button.

### Nice-to-have (V1.5+)

- Email the proposal directly to the prospect from inside the app
- View counts / read receipts on shared links
- Branded variants for partner brokers
- CRM sync (Salesforce / HubSpot)
- Editable templates so Jesse can adjust default copy without a code push

---

## 5. What it should look like

The visual design is **built and current as of Jesse's 5/28/26 revisions** (see Revision Log below). Brennan should not redesign it — use the existing components. The structure, ordering, and copy in the live demo are the source of truth.

Reference points:
- **Live demo:** https://covertproposal.vercel.app (current state)
- **Brand source:** https://covertplan.com (this is what the proposal output now mimics)
- **Brand book:** `/Users/stephanie/Desktop/Clever/Covert/COVERT Brand Book A0425.pdf`
- **Logo + step illustrations:** `public/covert-assets/` (already downloaded into the repo)

Things Brennan should preserve verbatim:
- Satoshi font, the `#14B8A6` teal, the dark `#171717` background
- Pill-shaped buttons
- The two-tone "Section Headline. **Teal accent.**" headline pattern
- Section spacing (`clamp()` padding values in each section file)
- Section-by-section PDF rendering logic (don't go back to slicing one big canvas)

---

## 6. Data model — what we need to track

In rough terms (Brennan can pick the actual schema):

**User**
- id, email, password hash, name, role (admin / sales / broker), created_at

**Proposal**
- id, owner_user_id, client_name, prepared_for, status (draft / sent / viewed / engaged), created_at, updated_at, share_token (random short string for the public view URL), pcr_data (JSON blob matching `PCRData` type)

**ProposalEvent** (for tracking — keep simple)
- id, proposal_id, event_type ("created", "shared", "viewed", "engaged", "downloaded"), occurred_at, metadata (JSON)

**EngagementRequest** (when a prospect clicks "Request Client Service Agreement")
- id, proposal_id, prospect_name, prospect_email, prospect_company, prospect_phone, occurred_at, notes

That's it. No need for anything more complex at V1.

---

## 7. Tech notes (lightweight — choose freely)

The front-end is **Next.js 16 + React 19 + Tailwind v4 + Recharts + TypeScript**. Brennan shouldn't fight that — it's working. Just add the backend.

Suggested (not prescribed):
- Hosting: keep Vercel for the front-end
- Backend: Vercel functions / Next.js API routes, or a small standalone Node service if preferred
- Database: Postgres (Supabase or Neon — both have generous free tiers)
- Auth: Supabase Auth or Clerk
- File storage (uploaded PCRs): S3, Supabase Storage, or Vercel Blob
- Email: Resend or Postmark

Brennan should pick what he's most comfortable with — none of this is load-bearing.

---

## 8. Things explicitly out of scope (for V1)

- Multi-tenancy / org accounts (everyone's on one Covert tenant for now)
- Custom theming per broker
- Recurring proposal regeneration (auto-refresh data quarterly)
- Analytics dashboards beyond per-proposal status
- A native mobile app (the web app is responsive enough for now)
- Editing the visual design of the proposal — that's locked
- A separate "broker portal" — partner brokers come later if at all

---

## 9. Open questions

### Resolved (Jesse 5/28/26 + Steph)

- **Input format** → PDF only. ✅ implemented.
- **No calculators** → the PCR already contains the computed figures; the tool extracts and places them. ✅ implemented.
- **Overdose-death projection** → members managing withdrawal ÷ 820, suppressed when plan < 300 members. ✅ implemented.
- **Page order / layout / copy** → per Jesse's 5/28 markups (see Revision Log). ✅ implemented.

### Resolved by Jesse 6/3/26 (implemented)

- [x] **5th Clinical Warning Signs wheel** → confirmed: **713** = pharmacies that filled an opioid Rx for the same member from multiple prescribers (PCR p4 "Pharmacies > 1 Prescriber").
- [x] **ROI** → "Guaranteed ROI" is retired. ROI ratio = **avoided medical spend ÷ cost**, where cost = members with an opioid Rx × $600 and savings = at-risk members × **$23,790**. Shown on both the Decision page (replacing "Guaranteed ROI") and the Next Steps page (~18:1 on the RxSense demo).

### Still pending Jesse

1. **"Break these down by month" (Live Risk Tickers).** Need confirmation of which figures to show as a per-month breakdown. (Left as a TODO in code.)

### Still pending Jesse (longer-horizon, for production build)

4. **CTA wiring.** When a prospect clicks "Request Client Service Agreement," what should happen? Email Jesse? Salesforce lead? Calendar booking?
5. **PCR formats.** Sample PCRs from every vendor Covert receives data from (RxSense ✅ have, Express Scripts, OptumRx, others?) so Brennan can build real parsers.
6. **Cost amplification numbers.** Currently citing Ingenix data. Better/newer source he prefers?
7. **Access / branding.** Internal Covert only, or partner brokers too at launch? Always Covert-branded, or white-label for brokers?

These go to Stephanie:

1. Launch timeline and what "done" looks like
2. Who else is reviewing/blessing this before it ships
3. Whether the existing Vercel deploy stays as the production environment or moves elsewhere

---

## Revision Log — Jesse 5/28/26 (applied)

Source: `Edits 5.28.26.docx` (annotated screenshots of the demo).

1. **Page reorder:** Hero → **Prescription Utilization** (now p2) → **"120/5,028 members…preventable harm"** (now p3) → **Live Risk Tickers** (now p4) → remaining sections unchanged.
2. **Hero:** added a right-hand "At a Glance" stat box — pharmacies dispensing opioids, prescribers providing opioids to at-risk patients, members with opioid Rx, members managing severe withdrawal symptoms.
3. **Executive Summary (p3):** identified-members count is now the hero number with everything stacked below it; removed the right-hand "60 prescribers" box (prescribers are covered later); updated body copy.
4. **Live Risk Tickers (p4):** restructured to 5 cards; removed the static "18 days" card; **Box 5 = projected opioid-overdose deaths** (withdrawal ÷ 820, hidden < 300 members).
5. **Member Risk Breakdown:** improved visibility of the tier descriptor text.
6. **Prescribers Creating Risk:** removed the "total prescribers" (108) stat; the flagged count is now the single hero number with "flagged for…" beneath.
7. **Clinical Warning Signs:** added a 5th wheel — "Pharmacies missing multi-prescriber activity" (**713** per Jesse 6/3: pharmacies that filled for the same member from multiple prescribers).
8. **Withdrawal Indicators:** relabeled to "…severe withdrawal symptoms indicators"; updated paragraph copy.
9. **Chronic Conditions:** updated the descriptor below the hero number to "Members experiencing worsening chronic conditions driven by opioid withdrawal."
10. **Financial Impact:** reworded the savings box; added a second, annualized member-impact row (become addicted / manage severe withdrawal / worsening chronic / at risk of overdose death).
11. **The Decision:** "The Difference" column → reduction in avoidable medical spend / **`X:1` projected ROI** / Improved member outcomes / Safer opioid prescribing practices.
12. **ROI model (Jesse 6/3):** "Guaranteed ROI" retired; ROI ratio = avoided medical spend (at-risk members × $23,790) ÷ cost (members with opioid Rx × $600). Applied on the Decision + Next Steps pages.

> **Note for the financial model:** the new ROI inputs imply a much larger "avoided medical spend" figure than the dollar amounts shown in the **Clinical & Financial Impact** section (which still uses the older per-member basis). The ROI **ratio** is correct per Jesse; the large dollar figures in that section were intentionally **not** rewritten to avoid an inconsistent half-migration. If Jesse wants the whole financial section reconciled to the $23,790 / $600 model, that's a follow-up — flag to Steph.

Demo data now reflects the real RxSense PCR (97,301 members w/ Rx, 11,094 opioid Rx, 5,028 identified, etc.).

---

## 10. Where to start

Suggested order for Brennan:

1. Read the existing repo — start with `app/page.tsx`, then `components/output/OutputProposal.tsx`, then `lib/types.ts`
2. Run it locally (`npm install && npm run dev`)
3. Add `?preview=output` to the URL to jump straight to the rendered proposal (this is a QA shortcut already in the code)
4. Get a sample PCR PDF from Jesse and build the parser first — that's the biggest unknown
5. Auth + storage second
6. Sharing link + CTA hook last

Stack one piece at a time. The front-end won't change unless something breaks; it's all powered by `PCRData` flowing through props.
