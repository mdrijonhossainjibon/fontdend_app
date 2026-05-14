# 🎨 Design System — CaptchaMaster

## Framework

**Tailwind CSS v4** — no `tailwind.config.*`. All config is CSS `@theme inline` directives in `src/index.css`. Plugin loaded via `@tailwindcss/vite`.

## Brand Color

**Gold / Yellow** — Binance/crypto-exchange inspired. Used as `--primary`, `--ring`, `--chart-1`, and sidebar primary.

---

## Light Mode (`:root`)

| Token | Visual |
|---|---|
| `--background` | Near-white warm cream |
| `--foreground` | Near-black warm |
| `--card` | Pure white |
| `--card-foreground` | Near-black warm |
| `--popover` | Pure white |
| `--popover-foreground` | Near-black warm |
| **`--primary`** | **Gold (brand)** |
| `--primary-foreground` | Near-black warm |
| `--secondary` | Very light warm gray |
| `--secondary-foreground` | Dark warm gray |
| `--muted` | Light warm gray |
| `--muted-foreground` | Medium warm gray |
| `--accent` | Light gold |
| `--accent-foreground` | Near-black warm |
| `--destructive` | Red |
| `--destructive-foreground` | White |
| `--border` | Light warm border |
| `--input` | Very light warm |
| `--ring` | Gold focus ring |
| `--chart-1` | Gold |
| `--chart-2` | Teal/cyan |
| `--chart-3` | Blue |
| `--chart-4` | Yellow-green |
| `--chart-5` | Orange |
| `--radius` | 12px (generous rounding) |

### Sidebar (light)

| Token | Visual |
|---|---|
| `--sidebar-background` | Near-white |
| `--sidebar-foreground` | Near-black |
| `--sidebar-primary` | Gold |
| `--sidebar-accent` | Very light warm |
| `--sidebar-border` | Light warm |

---

## Dark Mode (`.dark`)

Primary stays the **same gold** across both modes — only backgrounds darken.

| Token | Visual |
|---|---|
| `--background` | Very dark warm |
| `--foreground` | Near-white warm |
| `--card` | Dark warm |
| `--primary` | **Gold (unchanged)** |
| `--secondary` | Dark warm gray |
| `--muted-foreground` | Medium-light gray |
| `--destructive` | Dark red |
| `--destructive-foreground` | Bright red |
| `--border` | Dark warm border |

### Sidebar (dark)

| Token | Visual |
|---|---|
| `--sidebar-background` | Dark warm |
| `--sidebar-foreground` | Near-white |
| `--sidebar-primary` | Gold |
| `--sidebar-border` | Dark warm |

---

## Tailwind Utility Classes

Mapped via `@theme inline` in `index.css`. All semantic tokens are available as:

```
bg-background       bg-foreground
bg-card             bg-card-foreground
bg-popover          bg-popover-foreground
bg-primary          bg-primary-foreground
bg-secondary        bg-secondary-foreground
bg-muted            bg-muted-foreground
bg-accent           bg-accent-foreground
bg-destructive      bg-destructive-foreground
border-border       border-primary
ring-ring
text-foreground     text-muted-foreground
text-primary        text-card-foreground
text-destructive
```

### Radius scale

| Class | Size |
|---|---|
| `rounded-sm` | 8px |
| `rounded-md` | 10px |
| `rounded-lg` | 12px (default) |
| `rounded-xl` | 16px |

### Sidebar utilities

```
bg-sidebar                  text-sidebar-foreground
bg-sidebar-primary          bg-sidebar-accent
border-sidebar-border       ring-sidebar-ring
```

---

## Common Usage Patterns

| Purpose | Classes |
|---|---|
| Page body | `bg-background text-foreground` |
| Card | `bg-card text-card-foreground border-border` |
| Primary button | `bg-primary text-primary-foreground hover:bg-primary/90` |
| Secondary button | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| Destructive button | `bg-destructive text-destructive-foreground` |
| Muted text | `text-muted-foreground` |
| Input | `bg-background border-input` |
| Focus ring | `focus-visible:ring-ring` |
| Active/highlighted | `border-primary` or `bg-accent` |

### Decorative colors used directly

```
text-green-500 / bg-green-500/10     — success, online badges
text-blue-500  / bg-blue-500/10      — feature icons, global stats
text-purple-500                      — AI/ML features
text-orange-500                      — timer/support icons
text-emerald-500                     — online indicators
text-pink-500                        — priority support
text-amber-500, text-violet-500      — how-it-works step icons
bg-red-500/10                        — error/offline indicators
```

---

## Typography

| Family | Font Stack |
|---|---|
| Sans | `"Inter", "Geist", "Geist Fallback", sans-serif` |
| Mono | `"Geist Mono", "Geist Mono Fallback", monospace` |

---

## Animations

Defined in `index.css`:

| Name | Duration | Timing | Use |
|---|---|---|---|
| `pulse-glow` | 2s | ease-in-out infinite | Logo glow (gold drop-shadow) |
| `float` | 3s | ease-in-out infinite | Hero card/badge float |
| `shimmer` | 2s | ease-in-out infinite | Gold-tinted sweep |
| `fadeIn` | 0.3s | ease-out | Simple entrance |
| `slideUp` | 0.4s | cubic-bezier | Slide entrance |
| `scaleIn` | 0.5s | cubic-bezier | Scale entrance |
| `shake` | 0.5s | ease-in-out | Error feedback |
| `float-up` | 3s | ease-in-out forwards | Particle effects |

### Custom utility classes

- `bg-gradient-radial` — radial gradient backgrounds
- `glass-card` — translucent blurred background
- `glow-text` — gold text-shadow

---

## Brand Text

`CaptchaⱮaster` — uses Unicode `Ɱ` (Latin capital letter M with hook). The `Ɱaster` portion is styled with `text-primary`.

Logo image: `/logo.png`

---

## Dark Mode Toggle

Variant: `@custom-variant dark (&:is(.dark *));`

Activated by adding `.dark` class to any ancestor (typically `<html>`). A `next-themes` `ThemeProvider` component exists in `src/components/theme-provider.tsx` but is **not wired** into the app root (`main.tsx`).

---

## Component Library

**shadcn/ui** — 57 components in `src/components/ui/`. Uses Radix UI primitives, `cva` (class-variance-authority), `clsx` + `tailwind-merge` via the `cn()` utility. No `components.json` (manually adapted for Tailwind v4).

### Compatibility bridges

- `--adm-color-primary` — Ant Design Mobile compatibility
- `--ant-primary-color` — Ant Design compatibility
