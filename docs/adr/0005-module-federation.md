# ADR 0005: Module Federation Strategy

**Status:** Accepted  
**Date:** 2025-05-12  
**Deciders:** Platform team

---

## Context

As the application grows and more teams contribute features, independent deployment of feature slices becomes desirable. Module Federation (MF) allows the shell to load remote applications at runtime without rebuilding the host.

Two main options were considered:

1. **Nx-native webpack Module Federation** — Nx provides `@nx/angular:webpack-browser` + `@nx/angular:module-federation-dev-server`, with first-class generator support. Uses webpack 5's built-in MF plugin.
2. **`@angular-architects/native-federation`** — a newer approach that layers MF semantics on top of browser-native ESM without webpack. Works with Angular CLI's esbuild executor but has fewer production miles than option 1.

---

## Decision

Use **Nx webpack-based Module Federation** (`@nx/angular:webpack-browser`) for the following reasons:

- Nx 19 ships battle-tested generators (`@nx/angular:host`, `@nx/angular:remote`, `@nx/angular:setup-mf`) that handle the boilerplate correctly.
- Webpack 5's MF plugin has four years of production usage; native-federation is still maturing.
- The shell is the only app that needs the webpack executor; the rest of the monorepo keeps esbuild builds unaffected.
- Nx handles shared-dependency version negotiation automatically via `withModuleFederation()`.

### Architecture

```
shell (host)          ← webpack-browser, port 4200
└── remote-widgets    ← webpack-browser, port 4201
```

The shell fetches `/module-federation.manifest.json` at runtime (dynamic federation), which maps remote names to base URLs. This decouples the deploy URL from the shell build — no shell rebuild needed when a remote moves.

### Exposed contracts from `remote-widgets`

| Exposed key       | Module                        | Purpose                                    |
| ----------------- | ----------------------------- | ------------------------------------------ |
| `./Routes`        | `entry.routes.ts`             | Angular router routes for the widget shell |
| `./WidgetCatalog` | `widget-catalog.component.ts` | Standalone component for direct embedding  |

### Shared dependency strategy

`withModuleFederation()` automatically marks Angular packages, RxJS, and Zone.js as singletons with `strictVersion: false`. This means:

- A version mismatch raises a warning, not a hard failure.
- Both host and remote use the **host's** version of these packages (single instance enforced).

**Version mismatch failure mode:** If a remote ships an Angular version that is incompatible (e.g., 18 vs 16), the remote will silently use the host's version. Components that depend on APIs introduced in 18 but absent in 16 will throw at runtime. Mitigation: pin `@angular/core` across all remotes in the same range via Nx's `@nx/enforce-module-boundaries` or a workspace-level constraint.

---

## Consequences

- The shell's build executor changed from `@angular-devkit/build-angular:application` (esbuild) to `@nx/angular:webpack-browser`. This has no user-visible effect but increases shell build time (~2× slower than esbuild for cold builds, mitigated by Nx cache).
- The existing esbuild-based libraries (`libs/`) are unaffected; they continue to use `ng-packagr`.
- Adding a new remote: run `pnpm exec nx g @nx/angular:remote <name> --host=shell`, implement the feature, expose via `module-federation.config.ts`.
- CI must start both `shell` and `remote-widgets` when running e2e tests against the integrated flow.

---

## Local development

```bash
# Terminal 1 — start the remote on port 4201
pnpm exec nx serve remote-widgets

# Terminal 2 — start the shell (auto-discovers remote via manifest)
pnpm exec nx serve shell
```

The shell's dev server proxies `/module-federation.manifest.json` which already maps `remote-widgets` to `http://localhost:4201`.
