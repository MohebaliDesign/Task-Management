import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { ActivityTimeline } from "@/features/activity/activity-timeline";
import { getProject, getActivities } from "@/lib/queries";

export default function ProjectActivityPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();
  const activities = getActivities(project.id);

  return (
    <div>
      <SectionHeader
        title="تاریخچهٔ تغییرات"
        description="چه چیزی تغییر کرد، چه کسی آن را تغییر داد، چه زمانی و مرتبط با کدام جلسه."
        icon="activity"
      />
      {activities.length === 0 ? (
        <EmptyState icon="activity" title="تغییری ثبت نشده است" />
      ) : (
        <Card>
          <CardContent className="pt-5">
            <ActivityTimeline activities={activities} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
