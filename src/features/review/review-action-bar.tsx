import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { cn } from "@/lib/utils";

/**
 * The two final review actions, in one reusable component so the sticky top
 * bar, the sticky mobile bar, and the final action section render an
 * IDENTICAL button pair (never a different design per placement).
 *
 * RTL hierarchy (mandatory — brief §2/§3):
 *   Right: «نیاز به اصلاح دارد» (secondary / outline)
 *   Left:  «تأیید و امضا»       (primary / default)
 * DOM order below is deliberately [feedback, approve] — in an RTL flex row the
 * first child renders on the right, so this order alone produces that layout;
 * do not reorder without re-checking the RTL result.
 */
export function ReviewActionBar({
  onApprove,
  onFeedback,
  layout = "row",
  size = "default",
  interactive = true,
  className,
}: {
  onApprove: () => void;
  onFeedback: () => void;
  /** "row": always side-by-side (compact sticky bars). "responsive": stacked on mobile, row from sm+ (final section). */
  layout?: "row" | "responsive";
  size?: "default" | "sm";
  /** false while this instance is visually hidden (e.g. sticky bar mid-transition) — removes it from tab order so hidden/visible duplicates never both hold focus. */
  interactive?: boolean;
  className?: string;
}) {
  const tabIndex = interactive ? undefined : -1;
  const iconSize = size === "sm" ? 16 : 18;
  return (
    <div
      className={cn(
        "flex gap-2",
        layout === "row" ? "flex-row" : "flex-col-reverse gap-3 sm:flex-row",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={onFeedback}
        tabIndex={tabIndex}
        className="flex-1 border-warning/40 text-warning hover:bg-warning-subtle hover:text-warning"
      >
        <AppIcon name="edit" size={iconSize} />
        نیاز به اصلاح دارد
      </Button>
      <Button type="button" size={size} onClick={onApprove} tabIndex={tabIndex} className="flex-1">
        <AppIcon name="verify" size={iconSize} />
        تأیید و امضا
      </Button>
    </div>
  );
}
