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
import type { Person } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };

export function AddDecisionDialog({ projectId, meetingId, people }: { projectId: string; meetingId: string; people: Person[] }) {
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
          <input type="hidden" name="meetingId" value={meetingId} />
          <Field label="متن تصمیم" htmlFor="text" error={errs.text} required>
            <Textarea id="text" name="text" rows={3} aria-invalid={!!errs.text} />
          </Field>
          <Field label="تصمیم‌گیرنده" htmlFor="deciderId" error={errs.deciderId} required>
            <Select name="deciderId">
              <SelectTrigger id="deciderId"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
              <SelectContent>
                {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="حوزهٔ مرتبط" htmlFor="area" error={errs.area}>
              <Input id="area" name="area" defaultValue="عمومی" />
            </Field>
            <Field label="میزان اثر" htmlFor="impact" error={errs.impact}>
              <Input id="impact" name="impact" defaultValue="متوسط" />
            </Field>
          </div>
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
