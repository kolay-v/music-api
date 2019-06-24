module.exports = {
  env: {
    es6: true,
    node: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  overrides: [
    {
      rules: {
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-non-null-assertion': 0
      },
      files: ['*.ts']
    }
  ],
  extends: 'standard-with-typescript',
  parser: '@typescript-eslint/parser'
};