import { makeSchema, connectionPlugin, asNexusMethod } from 'nexus';
import { join } from 'path';
import * as allTypes from './types';
import { DateTimeResolver } from 'graphql-scalars';

export const gqlDate = asNexusMethod(DateTimeResolver, 'date');

export const schema = makeSchema({
	types: [allTypes, gqlDate],
	plugins: [connectionPlugin()],
	outputs: {
		typegen: join(
			process.cwd(),
			'graphql',
			'generated',
			'nexus-typegen',
			'index.d.ts'
		),
		schema: join(process.cwd(), 'graphql', 'generated', 'schema.graphql'),
	},
	contextType: {
		export: 'Context',
		module: join(process.cwd(), 'graphql', 'context.ts'),
	},
});
