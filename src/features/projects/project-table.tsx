import Link from "next/link";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { HealthBadge, LifecycleBadge, PhaseBadge } from "@/components/domain/status";
import { PersonChip } from "@/components/domain/person";
import { faDate, faRelative } from "@/lib/utils";
import { getPerson } from "@/lib/queries";
import type { Project } from "@/lib/domain";

/** The tabular alternative to ProjectCard — same data, denser scanning. */
export function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام پروژه</TableHead>
            <TableHead>مدیر پروژه</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>فاز</TableHead>
            <TableHead>مهلت</TableHead>
            <TableHead>آخرین به‌روزرسانی</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((p) => {
            const pm = getPerson(p.pmId);
            return (
              <TableRow key={p.id}>
                <TableCell>
                  <Link
                    href={`/projects/${p.id}`}
                    className="flex min-w-0 items-center gap-2 rounded-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[11px] font-normal text-muted-foreground">{p.versionLabel}</span>
                  </Link>
                </TableCell>
                <TableCell><PersonChip person={pm} variant="compact" /></TableCell>
                <TableCell>{p.lifecycle === "closed" ? <LifecycleBadge value={p.lifecycle} /> : <HealthBadge value={p.health} />}</TableCell>
                <TableCell><PhaseBadge value={p.phase} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{faDate(p.targetDate)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{faRelative(p.updatedAt)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
