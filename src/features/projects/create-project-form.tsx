"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/form/field";
import { SubmitButton } from "@/components/form/submit-button";
import { AppIcon } from "@/components/icon";
import { createProject, type ActionResult } from "@/lib/actions";
import { PRIORITY, PROJECT_PHASE } from "@/lib/domain";
import { priorityLabels, phaseLabels, roleLabels } from "@/lib/labels";
import type { Person } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };
const today = new Date().toISOString().slice(0, 10);

export function CreateProjectForm({ people }: { people: Person[] }) {
  const router = useRouter();
  const [state, formAction] = useFormState(createProject, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok && state.id) {
      toast.success("پروژه با موفقیت ایجاد شد.");
      router.push(`/projects/${state.id}`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات پایه</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="نام پروژه" htmlFor="name" error={errs.name} required className="sm:col-span-2">
            <Input id="name" name="name" placeholder="مثلاً: سامانهٔ گزارش‌گیری" aria-invalid={!!errs.name} />
          </Field>
          <Field label="شمارهٔ نسخه" htmlFor="versionNumber" error={errs.versionNumber} required hint="نسخهٔ جدید یک رکورد پروژهٔ مستقل است.">
            <Input id="versionNumber" name="versionNumber" type="number" min={1} defaultValue={1} className="latin-nums" aria-invalid={!!errs.versionNumber} />
          </Field>
          <Field label="اولویت" htmlFor="priority" error={errs.priority} required>
            <Select name="priority" defaultValue="medium">
              <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRIORITY.map((p) => <SelectItem key={p} value={p}>{priorityLabels[p].label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>مسئولیت و زمان‌بندی</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="مدیر پروژه" htmlFor="pmId" error={errs.pmId} required>
            <Select name="pmId">
              <SelectTrigger id="pmId"><SelectValue placeholder="انتخاب مدیر پروژه" /></SelectTrigger>
              <SelectContent>
                {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} — {roleLabels[p.role]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="مالک محصول" htmlFor="poId" error={errs.poId} required>
            <Select name="poId">
              <SelectTrigger id="poId"><SelectValue placeholder="انتخاب مالک محصول" /></SelectTrigger>
              <SelectContent>
                {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} — {roleLabels[p.role]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="فاز فعلی" htmlFor="phase" error={errs.phase} required>
            <Select name="phase" defaultValue="discovery">
              <SelectTrigger id="phase"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PROJECT_PHASE.map((p) => <SelectItem key={p} value={p}>{phaseLabels[p].label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="تاریخ شروع" htmlFor="startDate" error={errs.startDate} required>
              <Input id="startDate" name="startDate" type="date" defaultValue={today} className="latin-nums" aria-invalid={!!errs.startDate} />
            </Field>
            <Field label="مهلت هدف" htmlFor="targetDate" error={errs.targetDate} required>
              <Input id="targetDate" name="targetDate" type="date" className="latin-nums" aria-invalid={!!errs.targetDate} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>شرح وضعیت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="خلاصهٔ وضعیت فعلی" htmlFor="statusSummary" error={errs.statusSummary} hint="یک جملهٔ کوتاه که وضعیت کنونی پروژه را توصیف می‌کند.">
            <Textarea id="statusSummary" name="statusSummary" rows={2} />
          </Field>
          <Field label="خلاصهٔ اجرایی" htmlFor="executiveSummary" error={errs.executiveSummary}>
            <Textarea id="executiveSummary" name="executiveSummary" rows={3} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="تمرکز فعلی" htmlFor="currentFocus" error={errs.currentFocus}>
              <Input id="currentFocus" name="currentFocus" />
            </Field>
            <Field label="نقطه‌عطف بعدی" htmlFor="nextMilestone" error={errs.nextMilestone}>
              <Input id="nextMilestone" name="nextMilestone" />
            </Field>
          </div>
        </CardContent>
      </Card>

      {!state.ok && state.error && (
        <p className="flex items-center gap-2 rounded-md bg-destructive-subtle px-3 py-2 text-sm text-destructive-text">
          <AppIcon name="info" size={16} /> {state.error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <SubmitButton icon="add" pendingText="در حال ایجاد…">ثبت پروژه</SubmitButton>
        <SubmitButtonCancel />
      </div>
    </form>
  );
}

function SubmitButtonCancel() {
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.back()} className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
      انصراف
    </button>
  );
}
