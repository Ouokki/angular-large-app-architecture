# Contributing

Thank you for your interest in contributing to this project.

---

## Prerequisites

- **Node.js** 20+
- **pnpm** 9+ (`npm install -g pnpm`)
- **Git** 2.40+

---

## Setup

```bash
git clone https://github.com/Ouokki/angular-large-app-architecture.git
cd angular-large-app-architecture
pnpm install
```

---

## Local Development

This project uses Webpack Module Federation. The shell serve target starts both
the host and the remote widget app:

```bash
pnpm exec nx serve shell
```

Open [http://localhost:4200](http://localhost:4200). Login with any non-empty username and password (mock auth).

---

## Running Checks

Before opening a pull request, ensure all checks pass:

```bash
# Lint all affected projects
pnpm exec nx affected -t lint

# Unit tests for all affected projects
pnpm exec nx affected -t test

# Production builds for all affected projects
pnpm exec nx affected -t build

# E2E tests (requires shell + remote-widgets running)
pnpm exec nx e2e shell-e2e
```

To run everything at once:

```bash
pnpm exec nx run-many -t lint test build --parallel=4
```

---

## Commit Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint.

```
<type>(<scope>): <description>

[optional body]
```

**Types**: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`

**Scopes**: match the Nx project name (e.g. `feat-dashboard`, `data-access-settings`, `shell`, `workspace`)

**Examples**:

```
feat(feat-dashboard): add loading skeleton components
fix(data-access-settings): handle localStorage parse error gracefully
docs: add ADR for preloading strategy decision
```

---

## Pull Request Guidelines

- **One feature per PR** — keep changes focused and reviewable
- **Tests required** — every new component and service needs at least one test
- **Docs required** — if you add a new architectural pattern or make a significant decision, add an ADR in `docs/adr/`
- **All checks must pass** — lint, test, and build must all succeed
- **No `any` types** — TypeScript strict mode is enforced

---

## Architecture Rules

Before adding a new library, read [docs/architecture-tests.md](./docs/architecture-tests.md) and respect the module boundary tags:

| Tag                | Allowed to import                                       |
| ------------------ | ------------------------------------------------------- |
| `type:feat`        | `type:feat`, `type:ui`, `type:data-access`, `type:util` |
| `type:ui`          | `type:ui`, `type:util`                                  |
| `type:data-access` | `type:data-access`, `type:util`                         |
| `type:util`        | `type:util`                                             |

Cross-scope: each feature scope (`dashboard`, `settings`) can only import from itself or `shared`.

Violations are caught at lint time by `@nx/enforce-module-boundaries`.

---

## Project Structure

```
apps/
  shell/                    # Host application (Module Federation host)
  remote-widgets/           # Remote application (Module Federation remote)
libs/
  dashboard/
    feat-dashboard/         # Smart dashboard component
    data-access-metrics/    # MetricsService (signal-based)
  settings/
    feat-settings/          # Settings page component
    data-access-settings/   # NgRx store (optimistic update)
  shared/
    ui-button/              # Button component
    ui-input/               # Input component
    ui-table/               # Virtual-scroll table (10k rows)
    ui-modal/               # Modal component
docs/
  adr/                      # Architecture Decision Records
tools/                      # Build and analysis scripts
```
