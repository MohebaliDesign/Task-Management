import type {
  Database,
  Person,
  Project,
  Meeting,
  Decision,
  ActionItem,
  Dependency,
  Risk,
  Blocker,
  Comment,
  Signature,
  ProjectApproval,
  Activity,
} from "./domain";

/**
 * Synthetic but believable Persian seed data. Clearly fictional (people and
 * projects are invented) — demonstrates every governance state the UI supports:
 * multiple projects with different health, a closed prior version, meetings in
 * several approval states, decisions → actions provenance, blocking
 * dependencies, risks vs blockers, signatures, and a full activity trail.
 */

// Base clock: the seed is anchored near the app's "today" (1405/06 ≈ 2026-09).
const NOW = new Date("2026-09-05T09:00:00.000Z");
function daysAgo(n: number): string {
  return new Date(NOW.getTime() - n * 86_400_000).toISOString();
}
function daysAhead(n: number): string {
  return new Date(NOW.getTime() + n * 86_400_000).toISOString();
}

const people: Person[] = [
  { id: "p_sara", name: "سارا احمدی", role: "pm", title: "مدیر پروژه ارشد", email: "sara.ahmadi@algonet.ir", initials: "سا" },
  { id: "p_reza", name: "رضا کاظمی", role: "po", title: "مالک محصول", email: "reza.kazemi@algonet.ir", initials: "رک" },
  { id: "p_nima", name: "نیما رستمی", role: "team_lead", title: "سرپرست تیم مهندسی", email: "nima.rostami@algonet.ir", initials: "نر" },
  { id: "p_mina", name: "مینا شریفی", role: "team_lead", title: "سرپرست تیم طراحی", email: "mina.sharifi@algonet.ir", initials: "مش" },
  { id: "p_kaveh", name: "کاوه مرادی", role: "ceo", title: "مدیرعامل", email: "kaveh.moradi@algonet.ir", initials: "کم" },
  { id: "p_hassan", name: "حسن نوری", role: "member", title: "کارشناس تضمین کیفیت", email: "hassan.nouri@algonet.ir", initials: "حن" },
  { id: "p_leila", name: "لیلا فتحی", role: "member", title: "کارشناس محصول", email: "leila.fathi@algonet.ir", initials: "لف" },
  { id: "p_omid", name: "امید صادقی", role: "member", title: "مهندس بک‌اند", email: "omid.sadeghi@algonet.ir", initials: "اص" },
];

const meetings: Meeting[] = [];
const decisions: Decision[] = [];
const actions: ActionItem[] = [];
const dependencies: Dependency[] = [];
const risks: Risk[] = [];
const blockers: Blocker[] = [];
const comments: Comment[] = [];
const signatures: Signature[] = [];
const projectApprovals: ProjectApproval[] = [];
const activities: Activity[] = [];

let actSeq = 0;
function logActivity(a: Omit<Activity, "id">): void {
  activities.push({ id: `act_${(++actSeq).toString().padStart(3, "0")}`, ...a });
}

// ───────────────────────────────────────────────────────────────────────────
// PROJECT: لیلی — نسخه ۱ (closed, historical)
// ───────────────────────────────────────────────────────────────────────────
const leili1: Project = {
  id: "prj_leili1",
  name: "لیلی",
  versionLabel: "نسخه ۱",
  versionNumber: 1,
  previousVersionId: null,
  lifecycle: "closed",
  health: "on_track",
  priority: "high",
  phase: "maintenance",
  pmId: "p_sara",
  poId: "p_reza",
  startDate: daysAgo(400),
  targetDate: daysAgo(120),
  deliveryDate: daysAgo(118),
  closedDate: daysAgo(110),
  completion: 100,
  statusSummary: "نسخهٔ نخست سامانه لیلی با موفقیت تحویل و پس از تأیید نهایی مدیرعامل بسته شد.",
  currentFocus: "—",
  nextMilestone: "—",
  executiveSummary:
    "نسخهٔ اول سامانهٔ لیلی شامل هستهٔ احراز هویت و داشبورد پایه بود. تمامی نقاط‌عطف محقق و مستندات نهایی بایگانی شد.",
  healthCheck: { scope: "on_track", timeline: "on_track", resources: "on_track", quality: "on_track", dependencies: "on_track", risks: "on_track", budget: "at_risk" },
  metrics: [
    { id: "mt_l1_1", label: "نقاط‌عطف محقق‌شده", value: "۶ از ۶" },
    { id: "mt_l1_2", label: "جلسات ثبت‌شده", value: "۱۲" },
  ],
  milestones: [
    { id: "ms_l1_1", title: "تحویل نهایی نسخه ۱", dueDate: daysAgo(120), status: "done", progress: 100 },
  ],
  workstreams: [],
  teamIds: ["p_nima", "p_mina", "p_hassan"],
  resources: [],
  finalResult: "سند تحویل نهایی نسخه ۱ به همراه گزارش پوشش آزمون و تأییدیهٔ مدیرعامل بایگانی شد.",
  createdAt: daysAgo(400),
  updatedAt: daysAgo(110),
};
projectApprovals.push({
  id: "pa_leili1",
  projectId: "prj_leili1",
  approverId: "p_kaveh",
  approverName: "کاوه مرادی",
  status: "approved",
  comment: "نتیجهٔ نسخه ۱ مورد تأیید است. نسخهٔ دوم با دامنهٔ گسترده‌تر آغاز شود.",
  signedAt: daysAgo(110),
});
logActivity({ projectId: "prj_leili1", meetingId: null, type: "ceo_approval", actorId: "p_kaveh", actorName: "کاوه مرادی", entityLabel: "تأیید نهایی نسخه ۱", previousValue: null, newValue: "تأییدشده", createdAt: daysAgo(110) });
logActivity({ projectId: "prj_leili1", meetingId: null, type: "project_closed", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "نسخه ۱", previousValue: "در انتظار تأیید مدیرعامل", newValue: "بسته‌شده", createdAt: daysAgo(110) });

// ───────────────────────────────────────────────────────────────────────────
// PROJECT: لیلی — نسخه ۲ (active, at risk, the flagship record)
// ───────────────────────────────────────────────────────────────────────────
const leili2: Project = {
  id: "prj_leili2",
  name: "لیلی",
  versionLabel: "نسخه ۲",
  versionNumber: 2,
  previousVersionId: "prj_leili1",
  lifecycle: "active",
  health: "at_risk",
  priority: "critical",
  phase: "development",
  pmId: "p_sara",
  poId: "p_reza",
  startDate: daysAgo(75),
  targetDate: daysAhead(48),
  deliveryDate: null,
  closedDate: null,
  completion: 58,
  statusSummary:
    "توسعهٔ ماژول گزارش‌گیری طبق برنامه پیش می‌رود، اما وابستگی به سرویس احراز هویت خارجی زمان‌بندی را تحت فشار قرار داده است.",
  currentFocus: "تکمیل ماژول گزارش‌گیری و رفع وابستگی سرویس احراز هویت.",
  nextMilestone: "انتشار نسخهٔ آزمایشی داخلی",
  executiveSummary:
    "نسخهٔ دوم لیلی قابلیت‌های گزارش‌گیری پیشرفته و مدیریت دسترسی نقش‌محور را اضافه می‌کند. پیشرفت فنی مناسب است ولی یک وابستگی بیرونی و کمبود منابع تیم طراحی، سلامت زمان‌بندی را در وضعیت هشدار قرار داده است.",
  healthCheck: { scope: "on_track", timeline: "at_risk", resources: "at_risk", quality: "on_track", dependencies: "off_track", risks: "at_risk", budget: "on_track" },
  metrics: [
    { id: "mt_l2_1", label: "پیشرفت کلی", value: "۵۸٪" },
    { id: "mt_l2_2", label: "اقدامات باز", value: "۴" },
    { id: "mt_l2_3", label: "موانع فعال", value: "۱" },
    { id: "mt_l2_4", label: "روز تا مهلت", value: "۴۸" },
  ],
  milestones: [
    { id: "ms_l2_1", title: "طراحی معماری ماژول گزارش", dueDate: daysAgo(30), status: "done", progress: 100 },
    { id: "ms_l2_2", title: "پیاده‌سازی موتور گزارش‌گیری", dueDate: daysAhead(10), status: "in_progress", progress: 65 },
    { id: "ms_l2_3", title: "انتشار نسخهٔ آزمایشی داخلی", dueDate: daysAhead(48), status: "at_risk", progress: 20 },
    { id: "ms_l2_4", title: "آموزش کاربران کلیدی", dueDate: daysAhead(70), status: "planned", progress: 0 },
  ],
  workstreams: [
    { id: "ws_l2_1", title: "موتور گزارش‌گیری", lead: "p_nima", progress: 65, summary: "پیاده‌سازی هستهٔ تجمیع داده و خروجی‌های تحلیلی." },
    { id: "ws_l2_2", title: "دسترسی نقش‌محور", lead: "p_omid", progress: 40, summary: "مدل‌سازی نقش‌ها و مجوزها در لایهٔ بک‌اند." },
    { id: "ws_l2_3", title: "بازطراحی رابط کاربری", lead: "p_mina", progress: 35, summary: "به‌روزرسانی الگوهای داشبورد بر پایهٔ سیستم طراحی جدید." },
  ],
  teamIds: ["p_nima", "p_mina", "p_hassan", "p_omid", "p_leila"],
  resources: [
    {
      id: "res_l2_1",
      kind: "repo",
      title: "مخزن اصلی کد پروژه",
      url: "https://git.algonet.ir/leili/v2",
      description: "دسترسی با حساب سازمانی گیت‌لب؛ عضویت در تیم توسعهٔ لیلی لازم است.",
    },
    {
      id: "res_l2_2",
      kind: "figma",
      title: "فایل اصلی طراحی محصول",
      url: "https://figma.com/algonet/leili-v2",
      description: "شامل سیستم طراحی و صفحات نسخهٔ ۲؛ دسترسی ویرایش فقط برای تیم طراحی.",
    },
  ],
  finalResult: null,
  createdAt: daysAgo(75),
  updatedAt: daysAgo(2),
};
logActivity({ projectId: "prj_leili2", meetingId: null, type: "project_created", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "لیلی — نسخه ۲", previousValue: null, newValue: "فعال", createdAt: daysAgo(75) });
logActivity({ projectId: "prj_leili2", meetingId: null, type: "health_changed", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "سلامت پروژه", previousValue: "در مسیر", newValue: "در معرض خطر", createdAt: daysAgo(9) });
logActivity({ projectId: "prj_leili2", meetingId: null, type: "deadline_changed", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "مهلت پروژه", previousValue: faShort(daysAhead(30)), newValue: faShort(daysAhead(48)), createdAt: daysAgo(9) });

function faShort(iso: string): string {
  return iso.slice(0, 10);
}

// Meeting 1 — approved
const l2m1: Meeting = {
  id: "mtg_l2_1", projectId: "prj_leili2", sequence: 1,
  title: "جلسهٔ آغازین نسخه ۲", date: daysAgo(70), time: "10:00", location: "اتاق جلسات مرکزی",
  status: "approved", revision: 2, source: "manual",
  participants: [
    { personId: "p_sara", attended: true }, { personId: "p_reza", attended: true },
    { personId: "p_nima", attended: true }, { personId: "p_mina", attended: true },
    { personId: "p_omid", attended: true },
  ],
  agenda: ["تعریف دامنهٔ نسخه ۲", "تعیین نقاط‌عطف کلان", "تخصیص جریان‌های کاری"],
  discussion:
    "دامنهٔ نسخهٔ دوم شامل گزارش‌گیری پیشرفته و دسترسی نقش‌محور تأیید شد. تیم دربارهٔ اولویت‌بندی قابلیت‌ها و ظرفیت تیم طراحی گفت‌وگو کرد.",
  summary: "دامنه و نقاط‌عطف نسخه ۲ نهایی شد و مسئولیت جریان‌های کاری مشخص گردید.",
  nextSteps: ["آماده‌سازی معماری فنی", "تهیهٔ طرح اولیهٔ داشبورد"],
  openQuestions: ["آیا خروجی گزارش باید از قالب PDF نیز پشتیبانی کند؟"],
  createdById: "p_sara", createdAt: daysAgo(70), updatedAt: daysAgo(68), reviewToken: "rev-l2m1-8f3a",
};
meetings.push(l2m1);
decisions.push(
  { id: "dec_l2_1", projectId: "prj_leili2", meetingId: "mtg_l2_1", text: "دامنهٔ نسخه ۲ به گزارش‌گیری پیشرفته و دسترسی نقش‌محور محدود می‌شود.", deciderId: "p_reza", date: daysAgo(70), area: "دامنه", impact: "زیاد", createdAt: daysAgo(70) },
  { id: "dec_l2_2", projectId: "prj_leili2", meetingId: "mtg_l2_1", text: "بازطراحی رابط کاربری بر پایهٔ سیستم طراحی جدید سازمان انجام می‌شود.", deciderId: "p_mina", date: daysAgo(70), area: "طراحی", impact: "متوسط", createdAt: daysAgo(70) },
);
actions.push(
  { id: "act_l2_1", projectId: "prj_leili2", meetingId: "mtg_l2_1", title: "تهیهٔ سند معماری موتور گزارش", description: "طراحی معماری تجمیع داده و لایهٔ خروجی.", ownerId: "p_nima", deadline: daysAgo(45), status: "done", priority: "high", relatedDecisionId: "dec_l2_1", createdAt: daysAgo(70), updatedAt: daysAgo(46), completedAt: daysAgo(46) },
  { id: "act_l2_2", projectId: "prj_leili2", meetingId: "mtg_l2_1", title: "پیاده‌سازی مدل نقش و دسترسی", description: "مدل‌سازی نقش‌ها و مجوزها در بک‌اند.", ownerId: "p_omid", deadline: daysAhead(6), status: "in_progress", priority: "high", relatedDecisionId: "dec_l2_1", createdAt: daysAgo(70), updatedAt: daysAgo(3), completedAt: null },
  { id: "act_l2_3", projectId: "prj_leili2", meetingId: "mtg_l2_1", title: "طرح اولیهٔ داشبورد گزارش", description: "تهیهٔ وایرفریم و طرح بصری داشبورد.", ownerId: "p_mina", deadline: daysAgo(2), status: "in_progress", priority: "medium", relatedDecisionId: "dec_l2_2", createdAt: daysAgo(70), updatedAt: daysAgo(5), completedAt: null },
);
signatures.push(
  { id: "sig_l2_1a", meetingId: "mtg_l2_1", approverId: "p_nima", approverName: "نیما رستمی", role: "team_lead", status: "approved", comment: "مورد تأیید است.", signedAt: daysAgo(67), revision: 2 },
  { id: "sig_l2_1b", meetingId: "mtg_l2_1", approverId: "p_mina", approverName: "مینا شریفی", role: "team_lead", status: "approved", comment: "با طراحی هماهنگ است.", signedAt: daysAgo(66), revision: 2 },
);
logActivity({ projectId: "prj_leili2", meetingId: "mtg_l2_1", type: "meeting_created", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "جلسهٔ آغازین نسخه ۲", previousValue: null, newValue: "پیش‌نویس", createdAt: daysAgo(70) });
logActivity({ projectId: "prj_leili2", meetingId: "mtg_l2_1", type: "meeting_approved", actorId: "p_mina", actorName: "مینا شریفی", entityLabel: "جلسهٔ آغازین نسخه ۲", previousValue: "در انتظار امضا", newValue: "تأییدشده", createdAt: daysAgo(66) });

// Meeting 2 — approved
const l2m2: Meeting = {
  id: "mtg_l2_2", projectId: "prj_leili2", sequence: 2,
  title: "بازبینی میان‌دوره‌ای پیشرفت", date: daysAgo(28), time: "14:30", location: "آنلاین",
  status: "approved", revision: 1, source: "manual",
  participants: [
    { personId: "p_sara", attended: true }, { personId: "p_reza", attended: true },
    { personId: "p_nima", attended: true }, { personId: "p_omid", attended: true },
    { personId: "p_hassan", attended: true },
  ],
  agenda: ["مرور پیشرفت جریان‌های کاری", "بررسی ریسک وابستگی احراز هویت"],
  discussion:
    "معماری موتور گزارش تکمیل شد. تیم دربارهٔ ریسک وابستگی به سرویس احراز هویت خارجی هشدار داد و تصمیم به تهیهٔ راهکار جایگزین گرفت.",
  summary: "پیشرفت جریان‌های کاری بررسی و ریسک وابستگی احراز هویت به‌عنوان اولویت شناسایی شد.",
  nextSteps: ["بررسی راهکار جایگزین احراز هویت", "آغاز پیاده‌سازی موتور گزارش"],
  openQuestions: [],
  createdById: "p_sara", createdAt: daysAgo(28), updatedAt: daysAgo(27), reviewToken: "rev-l2m2-2c19",
};
meetings.push(l2m2);
decisions.push({ id: "dec_l2_3", projectId: "prj_leili2", meetingId: "mtg_l2_2", text: "برای کاهش ریسک، یک راهکار جایگزین برای سرویس احراز هویت بررسی و آماده‌سازی می‌شود.", deciderId: "p_sara", date: daysAgo(28), area: "وابستگی‌ها", impact: "زیاد", createdAt: daysAgo(28) });
actions.push(
  { id: "act_l2_4", projectId: "prj_leili2", meetingId: "mtg_l2_2", title: "پیاده‌سازی هستهٔ موتور گزارش", description: "توسعهٔ منطق تجمیع و خروجی تحلیلی.", ownerId: "p_nima", deadline: daysAhead(10), status: "in_progress", priority: "critical", relatedDecisionId: "dec_l2_3", createdAt: daysAgo(28), updatedAt: daysAgo(1), completedAt: null },
  { id: "act_l2_5", projectId: "prj_leili2", meetingId: "mtg_l2_2", title: "ارزیابی راهکار جایگزین احراز هویت", description: "مقایسهٔ دو سرویس جایگزین و ارائهٔ پیشنهاد.", ownerId: "p_omid", deadline: daysAhead(3), status: "blocked", priority: "high", relatedDecisionId: "dec_l2_3", createdAt: daysAgo(28), updatedAt: daysAgo(2), completedAt: null },
);
signatures.push(
  { id: "sig_l2_2a", meetingId: "mtg_l2_2", approverId: "p_nima", approverName: "نیما رستمی", role: "team_lead", status: "approved", comment: "", signedAt: daysAgo(26), revision: 1 },
);
logActivity({ projectId: "prj_leili2", meetingId: "mtg_l2_2", type: "meeting_approved", actorId: "p_nima", actorName: "نیما رستمی", entityLabel: "بازبینی میان‌دوره‌ای پیشرفت", previousValue: "در انتظار امضا", newValue: "تأییدشده", createdAt: daysAgo(26) });

// Meeting 3 — awaiting signatures (the review-flow demo)
const l2m3: Meeting = {
  id: "mtg_l2_3", projectId: "prj_leili2", sequence: 3,
  title: "جلسهٔ هفتگی هماهنگی", date: daysAgo(4), time: "11:00", location: "اتاق جلسات مرکزی",
  status: "awaiting_signatures", revision: 1, source: "manual",
  participants: [
    { personId: "p_sara", attended: true }, { personId: "p_reza", attended: true },
    { personId: "p_nima", attended: true }, { personId: "p_mina", attended: true },
    { personId: "p_omid", attended: false },
  ],
  agenda: ["وضعیت موانع فعلی", "بازنگری زمان‌بندی نقطه‌عطف بعدی", "تصمیم دربارهٔ منابع طراحی"],
  discussion:
    "سرویس احراز هویت خارجی همچنان مسدودکننده است و اقدام ارزیابی جایگزین را متوقف کرده. تیم طراحی به دلیل کمبود نیرو از زمان‌بندی عقب است. تصمیم گرفته شد یک نیروی طراحی موقت اضافه شود و مهلت نقطه‌عطف انتشار آزمایشی بازنگری گردد.",
  summary:
    "برای جبران عقب‌ماندگی طراحی، افزودن نیروی موقت تصویب شد و مهلت انتشار آزمایشی داخلی بازنگری گردید. رفع وابستگی احراز هویت به بالاترین اولویت ارتقا یافت.",
  nextSteps: ["افزودن نیروی طراحی موقت", "پیگیری فوری رفع وابستگی احراز هویت"],
  openQuestions: ["آیا بودجهٔ نیروی موقت از محل نسخه ۲ تأمین می‌شود؟"],
  createdById: "p_sara", createdAt: daysAgo(4), updatedAt: daysAgo(3), reviewToken: "rev-l2m3-review",
};
meetings.push(l2m3);
decisions.push(
  { id: "dec_l2_4", projectId: "prj_leili2", meetingId: "mtg_l2_3", text: "یک نیروی طراحی موقت برای جبران عقب‌ماندگی جریان بازطراحی رابط کاربری اضافه می‌شود.", deciderId: "p_sara", date: daysAgo(4), area: "منابع", impact: "زیاد", createdAt: daysAgo(4) },
  { id: "dec_l2_5", projectId: "prj_leili2", meetingId: "mtg_l2_3", text: "مهلت نقطه‌عطف «انتشار نسخهٔ آزمایشی داخلی» به دلیل وابستگی احراز هویت بازنگری می‌شود.", deciderId: "p_reza", date: daysAgo(4), area: "زمان‌بندی", impact: "زیاد", createdAt: daysAgo(4) },
);
actions.push(
  { id: "act_l2_6", projectId: "prj_leili2", meetingId: "mtg_l2_3", title: "جذب نیروی طراحی موقت", description: "هماهنگی با منابع انسانی برای یک قرارداد کوتاه‌مدت طراحی.", ownerId: "p_mina", deadline: daysAhead(7), status: "not_started", priority: "high", relatedDecisionId: "dec_l2_4", createdAt: daysAgo(4), updatedAt: daysAgo(4), completedAt: null },
  { id: "act_l2_7", projectId: "prj_leili2", meetingId: "mtg_l2_3", title: "نهایی‌سازی طرح بصری داشبورد", description: "تکمیل طرح داشبورد پس از افزودن نیروی طراحی.", ownerId: "p_mina", deadline: daysAhead(20), status: "not_started", priority: "medium", relatedDecisionId: "dec_l2_4", createdAt: daysAgo(4), updatedAt: daysAgo(4), completedAt: null },
);
// Dependencies: act_l2_5 (auth eval) is blocked by nothing internal but it itself blocks report engine progress.
dependencies.push(
  { id: "dep_l2_1", projectId: "prj_leili2", blockingActionId: "act_l2_5", blockedActionId: "act_l2_4", note: "تا مشخص‌شدن راهکار احراز هویت، تکمیل موتور گزارش ممکن نیست.", createdAt: daysAgo(4) },
  { id: "dep_l2_2", projectId: "prj_leili2", blockingActionId: "act_l2_6", blockedActionId: "act_l2_7", note: "نهایی‌سازی طرح داشبورد وابسته به جذب نیروی طراحی است.", createdAt: daysAgo(4) },
);
comments.push(
  { id: "cm_l2_1", meetingId: "mtg_l2_3", authorId: "p_nima", authorName: "نیما رستمی", body: "با جمع‌بندی موافقم. لطفاً اولویت رفع وابستگی احراز هویت در گزارش هفتهٔ بعد هم برجسته شود.", createdAt: daysAgo(3) },
);
signatures.push(
  { id: "sig_l2_3a", meetingId: "mtg_l2_3", approverId: "p_nima", approverName: "نیما رستمی", role: "team_lead", status: "approved", comment: "تأیید می‌شود.", signedAt: daysAgo(3), revision: 1 },
  { id: "sig_l2_3b", meetingId: "mtg_l2_3", approverId: "p_mina", approverName: "مینا شریفی", role: "team_lead", status: "pending", comment: "", signedAt: null, revision: 1 },
);
logActivity({ projectId: "prj_leili2", meetingId: "mtg_l2_3", type: "meeting_created", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "جلسهٔ هفتگی هماهنگی با مسئولین پروژه", previousValue: null, newValue: "پیش‌نویس", createdAt: daysAgo(4) });
logActivity({ projectId: "prj_leili2", meetingId: "mtg_l2_3", type: "meeting_submitted", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "جلسهٔ هفتگی هماهنگی", previousValue: "پیش‌نویس", newValue: "در انتظار امضا", createdAt: daysAgo(3) });
logActivity({ projectId: "prj_leili2", meetingId: "mtg_l2_3", type: "decision_added", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "افزودن نیروی طراحی موقت", previousValue: null, newValue: null, createdAt: daysAgo(4) });
logActivity({ projectId: "prj_leili2", meetingId: "mtg_l2_3", type: "signature_added", actorId: "p_nima", actorName: "نیما رستمی", entityLabel: "امضای جلسهٔ هفتگی", previousValue: "در انتظار", newValue: "تأیید و امضا شد", createdAt: daysAgo(3) });
logActivity({ projectId: "prj_leili2", meetingId: "mtg_l2_3", type: "comment_added", actorId: "p_nima", actorName: "نیما رستمی", entityLabel: "بازخورد سرپرست مهندسی", previousValue: null, newValue: null, createdAt: daysAgo(3) });

risks.push(
  { id: "rsk_l2_1", projectId: "prj_leili2", meetingId: "mtg_l2_2", title: "وابستگی به سرویس احراز هویت خارجی ممکن است زمان‌بندی را مختل کند.", impact: "high", probability: "high", status: "mitigating", ownerId: "p_omid", mitigation: "ارزیابی و آماده‌سازی راهکار جایگزین.", createdAt: daysAgo(28) },
  { id: "rsk_l2_2", projectId: "prj_leili2", meetingId: "mtg_l2_3", title: "کمبود منابع تیم طراحی می‌تواند کیفیت رابط کاربری را کاهش دهد.", impact: "medium", probability: "high", status: "open", ownerId: "p_mina", mitigation: "افزودن نیروی طراحی موقت.", createdAt: daysAgo(4) },
);
blockers.push(
  { id: "blk_l2_1", projectId: "prj_leili2", meetingId: "mtg_l2_3", title: "سرویس احراز هویت خارجی در دسترس نیست", description: "دسترسی به محیط آزمایشی سرویس احراز هویت قطع است و ارزیابی جایگزین را متوقف کرده.", status: "open", ownerId: "p_omid", raisedDate: daysAgo(6), resolvedDate: null },
);
logActivity({ projectId: "prj_leili2", meetingId: "mtg_l2_3", type: "blocker_added", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "سرویس احراز هویت خارجی در دسترس نیست", previousValue: null, newValue: "باز", createdAt: daysAgo(6) });
logActivity({ projectId: "prj_leili2", meetingId: "mtg_l2_2", type: "risk_added", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "وابستگی به سرویس احراز هویت خارجی", previousValue: null, newValue: "در حال کاهش", createdAt: daysAgo(28) });

// ───────────────────────────────────────────────────────────────────────────
// PROJECT: آوا (active, on track)
// ───────────────────────────────────────────────────────────────────────────
const ava: Project = {
  id: "prj_ava",
  name: "آوا",
  versionLabel: "نسخه ۱",
  versionNumber: 1,
  previousVersionId: null,
  lifecycle: "active",
  health: "on_track",
  priority: "medium",
  phase: "design",
  pmId: "p_reza",
  poId: "p_sara",
  startDate: daysAgo(40),
  targetDate: daysAhead(90),
  deliveryDate: null,
  closedDate: null,
  completion: 32,
  statusSummary: "فاز طراحی طبق برنامه پیش می‌رود و بازخورد کاربران اولیه مثبت بوده است.",
  currentFocus: "نهایی‌سازی جریان‌های اصلی کاربری و آماده‌سازی نمونهٔ اولیه.",
  nextMilestone: "آزمون کاربردپذیری نمونهٔ اولیه",
  executiveSummary:
    "سامانهٔ آوا یک دستیار مدیریت وظایف داخلی است. پروژه در فاز طراحی قرار دارد، سلامت همهٔ ابعاد مطلوب است و ریسک قابل‌توجهی شناسایی نشده.",
  healthCheck: { scope: "on_track", timeline: "on_track", resources: "on_track", quality: "on_track", dependencies: "on_track", risks: "on_track", budget: "on_track" },
  metrics: [
    { id: "mt_av_1", label: "پیشرفت کلی", value: "۳۲٪" },
    { id: "mt_av_2", label: "جلسات ثبت‌شده", value: "۲" },
  ],
  milestones: [
    { id: "ms_av_1", title: "نهایی‌سازی جریان‌های کاربری", dueDate: daysAhead(15), status: "in_progress", progress: 55 },
    { id: "ms_av_2", title: "آزمون کاربردپذیری نمونهٔ اولیه", dueDate: daysAhead(35), status: "planned", progress: 0 },
  ],
  workstreams: [
    { id: "ws_av_1", title: "طراحی تجربهٔ کاربری", lead: "p_mina", progress: 55, summary: "تدوین جریان‌ها و نمونهٔ اولیهٔ تعاملی." },
  ],
  teamIds: ["p_mina", "p_leila", "p_hassan"],
  resources: [
    {
      id: "res_av_1",
      kind: "figma",
      title: "فایل اصلی طراحی محصول",
      url: "https://figma.com/algonet/ava",
      description: "نسخهٔ فعال طراحی آوا؛ برای دسترسی از حساب سازمانی فیگما استفاده کنید.",
    },
  ],
  finalResult: null,
  createdAt: daysAgo(40),
  updatedAt: daysAgo(6),
};
logActivity({ projectId: "prj_ava", meetingId: null, type: "project_created", actorId: "p_reza", actorName: "رضا کاظمی", entityLabel: "آوا — نسخه ۱", previousValue: null, newValue: "فعال", createdAt: daysAgo(40) });

const avm1: Meeting = {
  id: "mtg_av_1", projectId: "prj_ava", sequence: 1,
  title: "جلسهٔ تعیین دامنه", date: daysAgo(38), time: "09:30", location: "آنلاین",
  status: "approved", revision: 1, source: "manual",
  participants: [{ personId: "p_reza", attended: true }, { personId: "p_mina", attended: true }, { personId: "p_leila", attended: true }],
  agenda: ["تعریف شخصیت‌های کاربری", "تعیین جریان‌های اصلی"],
  discussion: "شخصیت‌های کاربری و سه جریان اصلی کاربری تعریف شد.",
  summary: "دامنهٔ اولیهٔ آوا و جریان‌های اصلی کاربری مشخص شد.",
  nextSteps: ["تهیهٔ نمونهٔ اولیهٔ تعاملی"],
  openQuestions: [],
  createdById: "p_reza", createdAt: daysAgo(38), updatedAt: daysAgo(37), reviewToken: "rev-avm1-77d0",
};
meetings.push(avm1);
decisions.push({ id: "dec_av_1", projectId: "prj_ava", meetingId: "mtg_av_1", text: "آوا در فاز اول تنها بر مدیریت وظایف فردی تمرکز می‌کند.", deciderId: "p_reza", date: daysAgo(38), area: "دامنه", impact: "متوسط", createdAt: daysAgo(38) });
actions.push({ id: "act_av_1", projectId: "prj_ava", meetingId: "mtg_av_1", title: "تهیهٔ نمونهٔ اولیهٔ تعاملی", description: "ساخت پروتوتایپ سه جریان اصلی.", ownerId: "p_mina", deadline: daysAhead(12), status: "in_progress", priority: "medium", relatedDecisionId: "dec_av_1", createdAt: daysAgo(38), updatedAt: daysAgo(7), completedAt: null });
signatures.push({ id: "sig_av_1", meetingId: "mtg_av_1", approverId: "p_mina", approverName: "مینا شریفی", role: "team_lead", status: "approved", comment: "", signedAt: daysAgo(36), revision: 1 });
logActivity({ projectId: "prj_ava", meetingId: "mtg_av_1", type: "meeting_created", actorId: "p_reza", actorName: "رضا کاظمی", entityLabel: "جلسهٔ تعیین دامنه", previousValue: null, newValue: "پیش‌نویس", createdAt: daysAgo(38) });

// ───────────────────────────────────────────────────────────────────────────
// PROJECT: سام (active, off track — dashboard variety)
// ───────────────────────────────────────────────────────────────────────────
const sam: Project = {
  id: "prj_sam",
  name: "سام",
  versionLabel: "نسخه ۱",
  versionNumber: 1,
  previousVersionId: null,
  lifecycle: "active",
  health: "off_track",
  priority: "high",
  phase: "development",
  pmId: "p_sara",
  poId: null, // مالک محصول هنوز برای این پروژه تعیین نشده است
  startDate: daysAgo(120),
  targetDate: daysAhead(8),
  deliveryDate: null,
  closedDate: null,
  completion: 45,
  statusSummary: "چند مانع حل‌نشده و تغییر دامنهٔ دیرهنگام، پروژه را از مسیر خارج کرده است.",
  currentFocus: "رفع موانع یکپارچه‌سازی و بازتعریف مهلت واقع‌بینانه.",
  nextMilestone: "یکپارچه‌سازی درگاه پرداخت",
  executiveSummary:
    "سام یک سامانهٔ پرداخت داخلی است. به دلیل موانع فنی حل‌نشده و افزایش دامنه، سلامت زمان‌بندی و وابستگی‌ها بحرانی است و نیازمند تصمیم مدیریتی برای بازتعریف مهلت است.",
  healthCheck: { scope: "at_risk", timeline: "off_track", resources: "at_risk", quality: "at_risk", dependencies: "off_track", risks: "off_track", budget: "at_risk" },
  metrics: [
    { id: "mt_sm_1", label: "پیشرفت کلی", value: "۴۵٪" },
    { id: "mt_sm_2", label: "موانع فعال", value: "۲" },
    { id: "mt_sm_3", label: "روز تا مهلت", value: "۸" },
  ],
  milestones: [
    { id: "ms_sm_1", title: "یکپارچه‌سازی درگاه پرداخت", dueDate: daysAhead(8), status: "at_risk", progress: 40 },
  ],
  workstreams: [
    { id: "ws_sm_1", title: "یکپارچه‌سازی پرداخت", lead: "p_omid", progress: 40, summary: "اتصال به درگاه بانکی و آزمون تراکنش." },
  ],
  teamIds: ["p_omid", "p_hassan"],
  resources: [],
  finalResult: null,
  createdAt: daysAgo(120),
  updatedAt: daysAgo(1),
};
logActivity({ projectId: "prj_sam", meetingId: null, type: "project_created", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "سام — نسخه ۱", previousValue: null, newValue: "فعال", createdAt: daysAgo(120) });
logActivity({ projectId: "prj_sam", meetingId: null, type: "health_changed", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "سلامت پروژه", previousValue: "در معرض خطر", newValue: "خارج از مسیر", createdAt: daysAgo(5) });

const smm1: Meeting = {
  id: "mtg_sm_1", projectId: "prj_sam", sequence: 1,
  title: "جلسهٔ اضطراری بررسی موانع", date: daysAgo(3), time: "16:00", location: "اتاق جلسات مرکزی",
  status: "ready_for_review", revision: 1, source: "manual",
  participants: [{ personId: "p_sara", attended: true }, { personId: "p_omid", attended: true }, { personId: "p_hassan", attended: true }],
  agenda: ["بررسی موانع یکپارچه‌سازی", "تصمیم دربارهٔ مهلت"],
  discussion: "دو مانع فنی در اتصال به درگاه بانکی شناسایی شد. تیم پیشنهاد بازتعریف مهلت را مطرح کرد.",
  summary: "موانع یکپارچه‌سازی پرداخت بررسی و پیشنهاد بازتعریف مهلت برای تأیید مدیریت آماده شد.",
  nextSteps: ["پیگیری رفع موانع با تیم بانک", "ارائهٔ مهلت جدید پیشنهادی"],
  openQuestions: ["آیا امکان تمدید مهلت وجود دارد؟"],
  createdById: "p_sara", createdAt: daysAgo(3), updatedAt: daysAgo(3), reviewToken: "rev-smm1-a4e1",
};
meetings.push(smm1);
decisions.push({ id: "dec_sm_1", projectId: "prj_sam", meetingId: "mtg_sm_1", text: "پیشنهاد بازتعریف مهلت پروژه برای تصمیم‌گیری به جلسهٔ مدیریت ارجاع می‌شود.", deciderId: "p_sara", date: daysAgo(3), area: "زمان‌بندی", impact: "زیاد", createdAt: daysAgo(3) });
actions.push({ id: "act_sm_1", projectId: "prj_sam", meetingId: "mtg_sm_1", title: "پیگیری رفع موانع درگاه پرداخت", description: "هماهنگی با تیم فنی بانک برای رفع دو خطای اتصال.", ownerId: "p_omid", deadline: daysAhead(4), status: "blocked", priority: "critical", relatedDecisionId: "dec_sm_1", createdAt: daysAgo(3), updatedAt: daysAgo(1), completedAt: null });
blockers.push(
  { id: "blk_sm_1", projectId: "prj_sam", meetingId: "mtg_sm_1", title: "خطای اعتبارسنجی گواهی درگاه بانکی", description: "گواهی TLS درگاه بانکی در محیط آزمایشی نامعتبر است.", status: "open", ownerId: "p_omid", raisedDate: daysAgo(7), resolvedDate: null },
  { id: "blk_sm_2", projectId: "prj_sam", meetingId: "mtg_sm_1", title: "نبود مستندات نسخهٔ جدید API بانک", description: "مستندات نسخهٔ جدید API پرداخت هنوز منتشر نشده است.", status: "open", ownerId: "p_hassan", raisedDate: daysAgo(4), resolvedDate: null },
);
risks.push({ id: "rsk_sm_1", projectId: "prj_sam", meetingId: "mtg_sm_1", title: "عدم تمدید مهلت می‌تواند به تحویل ناقص منجر شود.", impact: "high", probability: "medium", status: "open", ownerId: "p_sara", mitigation: "ارائهٔ برنامهٔ زمان‌بندی جایگزین به مدیریت.", createdAt: daysAgo(3) });
logActivity({ projectId: "prj_sam", meetingId: "mtg_sm_1", type: "meeting_created", actorId: "p_sara", actorName: "سارا احمدی", entityLabel: "جلسهٔ اضطراری بررسی موانع", previousValue: null, newValue: "پیش‌نویس", createdAt: daysAgo(3) });
logActivity({ projectId: "prj_sam", meetingId: "mtg_sm_1", type: "blocker_added", actorId: "p_omid", actorName: "امید صادقی", entityLabel: "خطای اعتبارسنجی گواهی درگاه بانکی", previousValue: null, newValue: "باز", createdAt: daysAgo(7) });

export function buildSeed(): Database {
  return {
    people,
    projects: [leili2, leili1, ava, sam],
    meetings,
    decisions,
    actions,
    dependencies,
    risks,
    blockers,
    comments,
    signatures,
    projectApprovals,
    activities: activities.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
  };
}
