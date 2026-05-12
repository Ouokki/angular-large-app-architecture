# Storybook & Visual Regression

## Overview

Storybook 8 is configured for all four shared UI libraries. Stories document every variant and state of each component and serve as the source of truth for visual regression testing.

| Library     | Stories file                                        |
| ----------- | --------------------------------------------------- |
| `ui-button` | `libs/shared/ui-button/src/lib/button/*.stories.ts` |
| `ui-input`  | `libs/shared/ui-input/src/lib/input/*.stories.ts`   |
| `ui-table`  | `libs/shared/ui-table/src/lib/table/*.stories.ts`   |
| `ui-modal`  | `libs/shared/ui-modal/src/lib/modal/*.stories.ts`   |

## Local development

```bash
# Run Storybook for a specific library
pnpm exec nx run shared-ui-button:storybook

# Build static Storybook for all UI libraries
pnpm exec nx run-many -t build-storybook --projects=shared-ui-button,shared-ui-input,shared-ui-table,shared-ui-modal

# Run Storybook test-runner (accessibility + interaction tests)
pnpm exec nx run-many -t test-storybook --projects=shared-ui-button,shared-ui-input,shared-ui-table,shared-ui-modal
```

## Wiring to Chromatic (visual regression CI step)

Chromatic is the recommended tool for visual regression in Storybook projects. To enable it:

**1. Install the Chromatic CLI:**

```bash
pnpm add -D chromatic
```

**2. Add your project token to CI secrets:**

In GitHub → Settings → Secrets → Actions, add `CHROMATIC_PROJECT_TOKEN`.

**3. Add a Chromatic step to `.github/workflows/ci.yml`:**

```yaml
- name: Publish to Chromatic
  run: pnpm exec chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}
  env:
    CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

**4. Review visual diffs in the Chromatic UI** before merging PRs.

Chromatic takes a screenshot of every story on every PR. If pixels change, it blocks the merge until a reviewer approves the visual diff. This catches unintended style regressions that unit tests miss.

## Story conventions

- Every public variant, size, and state of a component must have a story.
- Interaction tests (`@storybook/addon-interactions`) should cover:
  - Keyboard navigation (focus, Enter, Escape)
  - State transitions (loading → success, error → recovery)
- Stories **must not** import from feature libraries — UI components are self-contained.
