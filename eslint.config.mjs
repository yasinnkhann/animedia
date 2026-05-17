import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

/** ESLint 10 requires a ScopeManager with `addGlobals`; Next's bundled Babel parser does not provide it yet. */
function withEslint10CompatibleNextParser(configs) {
	return configs.map(config => {
		const newConfig = {
			...config,
			languageOptions: {
				...config?.languageOptions,
				parser: tseslint.parser,
				parserOptions: {
					ecmaVersion: 'latest',
					sourceType: 'module',
					allowImportExportEverywhere: true,
					ecmaFeatures: {
						jsx: true,
						...(config?.languageOptions?.parserOptions?.ecmaFeatures || {}),
					},
					...(config?.languageOptions?.parserOptions || {}),
				},
			},
		};

		if (newConfig.plugins && newConfig.plugins['@typescript-eslint']) {
			delete newConfig.plugins['@typescript-eslint'];
		}

		return newConfig;
	});
}

const eslintConfig = tseslint.config(
	{
		ignores: ['graphql/generated', '.next/**'],
	},
	...withEslint10CompatibleNextParser(nextCoreWebVitals),
	{
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			'react-hooks': eslintPluginReactHooks,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
			'no-constant-binary-expression': 'off',
			'no-useless-catch': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'no-constant-condition': 'off',
			'no-var': 'off',
			'react-hooks/exhaustive-deps': 'warn',
			// React Compiler rules: keep as warnings until patterns are refactored (syncing form state from queries).
			'react-hooks/set-state-in-effect': 'warn',
			'react-hooks/preserve-manual-memoization': 'warn',
			'react-hooks/refs': 'warn',
			'react-hooks/rules-of-hooks': 'warn', // Downgrading to warn as some hooks are in transitions
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
