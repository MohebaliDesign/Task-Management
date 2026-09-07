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

export interface BlockerDraft {
  title: string;
  description: string;
  ownerId: string;
}

/**
 * Same field structure as the standalone "افزودن مانع" modal (AddBlockerDialog),
 * but purely client-side — it hands a draft back to the meeting form instead
 * of calling a server action. Also used to edit an already-drafted item: pass
 * `initial` + a custom `trigger` (e.g. an edit icon on the item row).
 */
export function BlockerDraftDialog({
  onPersonCreated,
  people,
  onSubmit,
  initial,
  trigger,
}: {
  people: Person[];
  onPersonCreated: (person: Person) => void;
  onSubmit: (draft: BlockerDraft) => void;
  initial?: BlockerDraft;
  trigger?: React.ReactNode;
}) {
  const isEdit = !!initial;
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [ownerId, setOwnerId] = React.useState(initial?.ownerId ?? "");
  const [error, setError] = React.useState("");

  function resetToInitial() {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setOwnerId(initial?.ownerId ?? "");
    setError("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("عنوان مانع را وارد کنید.");
    onSubmit({ title: title.trim(), description: description.trim(), ownerId });
    setOpen(false);
    if (!isEdit) resetToInitial();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) resetToInitial(); }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" size="sm">
            <AppIcon name="add" size={16} /> ثبت مانع
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "ویرایش مانع" : "ثبت مانع"}</DialogTitle>
          <DialogDescription>مانع یک بازدارندهٔ فعلی است که همین حالا پیشرفت را متوقف کرده است.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="عنوان مانع" htmlFor="blocker-draft-title" required>
            <Input id="blocker-draft-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="توضیحات (اختیاری)" htmlFor="blocker-draft-description">
            <Textarea id="blocker-draft-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </Field>
          <Field label="مسئول رفع (اختیاری)" htmlFor="blocker-draft-owner">
            <PersonSelect id="blocker-draft-owner" people={people} value={ownerId} onValueChange={setOwnerId} onPersonCreated={onPersonCreated} placeholder="بدون مسئول" />
          </Field>
          {error && <p className="text-xs font-medium text-destructive-text">{error}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">انصراف</Button>
            </DialogClose>
            <Button type="submit">{isEdit ? "ذخیرهٔ تغییرات" : "ثبت مانع"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
