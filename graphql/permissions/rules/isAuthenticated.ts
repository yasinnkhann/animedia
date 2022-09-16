import { getSession } from 'next-auth/react';
import { rule } from 'graphql-shield';
import { getServerAuthSession } from 'lib/nextAuth/get-server-auth-session';

export const isAuthenticated = rule({ cache: 'contextual' })(
	async (_parent, _args, { req, res }, _info) => {
		// const session = await getSession({ req })
		const session = await getServerAuthSession({ req, res });

		return Boolean(session);
	}
);
