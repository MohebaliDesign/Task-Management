import type { Metadata } from "next";
import { PageHeader } from "@/components/domain/page-header";
import { CreateProjectForm } from "@/features/projects/create-project-form";
import { getPeople } from "@/lib/queries";

export const metadata: Metadata = { title: "پروژهٔ جدید" };

export default function NewProjectPage() {
  const people = getPeople();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="ایجاد پروژهٔ جدید"
        description="اطلاعات پایهٔ پروژه را وارد کنید. پس از ایجاد، می‌توانید جلسات، تصمیم‌ها و اقدامات را اضافه کنید."
        icon="projects"
        crumbs={[{ label: "پروژه‌ها", href: "/projects" }, { label: "پروژهٔ جدید" }]}
      />
      <CreateProjectForm people={people} />
    </div>
  );
}
