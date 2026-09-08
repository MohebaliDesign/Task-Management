"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { PersonAvatar } from "@/components/domain/person";
import { roleLabels } from "@/lib/labels";
import { toFa } from "@/lib/utils";
import type { Person, Team } from "@/lib/domain";

/**
 * Simplest pattern that fits the current architecture: every other detail
 * surface in this app (add/update forms) is a Shadcn Dialog, so team member
 * detail reuses the same primitive instead of introducing a new route or a
 * drawer component just for this one view.
 */
export function TeamMembersDialog({
  team,
  members,
  children,
}: {
  team: Team;
  members: Person[];
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{team.name}</DialogTitle>
          <DialogDescription>{toFa(members.length)} عضو</DialogDescription>
        </DialogHeader>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">این تیم هنوز عضوی ندارد.</p>
        ) : (
          <ul className="space-y-3">
            {members.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <PersonAvatar person={p} className="h-9 w-9 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{roleLabels[p.role]}</p>
                </div>
                {team.leadId === p.id && (
                  <span className="ms-auto shrink-0 text-xs text-muted-foreground">سرپرست</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
