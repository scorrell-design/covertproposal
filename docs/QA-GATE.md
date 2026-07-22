# QA gate — Covert Proposal Generator (standard)

> Pre-deploy review gate (QA initiative). Nothing ships until every applicable box is checked.
> Tier sets the bar: portfolio/flagship > standard > demo. Canonical per-repo checklist; mirrored to
> the Notion QA Checklists DB (Portal Ops Hub). Kept in lockstep by the on-commit hook + `/qa-sync`.
> Auto-scaffolded 2026-07-22 — fill in evidence and adjust tier on the first real /qa.

**Product tier:** standard · **Reviewer:** Steph / Nichelle
**Build under review:** <commit / preview url> · **Date:** 2026-07-22

## Gate — must pass
- [ ] On GitHub (scorrell-design) and pushed.
- [ ] PRD (Notion) ↔ repo docs ↔ build reconciled (/prd-sync clean).
- [ ] Requirements in the PRD each demonstrably work (list evidence / screenshots).
- [ ] Netlify config correct (@netlify/plugin-nextjs present if CLI-created Next site).
- [ ] Demo data exhaustive + internally consistent (bump STORAGE_KEYs if seed changed).
- [ ] No vendor/third-party SDK/infra names in user-facing copy (run /brand-lint).
- [ ] Feature flags in intended state; flagged scope not leaking.
- [ ] No console errors on core flows (browser check).

## Tier-specific (flagship/portfolio only)
- [ ] Cross-tenant / multi-location behavior correct where applicable.
- [ ] Accessibility + responsive pass on primary screens.
- [ ] Performance acceptable on the heaviest data screen.

## Sign-off
- [ ] Steph approved. Notes: …
