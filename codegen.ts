import type { CodegenConfig } from '@graphql-codegen/cli';
import { SERVER_BASE_URL } from './utils/constants';

const config: CodegenConfig = {
	schema: SERVER_BASE_URL,
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
