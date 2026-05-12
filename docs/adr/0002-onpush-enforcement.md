# ADR 0002: OnPush Change Detection Enforcement

**Status:** Accepted  
**Date:** 2025-05-12  
**Deciders:** Platform team

---

## Context

Angular's default change detection (`CheckAlways`) triggers on every browser event and
macro-task, regardless of whether component inputs changed. In a large monorepo with hundreds of
components, this causes unnecessary re-renders and degraded frame rates under load.

---

## Decision

All Angular components in this monorepo **must** use `ChangeDetectionStrategy.OnPush`.

This is enforced at the linter level via:

```js
'@angular-eslint/prefer-on-push-component-change-detection': 'error'
```

Applied in every library's `eslint.config.js` and in the root `eslint.config.js`.

### Implications

- Components must derive view state from `input()` signals, `async` pipe, or `signal()`/
  `computed()` — not mutable class properties.
- Services that manage state must use `signal()` or expose `Observable`s so OnPush components
  can subscribe via `async` pipe or `toSignal()`.
- `MarkForCheck()` is allowed only in ControlValueAccessors or manual DOM-event listeners where
  the change originates outside Angular's change-detection zone.

---

## Consequences

- All 8 UI components and all 4 page components verified OnPush at commit time.
- CI lint step fails fast if a new component omits OnPush — zero runtime cost for enforcement.
- Slight increase in initial learning curve for contributors unfamiliar with OnPush semantics.
