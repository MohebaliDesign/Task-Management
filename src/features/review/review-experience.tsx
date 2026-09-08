"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { AppIcon } from "@/components/icon";
import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ReviewActionBar } from "./review-action-bar";
import { submitReviewResponse } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { ApprovalStatus } from "@/lib/domain";

export interface ReviewParticipant {
  id: string;
  name: string;
}
export interface ReviewDecision {
  id: string;
  text: string;
  description?: string;
}
/**
 * This reviewer's OWN recorded outcome only — never other reviewers' data.
 * `signedAtLabel` is pre-formatted server-side (avoids running the Persian
 * calendar formatter in the client bundle just for one string).
 */
export interface OwnReviewState {
  status: ApprovalStatus;
  signedAtLabel: string | null;
}

type DoneKind = "approved" | "feedback" | null;

/**
 * The full reviewer shell: minimal header, a sticky review-action bar that
 * hands off to the final action section, the two response dialogs, and the
 * read-only meeting content (passed as `children`, server-rendered).
 *
 * Privacy: this component only ever knows about ONE reviewer's state
 * (`ownState`, resolved server-side from a per-meeting identity cookie — see
 * lib/actions.ts + lib/queries.ts#getOwnSignature). It never receives or
 * renders any other participant's approval/feedback status, count, or name
 * paired with a status — that visibility stays on the PM Meeting Detail page.
 */
export function ReviewExperience({
  meetingId,
  participants,
  decisions,
  ownState,
  meetingApproved,
  children,
}: {
  meetingId: string;
  participants: ReviewParticipant[];
  decisions: ReviewDecision[];
  /** Non-null once THIS reviewer (identified via cookie) has already responded. */
  ownState: OwnReviewState | null;
  /** The meeting record's own overall status — not a per-reviewer signal. */
  meetingApproved: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [done, setDone] = React.useState<DoneKind>(null);

  // Shared reviewer identity across both flows.
  const [reviewerId, setReviewerId] = React.useState("");
  const [acknowledged, setAcknowledged] = React.useState(false);

  // Disagreement state: selected decisions → their feedback text.
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [decFeedback, setDecFeedback] = React.useState<Record<string, string>>({});
  const [generalFeedback, setGeneralFeedback] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // ── Sticky ⟷ final-section handoff ────────────────────────────────────────
  // There IS an active decision to make only when this reviewer hasn't
  // already responded and the meeting itself isn't already closed out.
  const hasActiveFlow = !ownState && !meetingApproved && !done;
  const finalRef = React.useRef<HTMLDivElement>(null);
  const [finalVisible, setFinalVisible] = React.useState(false);

  React.useEffect(() => {
    const el = finalRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => setFinalVisible(entries[0]?.isIntersecting ?? false),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showSticky = hasActiveFlow && !finalVisible;

  function openApprove() {
    setErrors({});
    setApproveOpen(true);
  }
  function openFeedback() {
    setErrors({});
    setFeedbackOpen(true);
  }

  function submitApprove() {
    const next: Record<string, string> = {};
    if (!reviewerId) next.reviewerId = "لطفاً مشخص کنید که به‌عنوان کدام شرکت‌کننده امضا می‌کنید.";
    if (!acknowledged) next.acknowledged = "برای امضا، تأیید بررسی محتوا لازم است.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const fd = new FormData();
    fd.set("meetingId", meetingId);
    fd.set("reviewerId", reviewerId);
    fd.set("decision", "approved");
    fd.set("acknowledged", "true");
    startTransition(async () => {
      const res = await submitReviewResponse(null, fd);
      if (res.ok) {
        setApproveOpen(false);
        setDone("approved");
        router.refresh();
      } else if (!res.ok && res.alreadyReviewed) {
        toast.error(res.error);
        setApproveOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
      }
    });
  }

  function submitFeedback() {
    const chosen = decisions.filter((d) => selected[d.id]);
    const next: Record<string, string> = {};
    if (!reviewerId) next.reviewerId = "لطفاً مشخص کنید که به‌عنوان کدام شرکت‌کننده بازخورد می‌دهید.";
    for (const d of chosen) {
      if (!(decFeedback[d.id] ?? "").trim()) next[`dec:${d.id}`] = "برای این تصمیم، دلیل یا پیشنهاد اصلاح را بنویسید.";
    }
    if (chosen.length === 0 && !generalFeedback.trim()) {
      next.form = "حداقل یک تصمیم را انتخاب کنید یا توضیح تکمیلی بنویسید.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const decisionFeedback = chosen.map((d) => ({ decisionId: d.id, feedback: (decFeedback[d.id] ?? "").trim() }));
    const fd = new FormData();
    fd.set("meetingId", meetingId);
    fd.set("reviewerId", reviewerId);
    fd.set("decision", "feedback_submitted");
    fd.set("generalFeedback", generalFeedback.trim());
    fd.set("decisionFeedbackJson", JSON.stringify(decisionFeedback));
    startTransition(async () => {
      const res = await submitReviewResponse(null, fd);
      if (res.ok) {
        setFeedbackOpen(false);
        setDone("feedback");
        router.refresh();
      } else if (!res.ok && res.alreadyReviewed) {
        toast.error(res.error);
        setFeedbackOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
      }
    });
  }

  const identityField = (idPrefix: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={`${idPrefix}-reviewer`}>شما کدام شرکت‌کننده هستید؟</Label>
      <Select value={reviewerId} onValueChange={setReviewerId}>
        <SelectTrigger id={`${idPrefix}-reviewer`} aria-invalid={!!errors.reviewerId}>
          <SelectValue placeholder="انتخاب کنید" />
        </SelectTrigger>
        <SelectContent>
          {participants.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.reviewerId && <p className="text-xs font-medium text-destructive-text">{errors.reviewerId}</p>}
      <p className="text-xs text-muted-foreground">
        این نسخهٔ اولیه هویت را به‌صورت امن احراز نمی‌کند؛ شناسایی از روی فهرست شرکت‌کنندگان انجام می‌شود.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ── Minimal header + sticky top action row (desktop/tablet) ─────── */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <BrandMark />
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">بازبینی جلسه</span>
            <ThemeToggle />
          </div>
        </div>

        {hasActiveFlow && (
          <div
            className={cn(
              "hidden overflow-hidden transition-[max-height,opacity] duration-200 ease-out motion-reduce:transition-none sm:block",
              showSticky ? "max-h-16 opacity-100" : "max-h-0 opacity-0",
            )}
            aria-hidden={!showSticky}
          >
            <div className="border-t border-border">
              <div className="mx-auto flex max-w-2xl justify-end px-4 py-2.5">
                <ReviewActionBar
                  onApprove={openApprove}
                  onFeedback={openFeedback}
                  layout="row"
                  size="sm"
                  interactive={showSticky}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Page content ──────────────────────────────────────────────── */}
      <div className="px-4">
        <main className="mx-auto max-w-2xl space-y-8 py-8 pb-10 sm:pb-8">
          {children}

          {/* Final action section — the natural end of the review flow. */}
          <div ref={finalRef} className="scroll-mt-24">
            {done ? (
              <ReviewSuccess kind={done} />
            ) : ownState ? (
              <OwnStateCard state={ownState} />
            ) : meetingApproved ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                این جلسه تأیید نهایی شده است و امکان ثبت پاسخ تازه وجود ندارد.
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                <h2 className="text-lg font-semibold">نظر شما درباره نتیجه جلسه</h2>
                <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                  اگر محتوای ثبت‌شده مورد تأیید شماست، آن را تأیید کنید. اگر موردی نیاز به اصلاح دارد، می‌توانید بازخورد
                  خود را ثبت کنید.
                </p>
                <ReviewActionBar onApprove={openApprove} onFeedback={openFeedback} layout="responsive" className="mt-5" />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Sticky bottom action bar (mobile — thumb reachability) ──────── */}
      {hasActiveFlow && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur transition-transform duration-200 ease-out motion-reduce:transition-none sm:hidden",
            showSticky ? "translate-y-0" : "translate-y-full",
          )}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          aria-hidden={!showSticky}
        >
          <div className="px-4 py-3">
            <ReviewActionBar onApprove={openApprove} onFeedback={openFeedback} layout="row" interactive={showSticky} />
          </div>
        </div>
      )}

      {/* ── Approve & sign ────────────────────────────────────────────── */}
      <Dialog open={approveOpen} onOpenChange={(o) => { setApproveOpen(o); if (!o) setErrors({}); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تأیید نتیجه جلسه</DialogTitle>
            <DialogDescription className="leading-7">
              با تأیید این صورت‌جلسه، اعلام می‌کنید که محتوای ثبت‌شده، تصمیم‌ها و اقدامات جلسه مورد تأیید شماست.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {identityField("approve")}
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="ack"
                checked={acknowledged}
                onCheckedChange={(c) => setAcknowledged(c === true)}
                aria-invalid={!!errors.acknowledged}
                className="mt-0.5"
              />
              <Label htmlFor="ack" className="text-sm font-normal leading-6">
                محتوای این جلسه را بررسی و تأیید می‌کنم.
              </Label>
            </div>
            {errors.acknowledged && <p className="-mt-2 text-xs font-medium text-destructive-text">{errors.acknowledged}</p>}
          </div>

          <DialogFooter>
            <Button onClick={submitApprove} disabled={pending} aria-busy={pending}>
              <AppIcon name="verify" size={18} />
              تأیید و امضا
            </Button>
            <Button variant="ghost" onClick={() => setApproveOpen(false)} disabled={pending}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Request changes (structured disagreement) ────────────────────── */}
      <Dialog open={feedbackOpen} onOpenChange={(o) => { setFeedbackOpen(o); if (!o) setErrors({}); }}>
        <DialogContent className="flex max-h-[100dvh] w-full max-w-2xl flex-col gap-0 overflow-hidden rounded-none p-0 sm:max-h-[88vh] sm:rounded-lg">
          <DialogHeader className="border-b border-border p-5 sm:p-6">
            <DialogTitle>موارد نیازمند اصلاح</DialogTitle>
            <DialogDescription className="leading-7">
              مواردی را که با آن‌ها موافق نیستید انتخاب کنید و دلیل یا پیشنهاد اصلاح خود را بنویسید.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
            {identityField("feedback")}

            <div className="space-y-3">
              <p className="text-sm font-medium">تصمیماتی که نیاز به اصلاح دارند</p>
              {decisions.length === 0 ? (
                <p className="text-sm text-muted-foreground">تصمیمی برای این جلسه ثبت نشده است.</p>
              ) : (
                <ul className="space-y-2.5">
                  {decisions.map((d) => {
                    const isSel = !!selected[d.id];
                    const decErr = errors[`dec:${d.id}`];
                    return (
                      <li key={d.id} className="rounded-lg border border-border p-3">
                        <div className="flex items-start gap-2.5">
                          <Checkbox
                            id={`sel-${d.id}`}
                            checked={isSel}
                            onCheckedChange={(c) => setSelected((s) => ({ ...s, [d.id]: c === true }))}
                            className="mt-0.5"
                          />
                          <Label htmlFor={`sel-${d.id}`} className="text-sm font-normal leading-6">
                            {d.text}
                          </Label>
                        </div>
                        {isSel && (
                          <div className="mt-3 ps-7">
                            <Label htmlFor={`fb-${d.id}`} className="mb-1.5 block text-xs text-muted-foreground">
                              دلیل مخالفت یا پیشنهاد اصلاح
                            </Label>
                            <Textarea
                              id={`fb-${d.id}`}
                              rows={2}
                              value={decFeedback[d.id] ?? ""}
                              onChange={(e) => setDecFeedback((s) => ({ ...s, [d.id]: e.target.value }))}
                              aria-invalid={!!decErr}
                              placeholder="مثلاً: با این تاریخ موافق نیستم چون…"
                            />
                            {decErr && <p className="mt-1 text-xs font-medium text-destructive-text">{decErr}</p>}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="general">توضیح تکمیلی درباره جلسه</Label>
              <Textarea
                id="general"
                rows={3}
                value={generalFeedback}
                onChange={(e) => setGeneralFeedback(e.target.value)}
                placeholder="اگر بازخورد دیگری دربارهٔ محتوای جلسه دارید، اینجا بنویسید."
              />
            </div>
            {errors.form && <p className="text-xs font-medium text-destructive-text">{errors.form}</p>}
          </div>

          <DialogFooter className="border-t border-border p-5 sm:p-6">
            <Button onClick={submitFeedback} disabled={pending} aria-busy={pending}>
              <AppIcon name="send" size={18} />
              ارسال بازخورد
            </Button>
            <Button variant="ghost" onClick={() => setFeedbackOpen(false)} disabled={pending}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** This reviewer's own recorded outcome — never any other reviewer's state. */
function OwnStateCard({ state }: { state: OwnReviewState }) {
  const approved = state.status === "approved";
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center">
      <span
        className={cn(
          "mx-auto flex h-12 w-12 items-center justify-center rounded-full",
          approved ? "bg-success-subtle text-success" : "bg-accent text-primary",
        )}
      >
        <AppIcon name={approved ? "verify" : "comment"} size={24} variant="Bold" />
      </span>
      <h2 className="mt-3 text-base font-semibold">
        {approved ? "این جلسه را تأیید کرده‌اید" : "بازخورد شما ثبت شده است"}
      </h2>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-7 text-muted-foreground">
        {approved
          ? state.signedAtLabel
            ? `این جلسه را در ${state.signedAtLabel} تأیید کرده‌اید.`
            : "این جلسه را تأیید کرده‌اید."
          : "بازخورد شما برای این جلسه ثبت شده است."}
      </p>
    </div>
  );
}

function ReviewSuccess({ kind }: { kind: "approved" | "feedback" }) {
  const approved = kind === "approved";
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center">
      <span
        className={cn(
          "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
          approved ? "bg-success-subtle text-success" : "bg-accent text-primary",
        )}
      >
        <AppIcon name={approved ? "verify" : "comment"} size={28} variant="Bold" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{approved ? "تأیید شما ثبت شد" : "بازخورد شما ثبت شد"}</h2>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-7 text-muted-foreground">
        {approved
          ? "ممنون. تأیید شما برای این جلسه با موفقیت ثبت شد."
          : "ممنون. بازخورد شما برای بررسی مدیر جلسه ثبت شد."}
      </p>
      <div className="mt-5">
        <Button variant="outline" onClick={() => window.close()}>بستن صفحه</Button>
      </div>
    </div>
  );
}
