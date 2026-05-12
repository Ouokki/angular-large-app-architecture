# angular-large-app-architecture

A reference Angular 18 + Nx 19 monorepo demonstrating enterprise-scale architecture patterns.

[![CI](https://github.com/Ouokki/angular-large-app-architecture/actions/workflows/ci.yml/badge.svg)](https://github.com/Ouokki/angular-large-app-architecture/actions/workflows/ci.yml)

---

## Architecture Overview

```text
apps/
  shell/                  # Host application (routing, layouts, providers)

libs/
  shared/
    ui-button/            # Accessible button: variants, sizes, loading state
    ui-input/             # ControlValueAccessor input with reactive forms
    ui-table/             # CDK virtual-scroll table (10k+ rows), sorting, filtering
    ui-modal/             # CDK dialog modal with focus trap & escape handling

  dashboard/
    data-access-metrics/  # Signals-based MetricsService (transient state)
    feat-dashboard/       # Dashboard page: metric cards + 10k-row activity table

  settings/
    data-access-settings/ # NgRx store: actions, reducer, selectors, effects
    feat-settings/        # Settings page with reactive forms bound to NgRx

tools/
  generators/             # Custom Nx generators: lib-feat, lib-ui, lib-data-access

docs/
  adr/                    # Architecture Decision Records
```

### Key Technology Decisions

| Concern          | Choice                           | Rationale                                      |
| ---------------- | -------------------------------- | ---------------------------------------------- |
| Monorepo         | Nx 19                            | Module boundaries, affected builds, generators |
| Package manager  | pnpm 10                          | Disk efficiency, strict hoisting               |
| Angular version  | 18                               | Signals, `@if`/`@for` control flow, standalone |
| Change detection | OnPush (enforced via ESLint)     | Performance at scale                           |
| Transient state  | Angular Signals                  | Zero boilerplate, native CD integration        |
| Persisted state  | NgRx 18                          | DevTools, effects, localStorage hydration      |
| Styling          | Tailwind CSS 3.4 + CSS variables | Design tokens, dark mode via `data-theme`      |
| Testing          | Jest 29 + @ngneat/spectator@17   | Fast, ergonomic component tests                |
| Linting          | ESLint 9 flat config             | Module boundary + OnPush enforcement           |
| Pre-commit       | Husky 9 + lint-staged 17         | Lint/format staged files before commit         |

---

## Prerequisites

- Node.js 20+
- pnpm 10+

## Getting Started

```bash
# Install dependencies
pnpm install

# Serve the shell app (development)
pnpm exec nx serve shell

# Run all unit tests
pnpm exec nx run-many -t test --parallel=3

# Lint all projects
pnpm exec nx run-many -t lint --parallel=3

# Build shell for production
pnpm exec nx build shell --configuration=production
```

## Module Boundary Rules

Library tags enforce a strict dependency graph:

```text
Scope rules:
  scope:shell     → scope:dashboard, scope:settings, scope:shared
  scope:dashboard → scope:shared  (NOT scope:settings)
  scope:settings  → scope:shared  (NOT scope:dashboard)
  scope:shared    → scope:shared  (NOT any feature scope)

Type rules:
  type:feat         → type:ui, type:data-access, type:util
  type:ui           → type:ui, type:util
  type:data-access  → type:util
  type:util         → type:util  (no upward dependencies)
```

Boundaries are enforced at lint time via `@nx/eslint-plugin` module boundary rules in `eslint.config.js`.

## Custom Generators

```bash
# New feature library
pnpm exec nx g workspace:lib-feat --name=my-feature --scope=dashboard

# New UI library
pnpm exec nx g workspace:lib-ui --name=my-widget --scope=shared

# New data-access library (--withNgrx scaffolds NgRx boilerplate)
pnpm exec nx g workspace:lib-data-access --name=my-store --scope=settings --withNgrx
```

## Architecture Decision Records

| ADR                                         | Title                                   |
| ------------------------------------------- | --------------------------------------- |
| [0001](docs/adr/0001-signals-vs-ngrx.md)    | Signals vs NgRx state strategy          |
| [0002](docs/adr/0002-onpush-enforcement.md) | OnPush change detection mandate         |
| [0003](docs/adr/0003-bundle-budgets.md)     | Bundle size budgets and optimizer flags |

## Performance Configuration

- **OnPush everywhere** — enforced via `@angular-eslint/prefer-on-push-component-change-detection: error`
- **CDK Virtual Scroll** — `ui-table` renders only visible rows; tested with 10 000 rows
- **Lazy routes** — all feature pages loaded on demand via `loadComponent()`
- **Selective preloading** — `SelectivePreloadStrategy` preloads on fast connections only
- **Bundle budgets** — initial 350 KB warn / 600 KB error; lazy 150 KB warn / 300 KB error
- **Optimizer flags** — `inlineCritical: true` for faster FCP in production

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
