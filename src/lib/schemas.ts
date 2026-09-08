import { z } from "zod";
import {
  PRIORITY,
  PROJECT_PHASE,
  PROJECT_HEALTH,
  ACTION_STATUS,
  RISK_LEVEL,
  BLOCKER_STATUS,
  ROLE,
} from "./domain";

const req = (msg: string) => z.string().trim().min(1, msg);

export const createProjectSchema = z.object({
  name: req("نام پروژه را وارد کنید").max(80, "نام پروژه طولانی است"),
  versionNumber: z.coerce.number().int().min(1).max(99),
  pmId: req("مدیر پروژه را انتخاب کنید"),
  poId: req("مالک محصول را انتخاب کنید"),
  priority: z.enum(PRIORITY),
  phase: z.enum(PROJECT_PHASE),
  startDate: req("تاریخ شروع را وارد کنید"),
  targetDate: req("مهلت هدف را وارد کنید"),
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
  targetDate: req("مهلت هدف را وارد کنید"),
});
export type UpdateProjectStateInput = z.infer<typeof updateProjectStateSchema>;

export const createMeetingSchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  title: req("عنوان جلسه را وارد کنید").max(120),
  date: req("تاریخ جلسه را وارد کنید"),
  time: z.string().trim().default("10:00"),
  location: z.string().trim().max(120).optional().default(""),
  participantIds: z.array(z.string()).min(1, "حداقل یک شرکت‌کننده انتخاب کنید"),
  agenda: z.string().trim().optional().default(""),
  discussion: z.string().trim().max(4000).optional().default(""),
  summary: req("خلاصهٔ جلسه را وارد کنید").max(2000),
  nextSteps: z.string().trim().optional().default(""),
  openQuestions: z.string().trim().optional().default(""),
});
export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;

export const addDecisionSchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  meetingId: req("شناسهٔ جلسه لازم است"),
  text: req("متن تصمیم را وارد کنید").max(500),
  deciderId: req("تصمیم‌گیرنده را انتخاب کنید"),
  area: z.string().trim().max(60).optional().default("عمومی"),
  impact: z.enum(RISK_LEVEL).optional().default("medium"),
});

export const addActionSchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  meetingId: req("شناسهٔ جلسه لازم است"),
  title: req("عنوان اقدام را وارد کنید").max(160),
  description: z.string().trim().max(600).optional().default(""),
  ownerId: z.string().trim().optional().default(""),
  deadline: z.string().trim().optional().default(""),
  priority: z.enum(PRIORITY),
  relatedDecisionId: z.string().trim().optional().default(""),
});

export const updateActionStatusSchema = z.object({
  actionId: req("شناسهٔ اقدام لازم است"),
  status: z.enum(ACTION_STATUS),
});

/** Same update, driven from the Follow-ups tab's modal instead of the inline select on a meeting page — captures a note too. */
export const updateActionStatusWithNoteSchema = z.object({
  actionId: req("شناسهٔ اقدام لازم است"),
  status: z.enum(ACTION_STATUS),
  note: z.string().trim().max(400).optional().default(""),
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

export const updateBlockerStatusSchema = z.object({
  blockerId: req("شناسهٔ مانع لازم است"),
  status: z.enum(BLOCKER_STATUS),
  note: z.string().trim().max(400).optional().default(""),
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

export const closeProjectSchema = z.object({
  projectId: req("شناسهٔ پروژه لازم است"),
  comment: z.string().trim().max(600).optional().default(""),
  finalResult: req("خلاصهٔ نتیجهٔ نهایی را وارد کنید").max(1000),
});

export const addPersonSchema = z.object({
  name: req("نام را وارد کنید").max(80),
  title: req("سمت سازمانی را وارد کنید").max(80),
  role: z.enum(ROLE),
  email: z.string().trim().email("ایمیل معتبر نیست").optional().or(z.literal("")).default(""),
  teamId: z.string().trim().optional().default(""),
});

export const addTeamSchema = z.object({
  name: req("نام تیم را وارد کنید").max(80),
  description: z.string().trim().max(300).optional().default(""),
  leadId: z.string().trim().optional().default(""),
});
