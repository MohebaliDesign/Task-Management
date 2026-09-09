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

6. **`--sidebar` / `--sidebar-accent` / `--sidebar-border` / `--sidebar-primary`** — the DS export ships no dedicated "navigation surface" token (no `surface-brand-subtle` / `primary-subtle`), only a near-neutral `sidebar` triplet copied from the base neutral ramp. Per the app-shell refinement brief, these four `--sidebar*` variables were retinted to a very low-lightness/low-saturation tint of the company **primary hue (226°)** instead of neutral gray, so the persistent navigation rail reads as a distinct, brand-reinforcing surface once Header and Main Content both moved to plain white — while staying calm enough for daily use and passing contrast in both themes. `--sidebar-primary` now equals `--primary`, used for the selected nav item. No new variable name was introduced; only the existing `--sidebar*` values were re-authored.

7. **`--sidebar-ring`** — referenced by `focus-visible:ring-sidebar-ring` in `brand-mark.tsx`/`sidebar-nav.tsx` but never defined, so those focus rings silently no-oped. Added, mirroring `--ring` (brand primary), so keyboard focus inside the sidebar is visible — same rationale as deviation 3 above.

8. **`w-[4.5rem]`** (`sidebar.tsx`, collapsed rail width) — the only arbitrary-value exception introduced by the app-shell refinement. The Tailwind scale's nearest steps (`w-16`/`w-20`) are either too tight or too loose for a centered 20px icon plus padding; `4.5rem` was measured to keep the icon rail visually balanced. Not a color/spacing/radius/shadow token, so it doesn't compete with the Design System — spacing-scale tokens (`p-*`, `gap-*`, etc.) are used everywhere else in the new shell components. Table column `min-w-[…]` utilities elsewhere (People/Teams tables) are the same kind of layout-only sizing hint, not design tokens.

Everything else is a faithful 1:1 mapping of the exported company tokens.
