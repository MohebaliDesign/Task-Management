"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/form/field";
import { AppIcon } from "@/components/icon";
import { PersonSelect } from "@/features/people/person-select";
import { ACTION_STATUS, PRIORITY } from "@/lib/domain";
import { actionStatusLabels, priorityLabels } from "@/lib/labels";
import type { ActionStatus, Person, Priority } from "@/lib/domain";

const NONE = "__none__";

export interface ActionDraft {
  title: string;
  ownerId: string;
  deadline: string;
  priority: Priority;
  status: ActionStatus;
  relatedDecisionKey: string | null;
}

/** Same field structure as the standalone "افزودن اقدام" modal, drafted client-side. */
export function ActionDraftDialog({
  people,
  decisionOptions,
  onPersonCreated,
  onAdd,
}: {
  people: Person[];
  decisionOptions: { key: string; text: string }[];
  onPersonCreated: (person: Person) => void;
  onAdd: (draft: ActionDraft) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [ownerId, setOwnerId] = React.useState("");
  const [deadline, setDeadline] = React.useState("");
  const [priority, setPriority] = React.useState<Priority>("medium");
  const [status, setStatus] = React.useState<ActionStatus>("not_started");
  const [relatedDecisionKey, setRelatedDecisionKey] = React.useState<string>(NONE);
  const [error, setError] = React.useState("");

  function reset() {
    setTitle("");
    setOwnerId("");
    setDeadline("");
    setPriority("medium");
    setStatus("not_started");
    setRelatedDecisionKey(NONE);
    setError("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("عنوان اقدام را وارد کنید.");
    if (!ownerId) return setError("مسئول اقدام را انتخاب کنید.");
    onAdd({
      title: title.trim(),
      ownerId,
      deadline,
      priority,
      status,
      relatedDecisionKey: relatedDecisionKey === NONE ? null : relatedDecisionKey,
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <AppIcon name="add" size={16} /> افزودن اقدام
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن اقدام</DialogTitle>
          <DialogDescription>اقدام با مسئول، مهلت، اولویت و وضعیت ثبت می‌شود.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="عنوان اقدام" htmlFor="action-draft-title" required>
            <Input id="action-draft-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="مسئول" htmlFor="action-draft-owner" required>
              <PersonSelect id="action-draft-owner" people={people} value={ownerId} onValueChange={setOwnerId} onPersonCreated={onPersonCreated} placeholder="انتخاب" />
            </Field>
            <Field label="اولویت" htmlFor="action-draft-priority" required>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger id="action-draft-priority"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITY.map((p) => <SelectItem key={p} value={p}>{priorityLabels[p].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="مهلت (اختیاری)" htmlFor="action-draft-deadline">
              <Input id="action-draft-deadline" type="date" className="latin-nums" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </Field>
            <Field label="وضعیت" htmlFor="action-draft-status" required>
              <Select value={status} onValueChange={(v) => setStatus(v as ActionStatus)}>
                <SelectTrigger id="action-draft-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACTION_STATUS.map((s) => <SelectItem key={s} value={s}>{actionStatusLabels[s].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          {decisionOptions.length > 0 && (
            <Field label="تصمیم مرتبط (اختیاری)" htmlFor="action-draft-decision">
              <Select value={relatedDecisionKey} onValueChange={setRelatedDecisionKey}>
                <SelectTrigger id="action-draft-decision"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>بدون تصمیم</SelectItem>
                  {decisionOptions.map((d) => <SelectItem key={d.key} value={d.key}>{d.text.slice(0, 40)}…</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          )}
          {error && <p className="text-xs font-medium text-destructive-text">{error}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">انصراف</Button>
            </DialogClose>
            <Button type="submit">افزودن اقدام</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
