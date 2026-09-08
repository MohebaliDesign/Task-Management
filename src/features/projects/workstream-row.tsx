import { Progress } from "@/components/ui/progress";
import { PersonChip } from "@/components/domain/person";
import { toFa } from "@/lib/utils";
import type { Person, Workstream } from "@/lib/domain";

export function WorkstreamRow({ workstream, lead }: { workstream: Workstream; lead: Person | undefined }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{workstream.title}</p>
        <span className="text-xs text-muted-foreground">{toFa(workstream.progress)}٪</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{workstream.summary}</p>
      <div className="mt-2 flex items-center gap-2">
        <Progress value={workstream.progress} className="h-1.5 min-w-0 shrink" />
        <PersonChip person={lead} variant="compact" className="max-w-[45%] shrink-0" />
      </div>
    </div>
  );
}
