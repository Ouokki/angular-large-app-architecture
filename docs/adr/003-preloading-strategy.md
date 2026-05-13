# ADR-003 — Connection-Aware Preloading Strategy

**Status:** Accepted  
**Date:** 2026-05-13

---

## Context

Angular ships two built-in preloading strategies:

- **`PreloadAllModules`** — preloads every lazy route after bootstrap. Simple but indiscriminate: it downloads all feature bundles on a 2G mobile connection even if the user never navigates there.
- **`NoPreloading`** — never preloads. Navigation triggers on-demand loading which adds a spinner on every first-visit route, even on fast connections where preloading would be invisible.

Neither is correct across the full user spectrum. The application must serve both a user on a fibre connection and a user on a congested 3G network.

---

## Decision

Implement a custom `ConnectionAwarePreloadingStrategy` that reads `navigator.connection` (the Network Information API) and adapts its behavior per connection tier.

### Behavior table

| Condition                      | Action                     | Why                                                               |
| ------------------------------ | -------------------------- | ----------------------------------------------------------------- |
| `saveData === true`            | Skip                       | User explicitly opted out of background data use                  |
| `effectiveType === 'slow-2g'`  | Skip                       | Network too slow to preload without harming foreground requests   |
| `effectiveType === '2g'`       | Skip                       | Same — every kilobyte competes with the visible page              |
| `effectiveType === '3g'`       | Delay 3 seconds, then load | Allow critical render path (LCP, TTI) to complete first           |
| `effectiveType === '4g'`       | Delay 1 second, then load  | Small idle delay avoids contending with initial page scripts      |
| `connection` undefined         | Delay 1 second, then load  | API not available (Safari, older browsers) — assume fast, be safe |
| `route.data.preload === false` | Skip                       | Per-route opt-out for routes that should never be preloaded       |

### Per-route opt-out

Routes that should never be preloaded (e.g. the Module Federation remote, large admin sections) set `data: { preload: false }` in their route config:

```typescript
{
  path: 'widgets',
  data: { preload: false },
  loadChildren: () => loadRemoteModule('remote-widgets', './Routes'),
}
```

---

## Consequences

- **Mobile users on 2G/3G** do not pay for preloading they did not ask for.
- **Desktop users on 4G** get navigation that feels instant — routes are preloaded 1 second after bootstrap.
- The 1-second idle delay means preloading never competes with LCP even on fast connections.
- `saveData` is honoured unconditionally — this is a user-level preference, not a performance hint.
- Graceful degradation: if `navigator.connection` is unavailable, the strategy falls back to the same 1-second delay as 4G. No feature detection required at the call site.
- The strategy is registered globally in `provideRouter(withPreloading(ConnectionAwarePreloadingStrategy))` so all feature routes benefit automatically.

---

## Alternatives Considered

### Predictive preloading (hover intent)

Preload a route only when the user hovers over its navigation link. Very precise but requires wiring up hover listeners to every nav element — significant complexity for marginal gain over the 1-second idle delay. Deferred to a future iteration.

### Service Worker precaching

A Service Worker can precache all route bundles during install. Orthogonal to this strategy — SW precaching solves offline access, not initial load performance. The two approaches are complementary and both can be enabled simultaneously.

### QuicklinkModule

The `ngx-quicklink` library preloads routes visible in the viewport. Interesting but adds a dependency and requires `RouterLinkWithHref` in every component. The connection-aware approach covers 80% of the value with no third-party dependency.

---

## Related

- [ADR-002](./002-signals-vs-ngrx.md) — state management decisions
- [ADR-005](./0005-module-federation.md) — why widgets uses `data: { preload: false }`
- [Performance docs](../performance.md) — measured impact on bundle load time
