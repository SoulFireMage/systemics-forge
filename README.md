# The Systems Forge

A training platform for systems thinking. It builds one reflex: reading a messy, event-by-event narrative (a news report, a policy pitch, a post-mortem) and seeing the plumbing underneath: stocks and flows, hidden delays, closed loops, perverse incentives and leverage points.

It's a static Preact + TypeScript app hosted on GitHub Pages. It works fully offline and logged out, with optional Skapi accounts for sync and bring-your-own-key OpenRouter for the AI-judged parts. The full specification is in [`spec.md`](spec.md).

**How it was built:** the shared architecture (ratings, sync, OpenRouter client, scheduler, admin studio) comes from [rhetoric-salle](https://github.com/SoulFireMage/rhetoric-salle). The domain layers listed in spec §6 were swapped in by an AI coding agent (Claude Code) from Richard’s spec.

## What's in it

| Area | What it does | Needs |
|---|---|---|
| **Deterministic drills** (Tier 1) | Anatomical Dissection (click the stock, the delay, the boundary error), Bathtub in the Wild (quantitative stock-flow puzzles with a worked ledger), Isomorphic Match (find the structural twin among four alien-domain disasters), Leverage Triage (archetype → POSIWID → highest Meadows leverage point). 34 seed drills; every one of the 24 skill nodes is covered. | Nothing |
| **Daily Calibration / Blitz** | A mixed queue aimed at the lowest-rated and most-rusted skills. Blitz is rapid dissections and matches with a streak multiplier and time-to-detection tracking. | Nothing |
| **Telemetry** | Four-wing radar, per-node rating ± uncertainty, readiness (decay) bars, attempt history and Crisis Desk record. | Nothing |
| **Generative Forge** (Tier 2) | Isomorphic Transposition Workbench (8 skeletons × 20 domain cards, with a client-side **Zero-Jargon validator** that highlights and blocks systems vocabulary), POSIWID & Iceberg Autopsy (80 words), the Leverage Upgrade (2–3 sentence rewrite). Without a key, self-check mode compares your work with a reference answer. | OpenRouter key (optional) |
| **The Crisis Desk** | 3–5 exchanges (130 words each) against a Linear Interventionist whose policy carries 2–3 hidden landmines (Blind Autopsy or Targeted Calibration), across five domains. A separate Chief Cyberneticist scores the five axes and rules the policy blocked, amended or ratified. Landmines exposed before the final exchange earn a blind-mode bonus. | OpenRouter key |
| **Admin Studio** | Batch-generate candidate drills of all four types, validate them, preview them live, edit the JSON and commit to the global bank. | Admin account + key |
| **Codex** | The full skill tree with formal and intuitive names and source notes. | Nothing |

There's a dual-register toggle (Formal / Both / Intuitive) everywhere, light and dark themes, and JSON export/import (which merges, never overwrites).

## Design decisions worth knowing

- **Inherited from rhetoric-salle:** Glicko-2 ratings on the ELO scale (start 1200), evidence weights (drills 1.0, Blitz 0.8, AI-judged 0.5, self-check 0.25), “FSRS-lite” readiness, checklist-computed judge scores, and robust JSON extraction. The parent README explains them.
- **Taxonomy:** spec §2 has 23 sub-nodes; Escalation and the Tragedy of the Commons are split into two nodes because their loop structures differ (noted in the Codex).
- **Leverage numbers** follow Meadows (1999), #12 weakest to #1 strongest. The validator enforces that the correct triage option has the lowest number, and the Guide says plainly that the ordering is a rule of thumb.
- **Crisis Desk landmines** are injected into the opponent’s system prompt as the design of its policy (not one tactic per round), so it argues for one coherent, flawed fix.
- **Seed numbers are checked by hand.** The carbon puzzle uses illustrative round numbers and says so.

## Data & privacy

- Progress lives in `localStorage` (`sf.*` keys). When signed in it also syncs to a **private** Skapi record. Merge rule: per skill node, the most recently practised copy wins; histories are unioned by id.
- The **OpenRouter key never leaves the browser** except in calls to `openrouter.ai`.
- Skapi tables are prefixed `sys_` (`sys_drill_bank`, `sys_telemetry`, `sys_desk_transcripts`), so this app can share the Rhetoric Forge’s Skapi project without the two reading each other’s data. The project ID and admin ID in `src/config.ts` are copied from the parent; change them if you want a separate project.

## Development

```sh
npm ci
npm run dev        # local dev server
npm test           # ratings, merge, scheduler, jargon validator, and validation of every seed drill and forge item
npm run build      # typecheck + production build into dist/
```

Seed drills: `src/data/drills/*.json` · taxonomy: `src/data/taxonomy.ts` · Forge content: `src/data/forge.ts` · Crisis Desk: `src/data/desk.ts` · judge rubrics: `src/lib/judges.ts`.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` tests, builds and deploys on every push to `main`. One-time setup: **repo Settings → Pages → Build and deployment → Source: GitHub Actions** (not “Deploy from a branch”). The build uses relative paths and hash routing, so it works at `https://<user>.github.io/systemics-forge/`.
