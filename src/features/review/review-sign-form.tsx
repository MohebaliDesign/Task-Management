"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/form/field";
import { SubmitButton } from "@/components/form/submit-button";
import { AppIcon } from "@/components/icon";
import { signMeeting, type ActionResult } from "@/lib/actions";
import type { Signature } from "@/lib/domain";

const initial: ActionResult = { ok: false, error: "" };

export function ReviewSignForm({ meetingId, pending }: { meetingId: string; pending: Signature[] }) {
  const router = useRouter();
  const [state, formAction] = useFormState(signMeeting, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};

  React.useEffect(() => {
    if (state.ok) {
      toast.success("پاسخ شما ثبت شد. سپاس‌گزاریم.");
      router.refresh();
    }
  }, [state, router]);

  if (pending.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-success-subtle px-3 py-3 text-sm text-success">
        <AppIcon name="check" size={18} variant="Bold" />
        همهٔ امضاهای لازم ثبت شده است.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="meetingId" value={meetingId} />
      <Field label="امضا به‌عنوان" htmlFor="signatureId" error={errs.signatureId} required>
        <Select name="signatureId">
          <SelectTrigger id="signatureId"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
          <SelectContent>
            {pending.map((s) => <SelectItem key={s.id} value={s.id}>{s.approverName}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="توضیح (اختیاری)" htmlFor="comment" error={errs.comment}>
        <Textarea id="comment" name="comment" rows={2} placeholder="در صورت درخواست اصلاح، دلیل را بنویسید." />
      </Field>
      {/* Each submit button carries its own decision via name/value — no state race. */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <SubmitButton name="decision" value="approved" icon="approval" className="flex-1">
          تأیید و امضا
        </SubmitButton>
        <SubmitButton
          name="decision"
          value="changes_requested"
          variant="outline"
          className="flex-1 border-warning/40 text-warning hover:bg-warning-subtle"
          icon="edit"
        >
          درخواست اصلاح
        </SubmitButton>
      </div>
    </form>
  );
}
