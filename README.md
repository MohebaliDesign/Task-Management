# سامانهٔ حاکمیت پروژه و پاسخگویی جلسات

**Project Governance & Meeting Accountability System** — an internal web application for PMs and POs to govern project state and turn every in‑person meeting into a traceable, approved record of decisions, actions, ownership, dependencies, and change history.

The product answers two questions at once:

- **پروژه الان کجاست؟** (Where is the project now?) — dashboard, health, progress, milestones.
- **چطور به این وضعیت رسید؟** (How did it get here?) — meetings → decisions → actions → dependencies → signatures → activity history.

The UI is entirely in **Persian (Farsi)** and **right‑to‑left (RTL)**.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | **Next.js 14** (App Router) + **React 18** + **TypeScript** (strict) |
| Styling | **Tailwind CSS v3** wired to the Algonet Design System via CSS variables |
| Components | **shadcn/ui** primitives (Radix under the hood), vendored into `src/components/ui` |
| Icons | **Iconsax** (`iconsax-react`), via a single `AppIcon` wrapper |
| Font | **Vazirmatn** (self‑hosted variable woff2, `next/font/local`) |
| Persistence | Local **JSON document** (`data/db.json`) driven by **Server Actions**; validation with **Zod** |
| Tests | Node's built‑in test runner (`node:test`) via `tsx` |

> Why JSON persistence instead of SQLite/Drizzle (which the brief lists as *preferred*): the target machine's npm mirror was offline and native modules add Windows build risk. A JSON‑document store keeps the prototype dependency‑free of native code while remaining a real server‑side read/write layer. Swapping in SQLite later touches only `src/lib/db.ts` + `src/lib/queries.ts`. See `docs/OPEN_PRODUCT_DECISIONS.md`.

---

## Prerequisites

- **Node.js ≥ 18** (developed on Node 22)
- npm (bundled). A project‑local `.npmrc` pins the **public npm registry** because the machine's default mirror (`cache.algonet.ir`) was unreachable during development — change it if you have an internal mirror.

## Install & run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. On first request the app seeds `data/db.json` automatically from `src/lib/seed.ts` (realistic synthetic Persian data).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm test` | Unit tests (seed integrity + governance logic) |
| `npm run seed` | Reset `data/db.json` to the clean seed dataset |

## Database / data store

- The store is a single file: `data/db.json` (git‑ignored; regenerated on demand).
- It is **seeded lazily** on first read, so a fresh clone just needs `npm run dev`.
- To reset to pristine seed data at any time: `npm run seed`.
- All reads go through `src/lib/queries.ts`; all writes go through the Server Actions in `src/lib/actions.ts` (the only write path), which also append to the activity log.

---

## Folder structure

```
src/
  app/
    (app)/                 # Authenticated PM/PO application (sidebar shell)
      page.tsx             #   داشبورد — cross-project dashboard
      projects/            #   list · new · [projectId]/{overview,meetings,decisions,actions,risks,activity,settings}
      activity/            #   global change history
    review/meeting/[token] # Lightweight reviewer / signature experience (no app nav)
    final-review/project/  # CEO final review & version closure
    layout.tsx             # <html lang="fa" dir="rtl"> + Vazirmatn + providers
    globals.css            # Design-system tokens → shadcn CSS variables
  components/
    ui/                    # shadcn primitives (Button, Card, Dialog, Select, …)
    domain/                # StatusPill/badges, PersonChip, PageHeader, EmptyState
    layout/                # AppShell, sidebar, mobile nav, theme toggle, brand
    form/                  # Field + SubmitButton helpers
    icon.tsx               # Iconsax registry + <AppIcon>
  features/                # Domain feature components (projects, meetings, actions, …)
  lib/                     # domain.ts, labels.ts, schemas.ts, db.ts, queries.ts, actions.ts, logic.ts, seed.ts
tests/                     # node:test suites
docs/                      # Architecture & design-system documentation
inputs/design-system/      # Extracted Algonet design tokens (Figma exports)
```

## shadcn/ui

Components live under `src/components/ui` and follow the shadcn "new‑york" style (see `components.json`). Because the environment is non‑interactive (no shadcn CLI/MCP prompts and the MCP servers required OAuth that can't run here), the primitives are **vendored** (the standard MIT shadcn source) and adapted for **RTL** and **Iconsax** (no Lucide). Primitives used: Button, Card, Badge, Input, Textarea, Label, Select, Dialog, Alert Dialog, Sheet, Dropdown Menu, Tabs, Tooltip, Avatar, Table, Progress, Separator, Skeleton, Sonner (toast).

## Design System

Company tokens are the source of truth. The Figma "shadcn" token exports (colors, radius, spacing, shadows, typography) were extracted to `inputs/design-system/` and mapped into semantic CSS variables in `src/app/globals.css`. See `docs/DESIGN_SYSTEM.md` and `docs/DESIGN_SYSTEM_MAPPING.md`. The skill/generator palettes never override company tokens.

## Verification status

`npm run lint` · `npm run typecheck` · `npm test` (15 passing) · `npm run build` all pass. Core flows (project CRUD, meeting documentation, decisions, actions, dependencies, reviewer signature → meeting auto‑approval, activity history, version closure) were exercised against the running app. See the handoff notes for details.
