import { rule } from 'graphql-shield';
import type { Context } from '../../context';

export const isAuthenticated = rule({ cache: 'contextual' })(async (
  _parent,
  _args,
  ctx: Context,
  _info
) => {
  return Boolean(ctx.session);
});
