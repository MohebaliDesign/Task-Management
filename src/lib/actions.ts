"use server";

import { revalidatePath } from "next/cache";
import { mutate, readDb } from "./db";
import { makeId } from "./utils";
import type {
  ActionItem,
  Activity,
  ActivityType,
  Decision,
  Meeting,
  Project,
} from "./domain";
import {
  addActionSchema,
  addBlockerSchema,
  addCommentSchema,
  addDecisionSchema,
  addDependencySchema,
  addRiskSchema,
  closeProjectSchema,
  createMeetingSchema,
  createProjectSchema,
  signMeetingSchema,
  updateActionStatusSchema,
  updateProjectStateSchema,
} from "./schemas";
import { actionStatusLabels, healthLabels } from "./labels";
import { allSignaturesApproved } from "./logic";

/**
 * Server actions — the only write path into the data store. Every meaningful
 * mutation appends an Activity so the change history stays authoritative.
 * The acting operator is fixed to the PM (سارا احمدی) for this local prototype;
 * a real auth layer would supply the actor. See docs/OPEN_PRODUCT_DECISIONS.md.
 */

const OPERATOR = { id: "p_sara", name: "سارا احمدی" };

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function nowIso() {
  return new Date().toISOString();
}

function pushActivity(
  db: ReturnType<typeof readDb>,
  a: Pick<Activity, "projectId" | "type" | "entityLabel"> & Partial<Activity>,
) {
  db.activities.unshift({
    id: makeId("act"),
    createdAt: a.createdAt ?? nowIso(),
    actorId: a.actorId ?? OPERATOR.id,
    actorName: a.actorName ?? OPERATOR.name,
    projectId: a.projectId,
    meetingId: a.meetingId ?? null,
    type: a.type,
    entityLabel: a.entityLabel,
    previousValue: a.previousValue ?? null,
    newValue: a.newValue ?? null,
  });
}

function fieldErrorsFrom(err: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (err && typeof err === "object" && "issues" in err) {
    for (const issue of (err as { issues: { path: (string | number)[]; message: string }[] }).issues) {
      const key = String(issue.path[0] ?? "form");
      if (!out[key]) out[key] = issue.message;
    }
  }
  return out;
}

// ── Projects ────────────────────────────────────────────────────────────────
export async function createProject(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = createProjectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  const id = makeId("prj");
  mutate((db) => {
    const project: Project = {
      id,
      name: v.name,
      versionLabel: `نسخه ${v.versionNumber}`,
      versionNumber: v.versionNumber,
      previousVersionId: null,
      lifecycle: "active",
      health: "on_track",
      priority: v.priority,
      phase: v.phase,
      pmId: v.pmId,
      poId: v.poId,
      startDate: new Date(v.startDate).toISOString(),
      targetDate: new Date(v.targetDate).toISOString(),
      deliveryDate: null,
      closedDate: null,
      completion: 0,
      statusSummary: v.statusSummary,
      currentFocus: v.currentFocus,
      nextMilestone: v.nextMilestone,
      executiveSummary: v.executiveSummary,
      healthCheck: { scope: "on_track", timeline: "on_track", resources: "on_track", quality: "on_track", dependencies: "on_track", risks: "on_track", budget: "on_track" },
      metrics: [],
      milestones: [],
      workstreams: [],
      teamIds: [],
      links: [],
      finalResult: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    db.projects.unshift(project);
    pushActivity(db, { projectId: id, type: "project_created", entityLabel: `${v.name} — ${project.versionLabel}`, newValue: "فعال" });
  });
  revalidatePath("/");
  revalidatePath("/projects");
  return { ok: true, id };
}

export async function updateProjectState(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = updateProjectStateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  mutate((db) => {
    const p = db.projects.find((x) => x.id === v.projectId);
    if (!p) return;
    if (p.health !== v.health) {
      pushActivity(db, { projectId: p.id, type: "health_changed", entityLabel: "سلامت پروژه", previousValue: healthLabels[p.health].label, newValue: healthLabels[v.health].label });
    }
    const newTarget = new Date(v.targetDate).toISOString();
    if (p.targetDate.slice(0, 10) !== newTarget.slice(0, 10)) {
      pushActivity(db, { projectId: p.id, type: "deadline_changed", entityLabel: "مهلت پروژه", previousValue: p.targetDate.slice(0, 10), newValue: newTarget.slice(0, 10) });
    }
    p.health = v.health;
    p.completion = v.completion;
    p.statusSummary = v.statusSummary;
    p.currentFocus = v.currentFocus;
    p.nextMilestone = v.nextMilestone;
    p.targetDate = newTarget;
    p.updatedAt = nowIso();
    pushActivity(db, { projectId: p.id, type: "project_updated", entityLabel: "به‌روزرسانی وضعیت پروژه" });
  });
  revalidatePath(`/projects/${v.projectId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function closeProject(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = closeProjectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  mutate((db) => {
    const p = db.projects.find((x) => x.id === v.projectId);
    if (!p) return;
    db.projectApprovals.push({
      id: makeId("pa"),
      projectId: p.id,
      approverId: "p_kaveh",
      approverName: "کاوه مرادی",
      status: "approved",
      comment: v.comment,
      signedAt: nowIso(),
    });
    p.lifecycle = "closed";
    p.closedDate = nowIso();
    p.deliveryDate = p.deliveryDate ?? nowIso();
    p.finalResult = v.finalResult;
    p.completion = 100;
    p.updatedAt = nowIso();
    pushActivity(db, { projectId: p.id, type: "ceo_approval", actorId: "p_kaveh", actorName: "کاوه مرادی", entityLabel: "تأیید نهایی مدیرعامل", newValue: "تأییدشده" });
    pushActivity(db, { projectId: p.id, type: "project_closed", entityLabel: p.versionLabel, previousValue: "فعال", newValue: "بسته‌شده" });
  });
  revalidatePath(`/projects/${v.projectId}`);
  revalidatePath("/");
  return { ok: true };
}

// ── Meetings ────────────────────────────────────────────────────────────────
function splitLines(s: string): string[] {
  return s.split("\n").map((x) => x.trim()).filter(Boolean);
}

export async function createMeeting(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const participantIds = formData.getAll("participantIds").map(String).filter(Boolean);
  const parsed = createMeetingSchema.safeParse({ ...raw, participantIds });
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  const id = makeId("mtg");
  mutate((db) => {
    const seq = db.meetings.filter((m) => m.projectId === v.projectId).length + 1;
    const meeting: Meeting = {
      id,
      projectId: v.projectId,
      sequence: seq,
      title: v.title,
      date: new Date(v.date).toISOString(),
      time: v.time,
      location: v.location,
      status: "draft",
      revision: 1,
      source: "manual",
      participants: participantIds.map((pid) => ({ personId: pid, attended: true })),
      agenda: splitLines(v.agenda),
      discussion: v.discussion,
      summary: v.summary,
      nextSteps: splitLines(v.nextSteps),
      openQuestions: splitLines(v.openQuestions),
      createdById: OPERATOR.id,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      reviewToken: `rev-${id}`,
    };
    db.meetings.push(meeting);
    pushActivity(db, { projectId: v.projectId, meetingId: id, type: "meeting_created", entityLabel: v.title, newValue: "پیش‌نویس" });
  });
  revalidatePath(`/projects/${v.projectId}/meetings`);
  return { ok: true, id };
}

export async function submitMeetingForReview(meetingId: string): Promise<ActionResult> {
  let projectId = "";
  mutate((db) => {
    const m = db.meetings.find((x) => x.id === meetingId);
    if (!m) return;
    projectId = m.projectId;
    // Ensure every team-lead participant has a pending signature to collect.
    const leads = m.participants
      .map((p) => db.people.find((x) => x.id === p.personId))
      .filter((p): p is NonNullable<typeof p> => !!p && p.role === "team_lead");
    for (const lead of leads) {
      const exists = db.signatures.some((s) => s.meetingId === meetingId && s.approverId === lead.id);
      if (!exists) {
        db.signatures.push({ id: makeId("sig"), meetingId, approverId: lead.id, approverName: lead.name, role: "team_lead", status: "pending", comment: "", signedAt: null, revision: m.revision });
      }
    }
    m.status = "awaiting_signatures";
    m.updatedAt = nowIso();
    pushActivity(db, { projectId: m.projectId, meetingId, type: "meeting_submitted", entityLabel: m.title, previousValue: "پیش‌نویس", newValue: "در انتظار امضا" });
  });
  if (projectId) {
    revalidatePath(`/projects/${projectId}/meetings/${meetingId}`);
    revalidatePath(`/projects/${projectId}/meetings`);
  }
  return { ok: true };
}

// ── Decisions / Actions / Dependencies ──────────────────────────────────────
export async function addDecision(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = addDecisionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  const id = makeId("dec");
  mutate((db) => {
    const decision: Decision = { id, projectId: v.projectId, meetingId: v.meetingId, text: v.text, deciderId: v.deciderId, date: nowIso(), area: v.area, impact: v.impact, createdAt: nowIso() };
    db.decisions.push(decision);
    pushActivity(db, { projectId: v.projectId, meetingId: v.meetingId, type: "decision_added", entityLabel: v.text.slice(0, 60) });
  });
  revalidatePath(`/projects/${v.projectId}/meetings/${v.meetingId}`);
  revalidatePath(`/projects/${v.projectId}/decisions`);
  return { ok: true, id };
}

export async function addAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = addActionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  const id = makeId("act");
  mutate((db) => {
    const action: ActionItem = {
      id, projectId: v.projectId, meetingId: v.meetingId, title: v.title, description: v.description,
      ownerId: v.ownerId, deadline: v.deadline ? new Date(v.deadline).toISOString() : null,
      status: "not_started", priority: v.priority, relatedDecisionId: v.relatedDecisionId || null,
      createdAt: nowIso(), updatedAt: nowIso(), completedAt: null,
    };
    db.actions.push(action);
    pushActivity(db, { projectId: v.projectId, meetingId: v.meetingId, type: "action_added", entityLabel: v.title });
  });
  revalidatePath(`/projects/${v.projectId}/meetings/${v.meetingId}`);
  revalidatePath(`/projects/${v.projectId}/actions`);
  return { ok: true, id };
}

export async function updateActionStatus(formData: FormData): Promise<ActionResult> {
  const parsed = updateActionStatusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "وضعیت نامعتبر است." };
  const v = parsed.data;
  let projectId = "";
  mutate((db) => {
    const a = db.actions.find((x) => x.id === v.actionId);
    if (!a) return;
    projectId = a.projectId;
    const prev = a.status;
    a.status = v.status;
    a.updatedAt = nowIso();
    a.completedAt = v.status === "done" ? nowIso() : null;
    pushActivity(db, { projectId: a.projectId, meetingId: a.meetingId, type: "action_status_changed", entityLabel: a.title, previousValue: actionStatusLabels[prev].label, newValue: actionStatusLabels[v.status].label });
  });
  if (projectId) {
    revalidatePath(`/projects/${projectId}/actions`);
    revalidatePath(`/projects/${projectId}`);
  }
  return { ok: true };
}

export async function addDependency(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = addDependencySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  mutate((db) => {
    db.dependencies.push({ id: makeId("dep"), projectId: v.projectId, blockingActionId: v.blockingActionId, blockedActionId: v.blockedActionId, note: v.note, createdAt: nowIso() });
    const blocked = db.actions.find((a) => a.id === v.blockedActionId);
    pushActivity(db, { projectId: v.projectId, type: "dependency_added", entityLabel: blocked ? `«${blocked.title}» مسدود شد` : "وابستگی جدید" });
  });
  revalidatePath(`/projects/${v.projectId}/actions`);
  return { ok: true };
}

// ── Risks / Blockers ────────────────────────────────────────────────────────
export async function addRisk(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = addRiskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  mutate((db) => {
    db.risks.push({ id: makeId("rsk"), projectId: v.projectId, meetingId: null, title: v.title, impact: v.impact, probability: v.probability, status: "open", ownerId: v.ownerId || null, mitigation: v.mitigation, createdAt: nowIso() });
    pushActivity(db, { projectId: v.projectId, type: "risk_added", entityLabel: v.title, newValue: "باز" });
  });
  revalidatePath(`/projects/${v.projectId}/risks`);
  revalidatePath(`/projects/${v.projectId}`);
  return { ok: true };
}

export async function addBlocker(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = addBlockerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  mutate((db) => {
    db.blockers.push({ id: makeId("blk"), projectId: v.projectId, meetingId: null, title: v.title, description: v.description, status: "open", ownerId: v.ownerId || null, raisedDate: nowIso(), resolvedDate: null });
    pushActivity(db, { projectId: v.projectId, type: "blocker_added", entityLabel: v.title, newValue: "باز" });
  });
  revalidatePath(`/projects/${v.projectId}/risks`);
  revalidatePath(`/projects/${v.projectId}`);
  return { ok: true };
}

// ── Review flow (reviewer-facing) ───────────────────────────────────────────
export async function addComment(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = addCommentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  let projectId = "";
  mutate((db) => {
    const m = db.meetings.find((x) => x.id === v.meetingId);
    if (!m) return;
    projectId = m.projectId;
    db.comments.push({ id: makeId("cm"), meetingId: v.meetingId, authorId: "reviewer", authorName: v.authorName, body: v.body, createdAt: nowIso() });
    pushActivity(db, { projectId: m.projectId, meetingId: v.meetingId, type: "comment_added", actorName: v.authorName, entityLabel: "بازخورد بازبین" });
  });
  if (projectId) revalidatePath(`/projects/${projectId}/meetings/${v.meetingId}`);
  return { ok: true };
}

export async function signMeeting(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = signMeetingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "امضا ناموفق بود.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  let projectId = "";
  mutate((db) => {
    const s = db.signatures.find((x) => x.id === v.signatureId);
    const m = db.meetings.find((x) => x.id === v.meetingId);
    if (!s || !m) return;
    projectId = m.projectId;
    s.status = v.decision;
    s.comment = v.comment;
    s.signedAt = v.decision === "approved" ? nowIso() : null;
    pushActivity(db, {
      projectId: m.projectId, meetingId: m.id, type: "signature_added", actorId: s.approverId, actorName: s.approverName,
      entityLabel: `امضای «${m.title}»`, previousValue: "در انتظار", newValue: v.decision === "approved" ? "تأیید و امضا شد" : "نیازمند اصلاح",
    });
    // If all signatures approved → meeting approved.
    const sigs = db.signatures.filter((x) => x.meetingId === m.id);
    if (allSignaturesApproved(sigs)) {
      m.status = "approved";
      m.updatedAt = nowIso();
      pushActivity(db, { projectId: m.projectId, meetingId: m.id, type: "meeting_approved", entityLabel: m.title, previousValue: "در انتظار امضا", newValue: "تأییدشده" });
    } else if (v.decision === "changes_requested") {
      pushActivity(db, { projectId: m.projectId, meetingId: m.id, type: "meeting_submitted", entityLabel: m.title, previousValue: "در انتظار امضا", newValue: "نیازمند اصلاح" });
    }
  });
  if (projectId) {
    revalidatePath(`/projects/${projectId}/meetings/${v.meetingId}`);
    revalidatePath(`/review/meeting/${v.meetingId}`);
  }
  return { ok: true };
}
