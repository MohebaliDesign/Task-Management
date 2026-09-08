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
import { addPerson, type ActionResult } from "@/lib/actions";
import { ROLE, type Team } from "@/lib/domain";
import { roleLabels } from "@/lib/labels";

const initial: ActionResult = { ok: false, error: "" };
const NO_TEAM = "none";

export function AddPersonDialog({ teams }: { teams: Team[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState(addPerson, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok) { toast.success("فرد ثبت شد."); setOpen(false); router.refresh(); }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><AppIcon name="add" size={16} /> افزودن فرد</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن فرد</DialogTitle>
          <DialogDescription>فرد جدید به فهرست افراد سازمان اضافه می‌شود.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <Field label="نام کامل" htmlFor="name" error={errs.name} required>
            <Input id="name" name="name" aria-invalid={!!errs.name} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="سمت سازمانی" htmlFor="title" error={errs.title} required>
              <Input id="title" name="title" placeholder="مثلاً مهندس بک‌اند" aria-invalid={!!errs.title} />
            </Field>
            <Field label="نقش" htmlFor="role" error={errs.role} required>
              <Select name="role" defaultValue="member">
                <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                <SelectContent>{ROLE.map((r) => <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="ایمیل" htmlFor="email" error={errs.email}>
              <Input id="email" name="email" type="email" dir="ltr" className="text-end" />
            </Field>
            <Field label="تیم" htmlFor="teamId" error={errs.teamId}>
              <Select name="teamId" defaultValue={NO_TEAM}>
                <SelectTrigger id="teamId"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_TEAM}>بدون تیم</SelectItem>
                  {teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="ghost">انصراف</Button></DialogClose>
            <SubmitButton icon="add">ثبت فرد</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
