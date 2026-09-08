import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/icon";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { BlockerStatusDot } from "@/components/domain/status";
import { AssigneeChip } from "@/components/domain/person";
import { ActionsTable } from "@/features/actions/actions-table";
import { AddBlockerDialog } from "@/features/actions/add-blocker-dialog";
import { UpdateBlockerStatusDialog } from "@/features/actions/update-blocker-status-dialog";
import { AddDependencyDialog } from "@/features/dependencies/add-dependency-dialog";
import {
  getProject, getActions, getDependencyViews, getBlockers, getPeople, getTeams, getAssignee,
} from "@/lib/queries";
import { faDate, toFa } from "@/lib/utils";

export default function ActionsPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();

  const actions = getActions(project.id);
  const deps = getDependencyViews(project.id);
  const blockers = getBlockers(project.id);
  const people = getPeople();
  const teams = getTeams();
  const readOnly = project.lifecycle === "closed";

  // Build per-action blocked-by / blocking maps.
  const blockedBy = new Map<string, string[]>();
  const blocking = new Map<string, string[]>();
  for (const { dependency } of deps) {
    blockedBy.set(dependency.blockedActionId, [...(blockedBy.get(dependency.blockedActionId) ?? []), dependency.blockingActionId]);
    blocking.set(dependency.blockingActionId, [...(blocking.get(dependency.blockingActionId) ?? []), dependency.blockedActionId]);
  }

  const openActions = actions.filter((a) => a.status !== "done" && a.status !== "canceled");
  const doneActions = actions.filter((a) => a.status === "done" || a.status === "canceled");
  const openBlockers = blockers.filter((b) => b.status === "open");
  const resolvedBlockers = blockers.filter((b) => b.status === "resolved");

  return (
    <div className="space-y-8">
      {/* Blockers — current impediments, surfaced first since they need the most immediate attention */}
      <div>
        <SectionHeader
          title="موانع"
          description="چیزی که همین حالا جلوی پیشرفت را گرفته و باید برطرف شود."
          icon="blocker"
          actions={!readOnly && <AddBlockerDialog projectId={project.id} people={people} teams={teams} />}
        />
        {blockers.length === 0 ? (
          <EmptyState
            icon="check"
            title="مانعی ثبت نشده است"
            description="اگر چیزی جلوی پیشرفت پروژه را گرفته است، آن را ثبت کنید."
            action={!readOnly && <AddBlockerDialog projectId={project.id} people={people} teams={teams} triggerLabel="ثبت مانع" />}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {[...openBlockers, ...resolvedBlockers].map((b) => (
              <Card
                key={b.id}
                className={`overflow-hidden border-s-4 p-0 ${b.status === "open" ? "border-s-destructive" : "border-s-success"}`}
              >
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                  <p className="min-w-0 truncate text-sm font-medium leading-5">{b.title}</p>
                  {!readOnly && <UpdateBlockerStatusDialog blocker={b} compact />}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-4 py-2.5 text-xs">
                  <BlockerStatusDot value={b.status} />
                  <AssigneeChip assignee={getAssignee(b.ownerId)} className="text-xs" />
                  <span className="text-muted-foreground">{faDate(b.raisedDate)}</span>
                </div>
                {b.note && (
                  <p className="truncate border-t border-border px-4 py-2 text-xs text-muted-foreground" title={b.note}>
                    {b.note}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Actions / Follow-ups — one table instead of a card per row, so relationships stay visible alongside owner and status */}
      <div>
        <SectionHeader
          title="اقدامات"
          description="کارهایی که باید انجام شوند: مسئول، مهلت و ارتباط با اقدامات دیگر."
          icon="actions"
        />
        {actions.length === 0 ? (
          <EmptyState icon="actions" title="اقدامی ثبت نشده است" description="اقدامات هنگام ثبت جلسه اضافه می‌شوند." />
        ) : (
          <div className="space-y-6">
            {openActions.length > 0 && (
              <Card className="overflow-hidden">
                <ActionsTable actions={openActions} projectId={project.id} blockedBy={blockedBy} blocking={blocking} readOnly={readOnly} />
              </Card>
            )}
            {doneActions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">تکمیل‌شده / لغوشده ({toFa(doneActions.length)})</p>
                <Card className="overflow-hidden opacity-80">
                  <ActionsTable actions={doneActions} projectId={project.id} blockedBy={blockedBy} blocking={blocking} readOnly={readOnly} />
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dependencies */}
      <div>
        <SectionHeader
          title="وابستگی‌ها"
          description="چه چیزی منتظر چه چیزی است."
          icon="dependency"
          actions={!readOnly && actions.length >= 2 && <AddDependencyDialog projectId={project.id} actions={actions} />}
        />
        {deps.length === 0 ? (
          <EmptyState
            icon="dependency"
            title="وابستگی‌ای ثبت نشده است"
            description="اگر اقدامی منتظر اقدام دیگری است، آن را به‌صورت وابستگی ثبت کنید."
            action={!readOnly && actions.length >= 2 && <AddDependencyDialog projectId={project.id} actions={actions} />}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {deps.map(({ dependency, blocking: b, blocked }) => (
              <Card key={dependency.id} className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-md border border-destructive/20 bg-destructive-subtle p-2.5">
                    <p className="text-xs text-destructive-text">مسدودشده (منتظر)</p>
                    <p className="text-sm font-medium">{blocked?.title ?? "—"}</p>
                    <div className="mt-1"><AssigneeChip assignee={getAssignee(blocked?.ownerId)} /></div>
                  </div>
                  <AppIcon name="chevronLeft" size={18} className="shrink-0 text-muted-foreground" />
                  <div className="flex-1 rounded-md border border-border bg-muted/40 p-2.5">
                    <p className="text-xs text-muted-foreground">مسدودکننده (باید اول انجام شود)</p>
                    <p className="text-sm font-medium">{b?.title ?? "—"}</p>
                    <div className="mt-1"><AssigneeChip assignee={getAssignee(b?.ownerId)} /></div>
                  </div>
                </div>
                {dependency.note && <p className="mt-2 text-xs text-muted-foreground">{dependency.note}</p>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
