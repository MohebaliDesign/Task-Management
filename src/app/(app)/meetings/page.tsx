import Link from "next/link";
import type { Metadata } from "next";
import { PageTopBar } from "@/components/layout/page-topbar";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { EmptyState } from "@/components/domain/empty-state";
import { ResponsiveDataView } from "@/components/domain/responsive-data-view";
import { type FilterOption } from "@/components/domain/filter-control";
import { type ViewMode } from "@/components/domain/view-switcher";
import { MeetingCategoriesToolbar } from "@/features/meeting-spaces/meeting-categories-toolbar";
import { MeetingCategoryTable } from "@/features/meeting-spaces/meeting-category-table";
import { MeetingSpaceCard } from "@/features/meeting-spaces/meeting-space-card";
import { getMeetingSpaces, getPerson } from "@/lib/queries";

export const metadata: Metadata = { title: "دسته‌های جلسات" };

interface SearchParams {
  q?: string;
  owner?: string;
  sort?: string;
  view?: string;
}

/**
 * The global «جلسات» area lists Meeting Categories, never individual meetings.
 * Individual meeting records live one level deeper inside a category
 * (/meetings/[spaceId]). This keeps organization-wide recurring meetings
 * separate from project-owned meetings while reusing the same Meeting entity.
 */
export default function MeetingsPage({ searchParams }: { searchParams: SearchParams }) {
  const all = getMeetingSpaces();

  const ownerOptions: FilterOption[] = Array.from(new Set(all.map((space) => space.ownerId)))
    .map((id) => getPerson(id))
    .filter((person): person is NonNullable<typeof person> => !!person)
    .map((person) => ({ value: person.id, label: person.name }));

  const q = (searchParams.q ?? "").trim();
  const filtered = all.filter((space) => {
    if (q && !`${space.name} ${space.description}`.includes(q)) return false;
    if (searchParams.owner && space.ownerId !== searchParams.owner) return false;
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
                  {filtered.map((space) => (
                    <MeetingSpaceCard key={space.id} space={space} />
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
