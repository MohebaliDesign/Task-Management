import Link from "next/link";
import type { ReactNode } from "react";
import { AppIcon } from "@/components/icon";
import { ActionStatusBadge, PriorityBadge } from "@/components/domain/status";
import { AssigneeChip } from "@/components/domain/person";
import { faDate, daysUntil, toFa } from "@/lib/utils";
import { getAssignee, getAction } from "@/lib/queries";
import type { ActionItem } from "@/lib/domain";

export function ActionItemRow({
  action,
  meetingHref,
  statusControl,
  blockedBy,
  blocking,
}: {
  action: ActionItem;
  meetingHref?: string;
  statusControl?: ReactNode;
  blockedBy?: string[]; // action ids blocking this one
  blocking?: string[]; // action ids this one blocks
}) {
  const owner = getAssignee(action.ownerId);
  const dLeft = daysUntil(action.deadline);
  const overdue = dLeft !== null && dLeft < 0 && action.status !== "done" && action.status !== "canceled";

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{action.title}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><AppIcon name="profile" size={14} /><AssigneeChip assignee={owner} /></span>
            {action.deadline && (
              <span className={`flex items-center gap-1 ${overdue ? "text-destructive-text" : ""}`}>
                <AppIcon name="calendar" size={14} />
                {faDate(action.deadline)}
                {overdue && dLeft !== null && ` (${toFa(Math.abs(dLeft))} روز تأخیر)`}
              </span>
            )}
            {meetingHref && (
              <Link href={meetingHref} className="flex items-center gap-1 hover:text-foreground">
                <AppIcon name="meetings" size={14} /> جلسهٔ منبع
              </Link>
            )}
          </div>

          {(blockedBy?.length || blocking?.length) ? (
            <div className="mt-1.5 flex flex-col gap-1">
              {blockedBy && blockedBy.length > 0 && (
                <p className="flex items-start gap-1.5 text-xs text-destructive-text">
                  <AppIcon name="dependency" size={14} className="mt-0.5 shrink-0" />
                  <span>مسدود توسط: {blockedBy.map((id) => getAction(id)?.title).filter(Boolean).join("، ")}</span>
                </p>
              )}
              {blocking && blocking.length > 0 && (
                <p className="flex items-start gap-1.5 text-xs text-warning">
                  <AppIcon name="dependency" size={14} className="mt-0.5 shrink-0" />
                  <span>مسدودکنندهٔ: {blocking.map((id) => getAction(id)?.title).filter(Boolean).join("، ")}</span>
                </p>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <PriorityBadge value={action.priority} />
          {statusControl ?? <ActionStatusBadge value={action.status} />}
        </div>
      </div>
    </div>
  );
}
