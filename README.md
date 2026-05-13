# angular-large-app-architecture

> Reference Angular 18 + Nx 19 monorepo — battle-tested patterns for 100k+ LOC codebases

[![Angular](https://img.shields.io/badge/Angular-18-dd0031?logo=angular)](https://angular.dev)
[![Nx](https://img.shields.io/badge/Nx-19-143055?logo=nx)](https://nx.dev)
[![CI](https://github.com/Ouokki/angular-large-app-architecture/actions/workflows/ci.yml/badge.svg)](https://github.com/Ouokki/angular-large-app-architecture/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**[Architecture Docs](./docs/)**

---

## Why this exists

Most Angular tutorials stop at `ng new`. This repo starts where they stop.

I've spent years shipping Angular apps in 24/7 production — banking, payments, aviation. The patterns that survived aren't the ones in the official docs. They're the ones we discovered after the codebase grew past 100k lines and we had to onboard five developers in two weeks, debug a change detection bug at 2 AM, and refactor a shared module without breaking three apps.

This repo isolates those patterns. Every decision is documented in an ADR. Every constraint is enforced by a lint rule. The codebase is small enough to read in a day but structured the way a real production monorepo would be.

If you're building Angular at scale — or learning to — this is the reference I wish I'd had.

---

## What's inside

### Architecture

- **Nx 19 monorepo** with enforced module boundaries (scope + type tags)
- **Standalone components only** — zero NgModules in feature code
- **ESLint ArchUnit-style rules** that prevent architecture erosion at lint time:
  - No `HttpClient` in feature libraries
  - No NgRx in UI libraries
  - No feature imports in data-access libraries

### State Management — Two Approaches, Documented

This repo deliberately uses **two different state management patterns**:

| Feature   | Approach                    | Why                                       |
| --------- | --------------------------- | ----------------------------------------- |
| Dashboard | Angular signals             | Local state, linear data flow, no sharing |
| Settings  | NgRx with optimistic update | Global state, rollback-capable, auditable |

[ADR-002](./docs/adr/002-signals-vs-ngrx.md) documents a 3-question rubric for choosing between them. About 80% of features should use signals.

### Performance

- **OnPush on every component**, enforced by ESLint ([ADR-004](./docs/adr/004-onpush-everywhere.md))
- **Virtual scroll**: 10,000 activity rows, ~20 DOM nodes in the viewport
- **Connection-aware preloading**: skips on 2G/saveData, delays 3s on 3G ([ADR-003](./docs/adr/003-preloading-strategy.md))
- **Bundle budgets**: 350 kB initial warning · 600 kB error
- See [docs/performance.md](./docs/performance.md) for measured numbers

### Module Federation

- Shell + remote-widgets as **separate Webpack 5 builds**
- **Dynamic manifest-based** remote registration — no hard-coded URLs in webpack config
- **Error boundary**: shell falls back gracefully if the remote is unavailable
- [ADR-005](./docs/adr/0005-module-federation.md) explains the tradeoffs

### Testing

- **Jest + Spectator** for component and service unit tests
- **Cypress 13** e2e for 6 critical user flows, including remote failure simulation
- **Storybook 8** for UI library visual documentation
- **ESLint** enforces architecture rules at lint time — no separate test runner needed

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Ouokki/angular-large-app-architecture.git
cd angular-large-app-architecture

# 2. Install
pnpm install

# 3. Start the local stack
pnpm exec nx serve shell
```

Open [http://localhost:4200](http://localhost:4200). Login with any non-empty username and password (mock auth).

---

## Architecture Decisions

| ADR                                          | Title                                       | Status   |
| -------------------------------------------- | ------------------------------------------- | -------- |
| [001](./docs/adr/001-module-boundaries.md)   | Nx module boundaries with scope + type tags | Accepted |
| [002](./docs/adr/002-signals-vs-ngrx.md)     | Signals vs NgRx — when to use which         | Accepted |
| [003](./docs/adr/003-preloading-strategy.md) | Connection-aware preloading strategy        | Accepted |
| [004](./docs/adr/004-onpush-everywhere.md)   | OnPush change detection everywhere          | Accepted |
| [005](./docs/adr/0005-module-federation.md)  | Module Federation for remote delivery       | Accepted |

---

## What I Learned Building This

**NgModules were a tax, not a feature.** Every NgModule I ever wrote was a wrapper around a list of components and a list of imports. Standalone components do the same thing with zero ceremony. I don't miss them.

**Signals don't replace NgRx — they solve different problems.** I used to reach for NgRx reflexively. Now I ask three questions first: Is this state shared? Does it need rollback? Do I need time-travel debugging? If all three answers are no, signals are simpler and just as correct.

**OnPush everywhere costs nothing when your data flow is clean.** The first time I turned on OnPush globally, it broke six components. Each one had the same root cause: mutable state being modified instead of replaced. Fixing the data flow took two days. The component tree has been free of change detection bugs since.

**Module Federation is for organizational boundaries, not technical ones.** It's not about code splitting — lazy loading handles that. It's about shipping independently and having different teams own different remotes. If you're one team with one release, you probably don't need it.

---

## Roadmap

- [ ] SSR with Angular Universal (server-side rendering for SEO)
- [ ] i18n (French, English, Arabic with RTL layout)
- [ ] Predictive preloading via hover intent
- [ ] PWA configuration with Service Worker precaching
- [ ] Lighthouse CI budget enforcement in GitHub Actions

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT — see [LICENSE](./LICENSE).

---

## About me

I'm **Ouokki**, Tech Lead Java/Angular with 5+ years shipping critical applications in banking, payments, and aviation. I currently lead frontend architecture on a major airline modernisation project.

Available for Angular freelance missions — architecture audits, performance refactors, team coaching, hands-on Tech Lead roles. Through portage salarial.

→ **GitHub**: [github.com/Ouokki](https://github.com/Ouokki)  
→ **Malt**: coming soon  
→ **LinkedIn**: coming soon
