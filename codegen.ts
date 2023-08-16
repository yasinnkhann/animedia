import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'http://localhost:3000/api/graphql',
	documents: ['graphql/**/*.ts'],
	ignoreNoDocuments: true, // for better experience with the watcher
	generates: {
		'./graphql/generated/code-gen/': {
			preset: 'client',
			plugins: [],
		},
	},
};

export default config;
