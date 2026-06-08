import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './graphql/generated/schema.graphql',
  documents: ['graphql/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './graphql/generated/code-gen/': {
      preset: 'client',
      plugins: [],
      config: {
        enumsAsTypes: false,
        nonOptionalTypename: true,
        scalars: {
          BigInt: 'number',
          DateTime: 'string',
          JSONObject: 'Record<string, unknown>',
        },
      },
    },
  },
};

export default config;
