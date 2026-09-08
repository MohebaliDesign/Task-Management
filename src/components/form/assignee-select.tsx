import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Person, Team } from "@/lib/domain";

const NONE = "none";

/**
 * Person/Team/No-owner picker for anything ownable (actions, blockers).
 * A plain <select name> so it drops into existing server-action forms
 * unchanged; "none" is translated back to an empty owner on submit by the
 * server action, same as the old person-only select already did.
 */
export function AssigneeSelect({
  name,
  people,
  teams,
  defaultValue,
  id,
}: {
  name: string;
  people: Person[];
  teams: Team[];
  defaultValue?: string | null;
  id?: string;
}) {
  return (
    <Select name={name} defaultValue={defaultValue || NONE}>
      <SelectTrigger id={id}><SelectValue placeholder="بدون مسئول" /></SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>بدون مسئول</SelectItem>
        {people.length > 0 && (
          <SelectGroup>
            <SelectLabel>افراد</SelectLabel>
            {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectGroup>
        )}
        {teams.length > 0 && (
          <SelectGroup>
            <SelectLabel>تیم‌ها</SelectLabel>
            {teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}
