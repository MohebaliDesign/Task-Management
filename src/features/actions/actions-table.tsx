import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/icon";
import { ActionStatusDot } from "@/components/domain/status";
import { AssigneeChip } from "@/components/domain/person";
import { UpdateActionStatusDialog } from "@/features/actions/update-action-status-dialog";
import { faDate, daysUntil, toFa } from "@/lib/utils";
import { getAssignee, getAction } from "@/lib/queries";
import type { ActionItem } from "@/lib/domain";

/**
 * The chosen pattern for "quickly understand actions, blockers, dependencies,
 * owners" without turning the page into more cards: one table where every
 * row already carries its relationship to other actions, instead of a
 * separate list a reader has to cross-reference by title. A dependency graph
 * or tree was considered, but actions here form a general graph (one action
 * can both block and be blocked by others) — a table scales to that without
 * a new charting dependency, and stays scannable at any row count.
 */
export function ActionsTable({
  actions,
  projectId,
  blockedBy,
  blocking,
  readOnly,
}: {
  actions: ActionItem[];
  projectId: string;
  blockedBy: Map<string, string[]>;
  blocking: Map<string, string[]>;
  readOnly: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>اقدام</TableHead>
          <TableHead>مسئول</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>مهلت</TableHead>
          <TableHead>وابستگی</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {actions.map((a) => {
          const dLeft = daysUntil(a.deadline);
          const overdue = dLeft !== null && dLeft < 0 && a.status !== "done" && a.status !== "canceled";
          const blockedByIds = blockedBy.get(a.id);
          const blockingIds = blocking.get(a.id);

          return (
            <TableRow key={a.id}>
              <TableCell className="min-w-[220px]">
                <p className="font-medium">{a.title}</p>
                <Link href={`/projects/${projectId}/meetings/${a.meetingId}`} className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <AppIcon name="meetings" size={12} /> جلسهٔ منبع
                </Link>
              </TableCell>
              <TableCell className="min-w-[140px]"><AssigneeChip assignee={getAssignee(a.ownerId)} /></TableCell>
              <TableCell className="min-w-[160px]">
                <div className="flex flex-col items-start gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <ActionStatusDot value={a.status} />
                    {a.note && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-muted-foreground"><AppIcon name="note" size={13} /></span>
                        </TooltipTrigger>
                        <TooltipContent>آخرین به‌روزرسانی: {a.note}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {!readOnly && <UpdateActionStatusDialog action={a} />}
                </div>
              </TableCell>
              <TableCell className="min-w-[110px]">
                {a.deadline ? (
                  <span className={overdue ? "text-destructive-text" : ""}>
                    {faDate(a.deadline)}
                    {overdue && dLeft !== null && <span className="block text-xs">{toFa(Math.abs(dLeft))} روز تأخیر</span>}
                  </span>
                ) : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="min-w-[100px]">
                {!blockedByIds?.length && !blockingIds?.length ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  <div className="flex flex-col gap-1">
                    {!!blockedByIds?.length && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex w-fit items-center gap-1 text-xs text-destructive-text">
                            <AppIcon name="dependency" size={13} /> مسدودشده توسط ({toFa(blockedByIds.length)})
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>مسدودشده توسط: {blockedByIds.map((id) => getAction(id)?.title).filter(Boolean).join("، ")}</TooltipContent>
                      </Tooltip>
                    )}
                    {!!blockingIds?.length && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex w-fit items-center gap-1 text-xs text-warning">
                            <AppIcon name="dependency" size={13} /> مسدودکنندهٔ ({toFa(blockingIds.length)})
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>مسدودکنندهٔ: {blockingIds.map((id) => getAction(id)?.title).filter(Boolean).join("، ")}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
