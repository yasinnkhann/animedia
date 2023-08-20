import { builder } from './builder';
import { applyMiddleware } from 'graphql-middleware';
import { permissions } from './permissions';

import './models/User';
import './models/Movie';
import './models/Show';
import './models/Person';

export const schema = applyMiddleware(builder.toSchema({}), permissions);
