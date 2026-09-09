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
import type { MeetingStatus } from "@/lib/domain";

export const metadata: Metadata = { title: "دسته‌های جلسات" };

interface SearchParams {
  q?: string;
  owner?: string;
  sort?: string;
  view?: string;
}

/**
 * The global «جلسات» area lists Meeting *Categories* (دسته‌های جلسات), never
 * individual meetings — those live one level deeper, inside a category
 * (/meetings/[spaceId]). This keeps organizational meetings, which are
 * independent of projects, grouped by the space they belong to.
 */
export default function MeetingsPage({ searchParams }: { searchParams: SearchParams }) {
  const all = getMeetingSpaces();

  // Owner filter options — only owners that actually own a category.
  const ownerOptions: FilterOption[] = Array.from(new Set(all.map((s) => s.ownerId)))
    .map((id) => getPerson(id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({ value: p.id, label: p.name }));

  const q = (searchParams.q ?? "").trim();
  const filtered = all.filter((s) => {
    if (q && !`${s.name} ${s.description}`.includes(q)) return false;
    if (searchParams.owner && s.ownerId !== searchParams.owner) return false;
    return true;
  });
  if (searchParams.sort === "oldest") filtered.reverse();
  const view: ViewMode = searchParams.view === "table" ? "table" : "card";

  return (
    <>
      <PageTopBar
        title="جلسات"
        description="دسته‌های جلسات سازمانی و سوابق آن‌ها را مدیریت کنید."
        actions={
          <Button asChild>
            <Link href="/meetings/new">
              <AppIcon name="add" size={18} />
              ایجاد دسته جلسات
            </Link>
          </Button>
        }
      />

      {all.length === 0 ? (
        <EmptyState
          icon="meetings"
          title="هنوز دسته‌ای از جلسات ثبت نشده است"
          description="یک دسته بسازید (مثلاً «جلسات داخلی سازمان») تا بتوانید جلسات سازمانی مستقل از پروژه را در آن ثبت کنید."
          action={
            <Button asChild size="sm">
              <Link href="/meetings/new">ایجاد دسته جلسات</Link>
            </Button>
          }
        />
      ) : (
        <>
          <MeetingCategoriesToolbar view={view} ownerOptions={ownerOptions} />
          {filtered.length === 0 ? (
            <EmptyState
              icon="search"
              title="دسته‌ای یافت نشد"
              description="هیچ دسته‌ای با فیلترهای فعلی مطابقت ندارد. فیلترها را تغییر دهید یا پاک کنید."
            />
          ) : (
            <ResponsiveDataView
              view={view}
              table={<MeetingCategoryTable spaces={filtered} />}
              cards={
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((s) => (
                    <MeetingSpaceCard key={s.id} space={s} />
                  ))}
                </div>
              }
            />
          )}
        </>
      )}
    </>
  );
}
