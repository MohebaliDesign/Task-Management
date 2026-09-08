"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppIcon } from "@/components/icon";
import { PersonAvatar } from "@/components/domain/person";
import { TeamMembersDialog } from "@/features/people/team-members-dialog";
import { toFa } from "@/lib/utils";
import type { Person, Team } from "@/lib/domain";

interface TeamRow {
  team: Team;
  members: Person[];
  pm: Person | undefined;
  po: Person | undefined;
}

const NA = <span className="text-muted-foreground">—</span>;

export function TeamsView({ rows }: { rows: TeamRow[] }) {
  const [view, setView] = React.useState<"card" | "table">("card");

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{toFa(rows.length)} تیم</span>
        <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
          <Button
            type="button"
            size="sm"
            variant={view === "card" ? "secondary" : "ghost"}
            className="h-7 px-2.5 text-xs shadow-none"
            aria-pressed={view === "card"}
            onClick={() => setView("card")}
          >
            <AppIcon name="dashboard" size={14} /> کارت
          </Button>
          <Button
            type="button"
            size="sm"
            variant={view === "table" ? "secondary" : "ghost"}
            className="h-7 px-2.5 text-xs shadow-none"
            aria-pressed={view === "table"}
            onClick={() => setView("table")}
          >
            <AppIcon name="clipboard" size={14} /> جدول
          </Button>
        </div>
      </div>

      {view === "card" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ team, members, pm, po }) => (
            <TeamMembersDialog key={team.id} team={team} members={members}>
              <button
                type="button"
                className="w-full rounded-lg text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="flex flex-col gap-3 p-4 transition-colors hover:border-primary/40 hover:bg-accent/40">
                  <p className="font-medium">{team.name}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <p>مدیر پروژه</p>
                      <p className="mt-0.5 text-foreground">{pm ? pm.name : "—"}</p>
                    </div>
                    <div>
                      <p>مالک محصول</p>
                      <p className="mt-0.5 text-foreground">{po ? po.name : "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>{toFa(members.length)} عضو</span>
                    <span className="flex items-center gap-1 text-primary">
                      مشاهدهٔ اعضا <AppIcon name="chevronLeft" size={13} />
                    </span>
                  </div>
                </Card>
              </button>
            </TeamMembersDialog>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>تیم</TableHead>
                <TableHead>مدیر پروژه</TableHead>
                <TableHead>مالک محصول</TableHead>
                <TableHead>تعداد اعضا</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ team, members, pm, po }) => (
                <TableRow key={team.id}>
                  <TableCell className="min-w-[160px] font-medium">
                    <TeamMembersDialog team={team} members={members}>
                      <button type="button" className="flex items-center gap-1 hover:text-primary hover:underline focus-visible:outline-none">
                        {team.name}
                      </button>
                    </TeamMembersDialog>
                  </TableCell>
                  <TableCell className="min-w-[140px]">
                    {pm ? (
                      <span className="inline-flex items-center gap-2">
                        <PersonAvatar person={pm} className="h-6 w-6" /> {pm.name}
                      </span>
                    ) : NA}
                  </TableCell>
                  <TableCell className="min-w-[140px]">
                    {po ? (
                      <span className="inline-flex items-center gap-2">
                        <PersonAvatar person={po} className="h-6 w-6" /> {po.name}
                      </span>
                    ) : NA}
                  </TableCell>
                  <TableCell className="min-w-[90px]">{toFa(members.length)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
