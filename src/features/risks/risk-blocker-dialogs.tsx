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
import { addRisk, addBlocker, type ActionResult } from "@/lib/actions";
import { RISK_LEVEL } from "@/lib/domain";
import { riskLevelLabels } from "@/lib/labels";
import type { Person } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };

export function AddRiskDialog({ projectId, people }: { projectId: string; people: Person[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState(addRisk, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};
  React.useEffect(() => {
    if (state.ok) { toast.success("ریسک ثبت شد."); setOpen(false); router.refresh(); }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><AppIcon name="add" size={16} /> افزودن ریسک</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن ریسک</DialogTitle>
          <DialogDescription>ریسک یک مشکل بالقوهٔ آینده است — نه یک مانع فعلی.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <Field label="عنوان ریسک" htmlFor="r-title" error={errs.title} required>
            <Textarea id="r-title" name="title" rows={2} aria-invalid={!!errs.title} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="میزان اثر" htmlFor="impact" error={errs.impact} required>
              <Select name="impact" defaultValue="medium">
                <SelectTrigger id="impact"><SelectValue /></SelectTrigger>
                <SelectContent>{RISK_LEVEL.map((l) => <SelectItem key={l} value={l}>{riskLevelLabels[l].label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="احتمال وقوع" htmlFor="probability" error={errs.probability} required>
              <Select name="probability" defaultValue="medium">
                <SelectTrigger id="probability"><SelectValue /></SelectTrigger>
                <SelectContent>{RISK_LEVEL.map((l) => <SelectItem key={l} value={l}>{riskLevelLabels[l].label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="مسئول" htmlFor="r-owner" error={errs.ownerId}>
            <Select name="ownerId">
              <SelectTrigger id="r-owner"><SelectValue placeholder="بدون مسئول" /></SelectTrigger>
              <SelectContent>{people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="راهکار کاهش" htmlFor="mitigation" error={errs.mitigation}>
            <Textarea id="mitigation" name="mitigation" rows={2} />
          </Field>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="ghost">انصراف</Button></DialogClose>
            <SubmitButton icon="add">ثبت ریسک</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AddBlockerDialog({ projectId, people }: { projectId: string; people: Person[] }) {
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
        <Button size="sm"><AppIcon name="add" size={16} /> افزودن مانع</Button>
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
            <Select name="ownerId">
              <SelectTrigger id="b-owner"><SelectValue placeholder="بدون مسئول" /></SelectTrigger>
              <SelectContent>{people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
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
