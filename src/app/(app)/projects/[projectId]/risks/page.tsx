import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/icon";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { RiskLevelBadge, RiskStatusBadge } from "@/components/domain/status";
import { PersonChip } from "@/components/domain/person";
import { AddRiskDialog, AddBlockerDialog } from "@/features/risks/risk-blocker-dialogs";
import { BlockerRow } from "@/features/risks/blocker-row";
import { getProject, getRisks, getBlockers, getPeople, getPerson } from "@/lib/queries";

export default function RisksPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();
  const risks = getRisks(project.id);
  const blockers = getBlockers(project.id);
  const people = getPeople();
  const readOnly = project.lifecycle === "closed";

  return (
    <div className="space-y-8">
      {/* Blockers — current impediments */}
      <div>
        <SectionHeader
          title="موانع"
          description="مانع = بازدارندهٔ فعلی که همین حالا پیشرفت را متوقف کرده است."
          icon="blocker"
          actions={!readOnly && <AddBlockerDialog projectId={project.id} people={people} />}
        />
        {blockers.length === 0 ? (
          <EmptyState icon="check" title="مانعی ثبت نشده است" />
        ) : (
          <Card className="divide-y divide-border">
            {blockers.map((b) => (
              <BlockerRow key={b.id} blocker={b} owner={getPerson(b.ownerId)} />
            ))}
          </Card>
        )}
      </div>

      {/* Risks — potential future problems */}
      <div>
        <SectionHeader
          title="ریسک‌ها"
          description="ریسک = مشکل بالقوهٔ آینده که هنوز رخ نداده است."
          icon="risk"
          actions={!readOnly && <AddRiskDialog projectId={project.id} people={people} />}
        />
        {risks.length === 0 ? (
          <EmptyState icon="check" title="ریسکی ثبت نشده است" />
        ) : (
          <Card className="divide-y divide-border">
            {risks.map((r) => (
              <div key={r.id} className="flex items-start gap-3 p-4">
                <AppIcon name="risk" size={20} className="mt-0.5 shrink-0 text-warning" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">{r.title}</p>
                    <RiskStatusBadge value={r.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <RiskLevelBadge value={r.impact} prefix="اثر" />
                    <RiskLevelBadge value={r.probability} prefix="احتمال" />
                    {r.ownerId && <span className="flex items-center gap-1.5 text-xs text-muted-foreground">مسئول: <PersonChip person={getPerson(r.ownerId)} variant="compact" /></span>}
                  </div>
                  {r.mitigation && <p className="mt-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">راهکار کاهش: {r.mitigation}</p>}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
