import { auth } from '../support/app.po';

const pages = [
  { name: 'Login', path: '/login' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Settings', path: '/settings' },
];

describe('Accessibility (axe)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login');
    cy.injectAxe();
  });

  it('login page has no critical a11y violations', () => {
    cy.checkA11y(undefined, { includedImpacts: ['critical', 'serious'] });
  });

  pages.slice(1).forEach(({ name, path }) => {
    it(`${name} page has no critical a11y violations`, () => {
      auth.username().type('demo@example.com');
      auth.password().type('password');
      auth.submit().click();
      cy.url().should('include', '/dashboard');

      cy.visit(path);
      cy.injectAxe();
      cy.checkA11y(undefined, { includedImpacts: ['critical', 'serious'] });
    });
  });
});
