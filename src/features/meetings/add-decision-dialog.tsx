"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/form/field";
import { SubmitButton } from "@/components/form/submit-button";
import { AppIcon } from "@/components/icon";
import { addDecision, type ActionResult } from "@/lib/actions";
import type { ActionItem, Meeting, Person } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function AddDecisionDialog({
  projectId,
  meetingId,
  meetings,
  people,
  unlinkedActions,
}: {
  projectId: string;
  /** Fixed meeting context (embedded in a meeting-detail page). */
  meetingId?: string;
  /** Project meetings, used to render a meeting picker when `meetingId` is not fixed. */
  meetings?: Meeting[];
  people: Person[];
  unlinkedActions?: ActionItem[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState(addDecision, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok) {
      toast.success("تصمیم ثبت شد.");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <AppIcon name="add" size={16} /> افزودن تصمیم
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن تصمیم</DialogTitle>
          <DialogDescription>تصمیم‌ها رکوردهای مستقل و قابل‌ردیابی هستند، نه بخشی از یادداشت جلسه.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          {meetingId && <input type="hidden" name="meetingId" value={meetingId} />}
          <Field label="متن تصمیم" htmlFor="text" error={errs.text} required>
            <Textarea id="text" name="text" rows={3} aria-invalid={!!errs.text} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="تصمیم‌گیرنده" htmlFor="deciderId" error={errs.deciderId} required>
              <Select name="deciderId">
                <SelectTrigger id="deciderId"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                <SelectContent>
                  {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="تاریخ" htmlFor="date" error={errs.date} required>
              <Input id="date" name="date" type="date" defaultValue={todayIso()} className="latin-nums" />
            </Field>
          </div>
          {!meetingId && (
            <Field label="جلسهٔ مرتبط" htmlFor="meetingId" error={errs.meetingId} hint="در صورت وجود، جلسهٔ منبع این تصمیم را انتخاب کنید.">
              <Select name="meetingId">
                <SelectTrigger id="meetingId"><SelectValue placeholder="بدون جلسهٔ مرتبط" /></SelectTrigger>
                <SelectContent>
                  {(meetings ?? []).map((m) => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Field label="حوزهٔ مرتبط" htmlFor="area" error={errs.area}>
              <Input id="area" name="area" defaultValue="عمومی" />
            </Field>
            <Field label="میزان اثر" htmlFor="impact" error={errs.impact}>
              <Input id="impact" name="impact" defaultValue="متوسط" />
            </Field>
          </div>
          {unlinkedActions && unlinkedActions.length > 0 && (
            <Field label="اقدامات مرتبط (اختیاری)" hint="اقدام‌های موجود بدون تصمیم مرتبط را می‌توانید به این تصمیم پیوند دهید.">
              <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border border-input p-2.5">
                {unlinkedActions.map((a) => (
                  <label key={a.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="relatedActionIds" value={a.id} className="h-4 w-4 rounded border-input accent-primary" />
                    <span className="truncate">{a.title}</span>
                  </label>
                ))}
              </div>
            </Field>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">انصراف</Button>
            </DialogClose>
            <SubmitButton icon="add">ثبت تصمیم</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
