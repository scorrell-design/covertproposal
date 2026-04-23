# Covert — Opioid Risk Intelligence Proposal Generator

A client-facing proposal tool that transforms pharmacy claims data (PCR) into an actionable opioid risk intelligence report. Built for Covert, a clinical intelligence company identifying opioid risk embedded in employer health plans.

## Quick Start

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Usage

1. **Upload a PCR file** (PDF, CSV, or XLSX) — or click **"Try Demo with Sample Data"** to see the full report using AssuredPartners example data.
2. **Review and edit** the auto-populated form fields across 6 sections.
3. Click **"Generate Proposal"** to produce the full scrollable report.
4. Use **"Download PDF"** in the top nav to export a client-ready PDF.

## Tech Stack

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Tailwind CSS** + CSS custom properties for brand tokens
- **Cabin** (Google Fonts) — 400, 600, 700 weights
- **Lucide React** for iconography
- **Recharts** for data visualization
- **jsPDF + html2canvas** for PDF generation (dynamically loaded)
- **react-intersection-observer** for scroll-triggered animations

## Project Structure

```
app/          → Next.js App Router pages and global styles
components/
  input/      → PCR upload, form sections, input screen
  output/     → Proposal sections (hero, tickers, risk breakdown, etc.)
  shared/     → Reusable brand components (logo, labels, cards)
lib/          → Types, calculations, demo data, PDF export
```

## Key Financial Rates (2026)

| Rate | Value | Source |
|------|-------|--------|
| Savings per withdrawal member | $23,000 | Jesse Lisson, VP Covert |
| Cost per member on opioid Rx | $600 | Jesse Lisson, VP Covert |
| Case management cost per case | $400 | Standard |
| Preventable spend reduction | 75% | Covert engagement model |
| Deaths per identified members | 1 / 825 | Actuarial |
| Abuse/addiction rate | 25% | CDC-aligned |

## Deployment

Optimized for Vercel:

```bash
npm run build
```
