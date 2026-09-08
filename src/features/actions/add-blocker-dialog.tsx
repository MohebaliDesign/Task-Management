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
import { Field } from "@/components/form/field";
import { AssigneeSelect } from "@/components/form/assignee-select";
import { SubmitButton } from "@/components/form/submit-button";
import { AppIcon } from "@/components/icon";
import { addBlocker, type ActionResult } from "@/lib/actions";
import type { Person, Team } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };

export function AddBlockerDialog({
  projectId,
  people,
  teams,
  triggerLabel = "افزودن مانع",
}: {
  projectId: string;
  people: Person[];
  teams: Team[];
  triggerLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState(addBlocker, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};
  React.useEffect(() => {
    if (state.ok) { toast.success("مانع ثبت شد."); setOpen(false); router.refresh(); }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><AppIcon name="add" size={16} /> {triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن مانع</DialogTitle>
          <DialogDescription>مانع یک بازدارندهٔ فعلی است که پیشرفت را متوقف کرده است.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <Field label="عنوان مانع" htmlFor="b-title" error={errs.title} required>
            <Input id="b-title" name="title" aria-invalid={!!errs.title} />
          </Field>
          <Field label="توضیحات" htmlFor="b-desc" error={errs.description}>
            <Textarea id="b-desc" name="description" rows={3} />
          </Field>
          <Field label="مسئول رفع" htmlFor="b-owner" error={errs.ownerId}>
            <AssigneeSelect id="b-owner" name="ownerId" people={people} teams={teams} />
          </Field>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="ghost">انصراف</Button></DialogClose>
            <SubmitButton icon="add">ثبت مانع</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
