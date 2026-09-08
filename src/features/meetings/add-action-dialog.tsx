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
import { AssigneeSelect } from "@/components/form/assignee-select";
import { SubmitButton } from "@/components/form/submit-button";
import { AppIcon } from "@/components/icon";
import { addAction, type ActionResult } from "@/lib/actions";
import { PRIORITY } from "@/lib/domain";
import { priorityLabels } from "@/lib/labels";
import type { ActionItem, Person, Team, Decision, Meeting } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };

export function AddActionDialog({
  projectId,
  meetingId,
  meetings,
  people,
  teams,
  decisions,
  blockableActions,
}: {
  projectId: string;
  /** Fixed meeting context (embedded in a meeting-detail page). */
  meetingId?: string;
  /** Project meetings, used to render a meeting picker when `meetingId` is not fixed. */
  meetings?: Meeting[];
  people: Person[];
  teams: Team[];
  decisions: Decision[];
  blockableActions?: ActionItem[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction] = useFormState(addAction, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok) {
      toast.success("اقدام ثبت شد.");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <AppIcon name="add" size={16} /> افزودن اقدام
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن اقدام</DialogTitle>
          <DialogDescription>اقدام با مسئول، مهلت، اولویت و تصمیم مرتبط ثبت می‌شود.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          {meetingId && <input type="hidden" name="meetingId" value={meetingId} />}
          <Field label="عنوان اقدام" htmlFor="title" error={errs.title} required>
            <Input id="title" name="title" aria-invalid={!!errs.title} />
          </Field>
          <Field label="توضیحات" htmlFor="description" error={errs.description}>
            <Textarea id="description" name="description" rows={2} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="مسئول" htmlFor="ownerId" error={errs.ownerId}>
              <AssigneeSelect id="ownerId" name="ownerId" people={people} teams={teams} />
            </Field>
            <Field label="اولویت" htmlFor="priority" error={errs.priority} required>
              <Select name="priority" defaultValue="medium">
                <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITY.map((p) => <SelectItem key={p} value={p}>{priorityLabels[p].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          {!meetingId && (
            <Field label="جلسهٔ مرتبط" htmlFor="meetingId" error={errs.meetingId} hint="در صورت وجود، جلسهٔ منبع این اقدام را انتخاب کنید.">
              <Select name="meetingId">
                <SelectTrigger id="meetingId"><SelectValue placeholder="بدون جلسهٔ مرتبط" /></SelectTrigger>
                <SelectContent>
                  {(meetings ?? []).map((m) => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Field label="مهلت" htmlFor="deadline" error={errs.deadline}>
              <Input id="deadline" name="deadline" type="date" className="latin-nums" />
            </Field>
            <Field label="تصمیم مرتبط" htmlFor="relatedDecisionId" error={errs.relatedDecisionId} hint={decisions.length === 0 ? "ابتدا تصمیم ثبت کنید" : undefined}>
              <Select name="relatedDecisionId" disabled={decisions.length === 0}>
                <SelectTrigger id="relatedDecisionId"><SelectValue placeholder="بدون تصمیم" /></SelectTrigger>
                <SelectContent>
                  {decisions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.text.slice(0, 40)}…</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          {blockableActions && blockableActions.length > 0 && (
            <Field
              label="این اقدام مسدود است توسط"
              htmlFor="blockingActionId"
              error={errs.blockingActionId}
              hint="اگر این اقدام منتظر اقدام دیگری است، آن را اینجا انتخاب کنید."
            >
              <Select name="blockingActionId">
                <SelectTrigger id="blockingActionId"><SelectValue placeholder="بدون وابستگی" /></SelectTrigger>
                <SelectContent>
                  {blockableActions.map((a) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">انصراف</Button>
            </DialogClose>
            <SubmitButton icon="add">ثبت اقدام</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
