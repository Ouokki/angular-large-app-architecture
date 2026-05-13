# CLAUDE.md — Finish `angular-large-app-architecture`

## GIT AUTHOR — MANDATORY, CHECK BEFORE EVERY COMMIT

```bash
git config user.name "Ouokki"
git config user.email "ouokki98@gmail.com"
```

Run this FIRST. Verify with `git log -1 --format='%an <%ae>'` after EVERY commit. If the author is wrong, immediately run:

```bash
git commit --amend --author="Ouokki" --no-edit
```

Never commit without verifying authorship. This is non-negotiable.

---

## CONTEXT

This is an existing Angular 18 + Nx 19 monorepo. The following is already built and working — DO NOT touch, refactor, rename, or restructure any of it:

- Nx 19 monorepo: `shell` (host) + `remote-widgets` (Module Federation remote)
- Libraries by scope (dashboard, settings, auth, shared) and type (feat, ui, data-access, util)
- Dashboard: metric cards, signal-based state, OnPush
- Settings: user settings form, theme switcher, localStorage persistence
- Auth: login guard, mock JWT, protected routes
- UI library: Button, Input, Table (CDK virtual scroll 10k rows), Modal, Badge
- Widget Catalog: signal filtering, Module Federation remote
- Storybook 8, Cypress 13 e2e (6 flows), ESLint ArchUnit rules
- TypeScript 5.5 strict, bundle budgets, GitHub Actions CI, Vercel config, Husky + lint-staged

## YOUR JOB

Add the missing features that turn this from a technical demo into a portfolio piece. Execute the commits below in exact order. After each commit:

1. Run `pnpm exec nx affected -t lint test build`
2. Fix any failure before committing
3. Commit with the exact message specified
4. Verify authorship: `git log -1 --format='%an <%ae>'`
5. Push: `git push origin main`

## QUALITY RULES

- No `any` types, no `// TODO`, no placeholder code
- Every new component/service has at least one test
- Every component uses `ChangeDetectionStrategy.OnPush`
- Use Angular 18 control flow (`@if`, `@for`, `@switch`) not `*ngIf`/`*ngFor`
- Use signal inputs (`input()`) not `@Input()` decorator
- Comments explain WHY, not WHAT

---

## COMMIT 1

**Run before anything else:**

```bash
git config user.name "Mohamed Ouokki"
git config user.email "mohamed.ouokki@gmail.com"
```

**Message:** `feat(data-access-settings): add NgRx store for settings with optimistic update`

Install NgRx if not present:

```bash
pnpm add @ngrx/store @ngrx/effects @ngrx/store-devtools
```

Create or update `libs/data-access-settings/` with the following NgRx implementation. If this library path doesn't exist, find the equivalent settings data-access library in the current workspace and work within it. Explore the repo structure first with `find . -type d -name '*settings*' | head -20` to locate the right directory.

### Files to create inside the settings data-access library:

**settings.model.ts**

- `UserSettings` interface with fields: `displayName` (string), `email` (string), `theme` ('light' | 'dark'), `language` (string), `timezone` (string), `notifications` ({ email: boolean, push: boolean, sms: boolean })
- `DEFAULT_SETTINGS` constant with sensible defaults

**settings.actions.ts**

- Use `createActionGroup` with source 'Settings'
- Actions: `loadSettings`, `loadSettingsSuccess` (props: settings), `loadSettingsFailure` (props: error), `saveSettings` (props: settings), `saveSettingsSuccess` (props: settings), `saveSettingsFailure` (props: previousSettings + error)

**settings.reducer.ts**

- State shape: `settings`, `previousSettings` (for rollback), `loading`, `saving`, `error`, `lastSaved`
- Key behavior on `saveSettings`: store current settings as `previousSettings`, apply new settings immediately (optimistic update)
- Key behavior on `saveSettingsFailure`: rollback `settings` to `previousSettings`, clear `previousSettings`
- Key behavior on `saveSettingsSuccess`: clear `previousSettings`, set `lastSaved` timestamp

**settings.selectors.ts**

- Selectors: `selectSettings`, `selectTheme`, `selectNotifications`, `selectLoading`, `selectSaving`, `selectError`, `selectLastSaved`

**settings.effects.ts**

- `loadSettings$`: reads from localStorage, dispatches success or failure
- `saveSettings$`: simulates 800ms network delay, writes to localStorage, dispatches success. On error dispatches failure with `previousSettings` for rollback
- Add a comment: "In production, replace localStorage with HttpClient. The data flow (action → reducer → effect → action) stays identical."

### Integration:

- Register `provideState` and `provideEffects` in the settings route providers
- Add `provideStore()` and `provideStoreDevtools({ maxAge: 25 })` to the app root providers if not already present
- Update the settings feature component to:
  - Inject `Store`
  - Use `toSignal(this.store.select(selectSettings))` to consume state as signals
  - Dispatch `loadSettings` on init
  - Dispatch `saveSettings` on form submit
  - Display saving indicator from `selectSaving`
  - Display error from `selectError`
  - Display "Saved" confirmation from `selectLastSaved`

### Tests:

- Reducer: test each `on()` handler (loadSettings sets loading, saveSettings stores previousSettings and applies optimistically, saveSettingsFailure rolls back)
- Effects: test loadSettings$ reads localStorage, test saveSettings$ writes localStorage and dispatches success
- Selectors: test selectSettings, selectTheme, selectSaving return correct slices
- Component: test that save dispatches the correct action, test loading/error states render

### Commit:

```bash
git add -A
git commit -m "feat(data-access-settings): add NgRx store for settings with optimistic update" -m "Migrates settings from direct localStorage to NgRx with full action/reducer/effect/selector cycle.

Optimistic update pattern: saveSettings immediately applies new state while
storing previous state for rollback. On failure, reducer reverts to previousSettings.

localStorage used as demo persistence layer — swap effects for HttpClient in production.
This feature contrasts with dashboard's signal-based state. See ADR-002."
git push origin main
git log -1 --format='%an <%ae>'
```

---

## COMMIT 2

**Message:** `docs: add ADR comparing signals vs NgRx using dashboard and settings as case studies`

Create `docs/adr/002-signals-vs-ngrx.md` with these sections:

- **Status**: Accepted
- **Context**: This codebase has two features with different state management. Dashboard uses signals. Settings uses NgRx. This was deliberate.
- **Use signals when**: state is local to a component tree, data flow is linear (fetch → display), no time-travel debugging needed, small team / single owner
- **Use NgRx when**: state is shared across features or persisted globally, optimistic updates with rollback needed, auditable state transitions needed, complex async coordination
- **Tradeoffs table**: compare boilerplate, debugging, testability, learning curve, async coordination, rollback, performance
- **Decision rubric**: 3 questions — (1) Does another feature need this state? (2) Is there undo/rollback? (3) Is state history inspection needed? If any yes → NgRx. All no → signals. ~80% of features should use signals.
- **Consequences**: new devs have two examples to study, both patterns coexist via OnPush + toSignal bridge

```bash
git add -A
git commit -m "docs: add ADR comparing signals vs NgRx using dashboard and settings as case studies"
git push origin main
git log -1 --format='%an <%ae>'
```

---

## COMMIT 3

**Message:** `feat(feat-dashboard): add loading skeletons, empty state, and error state with retry`

### Create skeleton components:

**SkeletonCardComponent** (standalone, OnPush):

- Matches exact dimensions of the existing metric/KPI card component
- CSS pulse animation: `background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-highlight) 50%, var(--skeleton-base) 75%)` with `background-size: 200% 100%` and `@keyframes shimmer`
- Use Tailwind classes where possible, add minimal custom CSS for the animation only

**SkeletonTableRowComponent** (standalone, OnPush):

- Matches table row layout with 5 rectangular placeholder blocks
- Same shimmer animation

### Update dashboard smart component:

Add a computed signal deriving state:

```typescript
readonly viewState = computed(() => {
  if (this.metricsService.isLoading()) return 'loading' as const;
  if (this.metricsService.error()) return 'error' as const;
  const data = this.metricsService.metrics();
  if (!data || data.length === 0) return 'empty' as const;
  return 'loaded' as const;
});
```

### Update dashboard template using `@switch`:

- `loading`: render 4 `<app-skeleton-card>` in the KPI grid + 8 `<app-skeleton-table-row>` below
- `error`: centered layout with warning icon (inline SVG), error message from service, "Try again" button calling `metricsService.reload()`
- `empty`: centered layout with empty-state icon, "No data available" message
- `loaded`: existing dashboard content unchanged

### Add `reload()` method to metrics service:

- Re-triggers the data fetch
- Resets error and loading signals

### Tests:

- SkeletonCardComponent renders without error
- SkeletonTableRowComponent renders without error
- Dashboard shows skeletons when isLoading is true
- Dashboard shows error state with retry button when error is set
- Dashboard shows empty state when metrics is empty array
- Clicking retry calls reload()

```bash
pnpm exec nx affected -t lint test build
git add -A
git commit -m "feat(feat-dashboard): add loading skeletons, empty state, and error state with retry" -m "Replaces loading spinner with skeleton placeholders matching KPI card and table row
dimensions to prevent layout shift. Three explicit view states (loading, error, empty)
derived from a single computed signal. Retry button re-triggers the data fetch."
git push origin main
git log -1 --format='%an <%ae>'
```

---

## COMMIT 4

**Message:** `feat(shell): add connection-aware preloading strategy`

### Create the strategy:

Place it where routing utilities live in the workspace. Find the right location:

```bash
find . -path '*/router*' -o -path '*/routing*' | grep -v node_modules | head -10
```

If no routing util lib exists, create the file in the shell app's routing folder.

**ConnectionAwarePreloadingStrategy** (Injectable, providedIn: root):

```typescript
preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
  // Routes with data.preload === false are never preloaded
  if (route.data?.['preload'] === false) return of(null);

  const conn = (navigator as any).connection;

  // Respect user's data-saving preference
  if (conn?.saveData) return of(null);

  // Don't preload on very slow connections
  if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') return of(null);

  // Delay preload to avoid competing with critical render path
  const delayMs = conn?.effectiveType === '3g' ? 3000 : 1000;
  return timer(delayMs).pipe(switchMap(() => load()));
}
```

Add a JSDoc comment block on the class explaining the rationale: why each connection type gets different treatment, why there's an idle delay, why `saveData` is respected.

### Register:

In the shell's route config, add `withPreloading(ConnectionAwarePreloadingStrategy)`.

### Tests:

- Returns `of(null)` when `saveData` is true
- Returns `of(null)` when effectiveType is `2g`
- Returns `of(null)` when effectiveType is `slow-2g`
- Calls `load()` after ~3s delay when effectiveType is `3g`
- Calls `load()` after ~1s delay when effectiveType is `4g`
- Calls `load()` after ~1s delay when `navigator.connection` is undefined (graceful fallback)
- Returns `of(null)` when route has `data: { preload: false }`

Mock `navigator.connection` in tests using Object.defineProperty or similar pattern.

```bash
pnpm exec nx affected -t lint test build
git add -A
git commit -m "feat(shell): add connection-aware preloading strategy" -m "Custom PreloadingStrategy adapting to navigator.connection. Skips preloading on
2G/slow-2G/saveData. Delays 3s on 3G, 1s on 4G/unknown. Routes opt out via
data: { preload: false }. Degrades gracefully when Network Information API unavailable."
git push origin main
git log -1 --format='%an <%ae>'
```

---

## COMMIT 5

**Message:** `docs: add ADR on connection-aware preloading strategy`

Create `docs/adr/003-preloading-strategy.md`:

- **Status**: Accepted
- **Context**: Angular's built-in PreloadAllModules wastes mobile data. NoPreloading makes navigation slow on fast connections.
- **Decision**: Custom strategy using Network Information API. Table showing behavior per connection type (slow-2g/2g → skip, 3g → 3s delay, 4g/unknown → 1s delay, saveData → skip).
- **Per-route opt-out**: `data: { preload: false }`
- **Consequences**: mobile users conserve data, desktop users get instant nav, graceful degradation when API unavailable
- **Alternatives considered**: predictive preloading (deferred), Service Worker precaching (orthogonal)

```bash
git add -A
git commit -m "docs: add ADR on connection-aware preloading strategy"
git push origin main
git log -1 --format='%an <%ae>'
```

---

## COMMIT 6

**Message:** `docs: add ADR on OnPush change detection discipline`

Create `docs/adr/004-onpush-everywhere.md`:

- **Status**: Accepted
- **Decision**: Every component uses OnPush, enforced by ESLint rule `@angular-eslint/prefer-on-push-component-change-detection: error`
- **Why no exceptions**: cost is near-zero with signals (automatic CD) and async pipe. Cost is only high with mutable state + imperative updates — which the architecture prevents.
- **Banned patterns**: `ChangeDetectorRef.markForCheck()` (fix data flow instead), `ChangeDetectorRef.detectChanges()` (bypasses strategy, causes bugs)
- **Personal lesson**: "I used to say 'OnPush where it matters.' After maintaining a 500k-LOC codebase with mixed strategies, I say 'OnPush everywhere, fix data flow if it breaks.' The inconsistency caused more bugs than performance gains justified."

```bash
git add -A
git commit -m "docs: add ADR on OnPush change detection discipline"
git push origin main
git log -1 --format='%an <%ae>'
```

---

## COMMIT 7

**Message:** `docs: add performance analysis with bundle breakdown`

1. Install source-map-explorer:

```bash
pnpm add -D source-map-explorer
```

2. Build with source maps:

```bash
pnpm exec nx build shell --configuration=production --source-map
```

3. Create `tools/analyze-bundle.sh`:

```bash
#!/bin/bash
set -euo pipefail
echo "Building shell with source maps..."
pnpm exec nx build shell --configuration=production --source-map
echo "Analyzing bundle..."
pnpm exec source-map-explorer dist/apps/shell/browser/main.*.js
```

Make executable: `chmod +x tools/analyze-bundle.sh`

4. Create `docs/performance.md` with:

- Bundle size table (main, dashboard chunk, settings chunk, remote widgets) — fill with actual sizes from the build output, or mark `[from build output]` if build can't run in this environment
- Budget enforcement rules (350kb initial warning, 500kb error)
- Optimizations documented: lazy loading, OnPush, virtual scrolling (10k rows → ~20 DOM nodes), connection-aware preloading, tree shaking (no barrel re-exports, direct imports)
- "How to reproduce" section with the shell build + source-map-explorer commands

```bash
git add -A
git commit -m "docs: add performance analysis with bundle breakdown" -m "Real production build metrics. Includes bundle analysis script in tools/
and performance documentation covering all optimization strategies."
git push origin main
git log -1 --format='%an <%ae>'
```

---

## COMMIT 8

**Message:** `docs: overhaul README with architecture diagram and portfolio links`

1. Generate dependency graph:

```bash
pnpm exec nx graph --file=docs/dep-graph.html 2>/dev/null || echo "Graph generation requires browser — add screenshot manually"
```

2. Replace `README.md` entirely with a portfolio-grade version. Structure:

```
# angular-large-app-architecture

> One-line: reference Angular 18 + Nx 19 monorepo — patterns for 100k+ LOC codebases

Badges: Angular 18, Nx 19, CI status, License MIT

Links: Live Demo | Storybook | Architecture Docs

---

## Why this exists
Personal paragraph about Angular at scale vs tutorials.
"I've spent years on Angular apps in 24/7 production. This repo isolates the patterns
that survived — the ones I'd use again knowing the codebase will grow into a monster."

## What's inside

### Architecture
- Nx monorepo with enforced module boundaries (scope + type tags)
- Standalone components only, zero NgModules in feature code
- ESLint ArchUnit-style rules preventing architecture erosion

### State Management — Two Approaches, Documented
- Dashboard uses Angular signals for local, linear state
- Settings uses NgRx for shared, rollback-capable state
- ADR-002 documents when to use which, with a 3-question decision rubric

### Performance
- OnPush on every component, enforced by ESLint (ADR-004)
- Virtual scroll: 10,000 rows, ~20 DOM nodes
- Connection-aware preloading: skips on 2G/saveData (ADR-003)
- Bundle budgets: 350kb initial warning, 500kb error

### Module Federation
- Shell + remote-widgets as separate Webpack 5 builds
- Dynamic manifest-based remote loading
- Error boundary: graceful fallback if remote is unavailable
- ADR-005 explains why Module Federation over alternatives

### Testing
- Jest + Spectator for component/service tests
- Cypress e2e for 6 critical user flows
- Storybook 8 for UI library visual documentation
- ESLint enforces architecture rules at lint time

## Quick Start

Three commands:
git clone, pnpm install, then two terminals (nx serve remote-widgets + nx serve shell)

## Architecture Decisions

Table linking all ADRs:
001 - Module Boundaries
002 - Signals vs NgRx
003 - Preloading Strategy
004 - OnPush Everywhere
005 - Module Federation

## What I Learned Building This

4 personal lessons (keep the tone from the previously drafted README):
1. NgModules were a tax, not a feature
2. Signals don't replace NgRx — they solve different problems
3. OnPush everywhere costs nothing when your data flow is clean
4. Module Federation is for organizational boundaries, not technical ones

## Roadmap
- [ ] SSR with Angular Universal
- [ ] i18n (FR + EN + AR with RTL)
- [ ] Predictive preloading via hover intent
- [ ] PWA configuration

## Contributing
See CONTRIBUTING.md

## License
MIT

---

## About me

I'm Ouokki, Tech Lead Java/Angular with 5+ years on critical apps in banking,
payments, and aviation. I lead frontend architecture on a major airline
modernization project.

Available for Angular freelance missions — architecture audits, performance
refactors, team coaching, hands-on Tech Lead roles. Through portage salarial.

→ Profil Malt: https://www.malt.fr/profile/[your-slug]
→ LinkedIn: https://www.linkedin.com/in/[your-handle]
→ Blog: https://[your-handle].hashnode.dev
```

Replace all `[placeholders]` with actual values. If you don't know the actual Malt/LinkedIn/blog URLs, leave them as-is — the user will fill them in.

```bash
git add -A
git commit -m "docs: overhaul README with architecture diagram and portfolio links" -m "Complete README rewrite for portfolio presentation. Architecture overview,
ADR index, quick start, personal lessons, and Malt/LinkedIn links for
inbound freelance inquiries."
git push origin main
git log -1 --format='%an <%ae>'
```

---

## COMMIT 9

**Message:** `docs: add CONTRIBUTING.md, CODE_OF_CONDUCT.md, and LICENSE`

### CONTRIBUTING.md:

- Prerequisites: Node 20, pnpm 9+
- Setup: git clone, pnpm install
- Local dev: two terminals (remote-widgets + shell), URLs
- Running checks: `nx affected -t lint`, `nx affected -t test`, `nx affected -t build`, `nx e2e shell-e2e`
- Commit format: Conventional Commits, enforced by commitlint
- PR guidelines: one feature per PR, tests required, docs required, all checks pass
- Architecture rules: before adding a library, read `docs/architecture.md` and respect module boundary tags

### CODE_OF_CONDUCT.md:

- Standard Contributor Covenant v2.1

### LICENSE:

- MIT license, copyright 2026 Mohamed Ouokki

```bash
git add -A
git commit -m "docs: add CONTRIBUTING.md, CODE_OF_CONDUCT.md, and LICENSE"
git push origin main
git log -1 --format='%an <%ae>'
```

---

## COMMIT 10

**Message:** `chore: tag v0.1.0 release`

```bash
git tag -a v0.1.0 -m "v0.1.0 — Angular at scale reference architecture

Features:
- Nx 19 monorepo with strict module boundaries
- Angular 18 standalone components, signals, OnPush everywhere
- NgRx for settings with optimistic update + rollback
- Module Federation (shell + remote-widgets)
- CDK virtual scroll (10k rows)
- Connection-aware preloading strategy
- Storybook 8, Cypress e2e, ESLint ArchUnit rules
- GitHub Actions CI, Vercel deployment
- 5 Architecture Decision Records"
git push origin v0.1.0
gh release create v0.1.0 --generate-notes --title "v0.1.0 — Angular at scale reference architecture"
```

If `gh` is not authenticated, skip the `gh release create` and tell me to run it manually.

---

## FINAL VERIFICATION

After all 10 commits, run this checklist:

```bash
# All commits authored correctly
git log --oneline --format='%h %an — %s' -10

# Everything builds
pnpm exec nx run-many -t lint test build

# ADRs exist
ls docs/adr/

# README has the About me section
grep -c "Malt" README.md

# Tag exists
git tag -l 'v0.1.0'
```

Report the output of each command. If any check fails, fix it before declaring done.
