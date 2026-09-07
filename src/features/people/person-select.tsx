"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppIcon } from "@/components/icon";
import { AddPersonDialog } from "./add-person-dialog";
import { roleLabels } from "@/lib/labels";
import type { Person } from "@/lib/domain";

const ADD_NEW = "__add_new_person__";

/**
 * A person <Select> that always offers "+ افزودن فرد جدید" at the bottom.
 * Selecting it opens a small creation dialog; the new person is appended to
 * the caller-owned `people` list (via onPersonCreated) and auto-selected.
 */
export function PersonSelect({
  name,
  id,
  people,
  value: valueProp,
  defaultValue,
  placeholder = "انتخاب کنید",
  onPersonCreated,
  onValueChange,
}: {
  /** Omit when used outside a native form submission (e.g. local draft state). */
  name?: string;
  id?: string;
  people: Person[];
  /** Controlled value — pass together with onValueChange for local-state usage. */
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onPersonCreated: (person: Person) => void;
  onValueChange?: (value: string) => void;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp !== undefined ? valueProp : internalValue;
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleChange(v: string) {
    if (v === ADD_NEW) {
      setDialogOpen(true);
      return;
    }
    if (valueProp === undefined) setInternalValue(v);
    onValueChange?.(v);
  }

  function handleCreated(person: Person) {
    onPersonCreated(person);
    if (valueProp === undefined) setInternalValue(person.id);
    onValueChange?.(person.id);
    setDialogOpen(false);
  }

  return (
    <>
      <Select name={name} value={value} onValueChange={handleChange}>
        <SelectTrigger id={id}><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {people.map((p) => (
            <SelectItem key={p.id} value={p.id}>{p.name} — {roleLabels[p.role]}</SelectItem>
          ))}
          <SelectSeparator />
          <SelectItem value={ADD_NEW} className="text-primary focus:bg-primary/10 focus:text-primary">
            <span className="flex items-center gap-1.5">
              <AppIcon name="add" size={14} />
              افزودن فرد جدید
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
      <AddPersonDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={handleCreated} />
    </>
  );
}
