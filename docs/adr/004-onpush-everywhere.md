# ADR-004 — OnPush Change Detection Everywhere

**Status:** Accepted  
**Date:** 2026-05-13

---

## Decision

Every component in this codebase uses `ChangeDetectionStrategy.OnPush`. No exceptions.

This is enforced at lint time by the ESLint rule:

```json
"@angular-eslint/prefer-on-push-component-change-detection": "error"
```

If a component is committed without `OnPush`, the CI lint step fails.

---

## Why No Exceptions

The cost argument against OnPush — "it's harder to use with mutable state" — disappears when data flow is correct. With Angular 18 signals and the `async` pipe, Angular's change detection mechanism tracks dependencies automatically. The only time OnPush "breaks" is when you mutate objects instead of replacing them. The fix is to fix the data flow, not to loosen the change detection strategy.

Cost of `OnPush` with clean data flow: **near zero**.  
Cost of inconsistent strategies in a large codebase: **significant**.

A component tree where some nodes are `Default` and others are `OnPush` is harder to reason about than one where every node is `OnPush`. The cognitive overhead of remembering which components need manual notification is larger than the one-time cost of writing correct data flow.

---

## Banned Patterns

### `ChangeDetectorRef.markForCheck()`

```typescript
// ✗ Don't do this
constructor(private cd: ChangeDetectorRef) {}

updateValue(v: string) {
  this.value = v;
  this.cd.markForCheck(); // This is a symptom, not a fix
}
```

If you find yourself calling `markForCheck()`, the real fix is to make `value` a signal or to pass it through `@Input()` with immutable replacement. `markForCheck()` hides broken data flow.

### `ChangeDetectorRef.detectChanges()`

```typescript
// ✗ Don't do this
this.cd.detectChanges();
```

`detectChanges()` bypasses the change detection strategy entirely. It re-checks the component regardless of whether inputs changed. It causes double-rendering bugs and is almost never the correct solution. The one legitimate use case (third-party DOM-manipulating libraries) should be isolated behind an adapter component.

---

## Personal Lesson

> "I used to say 'OnPush where it matters.' After maintaining a 500k-LOC codebase with mixed strategies, I say 'OnPush everywhere, fix data flow if it breaks.' The inconsistency caused more bugs than performance gains justified."

The performance case for `Default` over `OnPush` is often overstated. Angular's zone.js already batches change detection runs. The real performance gains come from correct data flow (signals, immutability) and proper use of `trackBy`/`track` in list rendering — not from the strategy choice itself.

`OnPush` everywhere forces you to write clean data flow. That discipline compounds. Six months after adopting it, you stop thinking about it.

---

## How It Works With Signals

Angular 18 signals are inherently compatible with `OnPush`. A signal read inside a template creates a dependency: when the signal changes, Angular schedules a re-check of that component. No zone, no `markForCheck`, no subscription management.

```typescript
// This works perfectly with OnPush
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ count() }}</p>`,
})
export class CounterComponent {
  count = signal(0);
  increment() {
    this.count.update((n) => n + 1);
  }
}
```

The `toSignal()` bridge applies the same principle to NgRx selectors:

```typescript
// toSignal converts an Observable to a signal — OnPush sees the dependency
readonly saving = toSignal(this.store.select(selectSaving), { initialValue: false });
```

---

## Consequences

- Components are safe to render in any context — they only re-render when their inputs or signals change.
- Testing is simpler: you control state explicitly via signals or store, no surprise re-renders.
- New developers must learn correct data flow before they can ship. This is a feature.
- If a future team member introduces a `Default` component, CI will fail immediately.

---

## Related

- [ADR-002](./002-signals-vs-ngrx.md) — signals and NgRx both work without friction under OnPush
- [Architecture tests](../architecture-tests.md) — ESLint rules preventing `@ngrx/store` in UI libs
