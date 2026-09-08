import type { Metadata } from "next";
import { PageHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { ActivityTimeline } from "@/features/activity/activity-timeline";
import { getActivities, getProjects } from "@/lib/queries";

export const metadata: Metadata = { title: "تاریخچهٔ فعالیت" };

export default function ActivityPage() {
  const activities = getActivities();
  const projects = getProjects();
  const nameOf = (id: string) => projects.find((p) => p.id === id)?.name;

  return (
    <>
      <PageHeader
        title="تاریخچهٔ فعالیت"
        description="جریان زمانی همهٔ تغییرات معنادار در سراسر پروژه‌ها."
        icon="activity"
      />
      {activities.length === 0 ? (
        <EmptyState icon="activity" title="فعالیتی ثبت نشده است" />
      ) : (
        <ActivityTimeline activities={activities} projectName={nameOf} showProjectLink />
      )}
    </>
  );
}
