LUMEN STOREFRONT — DESIGN SYSTEM & CONVENTIONS
Give this to the agent before any new page or component work.
Save as DESIGN.md in the repo root and reference it in every prompt.

============================================================

1. # STACK

- Next.js (App Router, server components by default)
- Tailwind CSS v4 (config via @theme and @custom-variant in globals.css)
- shadcn/ui primitives in components/ui (style: radix-rhea, base: neutral)
- react-hook-form + zod for every form (zodResolver from @hookform/resolvers)
- lucide-react for all icons
- next-themes for dark mode
- sonner for toasts
- cn from "cn" for class merging (re-exported as @/lib/utils)
- next/image for every image (never raw <img>)
- Logical (RTL-safe) spacing utilities everywhere — see section 14

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
Exception: shadcn/ui primitives in components/ui keep their generated
kebab-case filenames (input-group.tsx, theme-provider.tsx).

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

The shadcn semantic tokens in globals.css are aliased to this same zinc
scale (--primary -> zinc-900 light / zinc-100 dark, --border -> zinc-200
/ zinc-800, --muted-foreground -> zinc-500 / zinc-400, --ring ->
zinc-400 / zinc-500), so raw shadcn defaults stay monochrome too.

============================================================ 4. TYPOGRAPHY
============================================================
Font: Noto Sans via next/font, exposed as --font-sans -> font-sans
(--font-heading aliases the same family in globals.css).

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
2. Use @custom-variant dark (&:is(.dark *)) in globals.css (Tailwind v4).
3. <html> has suppressHydrationWarning; theme is applied by
   ThemeProvider (components/ui/theme-provider.tsx) with
   attribute="class". The app tree is wrapped in DirectionProvider.
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
components/ui/ModeToggle.tsx
components/ui/theme-provider.tsx

Auth reference: app/(auth)/layout.tsx and its pages
app/(auth)/login/page.tsx, app/(auth)/signup/page.tsx,
app/(auth)/forgot-password/page.tsx,
app/(auth)/reset-password/[code]/page.tsx,
app/(auth)/verify-email/[token]/page.tsx plus:
components/AuthShell.tsx
components/AuthCard.tsx
components/AuthField.tsx
components/PasswordField.tsx
components/AuthSubmitButton.tsx
components/LoginForm.tsx
components/SignupForm.tsx
components/ForgotPasswordForm.tsx
components/ResetPasswordForm.tsx
lib/authSchema.ts
lib/actions/auth-actions.ts

Dynamic route params (e.g. reset-password/[code]) are runtime data
under cacheComponents, so read them inside a Suspense boundary: keep
the page shell sync and await params in a child component.

A page that must run a backend call before it can render (e.g.
verify-email/[token]) instead opts out with `export const instant =
false` and calls the server action directly in the Server Component.

When in doubt, match one of these exactly rather than inventing
a new pattern.

============================================================ 14. RTL & LOGICAL PROPERTIES
============================================================
The app ships a DirectionProvider and may run RTL in future. Write
every layout with logical properties so the direction can flip later
without a refactor — this applies even though the default is dir="ltr".

DO                            | DON'T
------------------------------|--------------------------------
ps-* / pe-* (padding)         | pl-* / pr-*
ms-* / me-* (margin)          | ml-* / mr-*
start-* / end-* (inset)       | left-* / right-*
text-start / text-end         | text-left / text-right
border-s-* / border-e-*       | border-l-* / border-r-*
rounded-s-* / rounded-e-*     | rounded-l-* / rounded-r-*
gap-* / justify-between       | absolute left/right icon placement

- Symmetric px-* / py-* are direction-neutral and fine to use.
- Directional icons (ArrowRight, ChevronRight, ArrowLeft) do NOT
  auto-flip in RTL. Swap them from direction or lean on gap-based
  layouts instead of hard-coded placement.
- Set direction once at the root: <DirectionProvider dir="rtl">.

============================================================ 15. SHADCN COMPONENTS
============================================================
Primitives live in components/ui (style: radix-rhea, base: neutral) and
are added with the shadcn CLI. They are building blocks, not the final
look — always re-theme them to the zinc system above.

- Naming: generated primitives keep kebab-case filenames
  (input-group.tsx, theme-provider.tsx); your own components stay
  PascalCase (AuthCard.tsx, PasswordField.tsx).
- Class merging: import { cn } from "@/lib/utils" (re-exports "cn", a
  clsx + tailwind-merge replacement). Later classes win, so a className
  prop overrides a primitive's defaults.
- Semantic tokens in globals.css are aliased to zinc: --primary is
  zinc-900 with white text in light and zinc-100 with zinc-900 text in
  dark, so variant="default" already matches the section 6 primary CTA
  colors. Only add size/shape: h-12 rounded-full.
- Sizing: Button/Input defaults are compact (h-8, rounded-2xl). The
  storefront CTA and input are h-12 rounded-full — override via
  className (cn merges, so this is safe).
- Forms: react-hook-form + zod through a zodResolver. Compose
  Field / FieldGroup / FieldLabel / FieldError with Input / InputGroup,
  wired with Controller. See components/AuthField.tsx (text input) and
  components/PasswordField.tsx (password + visibility toggle).
- One reusable field wrapper per input shape beats repeating markup
  across forms; share the primary CTA via AuthSubmitButton.
