"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { submitMeetingForReview } from "@/lib/actions";
import type { MeetingStatus } from "@/lib/domain";

export function MeetingActionsBar({
  meetingId,
  reviewToken,
  status,
  readOnly,
}: {
  meetingId: string;
  reviewToken: string;
  status: MeetingStatus;
  readOnly: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function copyLink() {
    const url = `${window.location.origin}/review/meeting/${reviewToken}`;
    navigator.clipboard?.writeText(url).then(
      () => toast.success("پیوند بازبینی کپی شد.", { description: url }),
      () => toast.error("کپی پیوند ممکن نشد."),
    );
  }

  function submit() {
    startTransition(async () => {
      const res = await submitMeetingForReview(meetingId);
      if (res.ok) {
        toast.success("جلسه برای بازبینی و امضا ارسال شد.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={copyLink}>
        <AppIcon name="link" size={16} />
        پیوند بازبینی
      </Button>

      {!readOnly && status === "draft" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" disabled={pending}>
              <AppIcon name="send" size={16} />
              ارسال برای بازبینی
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ارسال جلسه برای بازبینی؟</AlertDialogTitle>
              <AlertDialogDescription>
                پس از ارسال، برای هر سرپرست تیم یک درخواست امضا ایجاد می‌شود و وضعیت جلسه به «در انتظار امضا» تغییر می‌کند.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>انصراف</AlertDialogCancel>
              <AlertDialogAction onClick={submit}>ارسال برای بازبینی</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
