import Link from "next/link";
import type { Metadata } from "next";
import { PageTopBar } from "@/components/layout/page-topbar";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { EmptyState } from "@/components/domain/empty-state";
import { MeetingCard } from "@/features/meetings/meeting-card";
import { MeetingTable } from "@/features/meetings/meeting-table";
import { MeetingsFilterBar, type ContextOption } from "@/features/meetings/meetings-filter-bar";
import { ViewSwitcher, type ViewMode } from "@/components/domain/view-switcher";
import { getAllMeetings, getProjects, getMeetingSpaces } from "@/lib/queries";
import { toFa } from "@/lib/utils";
import type { MeetingStatus } from "@/lib/domain";

export const metadata: Metadata = { title: "جلسات" };

interface SearchParams {
  q?: string;
  context?: string;
  status?: string;
  period?: string;
  sort?: string;
  view?: string;
}

export default function AllMeetingsPage({ searchParams }: { searchParams: SearchParams }) {
  const all = getAllMeetings();
  const projects = getProjects();
  const spaces = getMeetingSpaces();

  const projectOptions: ContextOption[] = projects.map((p) => ({ value: `project:${p.id}`, label: `${p.name} — ${p.versionLabel}` }));
  const spaceOptions: ContextOption[] = spaces.map((s) => ({ value: `space:${s.id}`, label: s.name }));

  const q = (searchParams.q ?? "").trim();
  const filtered = all.filter((m) => {
    if (q && !m.title.includes(q)) return false;
    if (searchParams.context && searchParams.context !== "all") {
      const [kind, id] = searchParams.context.split(":");
      if (kind === "project" && m.projectId !== id) return false;
      if (kind === "space" && m.spaceId !== id) return false;
    }
    if (searchParams.status && m.status !== (searchParams.status as MeetingStatus)) return false;
    if (searchParams.period === "7d" || searchParams.period === "30d") {
      const days = searchParams.period === "7d" ? 7 : 30;
      const diffDays = (Date.now() - new Date(m.date).getTime()) / 86_400_000;
      if (diffDays > days) return false;
    }
    return true;
  });
  if (searchParams.sort === "oldest") filtered.reverse();
  const view: ViewMode = searchParams.view === "table" ? "table" : "card";

  return (
    <>
      <PageTopBar
        title="جلسات"
        description={`${toFa(all.length)} جلسه در پروژه‌ها و دسته‌های جلسات ثبت شده است.`}
        icon="meetings"
        actions={
          <Button asChild variant="outline">
            <Link href="/meetings/spaces">
              <AppIcon name="meetings" size={18} />
              دسته‌های جلسات
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <MeetingsFilterBar projectOptions={projectOptions} spaceOptions={spaceOptions} />
        <ViewSwitcher value={view} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="search"
          title="جلسه‌ای یافت نشد"
          description="هیچ جلسه‌ای با فیلترهای فعلی مطابقت ندارد. فیلترها را تغییر دهید یا پاک کنید."
        />
      ) : view === "table" ? (
        <MeetingTable meetings={filtered} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </div>
      )}
    </>
  );
}
