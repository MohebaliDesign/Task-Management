import { notFound } from "next/navigation";
import { MeetingDetail } from "@/features/meetings/meeting-detail";
import { toFa } from "@/lib/utils";
import { getMeetingSpace, getMeeting } from "@/lib/queries";

export default function SpaceMeetingDetailPage({ params }: { params: { spaceId: string; meetingId: string } }) {
  const space = getMeetingSpace(params.spaceId);
  const meeting = getMeeting(params.meetingId);
  if (!space || !meeting || meeting.spaceId !== space.id) notFound();

  return (
    <MeetingDetail
      meeting={meeting}
      readOnly={false}
      editHref={`/meetings/${space.id}/${meeting.id}/edit`}
      crumbs={[
        { label: "جلسات", href: "/meetings" },
        { label: "دسته‌های جلسات", href: "/meetings/spaces" },
        { label: space.name, href: `/meetings/${space.id}` },
        { label: `جلسهٔ ${toFa(meeting.sequence)}` },
      ]}
    />
  );
}
