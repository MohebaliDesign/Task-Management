import { cn } from "@/lib/utils";
import { HEALTH_DIMENSION, type HealthCheck } from "@/lib/domain";
import { dimensionLabels, healthLabels, toneDot } from "@/lib/labels";

export function HealthCheckGrid({ health }: { health: HealthCheck }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {HEALTH_DIMENSION.map((dim) => {
        const value = health[dim];
        const meta = healthLabels[value];
        return (
          <div key={dim} className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2.5">
            <span className="text-sm text-muted-foreground">{dimensionLabels[dim]}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium">
              <span className={cn("h-2 w-2 rounded-full", toneDot[meta.tone])} aria-hidden="true" />
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
