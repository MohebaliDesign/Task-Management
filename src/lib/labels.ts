/**
 * Persian (user-facing) labels for every domain enum, plus a "tone" that maps
 * each state to a semantic color role. Tone is never color-only: components
 * always render the label text alongside the indicator (accessibility req #23).
 */
import type {
  ProjectHealth,
  ProjectLifecycle,
  ProjectPhase,
  Priority,
  HealthDimension,
  MeetingStatus,
  ActionStatus,
  ApprovalStatus,
  RiskLevel,
  RiskStatus,
  BlockerStatus,
  MilestoneStatus,
  Role,
  ActivityType,
  ResourceKind,
} from "./domain";

export type Tone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

interface LabelEntry {
  label: string;
  tone: Tone;
}

export const healthLabels: Record<ProjectHealth, LabelEntry> = {
  on_track: { label: "در مسیر", tone: "success" },
  at_risk: { label: "در معرض خطر", tone: "warning" },
  off_track: { label: "خارج از مسیر", tone: "danger" },
};

export const lifecycleLabels: Record<ProjectLifecycle, LabelEntry> = {
  draft: { label: "پیش‌نویس", tone: "muted" },
  active: { label: "فعال", tone: "primary" },
  ready_for_review: { label: "آماده بازبینی نهایی", tone: "info" },
  awaiting_ceo_approval: { label: "در انتظار تأیید مدیرعامل", tone: "warning" },
  closed: { label: "بسته‌شده", tone: "neutral" },
};

export const phaseLabels: Record<ProjectPhase, LabelEntry> = {
  discovery: { label: "کاوش", tone: "info" },
  design: { label: "طراحی", tone: "info" },
  development: { label: "توسعه", tone: "primary" },
  testing: { label: "آزمون", tone: "warning" },
  launch: { label: "عرضه", tone: "success" },
  maintenance: { label: "نگهداشت", tone: "neutral" },
};

export const priorityLabels: Record<Priority, LabelEntry> = {
  low: { label: "کم", tone: "muted" },
  medium: { label: "متوسط", tone: "info" },
  high: { label: "زیاد", tone: "warning" },
  critical: { label: "بحرانی", tone: "danger" },
};

export const dimensionLabels: Record<HealthDimension, string> = {
  scope: "دامنه",
  timeline: "زمان‌بندی",
  resources: "منابع",
  quality: "کیفیت",
  dependencies: "وابستگی‌ها",
  risks: "ریسک‌ها",
  budget: "بودجه",
};

export const meetingStatusLabels: Record<MeetingStatus, LabelEntry> = {
  draft: { label: "پیش‌نویس", tone: "muted" },
  ready_for_review: { label: "آماده بازبینی", tone: "info" },
  awaiting_signatures: { label: "در انتظار امضا", tone: "warning" },
  approved: { label: "تأییدشده", tone: "success" },
};

export const actionStatusLabels: Record<ActionStatus, LabelEntry> = {
  not_started: { label: "شروع‌نشده", tone: "muted" },
  in_progress: { label: "در حال انجام", tone: "primary" },
  blocked: { label: "مسدود", tone: "danger" },
  done: { label: "انجام‌شده", tone: "success" },
  canceled: { label: "لغوشده", tone: "neutral" },
};

export const approvalStatusLabels: Record<ApprovalStatus, LabelEntry> = {
  pending: { label: "در انتظار", tone: "warning" },
  approved: { label: "تأیید و امضا شد", tone: "success" },
  feedback_submitted: { label: "بازخورد ثبت شد", tone: "info" },
  changes_requested: { label: "نیازمند اصلاح", tone: "danger" },
};

export const riskLevelLabels: Record<RiskLevel, LabelEntry> = {
  low: { label: "کم", tone: "success" },
  medium: { label: "متوسط", tone: "warning" },
  high: { label: "زیاد", tone: "danger" },
};

export const riskStatusLabels: Record<RiskStatus, LabelEntry> = {
  open: { label: "باز", tone: "warning" },
  mitigating: { label: "در حال کاهش", tone: "info" },
  resolved: { label: "برطرف‌شده", tone: "success" },
};

export const blockerStatusLabels: Record<BlockerStatus, LabelEntry> = {
  open: { label: "باز", tone: "danger" },
  resolved: { label: "برطرف‌شده", tone: "success" },
};

export const milestoneStatusLabels: Record<MilestoneStatus, LabelEntry> = {
  planned: { label: "برنامه‌ریزی‌شده", tone: "muted" },
  in_progress: { label: "در حال انجام", tone: "primary" },
  done: { label: "انجام‌شده", tone: "success" },
  at_risk: { label: "در معرض خطر", tone: "warning" },
};

export const resourceKindLabels: Record<ResourceKind, string> = {
  figma: "فایل طراحی",
  repo: "مخزن کد",
  docs: "سند",
  drive: "فضای ذخیره‌سازی",
  slack: "کانال ارتباطی",
  other: "منبع پروژه",
};

export const roleLabels: Record<Role, string> = {
  pm: "مدیر پروژه",
  po: "مالک محصول",
  team_lead: "سرپرست تیم",
  ceo: "مدیرعامل",
  member: "عضو تیم",
};

export const activityLabels: Record<ActivityType, string> = {
  project_created: "پروژه ایجاد شد",
  project_updated: "اطلاعات پروژه به‌روزرسانی شد",
  health_changed: "سلامت پروژه تغییر کرد",
  deadline_changed: "مهلت پروژه تغییر کرد",
  milestone_updated: "نقطه‌عطف به‌روزرسانی شد",
  meeting_created: "جلسه ثبت شد",
  meeting_submitted: "جلسه برای بازبینی ارسال شد",
  meeting_approved: "جلسه تأیید شد",
  decision_added: "تصمیم افزوده شد",
  action_added: "اقدام افزوده شد",
  action_status_changed: "وضعیت اقدام تغییر کرد",
  action_owner_changed: "مسئول اقدام تغییر کرد",
  dependency_added: "وابستگی افزوده شد",
  risk_added: "ریسک افزوده شد",
  blocker_added: "مانع افزوده شد",
  comment_added: "بازخورد ثبت شد",
  signature_added: "امضا ثبت شد",
  ceo_approval: "تأیید نهایی مدیرعامل",
  project_closed: "نسخه پروژه بسته شد",
};

/** Tailwind classes per tone for the shared Badge/StatusDot components. */
export const toneClasses: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success-subtle text-success border-success/20",
  warning: "bg-warning-subtle text-warning border-warning/20",
  danger: "bg-destructive-subtle text-destructive-text border-destructive/20",
  info: "bg-accent text-accent-foreground border-border",
  muted: "bg-muted text-muted-foreground border-border",
};

export const toneDot: Record<Tone, string> = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-foreground-alt",
  muted: "bg-muted-foreground",
};