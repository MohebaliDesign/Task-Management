import { Card } from "@/components/ui/card";
import { PersonAvatar } from "@/components/domain/person";
import { AppIcon } from "@/components/icon";
import { PersonDetailDialog } from "@/features/people/person-detail-dialog";
import { roleLabels } from "@/lib/labels";
import { toFa } from "@/lib/utils";
import { getActiveProjectsForPerson, getTeamsForPerson } from "@/lib/queries";
import type { Person } from "@/lib/domain";

/** Compact browsable card for the People grid view (item #37) — one focus per card, "مشاهده جزئیات" opens the full detail dialog. */
export function PersonCard({ person }: { person: Person }) {
  const teams = getTeamsForPerson(person.id);
  const activeProjects = getActiveProjectsForPerson(person.id);

  return (
    <PersonDetailDialog person={person} teams={teams} activeProjects={activeProjects}>
      <button type="button" className="w-full rounded-lg text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Card className="flex flex-col gap-3 p-4 transition-colors hover:border-primary/40 hover:bg-accent/40">
          <div className="flex items-center gap-3">
            <PersonAvatar person={person} className="h-10 w-10 shrink-0" />
            <div className="min-w-0">
              <p className="truncate font-medium">{person.name}</p>
              <p className="truncate text-xs text-muted-foreground">{roleLabels[person.role]}</p>
            </div>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {teams.length > 0 ? teams.map((t) => t.name).join("، ") : "بدون تیم"}
          </p>
          <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
            <span>{toFa(activeProjects.length)} پروژهٔ فعال</span>
            <span className="flex items-center gap-1 text-primary">
              مشاهده جزئیات <AppIcon name="chevronLeft" size={13} />
            </span>
          </div>
        </Card>
      </button>
    </PersonDetailDialog>
  );
}
