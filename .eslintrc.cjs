module.exports = {
  env: { browser: true, es2021: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },

  overrides: [
    {
      env: { node: true },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: { sourceType: 'script' },
    },
  ],
};
