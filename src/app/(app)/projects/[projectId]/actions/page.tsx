import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/icon";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { ActionItemRow } from "@/features/actions/action-item-row";
import { ActionStatusSelect } from "@/features/actions/action-status-select";
import { AddDependencyDialog } from "@/features/dependencies/add-dependency-dialog";
import { PersonChip } from "@/components/domain/person";
import {
  getProject, getActions, getDecisions, getDependencyViews, getPerson,
} from "@/lib/queries";
import { toFa } from "@/lib/utils";

export default function ActionsPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();

  const actions = getActions(project.id);
  const decisions = getDecisions(project.id);
  const deps = getDependencyViews(project.id);
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

  return (
    <div className="space-y-8">
      <div>
        <SectionHeader
          title="اقدامات"
          description="هر اقدام دارای مسئول، مهلت، وضعیت، اولویت، تصمیم مرتبط و جلسهٔ منبع است."
          icon="actions"
        />
        {actions.length === 0 ? (
          <EmptyState icon="actions" title="اقدامی ثبت نشده است" description="اقدامات هنگام ثبت جلسه اضافه می‌شوند." />
        ) : (
          <div className="space-y-6">
            {openActions.length > 0 && (
              <Card className="divide-y divide-border">
                {openActions.map((a) => (
                  <ActionItemRow
                    key={a.id}
                    action={a}
                    decision={decisions.find((d) => d.id === a.relatedDecisionId)}
                    meetingHref={`/projects/${project.id}/meetings/${a.meetingId}`}
                    blockedBy={blockedBy.get(a.id)}
                    blocking={blocking.get(a.id)}
                    statusControl={readOnly ? undefined : <ActionStatusSelect actionId={a.id} status={a.status} />}
                  />
                ))}
              </Card>
            )}
            {doneActions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">تکمیل‌شده / لغوشده ({toFa(doneActions.length)})</p>
                <Card className="divide-y divide-border opacity-80">
                  {doneActions.map((a) => (
                    <ActionItemRow
                      key={a.id}
                      action={a}
                      decision={decisions.find((d) => d.id === a.relatedDecisionId)}
                      meetingHref={`/projects/${project.id}/meetings/${a.meetingId}`}
                      statusControl={readOnly ? undefined : <ActionStatusSelect actionId={a.id} status={a.status} />}
                    />
                  ))}
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <SectionHeader
          title="وابستگی‌ها"
          description="چه کسی منتظر چیست؟ رابطهٔ «مسدود توسط / مسدودکنندهٔ» را شفاف نشان می‌دهد."
          icon="dependency"
          actions={!readOnly && actions.length >= 2 && <AddDependencyDialog projectId={project.id} actions={actions} />}
        />
        {deps.length === 0 ? (
          <EmptyState icon="dependency" title="وابستگی‌ای ثبت نشده است" description="اگر اقدامی منتظر اقدام دیگری است، آن را به‌صورت وابستگی ثبت کنید." />
        ) : (
          <Card className="divide-y divide-border">
            {deps.map(({ dependency, blocking: b, blocked }) => (
              <div key={dependency.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex-1 rounded-md border border-destructive/20 bg-destructive-subtle p-2.5">
                    <p className="text-xs text-destructive-text">مسدودشده (منتظر)</p>
                    <p className="text-sm font-medium">{blocked?.title ?? "—"}</p>
                    <div className="mt-1"><PersonChip person={getPerson(blocked?.ownerId)} /></div>
                  </div>
                  <AppIcon name="chevronLeft" size={20} className="shrink-0 text-muted-foreground" />
                  <div className="flex-1 rounded-md border border-border bg-muted/40 p-2.5">
                    <p className="text-xs text-muted-foreground">مسدودکننده (باید اول انجام شود)</p>
                    <p className="text-sm font-medium">{b?.title ?? "—"}</p>
                    <div className="mt-1"><PersonChip person={getPerson(b?.ownerId)} /></div>
                  </div>
                </div>
                {dependency.note && <p className="max-w-xs text-xs text-muted-foreground">{dependency.note}</p>}
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
