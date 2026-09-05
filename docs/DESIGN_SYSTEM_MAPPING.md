# Design System → shadcn variable mapping

Company tokens are authoritative. Each Algonet semantic token is mapped to a shadcn CSS variable in `src/app/globals.css` (values stored as HSL triplets for the `hsl(var(--x))` convention). Tailwind exposes them via semantic color names in `tailwind.config.ts`.

## Direct mappings

| Company token | shadcn variable | Tailwind usage |
|---|---|---|
| general.background | `--background` | `bg-background` |
| general.foreground | `--foreground` | `text-foreground` |
| general.primary (`#416DFF`) | `--primary` | `bg-primary` |
| general.primary foreground | `--primary-foreground` | `text-primary-foreground` |
| unofficial.primary hover | `--primary-hover` | `hover:bg-primary-hover` |
| general.secondary (`#FF4000`) | `--secondary` | `bg-secondary` |
| unofficial.secondary hover | `--secondary-hover` | `hover:bg-secondary-hover` |
| general.accent / accent fg | `--accent` / `--accent-foreground` | `bg-accent` |
| general.muted / muted fg | `--muted` / `--muted-foreground` | `text-muted-foreground` |
| general.destructive | `--destructive` | `bg-destructive` |
| unofficial.destructive subtle/border/text | `--destructive-subtle/-border/-text` | error surfaces |
| general.border | `--border` | `border-border` |
| card.card / card fg | `--card` / `--card-foreground` | `bg-card` |
| focus.ring / ring error | `--ring` / `--ring-error` | `focus-visible:ring-ring` |
| sidebar.* | `--sidebar*` | sidebar chrome |
| unofficial.foreground alt | `--foreground-alt` | body copy on cards |

Radius, spacing, and shadow tokens map 1:1 to `--radius*`, Tailwind spacing, and `--shadow-*`.

## Documented interpretations / deviations

These are the only places the literal token was adjusted, each for usability/accessibility, never to substitute a different brand value:

1. **`--input`** — the DS `general.input` is `#FFFFFF` (an input *surface* color). shadcn's `--input` is the input *border*. A white border would be invisible, so `--input` is mapped to the DS **border** value (`#E5E5E5`); the input surface uses `--background`. Result matches the DS visual intent (white field, subtle border).

2. **`--popover`** — the DS `popover` token is inverted (black bg / white text), which reads as a **tooltip** style and is applied there (`Tooltip` uses `bg-foreground text-background`). Generic dropdown/select/command surfaces map `--popover` to the **card** surface so menus stay light and legible in the light theme. This avoids "dark dropdowns everywhere" while still honoring the token for tooltips.

3. **`--ring`** — set to the brand **primary** (`#416DFF`) rather than the DS `focus.ring` neutral `#E5E5E5`, so keyboard focus is clearly visible (accessibility). The DS `ring error` is kept for invalid fields.

4. **`success` / `warning`** — added as supplementary semantic tokens (green/amber) because the DS semantic set defines none, yet health/approval/risk states require affirmative/caution colors. Values are conventional (`#16A34A`, `#D97706`) and used only for status, never brand surfaces.

5. **Font** — `Vazir FD‑WOL` → **Vazirmatn** (same lineage, open‑source, self‑hosted). See `OPEN_PRODUCT_DECISIONS.md`.

Everything else is a faithful 1:1 mapping of the exported company tokens.
