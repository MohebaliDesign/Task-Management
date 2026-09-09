import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PersonAvatar } from "@/components/domain/person";
import { PersonDetailDialog } from "@/features/people/person-detail-dialog";
import { roleLabels } from "@/lib/labels";
import { toFa } from "@/lib/utils";
import { getActiveProjectsForPerson, getTeamsForPerson } from "@/lib/queries";
import type { Person } from "@/lib/domain";

/** Compact enterprise data table (item #33-35) — dense rows, small avatars, only comparison-useful columns. */
export function PeopleTable({ people }: { people: Person[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>شخص</TableHead>
            <TableHead>نقش</TableHead>
            <TableHead>تیم‌ها</TableHead>
            <TableHead>پروژه‌های فعال</TableHead>
            <TableHead className="w-0" aria-label="عملیات" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((p) => {
            const teams = getTeamsForPerson(p.id);
            const activeProjects = getActiveProjectsForPerson(p.id);
            return (
              <TableRow key={p.id}>
                <TableCell className="min-w-[200px]">
                  <div className="flex items-center gap-2.5">
                    <PersonAvatar person={p} className="h-8 w-8 shrink-0" />
                    <span className="truncate font-medium">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell className="min-w-[110px] text-sm text-foreground">{roleLabels[p.role]}</TableCell>
                <TableCell className="min-w-[200px]">
                  {teams.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {teams.map((t) => (
                        <Badge key={t.id} variant="secondary" className="font-normal">
                          {t.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="min-w-[90px] text-sm text-muted-foreground">{toFa(activeProjects.length)}</TableCell>
                <TableCell className="min-w-[110px]">
                  <PersonDetailDialog person={p} teams={teams} activeProjects={activeProjects}>
                    <button
                      type="button"
                      className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      مشاهده جزئیات
                    </button>
                  </PersonDetailDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
