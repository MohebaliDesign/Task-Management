import type { Metadata } from "next";
import { PageHeader } from "@/components/domain/page-header";
import { CreateMeetingSpaceForm } from "@/features/meeting-spaces/create-meeting-space-form";
import { getPeople } from "@/lib/queries";

export const metadata: Metadata = { title: "دستهٔ جلسات جدید" };

export default function NewMeetingSpacePage() {
  const people = getPeople();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="ایجاد دستهٔ جلسات جدید"
        description="یک دستهٔ جلسات، گروهی از جلسات سازمانی مستقل از پروژه است — مثلاً «جلسات داخلی سازمان». پس از ایجاد، می‌توانید چند جلسه در آن ثبت کنید."
        icon="meetings"
        crumbs={[{ label: "جلسات", href: "/meetings" }, { label: "دسته‌های جلسات", href: "/meetings/spaces" }, { label: "دستهٔ جدید" }]}
      />
      <CreateMeetingSpaceForm people={people} />
    </div>
  );
}
