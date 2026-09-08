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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/form/field";
import { SubmitButton } from "@/components/form/submit-button";
import { AppIcon } from "@/components/icon";
import { addDependency, type ActionResult } from "@/lib/actions";
import type { ActionItem } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };

export function AddDependencyDialog({
  projectId,
  actions,
  triggerLabel = "ثبت وابستگی",
}: {
  projectId: string;
  actions: ActionItem[];
  triggerLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState(addDependency, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok) {
      toast.success("وابستگی ثبت شد.");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <AppIcon name="dependency" size={16} /> {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن وابستگی</DialogTitle>
          <DialogDescription>مشخص کنید کدام اقدام، اقدام دیگری را مسدود کرده است.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <Field label="اقدام مسدودکننده (باید اول انجام شود)" htmlFor="blockingActionId" error={errs.blockingActionId} required>
            <Select name="blockingActionId">
              <SelectTrigger id="blockingActionId"><SelectValue placeholder="انتخاب اقدام" /></SelectTrigger>
              <SelectContent>
                {actions.map((a) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="اقدام مسدودشده (منتظر می‌ماند)" htmlFor="blockedActionId" error={errs.blockedActionId} required>
            <Select name="blockedActionId">
              <SelectTrigger id="blockedActionId"><SelectValue placeholder="انتخاب اقدام" /></SelectTrigger>
              <SelectContent>
                {actions.map((a) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="توضیح" htmlFor="note" error={errs.note}>
            <Input id="note" name="note" placeholder="چرا این وابستگی وجود دارد؟" />
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">انصراف</Button>
            </DialogClose>
            <SubmitButton icon="add">ثبت وابستگی</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
