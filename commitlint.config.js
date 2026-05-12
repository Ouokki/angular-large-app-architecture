module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'shell',
        'ui-button',
        'ui-input',
        'ui-table',
        'ui-modal',
        'feat-dashboard',
        'feat-settings',
        'data-access-metrics',
        'data-access-settings',
        'remote-widgets',
        'workspace',
        'ci',
        'deps',
      ],
    ],
    'scope-empty': [1, 'never'],
    'body-max-line-length': [2, 'always', 200],
  },
};
