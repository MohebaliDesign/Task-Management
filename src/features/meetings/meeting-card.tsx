import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/icon";
import { MeetingStatusBadge } from "@/components/domain/status";
import { AvatarStack } from "@/components/domain/person";
import { faDate } from "@/lib/utils";
import { getMeetingContext, getPerson } from "@/lib/queries";
import type { Meeting } from "@/lib/domain";

/**
 * Scannable meeting summary for the all-meetings hub — works identically for
 * a project meeting or a Meeting Space meeting; only the context line differs.
 */
export function MeetingCard({ meeting }: { meeting: Meeting }) {
  const ctx = getMeetingContext(meeting);
  const people = meeting.participants.map((p) => getPerson(p.personId)).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <Card className="group relative flex flex-col p-5 shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={ctx.meetingHref}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`مشاهدهٔ ${meeting.title}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{meeting.title}</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">{ctx.label}</p>
        </div>
        <MeetingStatusBadge value={meeting.status} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <AppIcon name="calendar" size={14} />
          {faDate(meeting.date)}
        </span>
        <AvatarStack people={people} max={4} />
      </div>
    </Card>
  );
}
