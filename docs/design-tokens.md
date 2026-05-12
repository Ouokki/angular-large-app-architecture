# Design Tokens

All visual constants are defined as CSS custom properties in
[`apps/shell/src/theme.css`](../apps/shell/src/theme.css).
Tailwind's `tailwind.config.js` references these variables — it never
redefines hardcoded values.

## Why CSS variables instead of Tailwind config values?

1. **Runtime theming** — switching from light to dark requires only toggling a
   `data-theme` attribute on `<html>`. No class manipulation, no re-render.
2. **SSR-safe** — CSS variables work correctly during server-side rendering
   without JavaScript hydration.
3. **Single source of truth** — non-Tailwind code (plain CSS, canvas elements,
   D3 charts) reads the same tokens.

## Dark mode

Dark mode is activated via `data-theme="dark"` on the `<html>` element:

```typescript
document.documentElement.setAttribute('data-theme', 'dark');
```

The Tailwind config uses `darkMode: ['attribute', 'data-theme']` to match.

## Token categories

| Category      | CSS prefix             | Example                    |
| ------------- | ---------------------- | -------------------------- |
| Primary color | `--color-primary-*`    | `var(--color-primary-600)` |
| Neutral color | `--color-neutral-*`    | `var(--color-neutral-100)` |
| Danger        | `--color-danger-*`     | `var(--color-danger-500)`  |
| Success       | `--color-success-*`    | `var(--color-success-500)` |
| Semantic bg   | `--color-bg*`          | `var(--color-bg-surface)`  |
| Semantic text | `--color-text*`        | `var(--color-text-muted)`  |
| Border        | `--color-border*`      | `var(--color-border)`      |
| Typography    | `--font-*`, `--text-*` | `var(--font-sans)`         |
| Radii         | `--radius-*`           | `var(--radius-md)`         |
| Shadows       | `--shadow-*`           | `var(--shadow-lg)`         |
| Spacing       | `--space-*`            | `var(--space-4)`           |

## Usage in components

```scss
// In component SCSS
.card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

```html
<!-- In templates via Tailwind utilities -->
<div class="bg-primary-600 text-white rounded-lg shadow-md px-4 py-2">Button</div>
```
