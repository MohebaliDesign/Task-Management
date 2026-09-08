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
import { addTeam, type ActionResult } from "@/lib/actions";
import type { Person } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };
const NO_LEAD = "none";

export function AddTeamDialog({ people }: { people: Person[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState(addTeam, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok) { toast.success("تیم ثبت شد."); setOpen(false); router.refresh(); }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><AppIcon name="add" size={16} /> افزودن تیم</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن تیم</DialogTitle>
          <DialogDescription>تیم‌ها می‌توانند مسئول اقدامات و موانع باشند، مستقل از یک فرد مشخص.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <Field label="نام تیم" htmlFor="t-name" error={errs.name} required>
            <Input id="t-name" name="name" aria-invalid={!!errs.name} />
          </Field>
          <Field label="توضیحات" htmlFor="t-desc" error={errs.description}>
            <Textarea id="t-desc" name="description" rows={2} />
          </Field>
          <Field label="سرپرست تیم" htmlFor="leadId" error={errs.leadId} hint="اعضای دیگر را بعداً هنگام افزودن فرد می‌توانید به این تیم اختصاص دهید.">
            <Select name="leadId" defaultValue={NO_LEAD}>
              <SelectTrigger id="leadId"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_LEAD}>بدون سرپرست</SelectItem>
                {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="ghost">انصراف</Button></DialogClose>
            <SubmitButton icon="add">ثبت تیم</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
