import { notFound } from "next/navigation";
import { MeetingDetail } from "@/features/meetings/meeting-detail";
import { toFa } from "@/lib/utils";
import { getProject, getMeeting } from "@/lib/queries";

export default function MeetingDetailPage({ params }: { params: { projectId: string; meetingId: string } }) {
  const project = getProject(params.projectId);
  const meeting = getMeeting(params.meetingId);
  if (!project || !meeting || meeting.projectId !== project.id) notFound();

  return (
    <MeetingDetail
      meeting={meeting}
      readOnly={project.lifecycle === "closed"}
      editHref={`/projects/${project.id}/meetings/${meeting.id}/edit`}
      crumbs={[
        { label: project.name, href: `/projects/${project.id}` },
        { label: "جلسات", href: `/projects/${project.id}/meetings` },
        { label: `جلسهٔ ${toFa(meeting.sequence)}` },
      ]}
    />
  );
}
