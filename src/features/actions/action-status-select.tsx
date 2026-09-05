"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateActionStatus } from "@/lib/actions";
import { ACTION_STATUS, type ActionStatus } from "@/lib/domain";
import { actionStatusLabels, toneDot } from "@/lib/labels";
import { cn } from "@/lib/utils";

export function ActionStatusSelect({ actionId, status }: { actionId: string; status: ActionStatus }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function onChange(value: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("actionId", actionId);
      fd.set("status", value);
      const res = await updateActionStatus(fd);
      if (res.ok) {
        toast.success("وضعیت اقدام به‌روزرسانی شد.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <Select value={status} onValueChange={onChange} disabled={pending}>
      <SelectTrigger className="h-8 w-36 text-xs" aria-label="تغییر وضعیت اقدام">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ACTION_STATUS.map((s) => (
          <SelectItem key={s} value={s}>
            <span className="flex items-center gap-2">
              <span className={cn("h-1.5 w-1.5 rounded-full", toneDot[actionStatusLabels[s].tone])} />
              {actionStatusLabels[s].label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
