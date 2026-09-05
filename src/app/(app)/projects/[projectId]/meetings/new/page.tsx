import { notFound } from "next/navigation";
import { PageHeader } from "@/components/domain/page-header";
import { CreateMeetingForm } from "@/features/meetings/create-meeting-form";
import { getProject, getPeople } from "@/lib/queries";

export default function NewMeetingPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();
  const people = getPeople();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="ثبت جلسهٔ جدید"
        description="جلسه را به‌صورت ساختاریافته مستند کنید. تصمیم‌ها و اقدامات را پس از ثبت اضافه می‌کنید."
        icon="meetings"
        crumbs={[
          { label: project.name, href: `/projects/${project.id}` },
          { label: "جلسات", href: `/projects/${project.id}/meetings` },
          { label: "جلسهٔ جدید" },
        ]}
      />
      <CreateMeetingForm projectId={project.id} people={people} />
    </div>
  );
}
