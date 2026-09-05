"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/form/field";
import { SubmitButton } from "@/components/form/submit-button";
import { AppIcon } from "@/components/icon";
import { closeProject, type ActionResult } from "@/lib/actions";

const initial: ActionResult = { ok: false, error: "" };

export function CloseProjectForm({ projectId, defaultResult }: { projectId: string; defaultResult?: string }) {
  const router = useRouter();
  const [state, formAction] = useFormState(closeProject, initial);
  const [confirm, setConfirm] = React.useState(false);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok) {
      toast.success("تأیید نهایی ثبت و نسخهٔ پروژه بسته شد.");
      router.push(`/projects/${projectId}/settings`);
    }
  }, [state, router, projectId]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      <Field label="نتیجهٔ نهایی پروژه" htmlFor="finalResult" error={errs.finalResult} required hint="خلاصه‌ای از دستاورد و مستندات نهایی این نسخه.">
        <Textarea id="finalResult" name="finalResult" rows={3} defaultValue={defaultResult} aria-invalid={!!errs.finalResult} />
      </Field>
      <Field label="یادداشت تأیید مدیرعامل" htmlFor="comment" error={errs.comment}>
        <Textarea id="comment" name="comment" rows={2} />
      </Field>

      <label className="flex items-start gap-2 rounded-md border border-border bg-muted/30 p-3 text-sm">
        <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]" />
        <span>تأیید می‌کنم که نتیجهٔ این نسخه بررسی شده و با بستن آن موافقم. تاریخچهٔ نسخه حفظ می‌شود و برای ادامهٔ کار باید نسخهٔ جدیدی ایجاد شود.</span>
      </label>

      {!state.ok && state.error && (
        <p className="flex items-center gap-2 rounded-md bg-destructive-subtle px-3 py-2 text-sm text-destructive-text">
          <AppIcon name="info" size={16} /> {state.error}
        </p>
      )}

      <SubmitButton icon="verify" disabled={!confirm} pendingText="در حال ثبت…">تأیید نهایی و بستن نسخه</SubmitButton>
    </form>
  );
}
