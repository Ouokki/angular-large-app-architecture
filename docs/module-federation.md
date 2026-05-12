# Module Federation

## Overview

This workspace uses Webpack 5 Module Federation (via `@nx/angular:webpack-browser`) to allow the shell to load the `remote-widgets` application at runtime without a shell rebuild.

## Architecture

```
shell (host)  →  runtime fetch: module-federation.manifest.json
                     └─ "remote-widgets": "http://localhost:4201"
                              ↓
               remote-widgets (webpack remote, port 4201)
                     exposes: ./Routes, ./WidgetCatalog
```

## How it works

1. The shell's `main.ts` fetches `/module-federation.manifest.json` before bootstrapping.
2. `setRemoteDefinitions(definitions)` registers the URL for each remote name.
3. Any `loadRemoteModule('remote-widgets', './Routes')` call at routing time resolves the module from the live remote at the registered URL.
4. Webpack negotiates shared dependencies at runtime: Angular, RxJS, and Zone.js are marked as **singletons** — the host's version wins.

## Version negotiation

| Package         | Strategy    | strictVersion |
| --------------- | ----------- | ------------- |
| `@angular/core` | `singleton` | `false`       |
| `rxjs`          | `singleton` | `false`       |
| `zone.js`       | `singleton` | `false`       |

`strictVersion: false` means a version mismatch prints a console warning rather than throwing. If the remote requires an API that the host version doesn't provide, the error will surface at runtime when the API is called — not at load time.

**Safe operating range:** Keep all remotes within the same Angular major version as the shell. Minor-version differences (e.g., 18.1 vs 18.2) are fine.

## Adding a new remote

```bash
# Generate the remote app and wire it to the shell
pnpm exec nx g @nx/angular:remote <name> --host=shell --port=<port>

# Register the remote URL in the shell's manifest
# apps/shell/public/module-federation.manifest.json
{
  "remote-widgets": "http://localhost:4201",
  "<name>": "http://localhost:<port>"
}
```

Expose components or routes from `apps/<name>/module-federation.config.ts`:

```ts
exposes: {
  './Routes': 'apps/<name>/src/app/remote-entry/entry.routes.ts',
},
```

## Local development workflow

```bash
# Terminal 1 — remote
pnpm exec nx serve remote-widgets

# Terminal 2 — shell (waits for remote to be ready)
pnpm exec nx serve shell
```

The `module-federation-dev-server` executor automatically discovers and serves configured remotes.

## Production deployment

Update `apps/shell/public/module-federation.manifest.json` to point to the production URL of each remote before the shell build:

```json
{
  "remote-widgets": "https://remote-widgets.your-domain.com"
}
```

The shell bundle does not embed the remote URL — no shell rebuild needed when a remote is redeployed.
