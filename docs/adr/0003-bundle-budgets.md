# ADR 0003: Bundle Size Budgets and Performance Configuration

**Status:** Accepted  
**Date:** 2025-05-12  
**Deciders:** Platform team

---

## Context

Without explicit bundle budgets, the Angular build silently grows over time. Lazy-loaded routes
help by splitting features into separate chunks, but the shell's initial bundle can still balloon
if shared code is imported carelessly.

---

## Decision

### Bundle budgets (shell app, production configuration)

| Type                | Warning | Error  |
| ------------------- | ------- | ------ |
| `initial`           | 350 KB  | 600 KB |
| `anyComponentStyle` | 4 KB    | 8 KB   |
| `lazy`              | 150 KB  | 300 KB |

Rationale for the `initial` threshold:

- Zone.js (~40 KB gzipped) + Angular core (~50 KB) + router (~20 KB) + NgRx (~30 KB)
  ≈ 140 KB baseline. 350 KB warning leaves ~210 KB for app shell code.
- 600 KB error prevents accidental fat imports (e.g., lodash, moment) in the shell.

### Optimizer flags

Production builds enable:

```json
"optimization": {
  "scripts": true,
  "styles": { "minify": true, "inlineCritical": true },
  "fonts": true
}
```

`inlineCritical: true` instructs the build to inline above-the-fold CSS into `<style>` tags,
eliminating a render-blocking stylesheet request.

### OnPush enforcement

All components must use `ChangeDetectionStrategy.OnPush` (enforced via ESLint — see ADR 0002).
OnPush reduces re-render surface area, which improves runtime performance proportionally to
component count.

---

## Consequences

- CI fails if any lazy chunk exceeds 300 KB — keeps feature teams accountable.
- The dashboard feature chunk contains the 10k-row virtual-scroll table; CDK scrolling adds
  ~15 KB, which is within the lazy budget.
- If the initial budget is exceeded, the investigation checklist is:
  1. Check for shared imports that should be lazy
  2. Check for CommonModule (replace with standalone pipes/directives)
  3. Check for unintentional tree-shaking failures (barrel re-exports)
