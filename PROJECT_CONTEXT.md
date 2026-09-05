# Project Context

## Product concept

A **Project Governance & Meeting Accountability System**. It is a governance‑focused workspace where PMs and POs maintain project health and document every meeting as an approved, traceable record of decisions, actions, ownership, dependencies, and change.

It is **not** a task manager, chat product, meeting‑hosting tool, wiki, or work OS. The differentiator is *governed continuity from meeting agreement to project state*: signed meeting outcomes, direct traceability from project state back to meeting evidence, PM/PO‑controlled data, versioned closure, and CEO sign‑off.

Source of truth: `Sources/INFORMATION_ARCHITECTURE.md` (IA) and `Sources/UX_BENCHMARK_RESEARCH.md` (benchmarks).

## Users / actors

- **PM (مدیر پروژه)** & **PO (مالک محصول)** — principal operators: create/maintain projects, document meetings, record decisions/actions/dependencies, update project state, share meeting summaries.
- **Team Lead / Participant (سرپرست تیم)** — a deliberately *lightweight* reviewer: opens a meeting review link, reads the summary, comments, and digitally approves/signs.
- **CEO (مدیرعامل)** — final approver: signs off the final project result, which closes the project version.

## Core entities

`Project` → `Meeting` → `Decision` → `Action` (+ Owner, Deadline, Status, Priority, Related Decision) → `Dependency` (Blocked by / Blocking); plus `Risk`, `Blocker`, `Milestone`, `Workstream`, `Comment`, `Signature`, `ProjectApproval`, `Activity`, `Person`. Full types in `src/lib/domain.ts`.

## Primary flows

1. **Project** — create → open → update health/progress/deadline → view history.
2. **Meeting documentation** — create meeting → add participants, decisions, actions → link actions to decisions → add dependencies → submit for review.
3. **Reviewer** — open review link → read summary/decisions/actions → comment → approve & sign. When all signatures are approved the meeting auto‑transitions to «تأییدشده».
4. **History** — every meaningful change appends an `Activity` (actor, type, entity, previous/new value, timestamp, related meeting).
5. **Closure** — final review → CEO approval → project version marked closed (history preserved; a new version is a new record).

## Confirmed requirements honored

- Action = Owner + Deadline + Status + Priority + Related Decision + Dependency.
- Decisions are first‑class structured records, distinct from narrative notes.
- Dependencies use directional **Blocked by / Blocking** language.
- Meeting approval lifecycle: Draft → Ready for Review → Awaiting Signatures → Approved.
- Health states: On Track / At Risk / Off Track (label + indicator, never color‑only).
- New project version = new project record (predecessor linked, not merged).
- Complete change history; CEO sign‑off closes a version.

## Boundaries

No real auth, external DB, email/SMS, payment, e‑signature provider, notifications, background jobs, or AI transcription. The "Meeting Assistant" is explicitly future scope. Unresolved product questions are tracked in `docs/OPEN_PRODUCT_DECISIONS.md` and implemented with the smallest reversible choice.
