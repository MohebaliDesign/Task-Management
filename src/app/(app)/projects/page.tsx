import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/domain/page-header";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { EmptyState } from "@/components/domain/empty-state";
import { ProjectCard } from "@/features/projects/project-card";
import { ProjectTable } from "@/features/projects/project-table";
import { ProjectsToolbar } from "@/features/projects/projects-toolbar";
import { ResponsiveDataView } from "@/components/domain/responsive-data-view";
import { type ViewMode } from "@/components/domain/view-switcher";
import { getProjects } from "@/lib/queries";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = { title: "پروژه‌ها" };

interface SearchParams {
  q?: string;
  health?: string;
  lifecycle?: string;
  phase?: string;
  sort?: string;
  view?: string;
}

export default function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const all = getProjects();
  const q = (searchParams.q ?? "").trim();
  const filtered = all.filter((p) => {
    if (q && !`${p.name} ${p.versionLabel}`.includes(q)) return false;
    if (searchParams.health && p.health !== searchParams.health) return false;
    if (searchParams.lifecycle && p.lifecycle !== searchParams.lifecycle) return false;
    if (searchParams.phase && p.phase !== searchParams.phase) return false;
    return true;
  });
  if (searchParams.sort === "oldest") filtered.reverse();
  const view: ViewMode = searchParams.view === "table" ? "table" : "card";

  return (
    <>
      <PageHeader
        title="پروژه‌ها"
        description={`${toFa(all.length)} پروژه ثبت شده است. برای مشاهدهٔ جزئیات، پروژه‌ای را باز کنید.`}
        icon="projects"
        actions={
          <Button asChild>
            <Link href="/projects/new">
              <AppIcon name="add" size={18} />
              پروژهٔ جدید
            </Link>
          </Button>
        }
      />

      <ProjectsToolbar view={view} />

      {filtered.length === 0 ? (
        <EmptyState
          icon="search"
          title="پروژه‌ای یافت نشد"
          description="هیچ پروژه‌ای با فیلترهای فعلی مطابقت ندارد. فیلترها را تغییر دهید یا پاک کنید."
        />
      ) : (
        <ResponsiveDataView
          view={view}
          table={<ProjectTable projects={filtered} />}
          cards={
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          }
        />
      )}
    </>
  );
}
