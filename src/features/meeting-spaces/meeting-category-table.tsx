import Link from "next/link";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { PersonChip } from "@/components/domain/person";
import { RowActions } from "@/components/domain/row-actions";
import { faDate, toFa } from "@/lib/utils";
import { getPerson, getMeetingSpaceStats } from "@/lib/queries";
import type { MeetingSpace } from "@/lib/domain";

/**
 * Tabular view of Meeting *Categories* (not individual meetings). Columns use
 * only data the domain actually carries for a MeetingSpace: owner, a derived
 * meeting count, and the last recorded meeting date.
 */
export function MeetingCategoryTable({ spaces }: { spaces: MeetingSpace[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام دسته</TableHead>
            <TableHead>مسئول</TableHead>
            <TableHead>تعداد جلسات</TableHead>
            <TableHead>آخرین جلسه</TableHead>
            <TableHead className="w-12 text-end"><span className="sr-only">عملیات</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spaces.map((s) => {
            const owner = getPerson(s.ownerId);
            const stats = getMeetingSpaceStats(s.id);
            return (
              <TableRow key={s.id} className="group">
                <TableCell>
                  <Link
                    href={`/meetings/${s.id}`}
                    className="rounded-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {s.name}
                  </Link>
                </TableCell>
                <TableCell><PersonChip person={owner} variant="compact" /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{toFa(stats.meetingCount)} جلسه</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {stats.lastMeetingDate ? faDate(stats.lastMeetingDate) : "—"}
                </TableCell>
                <TableCell className="text-end">
                  <RowActions
                    label={`عملیات ${s.name}`}
                    actions={[
                      { label: "مشاهدهٔ جلسات", icon: "overview", href: `/meetings/${s.id}` },
                      { label: "ثبت جلسه جدید", icon: "add", href: `/meetings/${s.id}/new` },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
