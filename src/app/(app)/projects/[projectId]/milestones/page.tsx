import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { MilestoneRow } from "@/features/projects/milestone-row";
import { getProject } from "@/lib/queries";

export default function MilestonesPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();

  return (
    <div>
      <SectionHeader title="نقاط‌عطف" description="نقاط عطف کلیدی این پروژه و وضعیت پیشرفت هر یک." icon="milestone" />
      {project.milestones.length === 0 ? (
        <EmptyState icon="milestone" title="نقطه‌عطفی ثبت نشده است" />
      ) : (
        <Card className="divide-y divide-border">
          {project.milestones.map((m) => <MilestoneRow key={m.id} milestone={m} />)}
        </Card>
      )}
    </div>
  );
}
