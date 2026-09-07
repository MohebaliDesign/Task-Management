import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PersonChip } from "@/components/domain/person";
import { getPerson } from "@/lib/queries";
import type { Project } from "@/lib/domain";

/**
 * One roster that answers "who does what, and where" — merges the former
 * separate Team and Workstreams lists so ownership and project area sit next
 * to each other instead of two lists a reader has to cross-reference by
 * name. This is a documentation view, not a task tracker: no due dates or
 * completion pressure, just who owns which area and what they're on right
 * now. A table scales to a large roster without every member needing its
 * own tall card.
 */
export function TeamWorkstreams({ project }: { project: Project }) {
  const rosterIds = [project.pmId, project.poId, ...project.teamIds].filter(
    (id, i, all): id is string => !!id && all.indexOf(id) === i,
  );

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>عضو تیم</TableHead>
            <TableHead>مسئولیت</TableHead>
            <TableHead>حوزهٔ پروژه</TableHead>
            <TableHead>وضعیت جاری</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rosterIds.map((id) => {
            const person = getPerson(id);
            if (!person) return null;
            const led = project.workstreams.filter((w) => w.lead === id);
            return (
              <TableRow key={id}>
                <TableCell className="min-w-[180px]">
                  <PersonChip person={person} showRole />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{person.title}</TableCell>
                <TableCell className="min-w-[140px]">
                  {led.length === 0 ? (
                    <span className="text-sm text-muted-foreground">—</span>
                  ) : (
                    <div className="space-y-1">
                      {led.map((w) => (
                        <p key={w.id} className="text-sm">
                          {w.title}
                        </p>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell className="min-w-[220px]">
                  {led.length === 0 ? (
                    <span className="text-sm text-muted-foreground">بدون جریان کاری فعال در حال حاضر</span>
                  ) : (
                    <div className="space-y-1">
                      {led.map((w) => (
                        <p key={w.id} className="text-sm leading-6 text-muted-foreground">
                          {w.summary}
                        </p>
                      ))}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
