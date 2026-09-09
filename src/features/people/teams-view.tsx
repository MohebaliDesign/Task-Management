import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppIcon } from "@/components/icon";
import { PersonAvatar } from "@/components/domain/person";
import { ViewSwitcher, type ViewMode } from "@/components/domain/view-switcher";
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

/** Team & People → "تیم‌ها" tab. Shares the ViewSwitcher/Card/Table pattern with the "افراد" tab (item #30) — view preference lives in the same `?view=` param. */
export function TeamsView({ rows, view }: { rows: TeamRow[]; view: ViewMode }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{toFa(rows.length)} تیم</span>
        <ViewSwitcher value={view} />
      </div>

      {view === "table" ? (
        <>
          <div className="hidden lg:block">
            <TeamsTable rows={rows} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {rows.map((row) => (
              <TeamCard key={row.team.id} {...row} />
            ))}
          </div>
        </>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <TeamCard key={row.team.id} {...row} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamCard({ team, members, pm, po }: TeamRow) {
  return (
    <TeamMembersDialog team={team} members={members}>
      <button type="button" className="w-full rounded-lg text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
              مشاهده جزئیات <AppIcon name="chevronLeft" size={13} />
            </span>
          </div>
        </Card>
      </button>
    </TeamMembersDialog>
  );
}

function TeamsTable({ rows }: { rows: TeamRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>تیم</TableHead>
            <TableHead>مدیر پروژه</TableHead>
            <TableHead>مالک محصول</TableHead>
            <TableHead>تعداد اعضا</TableHead>
            <TableHead className="w-0" aria-label="عملیات" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ team, members, pm, po }) => (
            <TableRow key={team.id}>
              <TableCell className="min-w-[160px] font-medium">{team.name}</TableCell>
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
              <TableCell className="min-w-[110px]">
                <TeamMembersDialog team={team} members={members}>
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    مشاهده جزئیات
                  </button>
                </TeamMembersDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
