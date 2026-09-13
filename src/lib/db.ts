import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { ActionItem, Blocker, Database, Decision, Meeting, Project } from "./domain";
import { buildSeed } from "./seed";

/**
 * Lightweight local persistence: a single JSON document on disk.
 *
 * This is a deliberate, documented alternative to the SQLite/Drizzle stack the
 * brief lists as "preferred" — see docs/OPEN_PRODUCT_DECISIONS.md. It keeps the
 * prototype dependency-free of native modules (reliable on Windows), while still
 * being a real server-side read/write layer driven by server actions.
 *
 * Concurrency note: for a single-user local prototype a naive read-modify-write
 * is sufficient. Swapping in SQLite later only touches this file + queries.ts.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function seedIfMissing() {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) {
    const seed = buildSeed();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), "utf8");
  }
}

/**
 * Local db.json is intentionally ignored by git and survives pulls/checkouts.
 * That means a developer can run a newer application against a snapshot written
 * by an older schema. Top-level collection defaults alone are not enough when a
 * later release adds nested arrays/nullable fields to an existing Project or
 * Meeting: pages calling `.length`, `.map`, or spreading those fields would then
 * crash at runtime.
 *
 * These normalizers only provide backwards-compatible structural defaults. They
 * do not invent new business decisions or replace valid persisted values.
 */
function normalizeProject(project: Project): Project {
  const health = project.health ?? "on_track";
  return {
    ...project,
    previousVersionId: project.previousVersionId ?? null,
    phases: project.phases ?? [],
    poId: project.poId ?? null,
    targetDate: project.targetDate ?? null,
    deliveryDate: project.deliveryDate ?? null,
    closedDate: project.closedDate ?? null,
    statusSummary: project.statusSummary ?? "",
    currentFocus: project.currentFocus ?? "",
    nextMilestone: project.nextMilestone ?? "",
    executiveSummary: project.executiveSummary ?? "",
    healthCheck:
      project.healthCheck ?? {
        scope: health,
        timeline: health,
        resources: health,
        quality: health,
        dependencies: health,
        risks: health,
        budget: health,
      },
    metrics: project.metrics ?? [],
    milestones: project.milestones ?? [],
    workstreams: project.workstreams ?? [],
    teamIds: project.teamIds ?? [],
    resources: project.resources ?? [],
    finalResult: project.finalResult ?? null,
  };
}

function normalizeMeeting(meeting: Meeting): Meeting {
  const summary = meeting.summary ?? "";
  return {
    ...meeting,
    projectId: meeting.projectId ?? null,
    spaceId: meeting.spaceId ?? null,
    location: meeting.location ?? "",
    revision: meeting.revision ?? 1,
    source: meeting.source ?? "manual",
    participants: meeting.participants ?? [],
    agenda: meeting.agenda ?? [],
    discussion: meeting.discussion ?? "",
    summary,
    summaryPoints: meeting.summaryPoints ?? (summary ? [summary] : []),
    nextSteps: meeting.nextSteps ?? [],
    reviewToken: meeting.reviewToken ?? `review_${meeting.id}`,
  };
}

function normalizeDecision(decision: Decision): Decision {
  return {
    ...decision,
    projectId: decision.projectId ?? null,
    meetingId: decision.meetingId ?? null,
    description: decision.description ?? "",
    area: decision.area ?? "عمومی",
  };
}

function normalizeAction(action: ActionItem): ActionItem {
  return {
    ...action,
    projectId: action.projectId ?? null,
    meetingId: action.meetingId ?? null,
    description: action.description ?? "",
    ownerId: action.ownerId ?? null,
    deadline: action.deadline ?? null,
    relatedDecisionId: action.relatedDecisionId ?? null,
    completedAt: action.completedAt ?? null,
    note: action.note ?? "",
  };
}

function normalizeBlocker(blocker: Blocker): Blocker {
  return {
    ...blocker,
    projectId: blocker.projectId ?? null,
    meetingId: blocker.meetingId ?? null,
    description: blocker.description ?? "",
    ownerId: blocker.ownerId ?? null,
    resolvedDate: blocker.resolvedDate ?? null,
    note: blocker.note ?? "",
  };
}

/**
 * A db.json on disk from before a schema change (a new top-level collection
 * added to `Database`) won't have that key at all — `seedIfMissing` only
 * covers a file that's missing entirely. Backfill absent collections and
 * normalize legacy nested entity shapes before any query sees them.
 */
function withCollectionDefaults(db: Partial<Database>): Database {
  return {
    people: db.people ?? [],
    teams: db.teams ?? [],
    projects: (db.projects ?? []).map(normalizeProject),
    meetings: (db.meetings ?? []).map(normalizeMeeting),
    decisions: (db.decisions ?? []).map(normalizeDecision),
    actions: (db.actions ?? []).map(normalizeAction),
    dependencies: db.dependencies ?? [],
    risks: db.risks ?? [],
    blockers: (db.blockers ?? []).map(normalizeBlocker),
    comments: db.comments ?? [],
    signatures: db.signatures ?? [],
    projectApprovals: db.projectApprovals ?? [],
    activities: db.activities ?? [],
    meetingSpaces: db.meetingSpaces ?? [],
  };
}

export function readDb(): Database {
  seedIfMissing();
  const raw = fs.readFileSync(DB_PATH, "utf8");
  return withCollectionDefaults(JSON.parse(raw) as Partial<Database>);
}

export function writeDb(db: Database): void {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

/** Read, mutate in place, persist — the single mutation primitive. */
export function mutate<T>(fn: (db: Database) => T): T {
  const db = readDb();
  const result = fn(db);
  writeDb(db);
  return result;
}

/** Force a reseed (used by `npm run seed`). */
export function resetDb(): void {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(buildSeed(), null, 2), "utf8");
}
