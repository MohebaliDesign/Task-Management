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

6. **`--sidebar` / `--sidebar-accent` / `--sidebar-border` / `--sidebar-primary`** — the DS export ships no dedicated "navigation surface" token (no `surface-brand-subtle` / `primary-subtle`), only a near-neutral `sidebar` triplet copied from the base neutral ramp. This went through three rounds before landing on its current, final values:
   - **Round 1** used a very low-lightness/low-saturation primary tint (near-white with a hint of blue) — too subtle against the white Header/Main Content.
   - **Round 2** made `--sidebar` equal to `--primary` itself — a strong, fully-saturated brand-blue surface — with white foreground text and a white "selected pill." Follow-up review asked for the Sidebar to return to a plain white surface belonging to the same shell as the Top Bar, so this was reverted.
   - **Round 3 (current)** — `--sidebar` is `0 0% 100%` (white, identical to `--background`/`--card`) in light mode. `--sidebar-foreground` is `--foreground-alt`'s value (`0 0% 25.1%`, neutral, readable, lower emphasis than selected). `--sidebar-accent` (hover) equals `--accent` (`0 0% 96.1%`). `--sidebar-border` equals `--border`. `--sidebar-primary` / `--sidebar-primary-foreground` now express the *selected* nav item as a subtle Primary-tinted background (`226 100% 95.5%`) with Primary Blue text/icon (`226 100% 62.7%`) — a light tint reads correctly against a white rail, where the Round 2 solid-white pill no longer would. In **Dark Mode**, `--sidebar` equals `--background` exactly (same reasoning: same shell surface as the Top Bar), and `--sidebar-primary` is a low-lightness Primary-hue tint (`226 45% 16%`) with the dark-mode `--ring` blue (`226 100% 69.4%`) as its foreground, mirroring the light-mode pairing without reusing a value that would be illegible on a near-black fill.

7. **`--sidebar-ring`** — referenced by `focus-visible:ring-sidebar-ring` in `brand-mark.tsx`/`sidebar-nav.tsx` but never defined pre-refinement, so those focus rings silently no-oped. Now mirrors `--ring` (brand primary) in both themes — the Round 2 white-ring workaround (needed only while the sidebar fill was itself primary-colored) no longer applies now that the sidebar is a white/near-black neutral again.

8. **`--background-subtle`** — new token, genuinely needed (item #28): the DS has no "workspace" surface distinct from `background`/`card`, but the shell now requires Main Content to read as a third, subtly distinct layer from the white Sidebar/Header/Cards (light: `0 0% 98%`, extremely close to white) — and, for the same conceptual hierarchy in Dark Mode, distinct from the near-black Sidebar/Header too (dark: `0 0% 5.5%`, between `--background` `3.9%` and `--card` `9%`). Mapped to Tailwind as `bg-background-subtle`. Used only on `<main>` in `app-shell.tsx` — Sidebar, Header, and Cards keep `background`/`card`.

9. **Shadow tokens (`--shadow-2xs` … `--shadow-xl`)** — refined for softer, more diffused elevation: lower opacity, larger blur radius, smaller vertical offset, and a negative spread so edges never look like a hard drop shadow (was already black-based per the DS's own definition — only the geometry/opacity changed, not the color). Also added **Dark Mode overrides** for the same six variables: the light-mode opacities (0.02–0.08) are close to invisible against a near-black page, so Dark Mode uses higher opacities (0.12–0.48) at the same soft geometry so elevation still reads on dark surfaces, per the "don't reuse light shadows unchanged if they look wrong on dark backgrounds" requirement.

10. **`--border`** — nudged lighter in light mode (`89.8%` → `92%` lightness) and darker (i.e. lower-contrast against the near-black page) in dark mode (`25.1%` → `20%`), in both cases to reduce border harshness per the app-shell refinement brief. Same hue/saturation (neutral gray), only the lightness changed — this is a token-level nudge, not a new color.

11. **`w-[4.5rem]`** (`sidebar.tsx`, collapsed rail width) — the only arbitrary-value exception introduced by the app-shell refinement. The Tailwind scale's nearest steps (`w-16`/`w-20`) are either too tight or too loose for a centered 20px icon plus padding; `4.5rem` was measured to keep the icon rail visually balanced. Not a color/spacing/radius/shadow token, so it doesn't compete with the Design System — spacing-scale tokens (`p-*`, `gap-*`, etc.) are used everywhere else in the new shell components. Table column `min-w-[…]` utilities elsewhere (People/Teams tables) are the same kind of layout-only sizing hint, not design tokens.

Everything else is a faithful 1:1 mapping of the exported company tokens.
