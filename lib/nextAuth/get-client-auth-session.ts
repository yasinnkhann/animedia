import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { authOptions as nextAuthOptions } from '../../pages/api/auth/[...nextauth]';

export const getClientAuthSession =
	(func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
		const session = await unstable_getServerSession(
			ctx.req,
			ctx.res,
			nextAuthOptions
		);

		if (!session) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			};
		}

		const giveFullPrivs =
			session.user &&
			((session.user as any)?.emailVerified ||
				(session.user as any)?.provider !== 'credentials');

		if (!giveFullPrivs) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			};
		}

		return await func(ctx);
	};
