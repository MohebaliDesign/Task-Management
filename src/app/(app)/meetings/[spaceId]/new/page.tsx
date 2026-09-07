import { notFound } from "next/navigation";
import { PageHeader } from "@/components/domain/page-header";
import { CreateSpaceMeetingForm } from "@/features/meeting-spaces/create-space-meeting-form";
import { getMeetingSpace, getPeople } from "@/lib/queries";

export default function NewSpaceMeetingPage({ params }: { params: { spaceId: string } }) {
  const space = getMeetingSpace(params.spaceId);
  if (!space) notFound();
  const people = getPeople();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="ثبت جلسهٔ جدید"
        description={`جلسه‌ای جدید در دستهٔ «${space.name}» ثبت کنید.`}
        icon="meetings"
        crumbs={[
          { label: "جلسات", href: "/meetings" },
          { label: space.name, href: `/meetings/${space.id}` },
          { label: "جلسهٔ جدید" },
        ]}
      />
      <CreateSpaceMeetingForm spaceId={space.id} people={people} />
    </div>
  );
}
