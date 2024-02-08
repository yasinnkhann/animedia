import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';

import { authOptions as nextAuthOptions } from '../../pages/api/auth/[...nextauth]';

export const getClientAuthSession =
	(func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
		const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions);

		if (!session) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			};
		}

		return await func(ctx);
	};
