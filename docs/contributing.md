# Contributing

## Prerequisites

- Node 20 (via `.nvmrc`) — `nvm use 20` or `fnm use 20`
- pnpm 9+ — `corepack enable && corepack prepare pnpm@9 --activate`

## Setup

```bash
pnpm install
```

## Running the app

```bash
pnpm exec nx serve shell            # shell app at http://localhost:4200
pnpm exec nx serve remote-widgets   # remote app at http://localhost:4201
```

## Code quality

Pre-commit hooks run automatically via Husky:

- **lint-staged** — runs ESLint + Prettier on staged files
- **commitlint** — validates commit message format

### Commit message format

This repo uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body — required for commits touching > 50 lines]
```

**Types:** `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `ci`, `build`, `style`, `perf`

**Scopes:** match Nx library names — `shell`, `ui-button`, `ui-input`, `ui-table`,
`ui-modal`, `feat-dashboard`, `feat-settings`, `data-access-metrics`, `data-access-settings`,
`remote-widgets`, `workspace`, `ci`, `deps`

## Testing

```bash
pnpm exec nx run-many -t test          # all unit tests
pnpm exec nx affected -t test         # only affected tests
pnpm exec nx run shell-e2e:e2e        # Cypress e2e
```

## Nx generators

See [docs/generators.md](generators.md) for custom workspace generators.

## Module boundaries

See [docs/architecture.md](architecture.md) for the tag system and allowed imports.

## ADRs

Architecture Decision Records live in `docs/adr/`. Read them before making
architectural changes.
