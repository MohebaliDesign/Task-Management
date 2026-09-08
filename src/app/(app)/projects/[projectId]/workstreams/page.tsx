import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { WorkstreamRow } from "@/features/projects/workstream-row";
import { getProject, getPerson } from "@/lib/queries";

export default function WorkstreamsPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();

  return (
    <div>
      <SectionHeader title="جریان‌های کاری" description="جریان‌های کاری فعال این پروژه، سرپرست و درصد پیشرفت هر یک." icon="actions" />
      {project.workstreams.length === 0 ? (
        <EmptyState icon="actions" title="جریان کاری ثبت نشده است" />
      ) : (
        <Card className="divide-y divide-border">
          {project.workstreams.map((w) => <WorkstreamRow key={w.id} workstream={w} lead={getPerson(w.lead)} />)}
        </Card>
      )}
    </div>
  );
}
