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

What exists today is a **prototype**: the front-end is built and styled, demo data is hard-coded, and the PDF download works. What's missing is the backend, real data ingestion, authentication, and CRM hooks. That's the scope of this build.

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
3. Clicks "New proposal," enters client name + uploads PCR
4. App actually reads the PCR (PDF/CSV/Excel) and extracts the data
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
2. **PCR file ingestion.** Accept PDF, CSV, XLSX uploads and extract these data points:
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

The visual design is **already built and locked.** Brennan should not redesign it — use the existing components.

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

## 9. Open questions (we need answers before building)

These go to Jesse:

1. **ROI display.** Math currently shows 29:1 in the demo. His note said "8:1 for example." Honest math, conservative cap, or different formula?
2. **Lives Saved formula.** Need his sign-off on the base rate (5% mortality × 30% intervention effectiveness) so it's defensible. Better citation if available.
3. **Cost amplification numbers.** Currently citing 2005-2006 Ingenix data. Better/newer source he prefers?
4. **CTA wiring.** When a prospect clicks "Request Client Service Agreement," what should happen? Email Jesse? Salesforce lead? Calendar booking?
5. **PCR formats.** Sample PCRs from every vendor Covert receives data from (RxSense, Express Scripts, OptumRx, others?) so Brennan can build real parsers.
6. **Edit step.** Should the salesperson be able to override extracted numbers before sending? (Recommend yes.)
7. **Distribution.** Just PDF download, or also direct email + shareable link?
8. **Access.** Internal Covert only, or partner brokers too at launch?
9. **Branding.** Always Covert-branded, or white-label for brokers?
10. **Other size-conditional content.** Lives Saved hides below 10K. Any other sections that depend on plan size or product mix (self-funded vs. fully insured)?

These go to Stephanie:

1. Launch timeline and what "done" looks like
2. Who else is reviewing/blessing this before it ships
3. Whether the existing Vercel deploy stays as the production environment or moves elsewhere

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
