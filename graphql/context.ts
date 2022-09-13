// import { PrismaClient } from '@prisma/client';
// import { prisma } from '../lib/prisma';
// import { Session } from 'next-auth';
// import { getServerAuthSession } from '../lib/nextAuth/get-server-auth-session';
// import type { GetServerSidePropsContext } from 'next';
// import { getSession } from 'next-auth/react';

// export type Context = {
// 	prisma: PrismaClient;
// 	session: Session | null;
// 	req: GetServerSidePropsContext['req'];
// 	res: GetServerSidePropsContext['res'];
// };

// export async function context(
// 	ctxArg: GetServerSidePropsContext
// ): Promise<Context> {
// 	const { req, res } = ctxArg;
// 	const session = await getServerAuthSession({ req, res });
// 	// const session = await getSession({ req });

// 	return {
// 		prisma,
// 		session,
// 		req,
// 		res,
// 	};
// }

import { PrismaClient } from '@prisma/client';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

export interface Context {
	prisma: PrismaClient;
	res: ServerResponse;
	req: MicroRequest;
	session: Session | null;
}

export async function context({ res, req }: any): Promise<Context> {
	const session = await getSession({ req });

	return { prisma, res, req, session };
}
