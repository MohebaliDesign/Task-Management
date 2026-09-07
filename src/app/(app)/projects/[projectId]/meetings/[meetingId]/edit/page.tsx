import { notFound } from "next/navigation";
import { PageHeader } from "@/components/domain/page-header";
import { CreateMeetingForm } from "@/features/meetings/create-meeting-form";
import { getProject, getMeeting, getPeople } from "@/lib/queries";
import { toFa } from "@/lib/utils";

export default function EditMeetingPage({ params }: { params: { projectId: string; meetingId: string } }) {
  const project = getProject(params.projectId);
  const meeting = getMeeting(params.meetingId);
  if (!project || !meeting || meeting.projectId !== project.id) notFound();
  const people = getPeople();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="ویرایش جلسه"
        description="اطلاعات پایهٔ جلسه را ویرایش کنید. تصمیم‌ها و اقدامات همچنان از صفحهٔ جلسه مدیریت می‌شوند."
        icon="meetings"
        crumbs={[
          { label: project.name, href: `/projects/${project.id}` },
          { label: "جلسات", href: `/projects/${project.id}/meetings` },
          { label: `جلسهٔ ${toFa(meeting.sequence)}`, href: `/projects/${project.id}/meetings/${meeting.id}` },
          { label: "ویرایش" },
        ]}
      />
      <CreateMeetingForm projectId={project.id} people={people} meeting={meeting} />
    </div>
  );
}
