# Architecture — Module Boundaries

This workspace uses Nx's `@nx/enforce-module-boundaries` ESLint rule to enforce
layered architecture at compile time. Violations are CI failures, not code-review
comments.

## Tag taxonomy

Every library in `libs/` and every app in `apps/` carries two tags in its
`project.json`:

| Axis     | Values                                             |
| -------- | -------------------------------------------------- |
| `scope:` | `shell`, `dashboard`, `settings`, `auth`, `shared` |
| `type:`  | `feat`, `ui`, `data-access`, `util`                |

### Type definitions

| Type          | Purpose                                                       | Can import                  |
| ------------- | ------------------------------------------------------------- | --------------------------- |
| `feat`        | Smart components, pages, routing                              | `ui`, `data-access`, `util` |
| `ui`          | Dumb/presentational components, no business logic             | `ui`, `util`                |
| `data-access` | Services, stores, HTTP calls, state management                | `util`                      |
| `util`        | Pure functions, pipes, constants — no Angular or RxJS imports | `util`                      |

### Scope constraints

- A library with `scope:dashboard` cannot import from `scope:settings` and vice
  versa — features are isolated.
- `scope:shared` libraries can be imported by any scope.
- Apps (`scope:shell`) can import from any scope.

## Why this matters

Without enforced boundaries, any component in any feature eventually imports
any service from any other feature. By the time you notice the coupling it is
woven through 200 files. The ESLint rule makes the boundary structural — a
compiler error, not a guideline.

See [ADR 001](adr/001-module-boundaries.md) for the full decision record.
