"use client";

import * as React from "react";
import Link from "next/link";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/domain/person";
import { AppIcon } from "@/components/icon";
import { roleLabels } from "@/lib/labels";
import { toFa } from "@/lib/utils";
import type { Person, Project, Team } from "@/lib/domain";

/**
 * "مشاهده جزئیات" for a Person — reuses the existing Dialog-as-detail-surface
 * pattern already established by TeamMembersDialog instead of introducing a
 * dedicated /people/[personId] route the IA doesn't define.
 */
export function PersonDetailDialog({
  person,
  teams,
  activeProjects,
  children,
}: {
  person: Person;
  teams: Team[];
  activeProjects: Project[];
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <PersonAvatar person={person} className="h-12 w-12 shrink-0" />
            <div className="min-w-0">
              <DialogTitle className="truncate">{person.name}</DialogTitle>
              <DialogDescription className="truncate">{person.title || roleLabels[person.role]}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">نقش</dt>
            <dd className="mt-0.5">{roleLabels[person.role]}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">ایمیل</dt>
            <dd className="mt-0.5 truncate ltr text-start">{person.email || "—"}</dd>
          </div>
        </dl>

        <div>
          <p className="mb-1.5 text-xs text-muted-foreground">تیم‌ها</p>
          {teams.length === 0 ? (
            <p className="text-sm text-muted-foreground">عضو هیچ تیمی نیست.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {teams.map((t) => (
                <Badge key={t.id} variant="secondary" className="font-normal">{t.name}</Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-1.5 text-xs text-muted-foreground">پروژه‌های فعال ({toFa(activeProjects.length)})</p>
          {activeProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">در حال حاضر روی پروژهٔ فعالی نیست.</p>
          ) : (
            <ul className="space-y-1.5">
              {activeProjects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.id}`}
                    className="flex items-center gap-1.5 rounded-sm text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <AppIcon name="projects" size={14} />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
