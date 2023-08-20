import { builder } from './builder';
import { applyMiddleware } from 'graphql-middleware';
import { permissions } from './permissions';
import path from 'path';
import fs from 'fs';
import { lexicographicSortSchema, printSchema } from 'graphql';

import './models/User';
import './models/Movie';
import './models/Show';
import './models/Person';

export const schema = applyMiddleware(builder.toSchema({}), permissions);

const schemaAsString = printSchema(lexicographicSortSchema(schema));

fs.writeFileSync(
	path.join(process.cwd(), './graphql/generated/code-gen/schema.gql'),
	schemaAsString
);
