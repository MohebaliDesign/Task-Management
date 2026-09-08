import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PersonAvatar } from "@/components/domain/person";
import { roleLabels } from "@/lib/labels";
import { getTeamsForPerson } from "@/lib/queries";
import type { Person } from "@/lib/domain";

export function PeopleTable({ people }: { people: Person[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>شخص</TableHead>
          <TableHead>نقش</TableHead>
          <TableHead>تیم‌ها</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {people.map((p) => {
          const teams = getTeamsForPerson(p.id);
          return (
            <TableRow key={p.id}>
              <TableCell className="min-w-[220px]">
                <div className="flex items-center gap-6">
                  <PersonAvatar person={p} className="h-10 w-10 shrink-0" />
                  <span className="font-medium">{p.name}</span>
                </div>
              </TableCell>
              <TableCell className="min-w-[120px] text-sm text-foreground">{roleLabels[p.role]}</TableCell>
              <TableCell className="min-w-[220px]">
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
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
