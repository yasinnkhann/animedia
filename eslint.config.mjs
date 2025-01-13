import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

const config = [
	{
		ignores: ['graphql/generated'],
	},
	...compat.extends(
		'next/core-web-vitals',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended'
	),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
		},

		languageOptions: {
			parser: tsParser,
		},

		rules: {
			'prettier/prettier': [
				'warn',
				{
					printWidth: 100,
				},
			],

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
		},
	},
];

export default config;
