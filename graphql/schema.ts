import { makeSchema, asNexusMethod, connectionPlugin } from 'nexus';
import { join } from 'path';
import { applyMiddleware } from 'graphql-middleware';
import { permissions } from './permissions';
import * as types from './types';
import { DateTimeResolver, JSONObjectResolver, GraphQLBigInt } from 'graphql-scalars';

export const dateScalar = asNexusMethod(DateTimeResolver, 'date');
export const jsonScalar = asNexusMethod(JSONObjectResolver, 'json');
export const bigIntScalar = asNexusMethod(GraphQLBigInt, 'bigint');

export const baseSchema = makeSchema({
	types: [types, dateScalar, jsonScalar, bigIntScalar],
	plugins: [connectionPlugin()],
	nonNullDefaults: {
		input: false,
		output: false,
	},
	outputs: {
		typegen: join(process.cwd(), 'graphql', 'generated', 'nexus-typegen', 'index.d.ts'),
		schema: join(process.cwd(), 'graphql', 'generated', 'schema.graphql'),
	},
	contextType: {
		module: join(process.cwd(), 'graphql', 'context.ts'),
		export: 'Context',
	},
	sourceTypes: {
		modules: [
			{
				module: '@prisma/client',
				alias: 'prisma',
			},
		],
	},
});

export const schema = applyMiddleware(baseSchema, permissions);
