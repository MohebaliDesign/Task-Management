"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/form/field";
import { SubmitButton } from "@/components/form/submit-button";
import { AppIcon } from "@/components/icon";
import { updateActionStatusWithNote, type ActionResult } from "@/lib/actions";
import { ACTION_STATUS, type ActionItem } from "@/lib/domain";
import { actionStatusLabels } from "@/lib/labels";

const initial: ActionResult = { ok: false, error: "" };

export function UpdateActionStatusDialog({ action }: { action: ActionItem }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState(updateActionStatusWithNote, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok) {
      toast.success("وضعیت اقدام به‌روزرسانی شد.");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <AppIcon name="edit" size={13} /> به‌روزرسانی
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>به‌روزرسانی وضعیت اقدام</DialogTitle>
          <DialogDescription>{action.title}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="actionId" value={action.id} />
          <Field label="وضعیت جدید" htmlFor="status" error={errs.status} required>
            <Select name="status" defaultValue={action.status}>
              <SelectTrigger id="status"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACTION_STATUS.map((s) => <SelectItem key={s} value={s}>{actionStatusLabels[s].label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="توضیح تغییر" htmlFor="note" error={errs.note} hint="چه اتفاقی افتاد یا چه چیزی تغییر کرد؟">
            <Textarea id="note" name="note" rows={3} defaultValue={action.note} placeholder="مثلاً: پیاده‌سازی بخش اول تمام شد، منتظر بازبینی کد." />
          </Field>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="ghost">انصراف</Button></DialogClose>
            <SubmitButton icon="check">ثبت تغییر</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
