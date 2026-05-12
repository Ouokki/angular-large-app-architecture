# Custom Nx Generators

This workspace ships three generators that enforce the tag/folder conventions
defined in [architecture.md](architecture.md). Run generators instead of
creating library files by hand.

## `lib-feat` — Feature library

Scaffolds a smart-component library with the correct `type:feat` + `scope:*`
tags.

```bash
pnpm exec nx g ./tools/generators/lib-feat/index#default \
  --name=reports \
  --scope=dashboard
# Creates libs/dashboard/feat-reports with tags: scope:dashboard, type:feat
```

## `lib-ui` — UI component library

Scaffolds a presentational component library (no business logic).

```bash
pnpm exec nx g ./tools/generators/lib-ui/index#default \
  --name=badge \
  --scope=shared
# Creates libs/shared/ui-badge with tags: scope:shared, type:ui
```

## `lib-data-access` — Data-access library

Scaffolds a service/store library. Pass `--withNgrx` to include an NgRx
feature store scaffold (actions, reducer, selectors, effects).

```bash
# Signals-based service (default)
pnpm exec nx g ./tools/generators/lib-data-access/index#default \
  --name=reports \
  --scope=dashboard

# NgRx store scaffold
pnpm exec nx g ./tools/generators/lib-data-access/index#default \
  --name=user-preferences \
  --scope=settings \
  --withNgrx
```

## What each generator does

1. Calls `@nx/angular:library` with the correct preset options (standalone,
   OnPush, SCSS, Jest).
2. Sets `tags` in `project.json` to `["scope:<scope>", "type:<type>"]`.
3. Generates additional scaffolding files (smart component shell, service stub,
   or NgRx store files depending on the generator).

## Why use generators instead of `nx g @nx/angular:library` directly?

Running the Angular library generator directly requires remembering the correct
tag format, naming convention, and option flags. Missing a tag means the module
boundary ESLint rule won't protect that library — silently. The custom generators
make the correct path the easy path.
