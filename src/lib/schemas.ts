import { z } from "zod";
import {
  PRIORITY,
  PROJECT_PHASE,
  PROJECT_HEALTH,
  ACTION_STATUS,
  RISK_LEVEL,
  ROLE,
} from "./domain";

const req = (msg: string) => z.string().trim().min(1, msg);

/** Parse a JSON-encoded array (submitted via a hidden input) into a validated list. */
function jsonArray<T extends z.ZodTypeAny>(
  itemSchema: T,
  opts?: { min?: number; minMsg?: string },
) {
  let arr = z.array(itemSchema);
  if (opts?.min) arr = arr.min(opts.min, opts.minMsg ?? "حداقل یک مورد اضافه کنید");
  return z
    .string()
    .optional()
    .default("[]")
    .transform((s, ctx) => {
      try {
        return JSON.parse(s && s.length > 0 ? s : "[]");
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "قالب داده نامعتبر است" });
        return z.NEVER;
      }
    })
    .pipe(arr);
}

// ── Projects ────────────────────────────────────────────────────────────────
const projectPhaseItemSchema = z.object({
  name: req("نام فاز را وارد کنید").max(80),
  startDate: req("تاریخ شروع فاز را وارد کنید"),
  deadline: z.string().trim().optional().default(""),
});

export const createProjectSchema = z.object({
  name: req("نام پروژه را وارد کنید").max(80, "نام پروژه طولانی است"),
  versionNumber: z.coerce.number().int().min(1).max(99),
  previousVersionId: z.string().trim().optional().default(""),
  pmId: req("مدیر پروژه را انتخاب کنید"),
  poId: z.string().trim().optional().default(""),
  priority: z.enum(PRIORITY),
  phase: z.enum(PROJECT_PHASE).optional().default("discovery"),
  phasesJson: jsonArray(projectPhaseItemSchema),
  startDate: req("تاریخ شروع را وارد کنید"),
  targetDate: z.string().trim().optional().default(""),
  statusSummary: z.string().trim().max(400).optional().default(""),
  executiveSummary: z.string().trim().max(1000).optional().default(""),
  currentFocus: z.string().trim().max(300).optional().default(""),
  nextMilestone: z.string().trim().max(200).optional().default(""),
});
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectStateSchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  health: z.enum(PROJECT_HEALTH),
  completion: z.coerce.number().int().min(0).max(100),
  statusSummary: z.string().trim().max(400),
  currentFocus: z.string().trim().max(300),
  nextMilestone: z.string().trim().max(200),
  targetDate: z.string().trim().optional().default(""),
});
export type UpdateProjectStateInput = z.infer<typeof updateProjectStateSchema>;

export const updateProjectInfoSchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  name: req("نام پروژه را وارد کنید").max(80, "نام پروژه طولانی است"),
  pmId: req("مدیر پروژه را انتخاب کنید"),
  poId: z.string().trim().optional().default(""),
  phase: z.enum(PROJECT_PHASE),
  priority: z.enum(PRIORITY),
});
export type UpdateProjectInfoInput = z.infer<typeof updateProjectInfoSchema>;

// ── People (inline "+ افزودن فرد جدید" creation) ────────────────────────────
export const createPersonSchema = z.object({
  name: req("نام فرد را وارد کنید").max(80),
  role: z.enum(ROLE),
});
export type CreatePersonInput = z.infer<typeof createPersonSchema>;

// ── Meetings ────────────────────────────────────────────────────────────────
const participantDraftSchema = z.object({
  personId: req("شرکت‌کننده نامعتبر است"),
  attended: z.boolean().optional().default(true),
});

const decisionDraftSchema = z.object({
  id: z.string().trim().optional(),
  text: req("عنوان تصمیم را وارد کنید").max(200),
  description: z.string().trim().max(500).optional().default(""),
  deciderId: req("مسئول تصمیم را انتخاب کنید"),
  area: z.string().trim().max(60).optional().default("عمومی"),
});
export type DecisionDraft = z.infer<typeof decisionDraftSchema>;

const actionDraftSchema = z.object({
  id: z.string().trim().optional(),
  title: req("عنوان اقدام را وارد کنید").max(160),
  ownerId: req("مسئول اقدام را انتخاب کنید"),
  deadline: z.string().trim().optional().default(""),
  priority: z.enum(PRIORITY),
  status: z.enum(ACTION_STATUS).optional().default("not_started"),
  relatedDecisionIndex: z.number().int().min(0).optional(),
});
export type ActionDraft = z.infer<typeof actionDraftSchema>;

/**
 * Shared by project meetings and Meeting Space meetings — same fields, same
 * validation, same sections, regardless of context. Exactly one of
 * projectId/spaceId identifies where the meeting lives.
 */
const meetingCoreSchema = z.object({
  projectId: z.string().trim().optional().default(""),
  spaceId: z.string().trim().optional().default(""),
  title: req("عنوان جلسه را وارد کنید").max(120),
  date: req("تاریخ جلسه را وارد کنید"),
  time: z.string().trim().default("10:00"),
  location: z.string().trim().max(120).optional().default(""),
  participantsJson: jsonArray(participantDraftSchema, { min: 1, minMsg: "حداقل یک شرکت‌کننده انتخاب کنید" }),
  agenda: z.string().trim().optional().default(""),
  discussion: z.string().trim().max(4000).optional().default(""),
  summaryPointsJson: jsonArray(z.string().trim().min(1).max(300), { min: 1, minMsg: "حداقل یک مورد برای خلاصهٔ جلسه اضافه کنید" }),
  nextSteps: z.string().trim().optional().default(""),
  decisionsJson: jsonArray(decisionDraftSchema),
  actionsJson: jsonArray(actionDraftSchema),
}).refine((v) => !!v.projectId || !!v.spaceId, {
  message: "زمینهٔ جلسه (پروژه یا دستهٔ جلسات) مشخص نیست",
  path: ["projectId"],
});

export const createMeetingSchema = meetingCoreSchema;
export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;

export const updateMeetingSchema = z.intersection(
  meetingCoreSchema,
  z.object({ meetingId: req("شناسهٔ جلسه لازم است") }),
);
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>;

// ── Decisions / Actions / Dependencies ──────────────────────────────────────
export const addDecisionSchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  meetingId: z.string().trim().optional().default(""),
  text: req("متن تصمیم را وارد کنید").max(500),
  description: z.string().trim().max(500).optional().default(""),
  deciderId: req("تصمیم‌گیرنده را انتخاب کنید"),
  date: req("تاریخ تصمیم را وارد کنید"),
  area: z.string().trim().max(60).optional().default("عمومی"),
  impact: z.string().trim().max(60).optional().default("متوسط"),
  relatedActionIds: z.array(z.string()).optional().default([]),
});

export const addActionSchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  meetingId: z.string().trim().optional().default(""),
  title: req("عنوان اقدام را وارد کنید").max(160),
  description: z.string().trim().max(600).optional().default(""),
  ownerId: req("مسئول اقدام را انتخاب کنید"),
  deadline: z.string().trim().optional().default(""),
  priority: z.enum(PRIORITY),
  relatedDecisionId: z.string().trim().optional().default(""),
  blockingActionId: z.string().trim().optional().default(""),
});

export const updateActionStatusSchema = z.object({
  actionId: req("شناسهٔ اقدام لازم است"),
  status: z.enum(ACTION_STATUS),
});

export const addDependencySchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  blockingActionId: req("اقدام مسدودکننده را انتخاب کنید"),
  blockedActionId: req("اقدام مسدودشده را انتخاب کنید"),
  note: z.string().trim().max(300).optional().default(""),
}).refine((v) => v.blockingActionId !== v.blockedActionId, {
  message: "یک اقدام نمی‌تواند مسدودکنندهٔ خودش باشد",
  path: ["blockedActionId"],
});

export const addRiskSchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  title: req("عنوان ریسک را وارد کنید").max(240),
  impact: z.enum(RISK_LEVEL),
  probability: z.enum(RISK_LEVEL),
  ownerId: z.string().trim().optional().default(""),
  mitigation: z.string().trim().max(400).optional().default(""),
});

export const addBlockerSchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  title: req("عنوان مانع را وارد کنید").max(240),
  description: z.string().trim().max(500).optional().default(""),
  ownerId: z.string().trim().optional().default(""),
});

export const addCommentSchema = z.object({
  meetingId: req("شناسهٔ جلسه لازم است"),
  authorName: req("نام خود را وارد کنید").max(80),
  body: req("متن بازخورد را وارد کنید").max(1000),
});

export const signMeetingSchema = z.object({
  signatureId: req("شناسهٔ امضا لازم است"),
  meetingId: req("شناسهٔ جلسه لازم است"),
  decision: z.enum(["approved", "changes_requested"]),
  comment: z.string().trim().max(600).optional().default(""),
});

// ── Meeting Spaces (organization meetings, independent of a project) ───────
export const createMeetingSpaceSchema = z.object({
  name: req("نام دستهٔ جلسات را وارد کنید").max(80, "نام دستهٔ جلسات طولانی است"),
  description: z.string().trim().max(400).optional().default(""),
  ownerId: req("مسئول دسته را انتخاب کنید"),
});
export type CreateMeetingSpaceInput = z.infer<typeof createMeetingSpaceSchema>;

export const closeProjectSchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  comment: z.string().trim().max(600).optional().default(""),
  finalResult: req("خلاصهٔ نتیجهٔ نهایی را وارد کنید").max(1000),
});
