# Performance Analysis

This document covers bundle sizes, optimization techniques, and how to reproduce the analysis locally.

All measurements are from a production build of the `shell` application (`pnpm exec nx build shell --configuration=production`).

---

## Bundle Sizes (Production)

> Build hash: `ac1870e9e8250189` — 2026-05-13

| Chunk               | File                            | Raw size            | Gzipped |
| ------------------- | ------------------------------- | ------------------- | ------- |
| Initial (all)       | —                               | **368 kB**          | 71 kB   |
| Main bundle         | `main.6f44c0731fca3cd6.js`      | 117 kB              | 25 kB   |
| Polyfills           | `polyfills.655695e8ac8ba0b3.js` | 149 kB              | 35 kB   |
| Dashboard lazy      | `8816.d157393087d1f387.js`      | 85 kB               | —       |
| Settings lazy       | `5820.b6f8056e414ff431.js`      | 80 kB               | —       |
| Angular Material    | `common.f718fb2b65bf1c84.js`    | 68 kB               | —       |
| Remote widgets (MF) | Separate Webpack build          | Built independently | —       |

> **Budget**: initial 350 kB warning / 600 kB error · lazy 150 kB warning / 300 kB error  
> The initial bundle slightly exceeds the 350 kB warning due to Angular Material inclusion in the main chunk. This is expected for a reference app that demos the full Material component palette.

---

## Optimizations Applied

### 1. Lazy Loading

Every feature route (dashboard, settings, widgets) uses `loadComponent` / `loadChildren`. The router only downloads a feature's bundle when the user navigates to that route for the first time.

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('@angular-large-app/dashboard/feat-dashboard').then(m => m.DashboardPageComponent),
}
```

**Impact**: the main bundle stays below 120 kB regardless of how many features the monorepo contains.

### 2. OnPush Change Detection Everywhere

Every component uses `ChangeDetectionStrategy.OnPush`, enforced by ESLint (see [ADR-004](./adr/004-onpush-everywhere.md)). Angular skips subtrees where inputs haven't changed, reducing the work per change-detection cycle proportionally to the component tree depth.

**Impact**: CPU time per user interaction stays flat as the component tree grows.

### 3. Virtual Scrolling (CDK)

The activity log table renders 10,000 rows. Without virtual scrolling, this would create 10,000 DOM nodes. With `@angular/cdk/scrolling`, only ~20 rows exist in the DOM at any moment.

```
10,000 rows × ~4 DOM nodes per row = 40,000 nodes (without)
~20 rows × ~4 DOM nodes per row = 80 nodes (with virtual scroll)
```

**Impact**: 500× reduction in DOM node count. Initial paint and scroll performance are unaffected by table size.

### 4. Connection-Aware Preloading

The `ConnectionAwarePreloadingStrategy` (see [ADR-003](./adr/003-preloading-strategy.md)) preloads lazy routes only when the connection supports it:

- 2G / saveData: no preloading
- 3G: 3-second idle delay
- 4G / unknown: 1-second idle delay

**Impact**: mobile users on metered connections download only what they navigate to.

### 5. Tree Shaking (No Barrel Re-exports)

Libraries export their public API from `src/index.ts` using direct file paths, not barrel files that re-export everything. This gives Webpack's tree shaker full visibility into which exports are used.

```typescript
// ✓ Direct export — tree-shakeable
export { ButtonComponent } from './lib/button/button.component';

// ✗ Barrel that re-exports a namespace — defeats tree shaking in some bundlers
export * from './lib/everything';
```

**Impact**: unused components and services are stripped from the production bundle.

---

## Budget Enforcement

Budgets are configured in `apps/shell/project.json` under the `production` configuration:

| Budget type         | Warning | Error  |
| ------------------- | ------- | ------ |
| `initial`           | 350 kB  | 600 kB |
| `anyComponentStyle` | 4 kB    | 8 kB   |
| `lazy`              | 150 kB  | 300 kB |

If a bundle exceeds the error budget, `nx build shell --configuration=production` exits with a non-zero code, blocking CI.

---

## How to Reproduce

### Full bundle analysis

```bash
# 1. Build with source maps
pnpm exec nx build shell --configuration=production --source-map

# 2. Analyse main bundle
pnpm exec source-map-explorer dist/apps/shell/main.*.js

# Or run the convenience script
bash tools/analyze-bundle.sh
```

### Check initial bundle size

```bash
pnpm exec nx build shell --configuration=production 2>&1 | grep "Initial total"
```

### Check all budgets

Budget violations appear as warnings/errors in the build output:

```
Warning: bundle initial exceeded maximum budget. Budget 358.40 kB was not met...
```

---

## Roadmap

- [ ] Split Angular Material into per-component imports to reduce initial bundle
- [ ] Implement Service Worker precaching for offline navigation
- [ ] Add Lighthouse CI budget checks to the GitHub Actions workflow
