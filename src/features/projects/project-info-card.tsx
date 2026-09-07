"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/form/field";
import { SubmitButton } from "@/components/form/submit-button";
import { SectionHeader } from "@/components/domain/page-header";
import { LifecycleBadge } from "@/components/domain/status";
import { PersonChip } from "@/components/domain/person";
import { PersonSelect } from "@/features/people/person-select";
import { updateProjectInfo, type ActionResult } from "@/lib/actions";
import { PROJECT_PHASE, PRIORITY } from "@/lib/domain";
import { phaseLabels, priorityLabels } from "@/lib/labels";
import { faDate } from "@/lib/utils";
import type { Person, Project } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };

export function ProjectInfoCard({ project, people: initialPeople }: { project: Project; people: Person[] }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [state, formAction] = useFormState(updateProjectInfo, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};
  const [people, setPeople] = React.useState(initialPeople);
  const pm = people.find((p) => p.id === project.pmId);
  const po = people.find((p) => p.id === project.poId);

  React.useEffect(() => {
    if (state.ok) {
      toast.success("اطلاعات پروژه به‌روزرسانی شد.");
      setEditing(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <div>
      <SectionHeader
        title="اطلاعات پروژه"
        icon="settings"
        actions={
          !editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              ویرایش پروژه
            </Button>
          )
        }
      />
      <Card>
        {editing ? (
          <CardContent className="pt-5">
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="projectId" value={project.id} />
              <Field label="نام پروژه" htmlFor="name" error={errs.name} required>
                <Input id="name" name="name" defaultValue={project.name} aria-invalid={!!errs.name} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="مدیر پروژه" htmlFor="pmId" error={errs.pmId} required>
                  <PersonSelect id="pmId" name="pmId" people={people} defaultValue={project.pmId} onPersonCreated={(p) => setPeople((prev) => [...prev, p])} />
                </Field>
                <Field label="مالک محصول" htmlFor="poId" error={errs.poId} hint="اختیاری">
                  <PersonSelect id="poId" name="poId" people={people} defaultValue={project.poId ?? undefined} placeholder="بدون مالک محصول" onPersonCreated={(p) => setPeople((prev) => [...prev, p])} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="فاز پروژه" htmlFor="phase" error={errs.phase} required>
                  <Select name="phase" defaultValue={project.phase}>
                    <SelectTrigger id="phase"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROJECT_PHASE.map((ph) => <SelectItem key={ph} value={ph}>{phaseLabels[ph].label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="اولویت" htmlFor="priority" error={errs.priority} required>
                  <Select name="priority" defaultValue={project.priority}>
                    <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRIORITY.map((p) => <SelectItem key={p} value={p}>{priorityLabels[p].label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="flex items-center gap-2 border-t border-border pt-4">
                <SubmitButton icon="check">ذخیره تغییرات</SubmitButton>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>انصراف</Button>
              </div>
            </form>
          </CardContent>
        ) : (
          <CardContent className="divide-y divide-border p-0">
            <Row label="شناسهٔ پروژه"><span className="ltr text-sm text-muted-foreground">{project.id}</span></Row>
            <Row label="نسخه">{project.versionLabel}</Row>
            <Row label="وضعیت چرخهٔ عمر"><LifecycleBadge value={project.lifecycle} /></Row>
            <Row label="مدیر پروژه"><PersonChip person={pm} /></Row>
            <Row label="مالک محصول"><PersonChip person={po} /></Row>
            <Row label="تاریخ ایجاد">{faDate(project.createdAt)}</Row>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 p-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  );
}
