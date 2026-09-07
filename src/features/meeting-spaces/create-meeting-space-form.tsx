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
import { createMeetingSpace, type ActionResult } from "@/lib/actions";
import { roleLabels } from "@/lib/labels";
import type { Person } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };

export function CreateMeetingSpaceForm({ people }: { people: Person[] }) {
  const router = useRouter();
  const [state, formAction] = useFormState(createMeetingSpace, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok && state.id) {
      toast.success("دستهٔ جلسات با موفقیت ایجاد شد.");
      router.push(`/meetings/${state.id}`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppIcon name="meetings" size={18} className="text-muted-foreground" />
            اطلاعات دستهٔ جلسات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="نام دسته" htmlFor="name" error={errs.name} required hint="نام گروهی که این جلسات را دربر می‌گیرد.">
            <Input id="name" name="name" placeholder="مثلاً: جلسات داخلی سازمان" aria-invalid={!!errs.name} />
          </Field>
          <Field label="توضیحات" htmlFor="description" error={errs.description} hint="این دسته دربارهٔ چه نوع جلساتی است؟">
            <Textarea id="description" name="description" rows={3} placeholder="مثلاً: جلسات مربوط به هماهنگی‌های سازمانی" />
          </Field>
          <Field label="مسئول دسته" htmlFor="ownerId" error={errs.ownerId} required>
            <Select name="ownerId">
              <SelectTrigger id="ownerId"><SelectValue placeholder="انتخاب مسئول" /></SelectTrigger>
              <SelectContent>
                {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} — {roleLabels[p.role]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      {!state.ok && state.error && (
        <p className="flex items-center gap-2 rounded-md bg-destructive-subtle px-3 py-2 text-sm text-destructive-text">
          <AppIcon name="info" size={16} /> {state.error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <SubmitButton icon="add" pendingText="در حال ایجاد…">ایجاد دسته جلسات</SubmitButton>
        <button type="button" onClick={() => router.back()} className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
          انصراف
        </button>
      </div>
    </form>
  );
}
