import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/icon";
import { MeetingStatusBadge } from "@/components/domain/status";
import { AvatarStack } from "@/components/domain/person";
import { faDate, toFa } from "@/lib/utils";
import { getMeetingDecisions, getMeetingActions, getSignatureProgress, getPerson } from "@/lib/queries";
import type { Meeting } from "@/lib/domain";

/**
 * The single meeting-list rendering, shared by project meetings and Meeting
 * Space meetings — same row structure and the same at-a-glance counts
 * regardless of context.
 */
export function MeetingList({ meetings, basePath }: { meetings: Meeting[]; basePath: string }) {
  return (
    <div className="space-y-3">
      {meetings.map((m) => {
        const decisions = getMeetingDecisions(m.id).length;
        const actions = getMeetingActions(m.id).length;
        const sig = getSignatureProgress(m.id);
        const people = m.participants.map((p) => getPerson(p.personId)).filter((p): p is NonNullable<typeof p> => !!p);
        return (
          <Card key={m.id} className="relative p-4 shadow-sm transition-shadow hover:shadow-md">
            <Link
              href={`${basePath}/${m.id}`}
              className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`باز کردن ${m.title}`}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <span className="text-[10px] leading-none text-muted-foreground">جلسه</span>
                  <span className="text-sm font-semibold leading-none">{toFa(m.sequence)}</span>
                </span>
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <AppIcon name="calendar" size={13} />
                    {faDate(m.date)} · {m.location || "بدون مکان"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AppIcon name="decision" size={14} /> {toFa(decisions)} تصمیم
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AppIcon name="actions" size={14} /> {toFa(actions)} اقدام
                </span>
                {sig.total > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <AppIcon name="approval" size={14} /> {toFa(sig.signed)} از {toFa(sig.total)} امضا
                  </span>
                )}
                <AvatarStack people={people} max={3} />
                <MeetingStatusBadge value={m.status} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
