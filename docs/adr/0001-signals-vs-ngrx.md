# ADR 0001: Signals vs NgRx for State Management

**Status:** Accepted  
**Date:** 2025-05-12  
**Deciders:** Platform team

---

## Context

Angular 18 introduces first-class signals (`signal()`, `computed()`, `effect()`), offering a
built-in reactive primitive without external dependencies. The existing NgRx ecosystem remains
the most mature Angular state-management library. We need a consistent rule for which tool to
reach for in which context.

---

## Decision

| Criterion            | Use Signals                             | Use NgRx                                    |
| -------------------- | --------------------------------------- | ------------------------------------------- |
| **Scope**            | Component-local or single-library state | Cross-feature / global app state            |
| **Persistence**      | Transient (lives with the component)    | Persisted (localStorage, SSR hydration)     |
| **Developer tools**  | Angular DevTools signals panel          | Redux DevTools + time-travel                |
| **Side-effects**     | Simple `effect()` with `untracked`      | Complex async flows (`createEffect` + RxJS) |
| **Testing**          | Direct signal mutation in specs         | MockStore / hot-observable marble tests     |
| **Team familiarity** | Lower barrier — no boilerplate          | Higher ceremony — actions/reducer/selectors |

### Rules applied in this repo

1. **`libs/dashboard/*`** — Signals. Metrics data is dashboard-scoped, transient, and
   computed-derivation-heavy. `MetricsService` owns a single `signal<MetricsState>` and exposes
   `computed()` slices. No DevTools needed for this volatile data.

2. **`libs/settings/*`** — NgRx. User preferences are persisted to `localStorage`, need
   rehydration across sessions, and benefit from DevTools inspection and effects for async I/O.
   The boilerplate cost is amortised by the persistence and testability gains.

3. **`apps/shell`** — Minimal state; Router signals (`@angular/router` `NavigationEnd`) only.

---

## Alternatives Considered

### Signals everywhere

**Pro:** No external dependency; zero-boilerplate; native change detection integration.  
**Con:** No DevTools support for time-travel; complex async side-effects require `effect()` +
`untracked()` which loses declarative RxJS flow; localStorage serialisation is manual.

### NgRx everywhere

**Pro:** Consistent pattern; excellent DevTools; `createEffect` handles any async shape.  
**Con:** Excessive ceremony for widget state; signal APIs not used; team must learn more syntax.

### Akita / NGXS / RxAngular

Rejected: smaller ecosystems, less alignment with Angular team's official signal roadmap.

---

## Consequences

- Dashboard feature tests use `signal()` manipulation directly — simpler setup.
- Settings tests use `MockStore` from `@ngrx/store/testing` — richer action assertion.
- A `noSignalInNgrxLibrary` ESLint rule (ADR 0002) enforces that NgRx `data-access-*` libs
  do not mix signal state with store slices.
- When Angular 18's `signalState()` API stabilises (expected Angular 19), revisit whether
  NgRx can be replaced in settings without losing persistence/DevTools capabilities.
