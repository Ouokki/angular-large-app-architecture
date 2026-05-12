import { dashboard, nav, settings } from '../support/app.po';

/**
 * Critical user flow: Dashboard → Settings → back to Dashboard.
 *
 * The app uses mock data (no real HTTP backend), so no cy.intercept stubs are
 * needed for the happy path. Settings auto-save on field change (NgRx +
 * localStorage persistence). localStorage is cleared between tests so each run
 * starts from a clean default state.
 */
describe('Critical user flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('redirects from / to /dashboard', () => {
    cy.url().should('include', '/dashboard');
  });

  it('renders the top navigation with all three links', () => {
    nav.links().should('have.length.gte', 3);
    nav.links().contains('Dashboard').should('exist');
    nav.links().contains('Settings').should('exist');
    nav.links().contains('Widgets').should('exist');
  });

  it('dashboard shows metric cards', () => {
    cy.visit('/dashboard');
    // The metrics service generates 4 cards synchronously — no async wait needed.
    dashboard.metricCards().should('have.length.gte', 4);
  });

  it('navigates to settings and shows the user settings form', () => {
    cy.visit('/dashboard');
    nav.toSettings();
    cy.url().should('include', '/settings');
    settings.form().should('exist');
    // Theme select should be present in the form.
    settings.themeSelect().should('exist');
  });

  it('changing the theme setting shows "Unsaved changes" indicator', () => {
    cy.visit('/settings');
    // The settings form auto-dispatches updateSettings on every valueChanges event.
    settings.themeSelect().select('dark');
    cy.contains('Unsaved changes').should('exist');
  });

  it('full flow: dashboard → change setting → return to dashboard', () => {
    // 1. Start on dashboard
    cy.visit('/dashboard');
    dashboard.metricCards().should('have.length.gte', 4);

    // 2. Navigate to settings and change a preference
    nav.toSettings();
    cy.url().should('include', '/settings');
    settings.themeSelect().select('light');

    // 3. Return to dashboard — metric cards still render correctly
    nav.toDashboard();
    cy.url().should('include', '/dashboard');
    dashboard.metricCards().should('have.length.gte', 4);
  });

  it('navigating to /widgets when the remote is down shows the error fallback', () => {
    // Simulate the MF remote being unreachable by blocking its JS bundle.
    cy.intercept('http://localhost:4201/**', { forceNetworkError: true });
    cy.visit('/widgets');
    cy.contains('Remote unavailable').should('exist');
    cy.contains('Return to dashboard').should('exist');
  });
});
