# Architecture

## Overview

A Next.js 14 App Router application. Pages are **React Server Components** that read the data store synchronously through `src/lib/queries.ts`; mutations are **Server Actions** in `src/lib/actions.ts`. Interactive pieces (forms, dialogs, selects, theme toggle) are small **Client Components** that call server actions via `useFormState` / `useFormStatus` and then `router.refresh()`.

```
Browser (RSC HTML + islands)
        │  form action / server action call
        ▼
Server Action (actions.ts)  ──►  Zod validate  ──►  mutate(db.json)  ──►  append Activity
        │                                                    │
        └────────────── revalidatePath() ◄───────────────────┘
```

## Layers

| Layer | File(s) | Responsibility |
|---|---|---|
| Domain model | `src/lib/domain.ts` | Entities + enums (stable English keys) |
| Labels | `src/lib/labels.ts` | Persian labels + semantic `tone` per enum value |
| Validation | `src/lib/schemas.ts` | Zod schemas for every mutation input |
| Store | `src/lib/db.ts` | `server-only` JSON read/write + lazy seed (`readDb`/`writeDb`/`mutate`) |
| Queries | `src/lib/queries.ts` | All read access + derived aggregates (stats, dependency views) |
| Actions | `src/lib/actions.ts` | `"use server"` mutations; the only write path; logs activity |
| Pure logic | `src/lib/logic.ts` | Framework‑free rules (approval, dependency direction) — unit‑tested |
| Seed | `src/lib/seed.ts` | Synthetic Persian dataset |

## Routing

- `(app)` route group → wrapped in `AppShell` (RTL sidebar + top bar), `dynamic = "force-dynamic"`.
- `review/meeting/[token]` and `final-review/project/[projectId]` live **outside** the group so they render a minimal shell with **no application navigation** (reviewer UX must stay narrow — IA §18).
- Project detail is a nested layout (`projects/[projectId]/layout.tsx`) that renders the project header + tab navigation, with sub‑routes: overview (index), `meetings`, `decisions`, `actions`, `risks`, `activity`, `settings`, and `meetings/[meetingId]`, `meetings/new`.

## Persistence model

A single JSON document (`data/db.json`) holds all collections (`Database` in `domain.ts`). `mutate(fn)` reads → applies `fn` → writes. For a single‑user local prototype this is sufficient; it is intentionally isolated behind `db.ts` + `queries.ts` so a future swap to SQLite/Drizzle is a localized change. The file is git‑ignored and regenerated from the seed.

## State & activity integrity

- Every meaningful mutation appends an `Activity` (actor, type, entity label, previous/new value, timestamp, optional meeting link).
- Signing a meeting updates the relevant `Signature`; when `allSignaturesApproved()` becomes true the meeting transitions to `approved` and logs `meeting_approved`.
- Closing a project records a CEO `ProjectApproval`, sets lifecycle `closed`, preserves history, and never overwrites prior versions.

## Theming

`next-themes` toggles a `.dark` class on `<html>`. All colors are CSS variables defined once in `globals.css` (light on `:root`, dark under `.dark`) and consumed through Tailwind semantic color names. Default theme is light.

## Accessibility & RTL

- `<html lang="fa" dir="rtl">`; layout uses logical properties (`ps/pe/ms/me`, `start/end`).
- Status is always label + indicator, never color alone.
- Radix primitives provide focus management, keyboard nav, and dialog semantics; forms use `<Field>` with `aria-describedby` error wiring and `aria-invalid`.
- `prefers-reduced-motion` disables animations.
