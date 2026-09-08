import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { AddDecisionDialog } from "@/features/meetings/add-decision-dialog";
import { DecisionCard } from "@/features/decisions/decision-card";
import { DecisionsTable } from "@/features/decisions/decisions-table";
import { DecisionsToolbar } from "@/features/decisions/decisions-toolbar";
import { getProject, getDecisions, getMeetings, getPeople, getActions } from "@/lib/queries";
import type { RiskLevel } from "@/lib/domain";

export default function DecisionsPage({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: { q?: string; impact?: string; sort?: string; view?: string };
}) {
  const project = getProject(params.projectId);
  if (!project) notFound();
  const allDecisions = getDecisions(project.id); // newest first
  const meetings = getMeetings(project.id);
  const people = getPeople();
  const actions = getActions(project.id);
  const readOnly = project.lifecycle === "closed";

  const q = (searchParams.q ?? "").trim();
  const impact = searchParams.impact as RiskLevel | undefined;
  const view = searchParams.view === "table" ? "table" : "card";

  let decisions = allDecisions;
  if (q) decisions = decisions.filter((d) => d.text.includes(q) || d.area.includes(q));
  if (impact) decisions = decisions.filter((d) => d.impact === impact);
  if (searchParams.sort === "oldest") decisions = [...decisions].reverse();

  return (
    <div>
      <SectionHeader
        title="تصمیم‌ها"
        description="تصمیم‌ها رکوردهای مستقل و قابل‌ردیابی هستند و به جلسهٔ منبع و اقدامات ناشی از خود پیوند دارند."
        icon="decision"
        actions={
          !readOnly && meetings.length > 0 && (
            <AddDecisionDialog
              projectId={project.id}
              meetings={meetings}
              people={people}
              unlinkedActions={actions.filter((a) => !a.relatedDecisionId)}
              triggerLabel="افزودن تصمیم جدید"
            />
          )
        }
      />
      {allDecisions.length === 0 ? (
        <EmptyState
          icon="decision"
          title="هنوز تصمیمی برای این پروژه ثبت نشده است"
          description="تصمیم‌ها معمولاً هنگام ثبت جلسه اضافه می‌شوند."
          action={
            !readOnly &&
            meetings.length > 0 && (
              <AddDecisionDialog
                projectId={project.id}
                meetings={meetings}
                people={people}
                unlinkedActions={actions.filter((a) => !a.relatedDecisionId)}
                triggerLabel="ثبت تصمیم جدید"
              />
            )
          }
        />
      ) : (
        <>
          <DecisionsToolbar resultCount={decisions.length} />
          {decisions.length === 0 ? (
            <EmptyState icon="search" title="تصمیمی با این مشخصات پیدا نشد" description="فیلترها یا عبارت جست‌وجو را تغییر دهید." />
          ) : view === "table" ? (
            <Card className="overflow-hidden"><DecisionsTable decisions={decisions} projectId={project.id} /></Card>
          ) : (
            <div className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {decisions.map((d) => (
                <DecisionCard key={d.id} decision={d} projectId={project.id} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
