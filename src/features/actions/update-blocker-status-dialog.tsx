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
import { updateBlockerStatus, type ActionResult } from "@/lib/actions";
import { BLOCKER_STATUS, type Blocker } from "@/lib/domain";
import { blockerStatusLabels } from "@/lib/labels";

const initial: ActionResult = { ok: false, error: "" };

export function UpdateBlockerStatusDialog({ blocker, compact = false }: { blocker: Blocker; compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState(updateBlockerStatus, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok) {
      toast.success("وضعیت مانع به‌روزرسانی شد.");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <Button variant="ghost" size="sm" className="h-7 shrink-0 gap-1 px-2 text-xs">
            <AppIcon name="edit" size={13} /> به‌روزرسانی وضعیت
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <AppIcon name="edit" size={14} /> به‌روزرسانی وضعیت
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>به‌روزرسانی وضعیت مانع</DialogTitle>
          <DialogDescription>{blocker.title}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="blockerId" value={blocker.id} />
          <Field label="وضعیت جدید" htmlFor="status" error={errs.status} required>
            <Select name="status" defaultValue={blocker.status}>
              <SelectTrigger id="status"><SelectValue /></SelectTrigger>
              <SelectContent>
                {BLOCKER_STATUS.map((s) => <SelectItem key={s} value={s}>{blockerStatusLabels[s].label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="توضیح تغییر" htmlFor="note" error={errs.note} hint="چه اتفاقی افتاد یا چه چیزی تغییر کرد؟">
            <Textarea id="note" name="note" rows={3} defaultValue={blocker.note} placeholder="مثلاً: با تیم فنی بانک هماهنگ شد و مشکل رفع شد." />
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
