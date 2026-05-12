# Contributing

## Development workflow

1. Create a feature branch from `develop`
2. Make changes — all new libraries must use the custom generators (see README)
3. Run `pnpm exec nx affected -t lint,test` before pushing
4. Open a PR targeting `develop`
5. CI must pass (lint + test + build)

## Commit message format

This repo uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

Allowed types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `ci`, `chore`

Allowed scopes (see `commitlint.config.js` for full list):
`shell`, `ui-button`, `ui-input`, `ui-table`, `ui-modal`, `feat-dashboard`,
`feat-settings`, `data-access-metrics`, `data-access-settings`, `workspace`, `ci`, `deps`

## Code standards

- **OnPush** on every component (enforced by ESLint)
- **Standalone** components and pipes only — no `NgModule`
- **Signal inputs** (`input()`) not `@Input()` decorator
- **Signal outputs** (`output()`) not `@Output()` decorator
- **Strict TypeScript** — no `any`, no unused locals/params

## Adding a new library

```bash
# Feature library
pnpm exec nx g workspace:lib-feat --name=<name> --scope=<scope>

# UI component library
pnpm exec nx g workspace:lib-ui --name=<name> --scope=shared

# Data-access library
pnpm exec nx g workspace:lib-data-access --name=<name> --scope=<scope>
```

After generating, add the path alias to `tsconfig.base.json`.

## Architecture decisions

Document significant decisions in `docs/adr/` following the existing ADR format.
