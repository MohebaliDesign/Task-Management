"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/form/field";
import { SubmitButton } from "@/components/form/submit-button";
import { addComment, type ActionResult } from "@/lib/actions";

const initial: ActionResult = { ok: false, error: "" };

export function ReviewCommentForm({ meetingId }: { meetingId: string }) {
  const router = useRouter();
  const [state, formAction] = useFormState(addComment, initial);
  const errs = state.ok ? {} : state.fieldErrors ?? {};
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) {
      toast.success("بازخورد شما ثبت شد.");
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="meetingId" value={meetingId} />
      <Field label="نام شما" htmlFor="authorName" error={errs.authorName} required>
        <Input id="authorName" name="authorName" placeholder="نام و نام خانوادگی" aria-invalid={!!errs.authorName} />
      </Field>
      <Field label="بازخورد" htmlFor="body" error={errs.body} required>
        <Textarea id="body" name="body" rows={3} placeholder="نظر یا اصلاح پیشنهادی خود را بنویسید…" aria-invalid={!!errs.body} />
      </Field>
      <SubmitButton icon="comment" variant="outline">ثبت بازخورد</SubmitButton>
    </form>
  );
}
