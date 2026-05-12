# Architecture Tests

This repository enforces layered architecture constraints at lint time using
two mechanisms: **Nx module boundaries** (project-level) and
**ArchUnit-style ESLint rules** (file-level). Both run in the standard
`nx affected -t lint` CI step — no separate test runner needed.

## Layer model

```
apps/           — composition roots (shell, remote-widgets)
libs/
  scope:shared  type:ui           — presentational, no services, no store
  scope:*       type:data-access  — HTTP, NgRx store, persistence
  scope:*       type:feat         — smart components, route config
  scope:*       type:util         — pure functions, pipes, constants
```

**Allowed dependency arrows:**

```
feat   → ui, data-access, util
ui     → ui, util
data-access → util
util   → (nothing)
```

Cross-scope: each feature scope (`dashboard`, `settings`) can only import
from itself or `shared`. The shell app (composition root) can import from
anywhere.

## Nx module boundary rule

Configured in the root `eslint.config.js` under `@nx/enforce-module-boundaries`.
Violations are detected at project import time:

```
import { DashboardService } from '@angular-large-app/dashboard/data-access-metrics';
//                              ↑ tag check: source vs target tags are compatible
```

If a `type:ui` library tries to import from a `type:data-access` library,
ESLint errors immediately on the import path.

## ArchUnit-style rules (file-level)

Three additional rules complement the tag checks.

### Rule 1 — No `HttpClient` in feature libraries

**File pattern:** `libs/**/feat-*/**/*.ts` (excluding spec and stories files)

```
// ✗ Forbidden in feat libraries
import { HttpClient } from '@angular/common/http';
```

**Why:** Feature components that call `HttpClient` directly bypass the
data-access layer, making tests harder (you'd need `HttpTestingController`
in feature component tests) and breaking the single-responsibility split.
Instead, inject a data-access service and let it own the HTTP boundary.

### Rule 2 — No NgRx in UI libraries

**File pattern:** `libs/**/ui-*/**/*.ts`

```
// ✗ Forbidden in UI libraries
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
```

**Why:** Presentational (UI) components must be stateless and portable.
Coupling them to the global NgRx store makes them untestable without a
full store setup and impossible to reuse in a different application. Pass
state via Angular 18 signal inputs (`input()`) instead.

### Rule 3 — Data-access libraries must not import from feature libraries

**File pattern:** `libs/**/data-access-*/**/*.ts`

```
// ✗ Forbidden in data-access libraries
import { DashboardPageComponent } from '../feat-dashboard';
```

**Why:** The data layer must be independent of the presentation layer.
Importing feature components from data-access creates a circular
dependency. The data flow is always: data-access provides → feat consumes.

## Verifying the rules locally

Run lint across the whole monorepo:

```bash
pnpm exec nx run-many -t lint --parallel=4
```

To intentionally trigger a rule and verify it fires:

```bash
# Add this to any file in libs/dashboard/feat-dashboard/src/
import { HttpClient } from '@angular/common/http';

# Then run:
pnpm exec nx run dashboard-feat-dashboard:lint
# → error: Feature libraries must not use HttpClient directly...
```

## What these rules do not cover

- **Runtime coupling** (e.g. shared `localStorage` keys across scopes) —
  code review and naming conventions handle this.
- **Bundle-level circular imports** — Nx dep-graph detects these.
- **API contract compatibility between remotes** — Type-check passes but
  runtime version mismatches are only caught by e2e tests.
