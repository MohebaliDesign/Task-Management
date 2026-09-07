"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/form/field";
import { SubmitButton } from "@/components/form/submit-button";
import { AppIcon } from "@/components/icon";
import { PersonSelect } from "@/features/people/person-select";
import { createProject, type ActionResult } from "@/lib/actions";
import { PRIORITY } from "@/lib/domain";
import { priorityLabels } from "@/lib/labels";
import { makeId } from "@/lib/utils";
import type { Person, Project } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };
const today = new Date().toISOString().slice(0, 10);

interface PhaseDraft {
  key: string;
  name: string;
  startDate: string;
  deadline: string;
}

export function CreateProjectForm({ people: initialPeople, projects }: { people: Person[]; projects: Project[] }) {
  const router = useRouter();
  const [state, formAction] = useFormState(createProject, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};
  const [people, setPeople] = React.useState(initialPeople);
  const [previousVersionId, setPreviousVersionId] = React.useState<string>("");
  const [phases, setPhases] = React.useState<PhaseDraft[]>([]);

  React.useEffect(() => {
    if (state.ok && state.id) {
      toast.success("پروژه با موفقیت ایجاد شد.");
      router.push(`/projects/${state.id}`);
    }
  }, [state, router]);

  function addPhase() {
    setPhases((prev) => [...prev, { key: makeId("phz"), name: "", startDate: today, deadline: "" }]);
  }
  function updatePhase(key: string, patch: Partial<PhaseDraft>) {
    setPhases((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch } : p)));
  }
  function removePhase(key: string) {
    setPhases((prev) => prev.filter((p) => p.key !== key));
  }

  const phasesJson = JSON.stringify(
    phases.filter((p) => p.name.trim()).map((p) => ({ name: p.name, startDate: p.startDate, deadline: p.deadline })),
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="phasesJson" value={phasesJson} />

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
          <Field
            label="نسخهٔ قبلی (اختیاری)"
            htmlFor="previousVersionId"
            error={errs.previousVersionId}
            hint="اگر این نسخه ادامه نسخه قبلی است، پروژه مرتبط را انتخاب کنید."
            className="sm:col-span-2"
          >
            <Select name="previousVersionId" value={previousVersionId} onValueChange={setPreviousVersionId}>
              <SelectTrigger id="previousVersionId"><SelectValue placeholder="بدون نسخهٔ قبلی" /></SelectTrigger>
              <SelectContent>
                {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} — {p.versionLabel}</SelectItem>)}
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
            <PersonSelect id="pmId" name="pmId" people={people} placeholder="انتخاب مدیر پروژه" onPersonCreated={(p) => setPeople((prev) => [...prev, p])} />
          </Field>
          <Field label="مالک محصول" htmlFor="poId" error={errs.poId} hint="در صورت نیاز، بعداً هم قابل تعیین است.">
            <PersonSelect id="poId" name="poId" people={people} placeholder="بدون مالک محصول" onPersonCreated={(p) => setPeople((prev) => [...prev, p])} />
          </Field>
          <div className="grid grid-cols-2 gap-4 sm:col-span-2">
            <Field label="تاریخ شروع" htmlFor="startDate" error={errs.startDate} required>
              <Input id="startDate" name="startDate" type="date" defaultValue={today} className="latin-nums" aria-invalid={!!errs.startDate} />
            </Field>
            <Field label="مهلت هدف (اختیاری)" htmlFor="targetDate" error={errs.targetDate}>
              <Input id="targetDate" name="targetDate" type="date" className="latin-nums" aria-invalid={!!errs.targetDate} />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>مدیریت فازها</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addPhase}>
            <AppIcon name="add" size={16} />
            افزودن فاز جدید
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {phases.length === 0 ? (
            <p className="text-sm text-muted-foreground">هنوز فازی اضافه نشده است. فازها اختیاری‌اند و بعداً هم قابل افزودن‌اند.</p>
          ) : (
            phases.map((phase, i) => (
              <div key={phase.key} className="grid grid-cols-[1fr_auto] items-start gap-3 rounded-md border border-border p-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label={`نام فاز ${i + 1}`} htmlFor={`phase-name-${phase.key}`}>
                    <Input
                      id={`phase-name-${phase.key}`}
                      value={phase.name}
                      onChange={(e) => updatePhase(phase.key, { name: e.target.value })}
                      placeholder="مثلاً: کشف و تحلیل"
                    />
                  </Field>
                  <Field label="تاریخ شروع" htmlFor={`phase-start-${phase.key}`}>
                    <Input
                      id={`phase-start-${phase.key}`}
                      type="date"
                      className="latin-nums"
                      value={phase.startDate}
                      onChange={(e) => updatePhase(phase.key, { startDate: e.target.value })}
                    />
                  </Field>
                  <Field label="مهلت" htmlFor={`phase-deadline-${phase.key}`}>
                    <Input
                      id={`phase-deadline-${phase.key}`}
                      type="date"
                      className="latin-nums"
                      value={phase.deadline}
                      onChange={(e) => updatePhase(phase.key, { deadline: e.target.value })}
                    />
                  </Field>
                </div>
                <Button type="button" variant="ghost" size="icon" className="mt-6 text-muted-foreground hover:text-destructive-text" onClick={() => removePhase(phase.key)} aria-label="حذف فاز">
                  <AppIcon name="trash" size={16} />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>شرح وضعیت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="وضعیت فعلی پروژه" htmlFor="statusSummary" error={errs.statusSummary} hint="یک جملهٔ کوتاه که وضعیت کنونی پروژه را توصیف می‌کند.">
            <Textarea id="statusSummary" name="statusSummary" rows={2} />
          </Field>
          <Field label="تمرکز فعلی" htmlFor="currentFocus" error={errs.currentFocus}>
            <Input id="currentFocus" name="currentFocus" />
          </Field>
        </CardContent>
      </Card>

      {!state.ok && state.error && (
        <p className="flex items-center gap-2 rounded-md bg-destructive-subtle px-3 py-2 text-sm text-destructive-text">
          <AppIcon name="info" size={16} /> {state.error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <SubmitButton icon="add" pendingText="در حال ایجاد…">ایجاد پروژه</SubmitButton>
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
