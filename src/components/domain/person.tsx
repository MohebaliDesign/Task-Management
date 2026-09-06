import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { roleLabels } from "@/lib/labels";
import type { Person } from "@/lib/domain";

export function PersonChip({
  person,
  showRole = false,
  variant = "full",
  className,
}: {
  person: Person | undefined;
  showRole?: boolean;
  /** "full" (avatar + name, for team/project visualization) or "compact" (name only, for dense inline rows already labeled by context). */
  variant?: "full" | "compact";
  className?: string;
}) {
  if (!person) return <span className="text-sm text-muted-foreground">—</span>;
  if (variant === "compact") {
    return <span className={cn("truncate text-sm", className)}>{person.name}</span>;
  }
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <Avatar className="h-6 w-6 shrink-0">
        <AvatarFallback className="text-[10px]">{person.initials}</AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm">{person.name}</span>
        {showRole && <span className="truncate text-xs text-muted-foreground">{roleLabels[person.role]}</span>}
      </span>
    </span>
  );
}

export function AvatarStack({ people, max = 4 }: { people: Person[]; max?: number }) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div className="flex items-center">
      <div className="flex flex-row-reverse -space-x-2 space-x-reverse">
        {shown.map((p) => (
          <Avatar key={p.id} className="h-7 w-7 border-2 border-card" title={p.name}>
            <AvatarFallback className="text-[10px]">{p.initials}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      {rest > 0 && <span className="ms-2 text-xs text-muted-foreground">+{rest}</span>}
    </div>
  );
}
