"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/form/field";
import { AppIcon } from "@/components/icon";
import { PersonSelect } from "@/features/people/person-select";
import type { Person } from "@/lib/domain";

export interface DecisionDraft {
  text: string;
  description: string;
  deciderId: string;
  area: string;
}

/**
 * Same field structure as the standalone "افزودن تصمیم" modal (AddDecisionDialog),
 * but purely client-side — it hands a draft back to the meeting-creation form
 * instead of calling a server action, since the meeting doesn't have an id yet.
 */
export function DecisionDraftDialog({
  people,
  onPersonCreated,
  onAdd,
}: {
  people: Person[];
  onPersonCreated: (person: Person) => void;
  onAdd: (draft: DecisionDraft) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [deciderId, setDeciderId] = React.useState("");
  const [area, setArea] = React.useState("عمومی");
  const [error, setError] = React.useState("");

  function reset() {
    setText("");
    setDescription("");
    setDeciderId("");
    setArea("عمومی");
    setError("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return setError("عنوان تصمیم را وارد کنید.");
    if (!deciderId) return setError("مسئول تصمیم را انتخاب کنید.");
    onAdd({ text: text.trim(), description: description.trim(), deciderId, area: area.trim() || "عمومی" });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <AppIcon name="add" size={16} /> افزودن تصمیم
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن تصمیم</DialogTitle>
          <DialogDescription>تصمیم‌ها رکوردهای مستقل و قابل‌ردیابی هستند، نه بخشی از یادداشت جلسه.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="عنوان تصمیم" htmlFor="decision-draft-text" required>
            <Textarea id="decision-draft-text" value={text} onChange={(e) => setText(e.target.value)} rows={2} />
          </Field>
          <Field label="توضیحات (اختیاری)" htmlFor="decision-draft-description">
            <Textarea id="decision-draft-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="مسئول تصمیم" htmlFor="decision-draft-decider" required>
              <PersonSelect id="decision-draft-decider" people={people} value={deciderId} onValueChange={setDeciderId} onPersonCreated={onPersonCreated} />
            </Field>
            <Field label="حوزهٔ مرتبط" htmlFor="decision-draft-area">
              <Input id="decision-draft-area" value={area} onChange={(e) => setArea(e.target.value)} />
            </Field>
          </div>
          {error && <p className="text-xs font-medium text-destructive-text">{error}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">انصراف</Button>
            </DialogClose>
            <Button type="submit">افزودن تصمیم</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
