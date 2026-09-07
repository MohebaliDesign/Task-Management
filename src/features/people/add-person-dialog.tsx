"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/form/field";
import { createPerson } from "@/lib/actions";
import { ROLE } from "@/lib/domain";
import { roleLabels } from "@/lib/labels";
import type { Person } from "@/lib/domain";

/**
 * Lightweight "add a new person" dialog reused wherever a person select
 * offers "+ افزودن فرد جدید" (project responsibility, meeting participants…).
 * Fully client-driven: calls createPerson directly and hands the new Person
 * back to the caller, which is responsible for making it selectable.
 */
export function AddPersonDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (person: Person) => void;
}) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [role, setRole] = React.useState<string>("member");
  const nameRef = React.useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const res = await createPerson(fd);
    setPending(false);
    if (res.ok) {
      toast.success("فرد جدید افزوده شد.");
      onCreated(res.person);
      setRole("member");
    } else {
      setError(res.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن فرد جدید</DialogTitle>
          <DialogDescription>فرد افزوده‌شده بلافاصله در فهرست انتخاب قابل‌دسترس خواهد بود.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="نام" htmlFor="new-person-name" required>
            <Input id="new-person-name" name="name" ref={nameRef} autoFocus placeholder="نام و نام خانوادگی" required />
          </Field>
          <Field label="نقش" htmlFor="new-person-role" required>
            <Select name="role" value={role} onValueChange={setRole}>
              <SelectTrigger id="new-person-role"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLE.map((r) => <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          {error && <p className="text-xs font-medium text-destructive-text">{error}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">انصراف</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>{pending ? "در حال افزودن…" : "افزودن فرد"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
