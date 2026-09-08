import { notFound } from "next/navigation";
import { PageHeader } from "@/components/domain/page-header";
import { CreateMeetingForm } from "@/features/meetings/create-meeting-form";
import { getMeetingSpace, getMeeting, getMeetingDecisions, getMeetingActions, getMeetingBlockers, getPeople } from "@/lib/queries";
import { toFa } from "@/lib/utils";

export default function EditSpaceMeetingPage({ params }: { params: { spaceId: string; meetingId: string } }) {
  const space = getMeetingSpace(params.spaceId);
  const meeting = getMeeting(params.meetingId);
  if (!space || !meeting || meeting.spaceId !== space.id) notFound();
  const people = getPeople();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="ویرایش جلسه"
        description="اطلاعات جلسه، تصمیم‌ها و اقدامات را در یک صفحه ویرایش و ذخیره کنید."
        icon="meetings"
        crumbs={[
          { label: "جلسات", href: "/meetings" },
          { label: space.name, href: `/meetings/${space.id}` },
          { label: `جلسهٔ ${toFa(meeting.sequence)}`, href: `/meetings/${space.id}/${meeting.id}` },
          { label: "ویرایش" },
        ]}
      />
      <CreateMeetingForm
        spaceId={space.id}
        people={people}
        meeting={meeting}
        meetingDecisions={getMeetingDecisions(meeting.id)}
        meetingActions={getMeetingActions(meeting.id)}
        meetingBlockers={getMeetingBlockers(meeting.id)}
      />
    </div>
  );
}
