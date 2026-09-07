import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppIcon } from "@/components/icon";
import { PageHeader } from "@/components/domain/page-header";
import { PersonChip } from "@/components/domain/person";
import { faDate } from "@/lib/utils";
import { getMeetingSpace, getSpaceMeeting, getPerson } from "@/lib/queries";

export default function SpaceMeetingDetailPage({ params }: { params: { spaceId: string; meetingId: string } }) {
  const space = getMeetingSpace(params.spaceId);
  const meeting = getSpaceMeeting(params.meetingId);
  if (!space || !meeting || meeting.spaceId !== space.id) notFound();

  const participants = meeting.participantIds.map((id) => getPerson(id)).filter((p): p is NonNullable<typeof p> => !!p);
  const creator = getPerson(meeting.createdById);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={meeting.title}
        description={`${faDate(meeting.date)} · ${meeting.location || "بدون مکان"}`}
        icon="meetings"
        crumbs={[
          { label: "جلسات", href: "/meetings" },
          { label: space.name, href: `/meetings/${space.id}` },
          { label: meeting.title },
        ]}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AppIcon name="people" size={18} className="text-muted-foreground" />
              شرکت‌کنندگان
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {participants.map((p) => (
              <PersonChip key={p.id} person={p} showRole />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AppIcon name="clipboard" size={18} className="text-muted-foreground" />
              خلاصهٔ جلسه
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{meeting.summary}</p>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          ثبت‌شده توسط <PersonChip person={creator} variant="compact" /> · {faDate(meeting.createdAt)}
        </p>
      </div>
    </div>
  );
}
