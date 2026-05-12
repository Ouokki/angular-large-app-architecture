module.exports = {
  '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
  '!(*pnpm-lock*).{html,scss,css,json,md,yaml,yml}': ['prettier --write'],
};
