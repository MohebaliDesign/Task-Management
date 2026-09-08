import Link from "next/link";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { MeetingStatusBadge } from "@/components/domain/status";
import { AvatarStack } from "@/components/domain/person";
import { faDate } from "@/lib/utils";
import { getMeetingContext, getPerson } from "@/lib/queries";
import type { Meeting } from "@/lib/domain";

/** The tabular alternative to MeetingCard — same data, denser scanning. */
export function MeetingTable({ meetings }: { meetings: Meeting[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>عنوان جلسه</TableHead>
            <TableHead>پروژه / دستهٔ جلسات</TableHead>
            <TableHead>تاریخ</TableHead>
            <TableHead>شرکت‌کنندگان</TableHead>
            <TableHead>وضعیت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((m) => {
            const ctx = getMeetingContext(m);
            const people = m.participants.map((p) => getPerson(p.personId)).filter((p): p is NonNullable<typeof p> => !!p);
            return (
              <TableRow key={m.id}>
                <TableCell>
                  <Link href={ctx.meetingHref} className="rounded-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {m.title}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{ctx.label}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{faDate(m.date)}</TableCell>
                <TableCell><AvatarStack people={people} max={3} /></TableCell>
                <TableCell><MeetingStatusBadge value={m.status} /></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
