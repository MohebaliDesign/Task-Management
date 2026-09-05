# Design System — Algonet tokens

Source: the uploaded **`DesignSystem DesignTokens.zip`** (a zip of Figma "Tokens Studio" exports). It was extracted to `inputs/design-system/`. The exports are already named for shadcn, which made the mapping direct.

## Extracted token sets

| Set | File | Notes |
|---|---|---|
| Semantic colors (light) | `semantic colors/shadcn.tokens.json` | 52 tokens incl. sidebar + "unofficial" extras |
| Semantic colors (dark) | `semantic colors/shadcn-dark.tokens.json` | full dark counterpart |
| Brand colors | `brand colors/shadcn.tokens.json` | neutral ramp 50–950, brand blue ramp, combinations |
| Border radius | `border radius/shadcn.tokens.json` | base **radius = 10px**; xs2 sm4 md6 lg8 xl12 2xl16 |
| Spacing | `spacing/shadcn.tokens.json` | 0,2,4,6,8,12,16,20,24,32,40,48,56,64,72,80,88,96 |
| Shadows | `shadows/shadcn.tokens.json` | 2xs…3xl (x/y/blur/spread, black) |
| Typography (Persian) | `typography (Persian)/shadcn.tokens.json` | family "Vazir FD‑WOL"; scale below |
| Typography (English) | `typography (English)/shadcn.tokens.json` | Latin counterpart |

## Core color values (light)

| Role | Hex |
|---|---|
| primary | `#416DFF` (brand blue 600) · hover `#375DD9` |
| secondary | `#FF4000` · hover `#D93600` |
| background / foreground | `#FFFFFF` / `#000000` |
| accent / muted | `#F5F5F5` · muted‑fg `#737373` |
| destructive | `#DC2626` |
| border / card | `#E5E5E5` / `#FFFFFF` |
| sidebar | `#FAFAFA` · fg `#404040` · border `#E5E5E5` |

Dark counterparts (e.g. background `#0A0A0A`, card `#171717`, border `#404040`) come from the dark export. Full HSL conversions live in `src/app/globals.css`.

## Radius

Base `--radius: 0.625rem` (10px). Steps: xs 2 · sm 4 · md 6 · lg 8 · xl 12 · 2xl 16.

## Shadows

The DS defines shadow geometry with a black color. Real elevation needs opacity, so shadows are applied at conventional low alphas (0.04–0.12) matching the DS steps 2xs→xl. Documented as the one intentional interpretation of the shadow tokens.

## Typography

Type scale (Persian export): H1 48/72 · H2 30/45 · H3 24/36 · H4 20/30 · paragraph‑large 18/27 · regular 16/24 · small 14/20 · mini 12/16. Weights: Regular 400 · Medium 500 · DemiBold 600 · Bold 700.

**Font substitution:** the token family is "Vazir FD‑WOL" (a proprietary Vazir cut not publicly available). Per the brief's explicit typography requirement, the app ships **Vazirmatn** — the open‑source successor in the same Vazir lineage — self‑hosted as a variable woff2 via `next/font/local`. See `docs/OPEN_PRODUCT_DECISIONS.md`.

## Success / warning colors

The DS semantic set has no dedicated `success`/`warning` roles (only primary/secondary/destructive/muted/accent). Health states (On Track / At Risk / Off Track), approvals, and risks need distinct affirmative/caution colors, so `success` (green) and `warning` (amber) were added as documented supplementary semantic tokens — see the mapping doc. They never replace a defined company token.
