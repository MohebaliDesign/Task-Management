"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/form/field";
import { SubmitButton } from "@/components/form/submit-button";
import { AppIcon } from "@/components/icon";
import { AddPersonDialog } from "@/features/people/add-person-dialog";
import { DecisionDraftDialog, type DecisionDraft } from "@/features/meetings/decision-draft-dialog";
import { ActionDraftDialog, type ActionDraft } from "@/features/meetings/action-draft-dialog";
import { createMeeting, updateMeeting, type ActionResult } from "@/lib/actions";
import { roleLabels, priorityLabels, actionStatusLabels } from "@/lib/labels";
import { makeId } from "@/lib/utils";
import type { Meeting, Person } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };
const today = new Date().toISOString().slice(0, 10);

interface ParticipantState {
  personId: string;
  attended: boolean;
}
interface DecisionDraftUI extends DecisionDraft {
  key: string;
}
interface ActionDraftUI extends ActionDraft {
  key: string;
}

export function CreateMeetingForm({
  projectId,
  people: initialPeople,
  meeting,
}: {
  projectId: string;
  people: Person[];
  /** Present in edit mode — every field is prefilled and the form calls updateMeeting. */
  meeting?: Meeting;
}) {
  const router = useRouter();
  const isEdit = !!meeting;
  const [state, formAction] = useFormState(isEdit ? updateMeeting : createMeeting, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  const [people, setPeople] = React.useState(initialPeople);
  const [participants, setParticipants] = React.useState<ParticipantState[]>(
    meeting?.participants.map((p) => ({ personId: p.personId, attended: p.attended })) ?? [],
  );
  const [addPersonOpen, setAddPersonOpen] = React.useState(false);

  const [summaryPoints, setSummaryPoints] = React.useState<string[]>(meeting?.summaryPoints ?? []);
  const [summaryDraft, setSummaryDraft] = React.useState("");
  const [editingPointIndex, setEditingPointIndex] = React.useState<number | null>(null);

  const [decisions, setDecisions] = React.useState<DecisionDraftUI[]>([]);
  const [actions, setActions] = React.useState<ActionDraftUI[]>([]);

  React.useEffect(() => {
    if (state.ok) {
      toast.success(isEdit ? "جلسه به‌روزرسانی شد." : "جلسه ثبت شد. اکنون می‌توانید تصمیم‌ها و اقدامات بیشتری را اضافه کنید.");
      router.push(`/projects/${projectId}/meetings/${state.id ?? meeting?.id}`);
    }
  }, [state, router, projectId, isEdit, meeting?.id]);

  function toggleParticipant(personId: string, checked: boolean) {
    setParticipants((prev) =>
      checked ? [...prev, { personId, attended: true }] : prev.filter((p) => p.personId !== personId),
    );
  }
  function toggleAbsent(personId: string, absent: boolean) {
    setParticipants((prev) => prev.map((p) => (p.personId === personId ? { ...p, attended: !absent } : p)));
  }
  function handlePersonCreated(person: Person) {
    setPeople((prev) => [...prev, person]);
    setParticipants((prev) => [...prev, { personId: person.id, attended: true }]);
  }

  function commitSummaryPoint() {
    const text = summaryDraft.trim();
    if (!text) return;
    if (editingPointIndex !== null) {
      setSummaryPoints((prev) => prev.map((p, i) => (i === editingPointIndex ? text : p)));
      setEditingPointIndex(null);
    } else {
      setSummaryPoints((prev) => [...prev, text]);
    }
    setSummaryDraft("");
  }
  function editSummaryPoint(i: number) {
    setEditingPointIndex(i);
    setSummaryDraft(summaryPoints[i] ?? "");
  }
  function deleteSummaryPoint(i: number) {
    setSummaryPoints((prev) => prev.filter((_, idx) => idx !== i));
    if (editingPointIndex === i) {
      setEditingPointIndex(null);
      setSummaryDraft("");
    }
  }

  function addDecisionDraft(draft: DecisionDraft) {
    setDecisions((prev) => [...prev, { key: makeId("dec"), ...draft }]);
  }
  function removeDecisionDraft(key: string) {
    setDecisions((prev) => prev.filter((d) => d.key !== key));
    setActions((prev) => prev.map((a) => (a.relatedDecisionKey === key ? { ...a, relatedDecisionKey: null } : a)));
  }
  function addActionDraft(draft: ActionDraft) {
    setActions((prev) => [...prev, { key: makeId("act"), ...draft }]);
  }
  function removeActionDraft(key: string) {
    setActions((prev) => prev.filter((a) => a.key !== key));
  }

  const participantsJson = JSON.stringify(participants);
  const summaryPointsJson = JSON.stringify(summaryPoints);
  const decisionsJson = JSON.stringify(
    decisions.map((d) => ({ text: d.text, description: d.description, deciderId: d.deciderId, area: d.area })),
  );
  const actionsJson = JSON.stringify(
    actions.map((a) => {
      const idx = a.relatedDecisionKey ? decisions.findIndex((d) => d.key === a.relatedDecisionKey) : -1;
      return {
        title: a.title,
        ownerId: a.ownerId,
        deadline: a.deadline,
        priority: a.priority,
        status: a.status,
        relatedDecisionIndex: idx >= 0 ? idx : undefined,
      };
    }),
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="projectId" value={projectId} />
      {isEdit && <input type="hidden" name="meetingId" value={meeting!.id} />}
      <input type="hidden" name="participantsJson" value={participantsJson} />
      <input type="hidden" name="summaryPointsJson" value={summaryPointsJson} />
      {!isEdit && <input type="hidden" name="decisionsJson" value={decisionsJson} />}
      {!isEdit && <input type="hidden" name="actionsJson" value={actionsJson} />}

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="meetings" size={18} className="text-muted-foreground" />شناسهٔ جلسه</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="عنوان جلسه" htmlFor="title" error={errs.title} required className="sm:col-span-2">
            <Input id="title" name="title" defaultValue={meeting?.title} placeholder="مثلاً: جلسهٔ هفتگی هماهنگی" aria-invalid={!!errs.title} />
          </Field>
          <Field label="تاریخ" htmlFor="date" error={errs.date} required>
            <Input id="date" name="date" type="date" defaultValue={meeting ? meeting.date.slice(0, 10) : today} className="latin-nums" aria-invalid={!!errs.date} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="ساعت" htmlFor="time" error={errs.time}>
              <Input id="time" name="time" type="time" defaultValue={meeting?.time ?? "10:00"} className="latin-nums" />
            </Field>
            <Field label="مکان" htmlFor="location" error={errs.location}>
              <Input id="location" name="location" defaultValue={meeting?.location} placeholder="اتاق جلسات / آنلاین" />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><AppIcon name="people" size={18} className="text-muted-foreground" />شرکت‌کنندگان</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => setAddPersonOpen(true)}>
            <AppIcon name="add" size={16} /> افزودن شرکت‌کننده
          </Button>
        </CardHeader>
        <CardContent>
          <Field label="افراد حاضر در جلسه" error={errs.participantsJson} required>
            <div className="grid gap-2 sm:grid-cols-2">
              {people.map((p) => {
                const entry = participants.find((x) => x.personId === p.id);
                const checked = !!entry;
                return (
                  <div key={p.id} className={`rounded-md border p-2.5 text-sm transition-colors ${checked ? "border-primary bg-primary/5" : "border-border"}`}>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => toggleParticipant(p.id, e.target.checked)}
                        className="h-4 w-4 accent-[hsl(var(--primary))]"
                      />
                      <span>{p.name}</span>
                      <span className="ms-auto text-xs text-muted-foreground">{roleLabels[p.role]}</span>
                    </label>
                    {checked && (
                      <label className="mt-2 flex cursor-pointer items-center gap-2 ps-6 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={!entry!.attended}
                          onChange={(e) => toggleAbsent(p.id, e.target.checked)}
                          className="h-3.5 w-3.5 accent-[hsl(var(--muted-foreground))]"
                        />
                        در جلسه حضور نداشت
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </Field>
        </CardContent>
      </Card>
      <AddPersonDialog open={addPersonOpen} onOpenChange={setAddPersonOpen} onCreated={handlePersonCreated} />

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="clipboard" size={18} className="text-muted-foreground" />محتوای جلسه</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="دستور جلسه" htmlFor="agenda" error={errs.agenda} hint="هر سطر یک موضوع.">
            <Textarea id="agenda" name="agenda" rows={3} defaultValue={meeting?.agenda.join("\n")} placeholder={"وضعیت موانع فعلی\nبازنگری زمان‌بندی"} />
          </Field>
          <Field label="خلاصهٔ بحث‌ها" htmlFor="discussion" error={errs.discussion}>
            <Textarea id="discussion" name="discussion" rows={4} defaultValue={meeting?.discussion} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="note" size={18} className="text-muted-foreground" />خلاصهٔ جلسه</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={summaryDraft}
              onChange={(e) => setSummaryDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitSummaryPoint();
                }
              }}
              placeholder="یک نکته از خلاصهٔ جلسه را بنویسید و اینتر بزنید…"
              aria-label="افزودن نکتهٔ خلاصه"
            />
            <Button type="button" size="icon" onClick={commitSummaryPoint} aria-label={editingPointIndex !== null ? "ذخیرهٔ ویرایش" : "افزودن نکته"}>
              <AppIcon name={editingPointIndex !== null ? "check" : "add"} size={18} />
            </Button>
          </div>
          {errs.summaryPointsJson && <p className="text-xs font-medium text-destructive-text">{errs.summaryPointsJson}</p>}
          {summaryPoints.length === 0 ? (
            <p className="text-sm text-muted-foreground">هنوز نکته‌ای اضافه نشده است.</p>
          ) : (
            <ul className="space-y-1.5">
              {summaryPoints.map((point, i) => (
                <li key={i} className={`flex items-start gap-2 rounded-md border p-2.5 text-sm ${editingPointIndex === i ? "border-primary bg-primary/5" : "border-border"}`}>
                  <AppIcon name="check" size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1">{point}</span>
                  <button type="button" onClick={() => editSummaryPoint(i)} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label="ویرایش">
                    <AppIcon name="edit" size={15} />
                  </button>
                  <button type="button" onClick={() => deleteSummaryPoint(i)} className="shrink-0 text-muted-foreground hover:text-destructive-text" aria-label="حذف">
                    <AppIcon name="trash" size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {!isEdit && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><AppIcon name="decision" size={18} className="text-muted-foreground" />تصمیم‌ها (اختیاری)</CardTitle>
            <DecisionDraftDialog people={people} onPersonCreated={(p) => setPeople((prev) => [...prev, p])} onAdd={addDecisionDraft} />
          </CardHeader>
          {decisions.length > 0 && (
            <CardContent className="space-y-2 pt-0">
              {decisions.map((d) => (
                <div key={d.key} className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                  <div className="min-w-0">
                    <p className="text-sm">{d.text}</p>
                    {d.description && <p className="mt-0.5 text-xs text-muted-foreground">{d.description}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">حوزه: {d.area}</p>
                  </div>
                  <button type="button" onClick={() => removeDecisionDraft(d.key)} className="shrink-0 text-muted-foreground hover:text-destructive-text" aria-label="حذف تصمیم">
                    <AppIcon name="trash" size={15} />
                  </button>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      {!isEdit && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><AppIcon name="actions" size={18} className="text-muted-foreground" />اقدامات (اختیاری)</CardTitle>
            <ActionDraftDialog
              people={people}
              decisionOptions={decisions.map((d) => ({ key: d.key, text: d.text }))}
              onPersonCreated={(p) => setPeople((prev) => [...prev, p])}
              onAdd={addActionDraft}
            />
          </CardHeader>
          {actions.length > 0 && (
            <CardContent className="space-y-2 pt-0">
              {actions.map((a) => (
                <div key={a.key} className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{priorityLabels[a.priority].label}</span>
                      <span>{actionStatusLabels[a.status].label}</span>
                      {a.deadline && <span>مهلت: {a.deadline}</span>}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeActionDraft(a.key)} className="shrink-0 text-muted-foreground hover:text-destructive-text" aria-label="حذف اقدام">
                    <AppIcon name="trash" size={15} />
                  </button>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-sm">گام‌های بعدی و پرسش‌های باز</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="گام‌های بعدی" htmlFor="nextSteps" error={errs.nextSteps} hint="هر سطر یک مورد.">
            <Textarea id="nextSteps" name="nextSteps" rows={3} defaultValue={meeting?.nextSteps.join("\n")} />
          </Field>
          <Field label="پرسش‌های باز" htmlFor="openQuestions" error={errs.openQuestions} hint="هر سطر یک مورد.">
            <Textarea id="openQuestions" name="openQuestions" rows={3} defaultValue={meeting?.openQuestions.join("\n")} />
          </Field>
        </CardContent>
      </Card>

      {!state.ok && state.error && (
        <p className="flex items-center gap-2 rounded-md bg-destructive-subtle px-3 py-2 text-sm text-destructive-text">
          <AppIcon name="info" size={16} /> {state.error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <SubmitButton icon="check" pendingText={isEdit ? "در حال ذخیره…" : "در حال ثبت…"}>{isEdit ? "ذخیرهٔ تغییرات" : "ثبت جلسه"}</SubmitButton>
        <button type="button" onClick={() => router.back()} className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground">انصراف</button>
      </div>
      {!isEdit && (
        <p className="text-xs text-muted-foreground">پس از ثبت، جلسه در وضعیت «پیش‌نویس» قرار می‌گیرد. سپس می‌توانید آن را برای بازبینی ارسال کنید.</p>
      )}
    </form>
  );
}
