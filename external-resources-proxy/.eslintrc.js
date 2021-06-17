module.exports = {
  root: true,
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreComments: true,
        ignorePattern: "^import (.+) from '.+'",
      },
    ],
    'jest/expect-expect': [
      'error',
      { assertFunctionNames: ['expect', 'request.**.expect'] },
    ],
  },
  env: {
    'jest/globals': true,
  },
}
