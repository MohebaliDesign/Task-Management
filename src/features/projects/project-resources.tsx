"use client";

import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon, type IconName } from "@/components/icon";
import { EmptyState } from "@/components/domain/empty-state";
import type { ProjectResource, ResourceKind } from "@/lib/domain";
import { resourceKindLabels } from "@/lib/labels";

const kindIcon: Record<ResourceKind, IconName> = {
  figma: "figma",
  repo: "repo",
  docs: "note",
  drive: "drive",
  slack: "slack",
  other: "globe",
};

function copyResourceLink(url: string) {
  navigator.clipboard?.writeText(url).then(
    () => toast.success("پیوند منبع کپی شد.", { description: url }),
    () => toast.error("کپی پیوند ممکن نشد."),
  );
}

export function ProjectResources({
  resources = [],
}: {
  resources?: ProjectResource[];
}) {
  if (resources.length === 0) {
    return <EmptyState icon="link" title="منبعی برای این پروژه ثبت نشده است" />;
  }

  return (
    <Card className="divide-y divide-border">
      {resources.map((r) => (
        <div key={r.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <AppIcon name={kindIcon[r.kind]} size={18} label={resourceKindLabels[r.kind]} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{r.title}</p>
              {r.description && <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{r.description}</p>}
              <p className="mt-1 truncate text-xs text-muted-foreground" dir="rtl">{r.url}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
            <Button variant="outline" size="sm" onClick={() => copyResourceLink(r.url)}>
              <AppIcon name="copy" size={15} />
              کپی پیوند
            </Button>
            <Button asChild variant="secondary" size="sm">
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                <AppIcon name="link" size={15} />
                باز کردن
              </a>
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
}
