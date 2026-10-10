LUMEN STOREFRONT — DESIGN SYSTEM & CONVENTIONS
Give this to the agent before any new page or component work.
Save as DESIGN.md in the repo root and reference it in every prompt.

============================================================

1. # STACK

- Next.js (App Router, server components by default)
- Tailwind CSS v4 (config via @theme and @custom-variant in globals.css)
- lucide-react for all icons
- next-themes for dark mode
- next/image for every image (never raw <img>)

============================================================ 2. FILE & NAMING CONVENTIONS
============================================================
Type | Convention | Example
----------------|---------------------------|-------------------------
React component | PascalCase.tsx | SiteHeader.tsx, ProductCard.tsx
Utility/helper | camelCase.ts | formatPrice.ts
Hook | camelCase.ts, use prefix | useCart.ts
Data/fixtures | camelCase.ts | products.ts
Route file | Next.js reserved | page.tsx, layout.tsx
Config | kebab-case | next.config.ts

Component folders: keep flat in components/ unless a component has
3+ private sub-components, then use a folder:

components/
ProductCard/
ProductCard.tsx
ProductCardSkeleton.tsx

Never use kebab-case for components (site-header.tsx is WRONG).

============================================================ 3. COLOR TOKENS
============================================================
Use zinc as the neutral scale everywhere. Do not mix grays
(gray, slate, neutral) with zinc.

| Purpose                         | Light                  | Dark                                |
| ------------------------------- | ---------------------- | ----------------------------------- |
| Page background                 | bg-white               | dark:bg-zinc-950                    |
| Elevated surface (card, drawer) | bg-white / bg-zinc-50  | dark:bg-zinc-900                    |
| Subtle section background       | bg-zinc-50/60          | dark:bg-zinc-900/40                 |
| Border / divider                | border-zinc-200        | dark:border-zinc-800                |
| Primary text                    | text-zinc-900          | dark:text-zinc-100                  |
| Secondary text                  | text-zinc-600          | dark:text-zinc-400                  |
| Muted text / labels             | text-zinc-500          | dark:text-zinc-400                  |
| Disabled / faint                | text-zinc-400          | dark:text-zinc-500                  |
| Inverted section                | bg-zinc-900 text-white | dark:bg-zinc-100 dark:text-zinc-900 |

Accent: emerald-500 only for status dots / success indicators.
Design is intentionally near-monochrome.

RULE: every colored utility needs a dark: pair. No exceptions.

============================================================ 4. TYPOGRAPHY
============================================================
Font: Inter via next/font, exposed as --font-inter -> font-sans.

| Role                          | Classes                                                 |
| ----------------------------- | ------------------------------------------------------- |
| Page H1 (hero)                | text-4xl sm:text-5xl lg:text-6xl font-semibold          |
| leading-[1.05] tracking-tight |
| Section H2                    | text-2xl sm:text-3xl font-semibold tracking-tight       |
| Sub-section H3                | text-base font-medium                                   |
| Body                          | text-base leading-relaxed                               |
| Small / meta                  | text-sm                                                 |
| Micro-label                   | text-xs or text-[11px]                                  |
| Brand wordmark                | text-lg font-semibold tracking-[0.2em] (all-caps LUMEN) |

Headings use tracking-tight. Wordmark is the only wide-tracked text.

============================================================ 5. LAYOUT & SPACING
============================================================

- Container: mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 on every section.
  No custom max-widths unless intentionally narrow (newsletter: max-w-3xl).
- Section vertical rhythm: py-20 desktop, py-16 hero-adjacent,
  py-10 utility bars.
- Grid gaps: gap-x-5 gap-y-10 for product grids; gap-5 category grids;
  gap-8 / gap-12 content columns.
- Never hardcode pixel spacing like mt-[37px]. Use the Tailwind scale.

============================================================ 6. COMPONENT PATTERNS
============================================================
BUTTONS
Primary (dark bg):
inline-flex h-12 items-center gap-2 rounded-full bg-zinc-900
px-7 text-sm font-medium text-white transition hover:bg-zinc-700
dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300

Secondary (outline):
inline-flex h-12 items-center rounded-full border border-zinc-300
bg-white px-7 text-sm font-medium text-zinc-900 transition
hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900
dark:text-zinc-100 dark:hover:border-zinc-100

Icon button:
rounded-lg p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800

Pill / tag / filter:
rounded-full px-4 py-2 text-sm font-medium
Active: bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900

All CTAs: rounded-full. Icon buttons: rounded-lg.

CARDS
Image wrapper:
relative aspect-[4/5] overflow-hidden rounded-2xl
bg-zinc-100 dark:bg-zinc-800
Image hover:
transition-transform duration-700 ease-out group-hover:scale-105
Hover-reveal action:
translate-y-3 opacity-0 group-hover:translate-y-0
group-hover:opacity-100
Badge on image:
rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium
backdrop-blur dark:bg-zinc-900/90

SECTION HEADERS (standard pattern)

  <div className="flex flex-wrap items-end justify-between gap-6">
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900
                     sm:text-3xl dark:text-zinc-50">
        Section title
      </h2>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">Subtitle.</p>
    </div>
    {/* optional action / tabs */}
  </div>

INVERTED / HIGH-CONTRAST SECTIONS
Used for newsletter, promo banners, announcement bar.
These FLIP in dark mode:
Light: bg-zinc-900 text-white
Dark: dark:bg-zinc-100 dark:text-zinc-900
Never make these sections dark in both modes — the flip is part
of the visual language.

============================================================ 7. DARK MODE RULES
============================================================

1. EVERY color class needs a dark: counterpart. Audit with grep for
   bg-, text-, border- before shipping.
2. Use @custom-variant dark (&:where(.dark, .dark \*)) in globals.css
   (Tailwind v4).
3. <html> has suppressHydrationWarning; theme is applied by
   ThemeProvider with attribute="class".
4. Client components that read the theme must guard against
   hydration mismatch:
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);
5. Image containers get bg-zinc-100 dark:bg-zinc-800 placeholder so
   images don't flash white.
6. Color swatches use ring-offset-white dark:ring-offset-zinc-950.

============================================================ 8. ACCESSIBILITY BASELINE
============================================================

- Every icon-only button: aria-label + visible hover state.
- Interactive elements: transition on hover/focus; never remove
  focus outline without replacement.
- Images: descriptive alt (product name, category name).
  Decorative -> alt="".
- Contrast: text pairs above meet WCAG AA at their size
  (zinc-900/white, zinc-600/zinc-50, white/zinc-900).

============================================================ 9. RESPONSIVENESS
============================================================
Breakpoints used: sm (640), md (768), lg (1024).

- Product grids: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
- Category grids: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
- Hero: stacked below lg, two-column at lg
- Nav: mobile drawer below lg, inline nav at lg
- Search: icon-only below md, full input at md+

============================================================ 10. MOTION
============================================================

- Duration: duration-300 for UI, duration-700 for image zoom.
- Easing: default; ease-out for image transforms.
- Never animate layout properties (width, height, top, left).
  Only transform and opacity.

============================================================ 11. PAGE STRUCTURE TEMPLATE
============================================================
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function SomePage() {
return (
<>
<SiteHeader />
<main>
{/_ sections _/}
</main>
<SiteFooter />
</>
);
}

Sections inside <main> alternate between:

- bg-white / dark:bg-zinc-950 (default)
- bg-zinc-50/60 / dark:bg-zinc-900/40 (subtle)
- bg-zinc-900 / dark:bg-zinc-100 (inverted, CTAs only)

Never put two of the same background type adjacent without a border
or spacing cue.

============================================================ 12. DO / DON'T CHEAT SHEET
============================================================
DO | DON'T
-----------------------------------------|--------------------------------
Use zinc scale everywhere | Mix gray / slate / neutral
Add dark: for every color | Ship light-only styles
PascalCase.tsx components | kebab-case.tsx components
mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 | Custom container widths
rounded-full for CTAs | rounded-md on big buttons
lucide-react icons at size-4 / size-5 | Inline SVGs, mixed icon libs
next/image with sizes prop | Raw <img>
transition on hover | No hover feedback
Invert sections in dark mode | Keep them dark in both
Client components only when needed | "use client" on every file

============================================================ 13. REFERENCE IMPLEMENTATION
============================================================
Canonical reference: app/page.tsx plus:
components/SiteHeader.tsx
components/ProductCard.tsx
components/Newsletter.tsx
components/SiteFooter.tsx
components/ThemeToggle.tsx
components/ThemeProvider.tsx

When in doubt, match one of these exactly rather than inventing
a new pattern.
