/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  env: {
    es2022: true,
    node: true,
    browser: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: { project: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  reportUnusedDisableDirectives: true,
  root: true,
  rules: {
    'no-var': 0,
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    '@typescript-eslint/ban-types': [
      'error',
      {
        'types': {
          '{}': false
        },
        'extendDefaults': true
      }
    ]
  },
  'settings': {
    'react': {
      'version': 'detect'
    }
  }
}
