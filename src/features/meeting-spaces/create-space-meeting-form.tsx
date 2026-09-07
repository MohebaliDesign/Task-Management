"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/form/field";
import { SubmitButton } from "@/components/form/submit-button";
import { AppIcon } from "@/components/icon";
import { createSpaceMeeting, type ActionResult } from "@/lib/actions";
import { roleLabels } from "@/lib/labels";
import type { Person } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };
const today = new Date().toISOString().slice(0, 10);

export function CreateSpaceMeetingForm({ spaceId, people }: { spaceId: string; people: Person[] }) {
  const router = useRouter();
  const [state, formAction] = useFormState(createSpaceMeeting, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok && state.id) {
      toast.success("جلسه با موفقیت ثبت شد.");
      router.push(`/meetings/${spaceId}`);
    }
  }, [state, router, spaceId]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="spaceId" value={spaceId} />

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="meetings" size={18} className="text-muted-foreground" />شناسهٔ جلسه</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="عنوان جلسه" htmlFor="title" error={errs.title} required className="sm:col-span-2">
            <Input id="title" name="title" placeholder="مثلاً: جلسهٔ مدیریت هفتگی" aria-invalid={!!errs.title} />
          </Field>
          <Field label="تاریخ" htmlFor="date" error={errs.date} required>
            <Input id="date" name="date" type="date" defaultValue={today} className="latin-nums" aria-invalid={!!errs.date} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="ساعت" htmlFor="time" error={errs.time}>
              <Input id="time" name="time" type="time" defaultValue="10:00" className="latin-nums" />
            </Field>
            <Field label="مکان" htmlFor="location" error={errs.location}>
              <Input id="location" name="location" placeholder="اتاق جلسات / آنلاین" />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AppIcon name="people" size={18} className="text-muted-foreground" />شرکت‌کنندگان</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="افراد حاضر در جلسه" error={errs.participantIds} required>
            <div className="grid gap-2 sm:grid-cols-2">
              {people.map((p) => (
                <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="checkbox" name="participantIds" value={p.id} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                  <span>{p.name}</span>
                  <span className="ms-auto text-xs text-muted-foreground">{roleLabels[p.role]}</span>
                </label>
              ))}
            </div>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="clipboard" size={18} className="text-muted-foreground" />خلاصهٔ جلسه</CardTitle></CardHeader>
        <CardContent>
          <Field label="خلاصهٔ جلسه" htmlFor="summary" error={errs.summary} required hint="جمع‌بندی مهم‌ترین نتایج جلسه.">
            <Textarea id="summary" name="summary" rows={4} aria-invalid={!!errs.summary} />
          </Field>
        </CardContent>
      </Card>

      {!state.ok && state.error && (
        <p className="flex items-center gap-2 rounded-md bg-destructive-subtle px-3 py-2 text-sm text-destructive-text">
          <AppIcon name="info" size={16} /> {state.error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <SubmitButton icon="check" pendingText="در حال ثبت…">ثبت جلسه</SubmitButton>
        <button type="button" onClick={() => router.back()} className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground">انصراف</button>
      </div>
    </form>
  );
}
