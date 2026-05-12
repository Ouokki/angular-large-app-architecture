const nx = require('@nx/eslint-plugin');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/node_modules', '**/.nx'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            // ── Type layer rules ──────────────────────────────────────
            {
              sourceTag: 'type:feat',
              onlyDependOnLibsWithTags: ['type:feat', 'type:ui', 'type:data-access', 'type:util'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:util'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            // ── Scope isolation rules ─────────────────────────────────
            // Each feature scope can only import from itself or shared.
            {
              sourceTag: 'scope:dashboard',
              onlyDependOnLibsWithTags: ['scope:dashboard', 'scope:shared', 'scope:shell'],
            },
            {
              sourceTag: 'scope:settings',
              onlyDependOnLibsWithTags: ['scope:settings', 'scope:shared', 'scope:shell'],
            },
            {
              sourceTag: 'scope:auth',
              onlyDependOnLibsWithTags: ['scope:auth', 'scope:shared', 'scope:shell'],
            },
            // shared can only import from shared (no circular feature deps)
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            // shell (the composition root) can import from anywhere
            {
              sourceTag: 'scope:shell',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },

  // ── ArchUnit-style layer rules ────────────────────────────────────────────
  //
  // These rules enforce the same constraints as @nx/enforce-module-boundaries
  // but at the *import statement* level, catching patterns that the tag-based
  // boundary check cannot see (e.g. direct Angular API use that leaks HTTP or
  // store coupling into the wrong layer).

  // Rule 1 — Feature components must not call HttpClient directly.
  // All HTTP must go through a data-access service so the feature layer stays
  // testable without needing HttpTestingController.
  // Spec files are excluded: tests are allowed to call provideHttpClient()
  // in TestBed.configureTestingModule to satisfy DI during integration tests.
  {
    files: ['libs/**/feat-*/**/*.ts'],
    ignores: ['**/*.spec.ts', '**/*.stories.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@angular/common/http',
              message:
                'Feature libraries must not use HttpClient directly. ' +
                'Wrap the HTTP call in a data-access service and inject it here.',
            },
          ],
        },
      ],
    },
  },

  // Rule 2 — UI components must not couple to NgRx.
  // Presentational components receive data through inputs; they must not
  // subscribe to the store. Pass data from the smart component instead.
  {
    files: ['libs/**/ui-*/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@ngrx/store',
              message:
                'UI libraries must not import from @ngrx/store. ' +
                'Keep UI components purely presentational — pass data via signal inputs.',
            },
            {
              name: '@ngrx/effects',
              message: 'UI libraries must not import from @ngrx/effects.',
            },
            {
              name: '@ngrx/entity',
              message: 'UI libraries must not import from @ngrx/entity.',
            },
          ],
        },
      ],
    },
  },

  // Rule 3 — Data-access libraries must not import from feature libraries.
  // Reinforces the data-access → feature dependency arrow (not the reverse).
  // Note: @nx/enforce-module-boundaries catches cross-tag violations at the
  // project level; this rule adds per-file granularity as a second line of
  // defence.
  {
    files: ['libs/**/data-access-*/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/feat-*'],
              message:
                'Data-access libraries must not import from feature libraries. ' +
                'The dependency must flow data-access → feature, never the reverse.',
            },
          ],
        },
      ],
    },
  },
];
