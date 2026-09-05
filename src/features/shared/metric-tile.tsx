import { Card } from "@/components/ui/card";
import { AppIcon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/labels";
import { toneDot } from "@/lib/labels";

export function MetricTile({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: IconName;
  tone?: Tone;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        {icon && (
          <span className="flex items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 rounded-full", toneDot[tone])} aria-hidden="true" />
            <AppIcon name={icon} size={16} className="text-muted-foreground" />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
