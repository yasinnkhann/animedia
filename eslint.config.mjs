import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const nextConfigs = nextCoreWebVitals.map(config => {
  if (!config.plugins?.['@typescript-eslint']) {
    return config;
  }

  return {
    ...config,
    rules: {
      ...config.rules,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  };
});

const eslintConfig = tseslint.config(
  {
    ignores: ['graphql/generated', '.next/**'],
  },
  ...nextConfigs,
  {
    plugins: {
      'react-hooks': eslintPluginReactHooks,
    },
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/preserve-manual-memoization': 'error',
      'react-hooks/refs': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  {
    ...prettierRecommended,
    rules: {
      ...prettierRecommended.rules,
      'prettier/prettier': ['warn', { usePrettierrc: true }],
    },
  },
  {
    files: ['*.config.js', 'postcss.config.js', 'tailwind.config.js'],
    languageOptions: {
      sourceType: 'script',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off',
    },
  }
);

export default eslintConfig;
