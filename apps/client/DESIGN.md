LUMEN STOREFRONT — DESIGN SYSTEM & CONVENTIONS
Give this to the agent before any new page or component work.
Save as DESIGN.md in the repo root and reference it in every prompt.

============================================================

1. # STACK

- Next.js (App Router, server components by default)
- Tailwind CSS v4 (config via @theme and @custom-variant in globals.css)
- shadcn/ui primitives in components/ui (style: radix-rhea, base: neutral)
- react-hook-form + zod for every form (zodResolver from @hookform/resolvers)
- lucide-react for UI icons; @hugeicons/core-free-icons for brand
  marks (e.g. the Google sign-in button)
- qrcode.react for the two-factor setup QR code (client component)
- next-themes for dark mode
- sonner for toasts
- zustand for client state; stores live in stores/ — see section 16
- cn from "cn" for class merging (re-exported as @/lib/utils)
- next/image for every image (never raw <img>)
- Logical (RTL-safe) spacing utilities everywhere — see section 14

# ============================================================ 2. FILE & NAMING CONVENTIONS

| Type            | Convention               | Example                          |
| --------------- | ------------------------ | -------------------------------- |
| React component | PascalCase.tsx           | SiteHeader.tsx, ProductCard.tsx  |
| Utility/helper  | camelCase.ts             | formatPrice.ts                   |
| Hook            | camelCase.ts, use prefix | useCart.ts                       |
| Data/fixtures   | camelCase.ts             | products.ts                      |
| Store           | camelCase.ts             | user.store.ts                    |
| Server action   | camelCase                | auth-actions.ts, user.actions.ts |
| Route file      | Next.js reserved         | page.tsx, layout.tsx             |
| Config          | kebab-case               | next.config.ts                   |

Component folders: keep flat in components/ unless a component has
3+ private sub-components, then use a folder:

components/
ProductCard/
ProductCard.tsx
ProductCardSkeleton.tsx

Never use kebab-case for components (site-header.tsx is WRONG).
Exception: shadcn/ui primitives in components/ui keep their generated
kebab-case filenames (input-group.tsx, theme-provider.tsx).

# ============================================================ 3. COLOR TOKENS

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

# ============================================================ 4. TYPOGRAPHY

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

# ============================================================ 5. LAYOUT & SPACING

- Container: mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 on every section.
  No custom max-widths unless intentionally narrow (newsletter: max-w-3xl).
- Section vertical rhythm: py-20 desktop, py-16 hero-adjacent,
  py-10 utility bars.
- Grid gaps: gap-x-5 gap-y-10 for product grids; gap-5 category grids;
  gap-8 / gap-12 content columns.
- Never hardcode pixel spacing like mt-[37px]. Use the Tailwind scale.

# ============================================================ 6. COMPONENT PATTERNS

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

# ============================================================ 7. DARK MODE RULES

1. EVERY color class needs a dark: counterpart. Audit with grep for
   bg-, text-, border- before shipping.
2. Use @custom-variant dark (&:is(.dark \*)) in globals.css (Tailwind v4).
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

# ============================================================ 8. ACCESSIBILITY BASELINE

- Every icon-only button: aria-label + visible hover state.
- Interactive elements: transition on hover/focus; never remove
  focus outline without replacement.
- Images: descriptive alt (product name, category name).
  Decorative -> alt="".
- Contrast: text pairs above meet WCAG AA at their size
  (zinc-900/white, zinc-600/zinc-50, white/zinc-900).

# ============================================================ 9. RESPONSIVENESS

Breakpoints used: sm (640), md (768), lg (1024).

- Product grids: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
- Category grids: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
- Hero: stacked below lg, two-column at lg
- Nav: mobile drawer below lg, inline nav at lg
- Search: icon-only below md, full input at md+

# ============================================================ 10. MOTION

- Duration: duration-300 for UI, duration-700 for image zoom.
- Easing: default; ease-out for image transforms.
- Never animate layout properties (width, height, top, left).
  Only transform and opacity.

# ============================================================ 11. PAGE STRUCTURE TEMPLATE

The site header is rendered ONCE in the root layout (app/layout.tsx),
so pages never include it. Auth pages get the shared AuthShell from
app/(auth)/layout.tsx. A normal page renders its own <main> content
plus the footer:

import { SiteFooter } from "@/components/SiteFooter";

export default function SomePage() {
return (
<>

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

# ============================================================ 12. DO / DON'T CHEAT SHEET

| DO                                     | DON'T                        |
| -------------------------------------- | ---------------------------- |
| Use zinc scale everywhere              | Mix gray / slate / neutral   |
| Add dark: for every color              | Ship light-only styles       |
| PascalCase.tsx components              | kebab-case.tsx components    |
| mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 | Custom container widths      |
| rounded-full for CTAs                  | rounded-md on big buttons    |
| lucide-react icons at size-4 / size-5  | Inline SVGs, mixed icon libs |
| next/image with sizes prop             | Raw <img>                    |
| transition on hover                    | No hover feedback            |
| Invert sections in dark mode           | Keep them dark in both       |
| Client components only when needed     | "use client" on every file   |

# ============================================================ 13. REFERENCE IMPLEMENTATION

Canonical reference: app/page.tsx plus:
components/SiteHeader.tsx (server, auth-aware)
components/SiteHeaderNav.tsx (client header markup)
components/UserMenu.tsx (signed-in account dropdown)
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
components/GoogleAuthButton.tsx
components/AuthDivider.tsx
lib/authSchema.ts
lib/actions/auth-actions.ts
lib/actions/user.actions.ts
stores/user.store.ts
proxy.ts (optimistic route guarding — see section 17)

Settings reference: app/settings/layout.tsx (shared shell + nav +
footer) plus
app/settings/page.tsx (Profile — read-only user data)
app/settings/edit/page.tsx (Edit profile — name / email / password)
app/settings/security/page.tsx (Security — two-factor authentication)
components/SettingsNav.tsx
components/ProfileView.tsx
components/ProfileForm.tsx
components/TwoFactorSettings.tsx (owns on/off state + store mirror)
components/TwoFactorSetupCard.tsx (off -> start, scan, verify)
components/TwoFactorStatusCard.tsx (on -> status + confirm-to-disable)
components/TwoFactorSetupKey.tsx (QR + manual setup key)
components/SettingsCard.tsx (shared card shell)
components/SecondaryButton.tsx (outline CTA)
components/SettingsCardSkeleton.tsx
The settings pages resolve the signed-in user with getCurrentUser()
inside a Suspense boundary (fallback = SettingsCardSkeleton) so the
shell stays static; the edit form validates against profileSchema and
persists through the updateUser server action (POST /user/me), and the
security page drives startTwoFactorSetup / verifyTwoFactor /
deleteTwoFactor (/auth/2fa-setup, /auth/2fa-verify, /auth/2fa-delete).

Dynamic route params (e.g. reset-password/[code]) are runtime data
under cacheComponents, so read them inside a Suspense boundary: keep
the page shell sync and await params in a child component.

A page that must run a backend call before it can render (e.g.
verify-email/[token]) instead opts out with `export const instant =
false` and calls the server action directly in the Server Component.

The site header is auth-aware without making the whole app dynamic:
components/SiteHeader.tsx is a Server Component that resolves the
signed-in user inside a Suspense boundary (fallback = the same header
with no user, showing a skeleton). It calls getCurrentUser()
(lib/actions/user.actions.ts, a GET /auth/me through the server api())
and passes the user to the client SiteHeaderNav / UserMenu. Signed in
shows an account dropdown (components/UserMenu.tsx) with a Sign out
form action (lib/actions/auth-actions.ts); signed out keeps the Sign
in / Sign up links. SiteHeaderNav mirrors the resolved user into the
persisted client store (stores/user.store.ts) — see section 16.

When in doubt, match one of these exactly rather than inventing
a new pattern.

# ============================================================ 14. RTL & LOGICAL PROPERTIES

The app ships a DirectionProvider and may run RTL in future. Write
every layout with logical properties so the direction can flip later
without a refactor — this applies even though the default is dir="ltr".

| DO                        | DON'T                              |
| ------------------------- | ---------------------------------- |
| ps-_ / pe-_ (padding)     | pl-_ / pr-_                        |
| ms-_ / me-_ (margin)      | ml-_ / mr-_                        |
| start-_ / end-_ (inset)   | left-_ / right-_                   |
| text-start / text-end     | text-left / text-right             |
| border-s-_ / border-e-_   | border-l-_ / border-r-_            |
| rounded-s-_ / rounded-e-_ | rounded-l-_ / rounded-r-_          |
| gap-\* / justify-between  | absolute left/right icon placement |

- Symmetric px-_ / py-_ are direction-neutral and fine to use.
- Directional icons (ArrowRight, ChevronRight, ArrowLeft) do NOT
  auto-flip in RTL. Swap them from direction or lean on gap-based
  layouts instead of hard-coded placement.
- Set direction once at the root: <DirectionProvider dir="rtl">.

# ============================================================ 15. SHADCN COMPONENTS

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
  across forms; share the primary CTA via AuthSubmitButton and the
  outline CTA via SecondaryButton.

# ============================================================ 16. STATE, DATA & SESSION

Two API layers, one per runtime:

- lib/api-server.ts — used by Server Components and server actions.
  Reads/writes cookies via next/headers, forwards auth Set-Cookie, and
  on 401 refreshes through POST /auth/refresh-token (forwarding the new
  cookie). Because it sets cookies it must run in a server action or
  route handler, never during a plain Server Component render.
- lib/api-client.ts — browser fetch helper (not yet imported anywhere;
  the server layer above is what the app currently uses). Keeps the
  access token in memory (setAccessToken / getAccessToken), sends
  credentials, and on 401 refreshes through POST /api/auth/refresh,
  queueing concurrent requests while the refresh is in flight.

Ambient response/user types live in types/index.d.ts (SuccessResponse,
User, AuthResponse). User mirrors the backend convertToPublicUser
payload: camelCase flags (isEmailVerified, twoFactorEnabled), an ISO
string created_at, and role: UserRole ("USER" | "ADMIN"). Keep the
field names in sync with that payload — not the old snake_case ones.

Client state uses zustand with the persist middleware
(stores/user.store.ts, localStorage key "userStore"). Select the
slices you need with useShallow to avoid re-render churn:

const { setUser } = useUserStore(
useShallow((state) => ({ setUser: state.setUser })),
);

Session flow:

1. login / createAccount (lib/actions/auth-actions.ts) forward the
   auth cookies and re-render. When the account has 2FA on, login()
   first fails with "Missing two factor code"; LoginForm reveals a
   6-digit field and resubmits with twoFactorCode (credentials are
   re-sent and re-validated alongside the code). Google sign-in is not
   challenged for 2FA.
2. SiteHeader (Server Component) calls getCurrentUser()
   (lib/actions/user.actions.ts) inside Suspense and hands the user to
   the client SiteHeaderNav.
3. SiteHeaderNav writes that user into the store in a useEffect;
   components on that pass render from the prop, and any other client
   component can read the store.
4. logout() clears the auth cookies and redirects; the next render
   resolves null and the effect writes null, clearing the persisted
   store.
   The server (the user resolved from /auth/me) is the source of truth;
   the store is a client mirror for convenience, never an auth check.

Google sign-in (OAuth): GOOGLE_REDIRECT_URI points at the client
(app/auth/google/callback), so the client owns both halves of the
handshake and the API origin is never a top-level navigation.

- app/auth/google/route.ts starts it: a server-side GET to the backend
  /auth/google, then forwards the backend's redirect (on to Google) and
  the oauth_state cookie onto this origin.
- app/auth/google/callback/route.ts receives Google's redirect, forwards
  code + state + the browser's cookies to /auth/google/callback, then
  mirrors the returned accessToken + refreshToken cookies onto this
  origin and redirects to /. Failures land on /login?error=google, which
  components/GoogleAuthButton.tsx surfaces as a toast.
  Gotcha: call response.cookies.set(...) BEFORE response.headers.append(
  "set-cookie", ...). Next re-serialises Set-Cookie when cookies.set runs
  and drops any Set-Cookie headers appended before it — so the accessToken
  must be set first, then the forwarded backend cookies appended.

# ============================================================ 17. ROUTING, PROXY & ACCOUNT AREA

proxy.ts (project root) is Next 16's renamed middleware (middleware.ts
is deprecated). It does OPTIMISTIC, cookie-only route guarding — never a
DB or API call, since it also runs on prefetches:

- authRoutes = ["/login", "/signup"] — signed-in visitors are redirected
  home ("/"). Add any future logged-out-only page here.
- protectedRoutes = ["/settings"] — signed-out visitors are redirected
  to /login?next=<path>. Add every future URL that needs a session here.

Both lists match by prefix, so a parent path also covers its children
(/settings covers /settings/edit). The protected redirect carries a
`next` param; LoginForm (components/LoginForm.tsx) reads it on success
and returns the visitor to where they were headed (same-origin paths
only). The server — getCurrentUser() over /auth/me — is still the real
gate; the proxy only avoids rendering the wrong page and wasted prefetch
churn.

Account area (/settings):

- app/settings/layout.tsx renders the shared shell: a "Settings" header,
  a grid (SettingsNav in the start column at lg, content beside it), and
  SiteFooter.
- app/settings/page.tsx -> components/ProfileView.tsx: read-only user
  data (avatar initials, name, email, role, member since) plus status
  pills (email verified / two-factor). Emerald is used only for the
  success dot.
- app/settings/edit/page.tsx -> components/ProfileForm.tsx: a
  react-hook-form + zod form (profileSchema in lib/authSchema.ts) built
  from AuthField / PasswordField, sharing the AuthSubmitButton CTA. It
  persists through updateUser (lib/actions/user.actions.ts), which POSTs
  to the backend user route (/user/me). It updates name, email and
  password: the current password is required (revealed in its own
  identity-confirmation box) only when the email or a new password is
  set, while the backend also rejects an email sent without one. On
  success it mirrors the returned user into the store, revalidates
  /settings, and toasts.
- app/settings/security/page.tsx -> components/TwoFactorSettings.tsx:
  two-factor authentication, owned by the thin TwoFactorSettings
  orchestrator (on/off state + user-store mirror). When off,
  TwoFactorSetupCard calls startTwoFactorSetup (POST /auth/2fa-setup),
  shows the returned otpauthURI as a QR with the base32 secret for manual
  entry (TwoFactorSetupKey, qrcode.react), then verifies the 6-digit code
  through verifyTwoFactor (POST /auth/2fa-verify). When on,
  TwoFactorStatusCard shows a status pill plus a confirm-to-disable form
  that collects the account password and a current code, then calls
  deleteTwoFactor (POST /auth/2fa-delete), which verifies both and clears
  the secret. All cards share SettingsCard / SecondaryButton, and action
  errors render through FieldError.
- Reachable from components/UserMenu.tsx (Settings item) and the mobile
  drawer user card in SiteHeaderNav, both client-side navigations.

When adding a settings subpage, drop a link into components/SettingsNav.tsx
(active route highlighted from usePathname) and, if it needs a session,
add its parent path to protectedRoutes above.
