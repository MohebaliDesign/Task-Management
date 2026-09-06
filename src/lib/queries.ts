import "server-only";
import { readDb } from "./db";
import type {
  ActionItem,
  Activity,
  Blocker,
  Comment,
  Decision,
  Dependency,
  Meeting,
  Person,
  Project,
  ProjectApproval,
  Risk,
  Signature,
} from "./domain";

/** All read access goes through these helpers so pages never touch fs/db.ts. */

export function getPeople(): Person[] {
  return readDb().people;
}
export function getPerson(id: string | null | undefined): Person | undefined {
  if (!id) return undefined;
  return readDb().people.find((p) => p.id === id);
}

export function getProjects(): Project[] {
  return [...readDb().projects].sort((a, b) => {
    // Active/at-risk projects first, closed last; then by updatedAt desc.
    const closedA = a.lifecycle === "closed" ? 1 : 0;
    const closedB = b.lifecycle === "closed" ? 1 : 0;
    if (closedA !== closedB) return closedA - closedB;
    return a.updatedAt < b.updatedAt ? 1 : -1;
  });
}
export function getProject(id: string): Project | undefined {
  return readDb().projects.find((p) => p.id === id);
}

export function getMeetings(projectId: string): Meeting[] {
  return readDb()
    .meetings.filter((m) => m.projectId === projectId)
    .sort((a, b) => b.sequence - a.sequence);
}
export function getMeeting(id: string | null | undefined): Meeting | undefined {
  if (!id) return undefined;
  return readDb().meetings.find((m) => m.id === id);
}
export function getMeetingByToken(token: string): Meeting | undefined {
  return readDb().meetings.find((m) => m.reviewToken === token);
}

export function getDecisions(projectId: string): Decision[] {
  return readDb()
    .decisions.filter((d) => d.projectId === projectId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
export function getMeetingDecisions(meetingId: string): Decision[] {
  return readDb().decisions.filter((d) => d.meetingId === meetingId);
}

export function getActions(projectId: string): ActionItem[] {
  return readDb().actions.filter((a) => a.projectId === projectId);
}
export function getAction(id: string | null | undefined): ActionItem | undefined {
  if (!id) return undefined;
  return readDb().actions.find((a) => a.id === id);
}
export function getMeetingActions(meetingId: string): ActionItem[] {
  return readDb().actions.filter((a) => a.meetingId === meetingId);
}

export function getDependencies(projectId: string): Dependency[] {
  return readDb().dependencies.filter((d) => d.projectId === projectId);
}
export function getRisks(projectId: string): Risk[] {
  return readDb().risks.filter((r) => r.projectId === projectId);
}
export function getBlockers(projectId: string): Blocker[] {
  return readDb().blockers.filter((b) => b.projectId === projectId);
}
export function getComments(meetingId: string): Comment[] {
  return readDb()
    .comments.filter((c) => c.meetingId === meetingId)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}
export function getSignatures(meetingId: string): Signature[] {
  return readDb().signatures.filter((s) => s.meetingId === meetingId);
}
export function getProjectApproval(projectId: string): ProjectApproval | undefined {
  return readDb().projectApprovals.find((a) => a.projectId === projectId);
}

export function getActivities(projectId?: string): Activity[] {
  const all = readDb().activities;
  const list = projectId ? all.filter((a) => a.projectId === projectId) : all;
  return [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// ── Derived / aggregate helpers ─────────────────────────────────────────────
export interface ProjectStats {
  openActions: number;
  blockedActions: number;
  openBlockers: number;
  openRisks: number;
  meetingsAwaitingSignature: number;
  decisions: number;
}
export function getProjectStats(projectId: string): ProjectStats {
  const db = readDb();
  return {
    openActions: db.actions.filter((a) => a.projectId === projectId && a.status !== "done" && a.status !== "canceled").length,
    blockedActions: db.actions.filter((a) => a.projectId === projectId && a.status === "blocked").length,
    openBlockers: db.blockers.filter((b) => b.projectId === projectId && b.status === "open").length,
    openRisks: db.risks.filter((r) => r.projectId === projectId && r.status !== "resolved").length,
    meetingsAwaitingSignature: db.meetings.filter((m) => m.projectId === projectId && m.status === "awaiting_signatures").length,
    decisions: db.decisions.filter((d) => d.projectId === projectId).length,
  };
}

export interface DependencyView {
  dependency: Dependency;
  blocking: ActionItem | undefined;
  blocked: ActionItem | undefined;
}
export function getDependencyViews(projectId: string): DependencyView[] {
  const db = readDb();
  return db.dependencies
    .filter((d) => d.projectId === projectId)
    .map((dependency) => ({
      dependency,
      blocking: db.actions.find((a) => a.id === dependency.blockingActionId),
      blocked: db.actions.find((a) => a.id === dependency.blockedActionId),
    }));
}

/** Signatures summary for a meeting (e.g. "۱ از ۲ امضا"). */
export function getSignatureProgress(meetingId: string): { signed: number; total: number } {
  const sigs = readDb().signatures.filter((s) => s.meetingId === meetingId);
  return { signed: sigs.filter((s) => s.status === "approved").length, total: sigs.length };
}
