module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  ignorePatterns: ['reportWebVitals.ts'],
  overrides: [
    {
      files: ['src/**/*.tsx', 'src/**/*.ts'],
      extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],

      parserOptions: {
        project: ['./tsconfig.json'],
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-inferrable-types': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
