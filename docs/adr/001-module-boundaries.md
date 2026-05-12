# ADR 001 — Enforced Module Boundaries via Nx ESLint Rule

**Status:** Accepted  
**Date:** 2025-05

## Context

Angular applications at scale suffer from a predictable failure mode: initially
clean feature boundaries erode under deadline pressure. A developer adds a quick
import from another feature's service "just this once." A year later every
feature depends on every other feature and the codebase is a distributed monolith
with none of the benefits of either a monolith or microservices.

We have eight planned feature areas (dashboard, settings, auth, reports, etc.)
across a team that will eventually grow to multiple squads. We need a mechanism
that makes violating boundaries a compile/lint error rather than a code-review
comment.

## Decision

We use Nx's `@nx/enforce-module-boundaries` ESLint rule with the following
constraints:

**Type constraints (layer rules):**

```
feat      → can import: ui, data-access, util
ui        → can import: ui, util
data-access → can import: util
util      → can import: util only
```

**Scope constraints (feature isolation):**

```
scope:dashboard  → cannot import scope:settings, scope:auth, scope:reports
scope:settings   → cannot import scope:dashboard, scope:auth, scope:reports
scope:auth       → cannot import scope:dashboard, scope:settings
scope:shared     → can be imported by any scope (no imports of feature scopes)
scope:shell      → can import any scope (the composition root)
```

## Consequences

**Positive:**

- Circular dependencies are caught in CI, not production.
- New team members get immediate feedback when they violate the architecture.
- Nx's dependency graph reflects the actual architecture, not an aspirational one.
- Refactoring a feature in isolation is possible because its `data-access` and
  `ui` libs have no hidden dependencies on other features.

**Negative:**

- Adding a new cross-cutting concern requires an explicit decision: does this
  become a `scope:shared` utility, or does each feature own its copy?
- The initial scaffolding cost is higher — every new library needs correct tags.
  Custom generators (ADR 006) amortize this cost.

## Considered alternatives

**Documented conventions only:** Tried and failed on multiple previous projects.
The architectural intent disappears within six months of the first "just this
once" violation.

**Domain-based apps (separate Angular apps per feature):** Module Federation
(ADR 005) addresses this for runtime isolation where needed. For development-time
isolation, Nx libraries with enforced boundaries give us the same guarantees
without the operational complexity of separate deployment pipelines per feature.
