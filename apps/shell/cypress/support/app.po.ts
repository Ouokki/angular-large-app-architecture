export const auth = {
  password: () => cy.get('input[formcontrolname="password"]'),
  submit: () => cy.get('button[type="submit"]').contains('Sign in'),
  username: () => cy.get('input[formcontrolname="username"]'),
};

export const nav = {
  links: () => cy.get('nav a'),
  toDashboard: () => cy.get('nav a[href="/dashboard"]').click(),
  toSettings: () => cy.get('nav a[href="/settings"]').click(),
  toWidgets: () => cy.get('nav a[href="/widgets"]').click(),
};

export const dashboard = {
  metricCards: () => cy.get('app-metric-card'),
  searchInput: () => cy.get('input[type="search"], input[placeholder*="Search" i]'),
  tableRows: () => cy.get('cdk-virtual-scroll-viewport [role="row"]'),
};

export const settings = {
  form: () => cy.get('form'),
  themeSelect: () => cy.get('select#theme'),
  resetButton: () => cy.get('button[type="button"]').contains('Reset'),
};
