"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { AppIcon, type IconName } from "@/components/icon";

export function SubmitButton({
  children,
  icon,
  pendingText,
  disabled,
  ...props
}: ButtonProps & { icon?: IconName; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} aria-busy={pending} {...props}>
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-e-transparent" aria-hidden="true" />
          {pendingText ?? "در حال ثبت…"}
        </>
      ) : (
        <>
          {icon && <AppIcon name={icon} size={18} />}
          {children}
        </>
      )}
    </Button>
  );
}
