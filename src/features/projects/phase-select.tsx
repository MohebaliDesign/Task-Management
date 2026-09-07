"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { cn } from "@/lib/utils";

/**
 * Searchable phase-name picker: search existing phase names, pick one, or
 * create a new one inline (no dialog, no page navigation) — mirrors the
 * "add new" pattern used for people, but phase names aren't a persisted
 * entity, so creating one is just accepting free text as the value.
 */
export function PhaseSelect({
  value,
  onChange,
  suggestions,
  placeholder = "انتخاب یا جستجوی فاز",
}: {
  value: string;
  onChange: (name: string) => void;
  suggestions: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [draft, setDraft] = React.useState("");

  const filtered = React.useMemo(
    () => suggestions.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase())),
    [suggestions, query],
  );

  function reset() {
    setQuery("");
    setCreating(false);
    setDraft("");
  }

  function select(name: string) {
    onChange(name);
    setOpen(false);
    reset();
  }

  function commitNew() {
    const name = draft.trim();
    if (!name) return;
    select(name);
  }

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          )}
        >
          <span className={cn(!value && "text-muted-foreground")}>{value || placeholder}</span>
          <AppIcon name="chevronDown" size={16} className="opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        {creating ? (
          <div className="space-y-2 p-3">
            <label className="text-xs text-muted-foreground">نام فاز جدید</label>
            <div className="flex gap-2">
              <Input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitNew();
                  }
                }}
                placeholder="مثلاً: بازبینی کاربری"
              />
              <Button type="button" size="sm" onClick={commitNew}>ثبت</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-border p-2">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 start-2.5 flex items-center text-muted-foreground">
                  <AppIcon name="search" size={15} />
                </span>
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی فاز"
                  className="h-8 ps-8 text-sm"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <p className="px-2 py-3 text-center text-xs text-muted-foreground">فازی یافت نشد.</p>
              ) : (
                filtered.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => select(name)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm hover:bg-accent",
                      name === value && "bg-accent",
                    )}
                  >
                    {name === value && <AppIcon name="check" size={14} className="shrink-0 text-primary" />}
                    <span className={cn(name !== value && "ps-[22px]")}>{name}</span>
                  </button>
                ))
              )}
            </div>
            <div className="border-t border-border p-1">
              <button
                type="button"
                onClick={() => { setCreating(true); setDraft(query); }}
                className="flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm text-primary hover:bg-primary/5"
              >
                <AppIcon name="add" size={14} />
                افزودن فاز جدید
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
