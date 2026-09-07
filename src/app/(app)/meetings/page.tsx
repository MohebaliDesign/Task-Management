import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/domain/page-header";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { EmptyState } from "@/components/domain/empty-state";
import { MeetingSpaceCard } from "@/features/meeting-spaces/meeting-space-card";
import { getMeetingSpaces } from "@/lib/queries";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = { title: "جلسات" };

export default function MeetingSpacesPage() {
  const spaces = getMeetingSpaces();

  return (
    <>
      <PageHeader
        title="جلسات"
        description={
          spaces.length > 0
            ? `${toFa(spaces.length)} دستهٔ جلسات ثبت شده است. هر دسته می‌تواند چند جلسهٔ سازمانی مستقل از پروژه را دربر بگیرد.`
            : "دسته‌های جلسات، جلسات سازمانی مستقل از پروژه‌ها را گروه‌بندی می‌کنند."
        }
        icon="meetings"
        actions={
          <Button asChild>
            <Link href="/meetings/new">
              <AppIcon name="add" size={18} />
              ایجاد دسته جلسات
            </Link>
          </Button>
        }
      />

      {spaces.length === 0 ? (
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {spaces.map((s) => (
            <MeetingSpaceCard key={s.id} space={s} />
          ))}
        </div>
      )}
    </>
  );
}
