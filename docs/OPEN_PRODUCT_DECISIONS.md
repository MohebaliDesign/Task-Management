# Open Product Decisions

The IA (`Sources/INFORMATION_ARCHITECTURE.md` §25) marks several requirements as **Open Question**. For each, this prototype implements the *smallest reversible* choice and records the assumption here so it is not mistaken for a settled product rule.

| # | Open question | Prototype assumption (reversible) | Where |
|---|---|---|---|
| 1 | Must every participant sign, or is a quorum enough? | **All** team‑lead participants must approve; the meeting auto‑approves only when every signature is `approved`. | `actions.ts` `signMeeting` + `logic.ts` `allSignaturesApproved` |
| 2 | Rejection / "changes requested" behavior | Reviewers may choose **درخواست اصلاح** (changes_requested); it is recorded on the signature + activity but does **not** auto‑revert the meeting. No re‑review state machine yet. | `signMeeting` |
| 3 | Do edits invalidate signatures? Is a signed meeting immutable? | Approved meetings are treated as **read‑only** in the UI (no add‑decision/action once closed/approved surfaces are gated by `readOnly`). Signature invalidation on edit is **not** implemented. | meeting/detail gating |
| 4 | Reviewer authentication / link validity | Review links are **unauthenticated tokens** with no expiry (prototype). Reviewer identity is chosen from the pending‑signature list. | `review/meeting/[token]` |
| 5 | Exact PM vs PO permission difference | Treated as **identical** operators; the acting user is fixed to the PM (سارا احمدی). | `actions.ts` `OPERATOR` |
| 6 | Multiple owners per action | **Single** owner per action. | `domain.ts` `ActionItem.ownerId` |
| 7 | Can an action exist without a decision? | **Yes** — `relatedDecisionId` is optional. | `domain.ts` |
| 8 | Dependency types | Only **Blocked by / Blocking** (Finish‑to‑Start), action‑to‑action. | `domain.ts` `Dependency` |
| 9 | CEO reject / reopen closed version | CEO approval **closes** the version; no reject or reopen path. New work = new version record. | `closeProject` |
| 10 | Export format (PDF/Word/print) | **Not implemented** (out of MVP scope for this pass). | — |
| 11 | Progress calculation | `completion` is a **manual** 0–100 field (matches Linear's manual+calculated hybrid intent); milestone/workstream progress are manual too. | `domain.ts`, project state form |

## Infrastructure decisions

- **Persistence** — brief lists SQLite + Drizzle as *preferred*. A local **JSON‑document store** was used instead because (a) the machine's npm mirror `cache.algonet.ir` was offline, and (b) native SQLite bindings add Windows build fragility. The store is isolated behind `db.ts` + `queries.ts` for a clean future swap. **Reversible.**
- **npm registry** — a project‑local `.npmrc` pins `registry.npmjs.org` because the default mirror 404'd on all packages during development. Remove/adjust if an internal mirror is available.
- **Font** — `Vazir FD‑WOL` (DS token) is proprietary and unavailable; shipped **Vazirmatn** (open‑source Vazir successor), which the brief explicitly requires. **Reversible** (swap the woff2 in `src/app/fonts`).
- **shadcn CLI/MCP** — the shadcn MCP servers require interactive OAuth that cannot run in this non‑interactive session; the shadcn primitives were therefore **vendored** from the standard MIT source and adapted for RTL + Iconsax. Functionally equivalent to a CLI install.
