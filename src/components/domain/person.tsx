import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AppIcon } from "@/components/icon";
import { cn, personAvatarUrl } from "@/lib/utils";
import { roleLabels } from "@/lib/labels";
import type { Person } from "@/lib/domain";
import type { Assignee } from "@/lib/queries";

/** Shared face-avatar: same photo for the same person everywhere, initials fallback if the image fails. */
export function PersonAvatar({ person, className }: { person: Person; className?: string }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={personAvatarUrl(person.id)} alt="" />
      <AvatarFallback className="text-[10px]">{person.initials}</AvatarFallback>
    </Avatar>
  );
}

export function PersonChip({
  person,
  showRole = false,
  className,
}: {
  person: Person | undefined;
  showRole?: boolean;
  className?: string;
}) {
  if (!person) return <span className="text-sm text-muted-foreground">—</span>;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <PersonAvatar person={person} className="h-6 w-6" />
      <span className="flex flex-col leading-tight">
        <span className="text-sm">{person.name}</span>
        {showRole && <span className="text-xs text-muted-foreground">{roleLabels[person.role]}</span>}
      </span>
    </span>
  );
}

/**
 * Ownership can now be a person or a team. Team gets an icon avatar instead
 * of initials so the two are never visually confused at a glance.
 */
export function AssigneeChip({ assignee, className }: { assignee: Assignee | undefined; className?: string }) {
  if (!assignee) return <span className="text-sm text-muted-foreground">بدون مسئول</span>;
  if (assignee.type === "person") return <PersonChip person={assignee.person} className={className} />;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Avatar className="h-6 w-6">
        <AvatarFallback className="bg-accent text-accent-foreground">
          <AppIcon name="people" size={13} />
        </AvatarFallback>
      </Avatar>
      <span className="text-sm">{assignee.team.name}</span>
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
          <PersonAvatar key={p.id} person={p} className="h-7 w-7 border-2 border-card" />
        ))}
      </div>
      {rest > 0 && <span className="ms-2 text-xs text-muted-foreground">+{rest}</span>}
    </div>
  );
}
