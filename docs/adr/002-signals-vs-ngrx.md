# ADR-002 — Signals vs NgRx: Two State Patterns, Documented

**Status:** Accepted  
**Date:** 2026-05-13

---

## Context

This codebase deliberately uses **two different state management approaches** across its features:

- **Dashboard** — Angular signals (`signal()`, `computed()`) inside a service
- **Settings** — NgRx store with actions, reducer, effects, and selectors

This was not inconsistency. It was a deliberate choice to keep both patterns alive in the same codebase, each where it belongs. The goal: any developer reading this repo can see both patterns in a realistic context and develop an intuition for when to reach for which.

---

## The Two Approaches

### Signals (used in Dashboard)

Angular 18's reactive primitive. A signal is a value you read and write; computed signals derive from other signals; effects react to signal changes.

```typescript
// In MetricsService
private readonly _state = signal<MetricsState>({ cards: [], loading: false, error: null });
readonly cards = computed(() => this._state().cards);
readonly loading = computed(() => this._state().loading);
```

The component consumes these as plain signals — no subscriptions, no `| async`, no store injection.

### NgRx (used in Settings)

A unidirectional data flow framework: components dispatch actions, reducers produce new state, effects handle side effects, selectors project state.

```typescript
// Component dispatches, never mutates
this.store.dispatch(saveSettings({ settings: this.form.getRawValue() }));

// Component reads via toSignal — same ergonomics as signals at the call site
readonly saving = toSignal(this.store.select(selectSaving), { initialValue: false });
```

The `toSignal()` bridge means components look nearly identical whether they use signals or NgRx — the architectural difference lives in the store layer, not in templates.

---

## When to Use Signals

| Criterion                             | Answer |
| ------------------------------------- | ------ |
| State is local to one component tree  | ✅ Yes |
| Data flow is linear (fetch → display) | ✅ Yes |
| No undo / rollback needed             | ✅ Yes |
| No other feature shares this state    | ✅ Yes |
| Team size: 1–3 people own this module | ✅ Yes |

**If all five answers are "yes", use signals.** The dashboard fits perfectly: one service owns the data, components only read it, no other feature needs it.

---

## When to Use NgRx

| Criterion                                                       | Answer  |
| --------------------------------------------------------------- | ------- |
| Multiple features or routes share this state                    | ✅ NgRx |
| Optimistic updates with rollback required                       | ✅ NgRx |
| State transitions must be auditable (DevTools)                  | ✅ NgRx |
| Complex async coordination (e.g. race conditions, cancellation) | ✅ NgRx |
| State survives navigation (global persistence)                  | ✅ NgRx |

**Settings fits all five.** Settings are global, the save flow needs optimistic rollback, and DevTools time-travel helps debug the 800ms simulated save.

---

## Tradeoff Comparison

| Dimension           | Signals                                     | NgRx                                                              |
| ------------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| Boilerplate         | Minimal                                     | Significant (actions, reducer, effects, selectors)                |
| Debugging           | `console.log`, DevTools signals view        | Redux DevTools — full time-travel, action replay                  |
| Testability         | Unit-test the service directly              | Each piece tested in isolation; more predictable                  |
| Learning curve      | Low — feels like reactive variables         | High — requires understanding flux pattern                        |
| Async coordination  | Manual (`switchMap` in effects, `toSignal`) | First-class via `createEffect`, `ofType`                          |
| Optimistic rollback | Manual implementation                       | Natural: optimistic update in reducer, rollback on failure action |
| Performance         | Excellent (fine-grained reactivity)         | Good (selectors memoize, OnPush prevents re-renders)              |

---

## Decision Rubric (3 Questions)

Before adding state management to a new feature, answer these three questions:

1. **Does another feature need this state?**
2. **Is there undo/rollback or optimistic updates?**
3. **Do you need to inspect state history during debugging?**

**If any answer is yes → NgRx.**  
**If all answers are no → signals.**

In practice, about 80% of features in a well-designed monorepo should use signals. NgRx is for the 20% where shared state, rollback, or auditability are real requirements — not where it "might be useful someday."

---

## Consequences

- New developers have two reference implementations to study side-by-side.
- The `toSignal()` bridge means components look identical at the template level regardless of which approach backs them.
- Mixing approaches within a single feature is forbidden by the ESLint ArchUnit rules (no `@ngrx/store` in `ui-*` libraries).
- The ADR will be updated if a third pattern (e.g. TanStack Query for server state) is introduced.

---

## Related

- [ADR-001](./001-module-boundaries.md) — Nx module boundary enforcement
- [ADR-004](./004-onpush-everywhere.md) — OnPush discipline that makes both patterns safe
