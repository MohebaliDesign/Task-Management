import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const describedBy = [error ? `${htmlFor}-error` : null, hint ? `${htmlFor}-hint` : null]
    .filter(Boolean)
    .join(" ") || undefined;
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ms-1 text-destructive-text" aria-hidden="true">*</span>}
      </Label>
      <div aria-describedby={describedBy}>{children}</div>
      {hint && !error && (
        <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="text-xs font-medium text-destructive-text">
          {error}
        </p>
      )}
    </div>
  );
}
