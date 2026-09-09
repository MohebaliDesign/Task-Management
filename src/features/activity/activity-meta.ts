import type { IconName } from "@/components/icon";
import type { Tone } from "@/lib/labels";
import type { Activity, ActivityType } from "@/lib/domain";

/** Icon + semantic tone per activity type (item #60-61) — restrained, always paired with text, never color-only. */
export const activityMeta: Record<ActivityType, { icon: IconName; tone: Tone }> = {
  project_created: { icon: "projects", tone: "primary" },
  project_updated: { icon: "edit", tone: "primary" },
  health_changed: { icon: "verify", tone: "info" },
  deadline_changed: { icon: "calendar", tone: "info" },
  milestone_updated: { icon: "milestone", tone: "primary" },
  meeting_created: { icon: "meetings", tone: "primary" },
  meeting_updated: { icon: "edit", tone: "primary" },
  meeting_submitted: { icon: "send", tone: "info" },
  meeting_approved: { icon: "approval", tone: "success" },
  decision_added: { icon: "decision", tone: "primary" },
  action_added: { icon: "actions", tone: "primary" },
  action_status_changed: { icon: "actions", tone: "warning" },
  action_owner_changed: { icon: "profile", tone: "info" },
  dependency_added: { icon: "dependency", tone: "neutral" },
  risk_added: { icon: "risk", tone: "warning" },
  blocker_added: { icon: "blocker", tone: "danger" },
  blocker_status_changed: { icon: "blocker", tone: "warning" },
  comment_added: { icon: "comment", tone: "info" },
  signature_added: { icon: "approval", tone: "success" },
  ceo_approval: { icon: "verify", tone: "success" },
  project_closed: { icon: "archive", tone: "neutral" },
  person_added: { icon: "profile", tone: "primary" },
};

/** Types whose previous/new value is a short state label worth rendering as compact badges (item #54). */
const STATUS_TRANSITION_TYPES: ReadonlySet<ActivityType> = new Set<ActivityType>([
  "health_changed",
  "meeting_submitted",
  "meeting_approved",
  "action_status_changed",
  "blocker_status_changed",
  "project_closed",
]);

export function isStatusTransition(a: Activity): boolean {
  return STATUS_TRANSITION_TYPES.has(a.type) && !!a.previousValue && !!a.newValue;
}

/**
 * Human sentence for the event title (item #52) — entity name embedded and
 * quoted, actor kept separate (rendered as its own Actor field). Falls back
 * to the generic label when an event has no entity name to embed.
 */
export function activityTitle(a: ActivityType, entityLabel: string): string {
  const name = entityLabel ? `«${entityLabel}»` : "";
  switch (a) {
    case "project_created": return `پروژه ${name} ایجاد شد`;
    case "project_updated": return `اطلاعات پروژه به‌روزرسانی شد`;
    case "health_changed": return `سلامت پروژه تغییر کرد`;
    case "deadline_changed": return `مهلت پروژه تغییر کرد`;
    case "milestone_updated": return `نقطه‌عطف ${name} به‌روزرسانی شد`;
    case "meeting_created": return `جلسه ${name} ثبت شد`;
    case "meeting_updated": return `جلسه ${name} ویرایش شد`;
    case "meeting_submitted": return `جلسه ${name} برای بازبینی ارسال شد`;
    case "meeting_approved": return `جلسه ${name} تأیید و امضا شد`;
    case "decision_added": return `تصمیم ${name} ثبت شد`;
    case "action_added": return `اقدام ${name} افزوده شد`;
    case "action_status_changed": return `وضعیت اقدام ${name} تغییر کرد`;
    case "action_owner_changed": return `مسئول اقدام ${name} تغییر کرد`;
    case "dependency_added": return `وابستگی جدیدی ثبت شد${name ? `: ${name}` : ""}`;
    case "risk_added": return `ریسک ${name} ثبت شد`;
    case "blocker_added": return `مانع ${name} ثبت شد`;
    case "blocker_status_changed": return `وضعیت مانع ${name} تغییر کرد`;
    case "comment_added": return `بازخورد جدیدی ثبت شد`;
    case "signature_added": return `امضای جدیدی ثبت شد`;
    case "ceo_approval": return `تأیید نهایی مدیرعامل ثبت شد`;
    case "project_closed": return `نسخهٔ پروژه ${name} بسته شد`;
    case "person_added": return `${name || "فرد جدید"} به فهرست افراد افزوده شد`;
  }
}
