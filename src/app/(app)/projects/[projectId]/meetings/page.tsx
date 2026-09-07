import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { MeetingList } from "@/features/meetings/meeting-list";
import { getProject, getMeetings } from "@/lib/queries";

export default function MeetingsPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();
  const meetings = getMeetings(project.id);
  const readOnly = project.lifecycle === "closed";

  return (
    <div>
      <SectionHeader
        title="جلسات پروژه"
        description="تاریخچهٔ کامل جلسات، به‌عنوان منبع اصلی تصمیم‌ها و اقدامات."
        icon="meetings"
        actions={
          !readOnly && (
            <Button asChild size="sm">
              <Link href={`/projects/${project.id}/meetings/new`}>
                <AppIcon name="add" size={16} />
                ثبت جلسه
              </Link>
            </Button>
          )
        }
      />

      {meetings.length === 0 ? (
        <EmptyState
          icon="meetings"
          title="هنوز جلسه‌ای ثبت نشده است"
          description="نخستین جلسهٔ پروژه را ثبت کنید تا تصمیم‌ها و اقدامات آن ثبت شوند."
          action={
            !readOnly && (
              <Button asChild size="sm">
                <Link href={`/projects/${project.id}/meetings/new`}>ثبت نخستین جلسه</Link>
              </Button>
            )
          }
        />
      ) : (
        <MeetingList meetings={meetings} basePath={`/projects/${project.id}/meetings`} />
      )}
    </div>
  );
}
