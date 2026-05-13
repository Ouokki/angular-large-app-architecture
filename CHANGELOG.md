# Changelog

All notable changes to this project are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [Unreleased]

### Added

- HTTP interceptor chain: auth token injection, global error handling, GET retry with backoff
- `NotificationService` wrapping `MatSnackBar` for user-visible feedback
- `GlobalErrorHandler` catching unhandled Angular errors
- Role-based route guard (`roleGuard`) extending the existing `authGuard`
- Storybook 8 stories for all shared UI libraries (`ui-button`, `ui-input`, `ui-modal`, `ui-table`)
- Cypress E2E added to CI workflow
- i18n foundation with `@angular/localize` (English + French)
- Lighthouse CI budget enforcement in GitHub Actions
- PWA Service Worker with offline support
- Dependabot for automated Angular / Nx / NgRx dependency updates
- Dev container for zero-setup GitHub Codespaces

---

## [0.1.0] — 2026-05-13

### Added

- Nx 19 monorepo with enforced module boundaries (scope + type tags)
- Standalone Angular 18 components throughout — zero NgModules in feature code
- Dashboard feature using Angular signals (`computed`, `effect`, `toSignal`)
- Settings feature using NgRx 18 with optimistic update and rollback
- Webpack 5 Module Federation: shell host + remote-widgets, dynamic manifest
- Error boundary: shell falls back gracefully when the remote is unavailable
- `ConnectionAwarePreloadingStrategy` — skips preload on 2G/saveData, delays on 3G
- OnPush change detection on every component, enforced by ESLint
- Virtual scroll CDK table rendering 10 000 rows (~20 DOM nodes)
- Jest + Spectator unit tests for all components and services
- Cypress 13 E2E for 6 critical user flows
- Husky + commitlint (Conventional Commits) enforced at commit time
- GitHub Actions CI: lint → test → build on every push to `develop` / PR to `main`
- Architecture Decision Records (ADR 001–005) in `docs/adr/`
- `docs/performance.md` with measured production bundle numbers
- MIT licence, Contributor Covenant Code of Conduct

[Unreleased]: https://github.com/Ouokki/angular-large-app-architecture/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Ouokki/angular-large-app-architecture/releases/tag/v0.1.0
