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
  Person,
  Project,
  ProjectPhaseItem,
  Team,
} from "./domain";
import {
  addActionSchema,
  addBlockerSchema,
  addCommentSchema,
  addDecisionSchema,
  addDependencySchema,
  addPersonSchema,
  addRiskSchema,
  addTeamSchema,
  closeProjectSchema,
  createMeetingSchema,
  createMeetingSpaceSchema,
  createPersonSchema,
  createProjectSchema,
  signMeetingSchema,
  updateActionStatusSchema,
  updateActionStatusWithNoteSchema,
  updateBlockerStatusSchema,
  updateMeetingSchema,
  updateProjectInfoSchema,
  updateProjectStateSchema,
} from "./schemas";
import { actionStatusLabels, blockerStatusLabels, healthLabels, roleLabels } from "./labels";
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

/** AssigneeSelect submits "none" for the explicit no-owner option; both that and "" mean unassigned. */
function normalizeOwnerId(v: string): string | null {
  return v && v !== "none" ? v : null;
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
  const phases: ProjectPhaseItem[] = v.phasesJson.map((p) => ({
    id: makeId("phz"),
    name: p.name,
    startDate: new Date(p.startDate).toISOString(),
    deadline: p.deadline ? new Date(p.deadline).toISOString() : null,
  }));
  mutate((db) => {
    // Case 1: linked to a previous version. Case 2: a fresh, unlinked version number.
    const previousVersionId = v.previousVersionId && db.projects.some((x) => x.id === v.previousVersionId)
      ? v.previousVersionId
      : null;
    const project: Project = {
      id,
      name: v.name,
      versionLabel: `نسخه ${v.versionNumber}`,
      versionNumber: v.versionNumber,
      previousVersionId,
      lifecycle: "active",
      health: "on_track",
      priority: v.priority,
      phase: v.phase,
      phases,
      pmId: v.pmId,
      poId: v.poId || null,
      startDate: new Date(v.startDate).toISOString(),
      targetDate: v.targetDate ? new Date(v.targetDate).toISOString() : null,
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
      resources: [],
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
    const newTarget = v.targetDate ? new Date(v.targetDate).toISOString() : null;
    if ((p.targetDate?.slice(0, 10) ?? null) !== (newTarget?.slice(0, 10) ?? null)) {
      pushActivity(db, { projectId: p.id, type: "deadline_changed", entityLabel: "مهلت پروژه", previousValue: p.targetDate?.slice(0, 10) ?? "بدون مهلت", newValue: newTarget?.slice(0, 10) ?? "بدون مهلت" });
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

export async function updateProjectInfo(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = updateProjectInfoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  mutate((db) => {
    const p = db.projects.find((x) => x.id === v.projectId);
    if (!p) return;
    const prevName = p.name;
    p.name = v.name;
    p.pmId = v.pmId;
    p.poId = v.poId || null;
    p.phase = v.phase;
    p.priority = v.priority;
    p.updatedAt = nowIso();
    pushActivity(db, {
      projectId: p.id,
      type: "project_updated",
      entityLabel: "به‌روزرسانی اطلاعات پروژه",
      previousValue: prevName !== v.name ? prevName : null,
      newValue: prevName !== v.name ? v.name : null,
    });
  });
  revalidatePath(`/projects/${v.projectId}`);
  revalidatePath(`/projects/${v.projectId}/settings`);
  revalidatePath("/projects");
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

// ── People (inline "+ افزودن فرد جدید" creation) ────────────────────────────
function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export type CreatePersonResult =
  | { ok: true; person: Person }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function createPerson(formData: FormData): Promise<CreatePersonResult> {
  const parsed = createPersonSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  const person: Person = {
    id: makeId("p"),
    name: v.name,
    role: v.role,
    title: roleLabels[v.role],
    email: "",
    initials: initialsFrom(v.name) || "?",
  };
  mutate((db) => {
    db.people.push(person);
    // Not tied to a specific project — logged against no project context.
  });
  revalidatePath("/");
  return { ok: true, person };
}

// ── Meetings ────────────────────────────────────────────────────────────────
function splitLines(s: string): string[] {
  return s.split("\n").map((x) => x.trim()).filter(Boolean);
}

function meetingBasePath(m: Pick<Meeting, "projectId" | "spaceId">): string {
  return m.projectId ? `/projects/${m.projectId}/meetings` : `/meetings/${m.spaceId}`;
}
function revalidateMeetingPaths(m: Pick<Meeting, "id" | "projectId" | "spaceId">) {
  const base = meetingBasePath(m);
  revalidatePath(base);
  revalidatePath(`${base}/${m.id}`);
  if (m.projectId) {
    revalidatePath(`/projects/${m.projectId}/decisions`);
    revalidatePath(`/projects/${m.projectId}/actions`);
    revalidatePath(`/projects/${m.projectId}/risks`);
    revalidatePath(`/projects/${m.projectId}`);
  } else {
    revalidatePath("/meetings");
  }
}

export async function createMeeting(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = createMeetingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  const id = makeId("mtg");
  const projectId = v.projectId || null;
  const spaceId = v.spaceId || null;
  mutate((db) => {
    const seq = db.meetings.filter((m) => (projectId ? m.projectId === projectId : m.spaceId === spaceId)).length + 1;
    const meeting: Meeting = {
      id,
      projectId,
      spaceId,
      sequence: seq,
      title: v.title,
      date: new Date(v.date).toISOString(),
      time: v.time,
      location: v.location,
      status: "draft",
      revision: 1,
      source: "manual",
      participants: v.participantsJson.map((p) => ({ personId: p.personId, attended: p.attended })),
      agenda: splitLines(v.agenda),
      discussion: v.discussion,
      summary: v.summaryPointsJson.join(" ؛ "),
      summaryPoints: v.summaryPointsJson,
      nextSteps: splitLines(v.nextSteps),
      createdById: OPERATOR.id,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      reviewToken: `rev-${id}`,
    };
    db.meetings.push(meeting);
    if (projectId) pushActivity(db, { projectId, meetingId: id, type: "meeting_created", entityLabel: v.title, newValue: "پیش‌نویس" });
    if (spaceId) {
      const space = db.meetingSpaces.find((s) => s.id === spaceId);
      if (space) space.updatedAt = nowIso();
    }

    // Decisions drafted inline in the meeting form — created in order so
    // actions below can reference them by index before they have real ids.
    const decisionIds: string[] = [];
    for (const d of v.decisionsJson) {
      const decisionId = makeId("dec");
      const decision: Decision = {
        id: decisionId,
        projectId,
        meetingId: id,
        text: d.text,
        description: d.description,
        deciderId: d.deciderId,
        date: meeting.date,
        area: d.area,
        impact: "medium",
        createdAt: nowIso(),
      };
      db.decisions.push(decision);
      decisionIds.push(decisionId);
      if (projectId) pushActivity(db, { projectId, meetingId: id, type: "decision_added", entityLabel: d.text.slice(0, 60) });
    }

    for (const a of v.actionsJson) {
      const actionId = makeId("act");
      const relatedDecisionId = a.relatedDecisionIndex !== undefined ? decisionIds[a.relatedDecisionIndex] ?? null : null;
      const action: ActionItem = {
        id: actionId,
        projectId,
        meetingId: id,
        title: a.title,
        description: "",
        ownerId: a.ownerId,
        deadline: a.deadline ? new Date(a.deadline).toISOString() : null,
        status: a.status,
        priority: a.priority,
        relatedDecisionId,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        completedAt: a.status === "done" ? nowIso() : null,
        note: "",
      };
      db.actions.push(action);
      if (projectId) pushActivity(db, { projectId, meetingId: id, type: "action_added", entityLabel: a.title });
    }

    for (const b of v.blockersJson) {
      const blockerId = makeId("blk");
      db.blockers.push({
        id: blockerId, projectId, meetingId: id, title: b.title, description: b.description,
        status: "open", ownerId: b.ownerId || null, raisedDate: nowIso(), resolvedDate: null, note: "",
      });
      if (projectId) pushActivity(db, { projectId, meetingId: id, type: "blocker_added", entityLabel: b.title, newValue: "باز" });
    }
  });
  revalidateMeetingPaths({ id, projectId, spaceId });
  return { ok: true, id };
}

export async function updateMeeting(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = updateMeetingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  let touched: { id: string; projectId: string | null; spaceId: string | null } | null = null;
  mutate((db) => {
    const m = db.meetings.find((x) => x.id === v.meetingId);
    if (!m) return;
    m.title = v.title;
    m.date = new Date(v.date).toISOString();
    m.time = v.time;
    m.location = v.location;
    m.participants = v.participantsJson.map((p) => ({ personId: p.personId, attended: p.attended }));
    m.agenda = splitLines(v.agenda);
    m.discussion = v.discussion;
    m.summary = v.summaryPointsJson.join(" ؛ ");
    m.summaryPoints = v.summaryPointsJson;
    m.nextSteps = splitLines(v.nextSteps);
    m.updatedAt = nowIso();

    // Decisions/actions are fully synchronised from the submitted lists:
    // items carrying an existing id are updated in place, unlisted items are
    // removed, and items without an id are inserted fresh.
    const existingDecisions = db.decisions.filter((d) => d.meetingId === m.id);
    const decisionIds: string[] = [];
    const keepDecisionIds = new Set<string>();
    for (const d of v.decisionsJson) {
      const existing = d.id ? existingDecisions.find((ed) => ed.id === d.id) : undefined;
      if (existing) {
        existing.text = d.text;
        existing.description = d.description;
        existing.deciderId = d.deciderId;
        existing.area = d.area;
        decisionIds.push(existing.id);
        keepDecisionIds.add(existing.id);
      } else {
        const newId = makeId("dec");
        db.decisions.push({ id: newId, projectId: m.projectId, meetingId: m.id, text: d.text, description: d.description, deciderId: d.deciderId, date: m.date, area: d.area, impact: "medium", createdAt: nowIso() });
        decisionIds.push(newId);
        keepDecisionIds.add(newId);
      }
    }
    db.decisions = db.decisions.filter((d) => d.meetingId !== m.id || keepDecisionIds.has(d.id));

    const existingActions = db.actions.filter((a) => a.meetingId === m.id);
    const keepActionIds = new Set<string>();
    for (const a of v.actionsJson) {
      const relatedDecisionId = a.relatedDecisionIndex !== undefined ? decisionIds[a.relatedDecisionIndex] ?? null : null;
      const existing = a.id ? existingActions.find((ea) => ea.id === a.id) : undefined;
      if (existing) {
        existing.title = a.title;
        existing.ownerId = a.ownerId;
        existing.deadline = a.deadline ? new Date(a.deadline).toISOString() : null;
        existing.priority = a.priority;
        existing.status = a.status;
        existing.relatedDecisionId = relatedDecisionId;
        existing.updatedAt = nowIso();
        existing.completedAt = a.status === "done" ? (existing.completedAt ?? nowIso()) : null;
        keepActionIds.add(existing.id);
      } else {
        const newId = makeId("act");
        db.actions.push({
          id: newId, projectId: m.projectId, meetingId: m.id, title: a.title, description: "",
          ownerId: a.ownerId, deadline: a.deadline ? new Date(a.deadline).toISOString() : null,
          status: a.status, priority: a.priority, relatedDecisionId,
          createdAt: nowIso(), updatedAt: nowIso(), completedAt: a.status === "done" ? nowIso() : null, note: "",
        });
        keepActionIds.add(newId);
      }
    }
    db.actions = db.actions.filter((a) => a.meetingId !== m.id || keepActionIds.has(a.id));

    const existingBlockers = db.blockers.filter((b) => b.meetingId === m.id);
    const keepBlockerIds = new Set<string>();
    for (const b of v.blockersJson) {
      const existing = b.id ? existingBlockers.find((eb) => eb.id === b.id) : undefined;
      if (existing) {
        existing.title = b.title;
        existing.description = b.description;
        existing.ownerId = b.ownerId || null;
        keepBlockerIds.add(existing.id);
      } else {
        const newId = makeId("blk");
        db.blockers.push({ id: newId, projectId: m.projectId, meetingId: m.id, title: b.title, description: b.description, status: "open", ownerId: b.ownerId || null, raisedDate: nowIso(), resolvedDate: null, note: "" });
        keepBlockerIds.add(newId);
      }
    }
    db.blockers = db.blockers.filter((b) => b.meetingId !== m.id || keepBlockerIds.has(b.id));

    if (m.projectId) pushActivity(db, { projectId: m.projectId, meetingId: m.id, type: "meeting_updated", entityLabel: m.title });
    touched = { id: m.id, projectId: m.projectId, spaceId: m.spaceId };
  });
  if (touched) revalidateMeetingPaths(touched);
  return { ok: true, id: v.meetingId };
}

export async function submitMeetingForReview(meetingId: string): Promise<ActionResult> {
  let touched: { id: string; projectId: string | null; spaceId: string | null } | null = null;
  mutate((db) => {
    const m = db.meetings.find((x) => x.id === meetingId);
    if (!m) return;
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
    if (m.projectId) pushActivity(db, { projectId: m.projectId, meetingId, type: "meeting_submitted", entityLabel: m.title, previousValue: "پیش‌نویس", newValue: "در انتظار امضا" });
    touched = { id: m.id, projectId: m.projectId, spaceId: m.spaceId };
  });
  if (touched) revalidateMeetingPaths(touched);
  return { ok: true };
}

// ── Decisions / Actions / Dependencies ──────────────────────────────────────
export async function addDecision(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const relatedActionIds = formData.getAll("relatedActionIds").map(String).filter(Boolean);
  const parsed = addDecisionSchema.safeParse({ ...raw, relatedActionIds });
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  const id = makeId("dec");
  const meetingId = v.meetingId || null;
  mutate((db) => {
    const decision: Decision = { id, projectId: v.projectId, meetingId, text: v.text, description: v.description, deciderId: v.deciderId, date: new Date(v.date).toISOString(), area: v.area, impact: v.impact, createdAt: nowIso() };
    db.decisions.push(decision);
    pushActivity(db, { projectId: v.projectId, meetingId, type: "decision_added", entityLabel: v.text.slice(0, 60) });
    for (const actionId of v.relatedActionIds) {
      const action = db.actions.find((a) => a.id === actionId);
      if (action && !action.relatedDecisionId) {
        action.relatedDecisionId = id;
        action.updatedAt = nowIso();
      }
    }
  });
  if (meetingId) revalidatePath(`/projects/${v.projectId}/meetings/${meetingId}`);
  revalidatePath(`/projects/${v.projectId}/decisions`);
  revalidatePath(`/projects/${v.projectId}`);
  return { ok: true, id };
}

export async function addAction(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = addActionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  const id = makeId("act");
  const meetingId = v.meetingId || null;
  mutate((db) => {
    const action: ActionItem = {
      id, projectId: v.projectId, meetingId, title: v.title, description: v.description,
      ownerId: normalizeOwnerId(v.ownerId), deadline: v.deadline ? new Date(v.deadline).toISOString() : null,
      status: "not_started", priority: v.priority, relatedDecisionId: v.relatedDecisionId || null,
      createdAt: nowIso(), updatedAt: nowIso(), completedAt: null, note: "",
    };
    db.actions.push(action);
    pushActivity(db, { projectId: v.projectId, meetingId, type: "action_added", entityLabel: v.title });
    if (v.blockingActionId) {
      db.dependencies.push({ id: makeId("dep"), projectId: v.projectId, blockingActionId: v.blockingActionId, blockedActionId: id, note: "", createdAt: nowIso() });
      pushActivity(db, { projectId: v.projectId, meetingId, type: "dependency_added", entityLabel: `«${v.title}» مسدود شد` });
    }
  });
  if (meetingId) revalidatePath(`/projects/${v.projectId}/meetings/${meetingId}`);
  revalidatePath(`/projects/${v.projectId}/actions`);
  revalidatePath(`/projects/${v.projectId}`);
  return { ok: true, id };
}

export async function updateActionStatus(formData: FormData): Promise<ActionResult> {
  const parsed = updateActionStatusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "وضعیت نامعتبر است." };
  const v = parsed.data;
  let projectId: string | null = null;
  mutate((db) => {
    const a = db.actions.find((x) => x.id === v.actionId);
    if (!a) return;
    projectId = a.projectId;
    const prev = a.status;
    a.status = v.status;
    a.updatedAt = nowIso();
    a.completedAt = v.status === "done" ? nowIso() : null;
    if (a.projectId) pushActivity(db, { projectId: a.projectId, meetingId: a.meetingId, type: "action_status_changed", entityLabel: a.title, previousValue: actionStatusLabels[prev].label, newValue: actionStatusLabels[v.status].label });
  });
  if (projectId) {
    revalidatePath(`/projects/${projectId}/actions`);
    revalidatePath(`/projects/${projectId}`);
  }
  return { ok: true };
}

export async function updateActionStatusWithNote(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = updateActionStatusWithNoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  let projectId: string | null = null;
  mutate((db) => {
    const a = db.actions.find((x) => x.id === v.actionId);
    if (!a) return;
    projectId = a.projectId;
    const prev = a.status;
    a.status = v.status;
    a.updatedAt = nowIso();
    a.completedAt = v.status === "done" ? nowIso() : null;
    a.note = v.note;
    if (a.projectId) pushActivity(db, { projectId: a.projectId, meetingId: a.meetingId, type: "action_status_changed", entityLabel: a.title, previousValue: actionStatusLabels[prev].label, newValue: actionStatusLabels[v.status].label });
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
    db.blockers.push({ id: makeId("blk"), projectId: v.projectId, meetingId: null, title: v.title, description: v.description, status: "open", ownerId: normalizeOwnerId(v.ownerId), raisedDate: nowIso(), resolvedDate: null, note: "" });
    pushActivity(db, { projectId: v.projectId, type: "blocker_added", entityLabel: v.title, newValue: "باز" });
  });
  revalidatePath(`/projects/${v.projectId}/actions`);
  revalidatePath(`/projects/${v.projectId}`);
  return { ok: true };
}

export async function updateBlockerStatus(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = updateBlockerStatusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  let projectId: string | null = null;
  mutate((db) => {
    const b = db.blockers.find((x) => x.id === v.blockerId);
    if (!b) return;
    projectId = b.projectId;
    const prev = b.status;
    b.status = v.status;
    b.resolvedDate = v.status === "resolved" ? nowIso() : null;
    b.note = v.note;
    if (b.projectId) pushActivity(db, { projectId: b.projectId, meetingId: b.meetingId, type: "blocker_status_changed", entityLabel: b.title, previousValue: blockerStatusLabels[prev].label, newValue: blockerStatusLabels[v.status].label });
  });
  if (projectId) {
    revalidatePath(`/projects/${projectId}/actions`);
    revalidatePath(`/projects/${projectId}`);
  }
  return { ok: true };
}

// ── Meeting Spaces (organization meetings, independent of a project) ───────
export async function createMeetingSpace(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = createMeetingSpaceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  const id = makeId("spc");
  mutate((db) => {
    db.meetingSpaces.unshift({
      id,
      name: v.name,
      description: v.description,
      ownerId: v.ownerId,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
  });
  revalidatePath("/");
  revalidatePath("/meetings");
  return { ok: true, id };
}

// ── Review flow (reviewer-facing) ───────────────────────────────────────────
export async function addComment(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = addCommentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  let touched: { id: string; projectId: string | null; spaceId: string | null } | null = null;
  mutate((db) => {
    const m = db.meetings.find((x) => x.id === v.meetingId);
    if (!m) return;
    db.comments.push({ id: makeId("cm"), meetingId: v.meetingId, authorId: "reviewer", authorName: v.authorName, body: v.body, createdAt: nowIso() });
    if (m.projectId) pushActivity(db, { projectId: m.projectId, meetingId: v.meetingId, type: "comment_added", actorName: v.authorName, entityLabel: "بازخورد بازبین" });
    touched = { id: m.id, projectId: m.projectId, spaceId: m.spaceId };
  });
  if (touched) revalidateMeetingPaths(touched);
  return { ok: true };
}

export async function signMeeting(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = signMeetingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "امضا ناموفق بود.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  let touched: { id: string; projectId: string | null; spaceId: string | null } | null = null;
  mutate((db) => {
    const s = db.signatures.find((x) => x.id === v.signatureId);
    const m = db.meetings.find((x) => x.id === v.meetingId);
    if (!s || !m) return;
    s.status = v.decision;
    s.comment = v.comment;
    s.signedAt = v.decision === "approved" ? nowIso() : null;
    if (m.projectId) {
      pushActivity(db, {
        projectId: m.projectId, meetingId: m.id, type: "signature_added", actorId: s.approverId, actorName: s.approverName,
        entityLabel: `امضای «${m.title}»`, previousValue: "در انتظار", newValue: v.decision === "approved" ? "تأیید و امضا شد" : "نیازمند اصلاح",
      });
    }
    // If all signatures approved → meeting approved.
    const sigs = db.signatures.filter((x) => x.meetingId === m.id);
    if (allSignaturesApproved(sigs)) {
      m.status = "approved";
      m.updatedAt = nowIso();
      if (m.projectId) pushActivity(db, { projectId: m.projectId, meetingId: m.id, type: "meeting_approved", entityLabel: m.title, previousValue: "در انتظار امضا", newValue: "تأییدشده" });
    } else if (v.decision === "changes_requested" && m.projectId) {
      pushActivity(db, { projectId: m.projectId, meetingId: m.id, type: "meeting_submitted", entityLabel: m.title, previousValue: "در انتظار امضا", newValue: "نیازمند اصلاح" });
    }
    touched = { id: m.id, projectId: m.projectId, spaceId: m.spaceId };
  });
  if (touched) {
    revalidateMeetingPaths(touched);
    revalidatePath(`/review/meeting/${v.meetingId}`);
  }
  return { ok: true };
}

// ── People & Teams ──────────────────────────────────────────────────────────
export async function addPerson(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = addPersonSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  const id = makeId("p");
  mutate((db) => {
    const person: Person = { id, name: v.name, role: v.role, title: v.title, email: v.email, initials: initialsFrom(v.name) };
    db.people.push(person);
    if (v.teamId && v.teamId !== "none") {
      const team = db.teams.find((t) => t.id === v.teamId);
      if (team && !team.memberIds.includes(id)) team.memberIds.push(id);
    }
  });
  revalidatePath("/people");
  return { ok: true, id };
}

export async function addTeam(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = addTeamSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "لطفاً خطاهای فرم را برطرف کنید.", fieldErrors: fieldErrorsFrom(parsed.error) };
  const v = parsed.data;
  const id = makeId("tm");
  mutate((db) => {
    const team: Team = { id, name: v.name, description: v.description, leadId: v.leadId && v.leadId !== "none" ? v.leadId : null, memberIds: [] };
    db.teams.push(team);
  });
  revalidatePath("/people");
  return { ok: true, id };
}
