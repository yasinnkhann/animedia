import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { Session } from 'next-auth';
import { getServerAuthSession } from '../lib/nextAuth/get-server-auth-session';
import type { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export type Context = {
	prisma: PrismaClient;
	session: Session | null;
	req: GetServerSidePropsContext['req'];
	res: GetServerSidePropsContext['res'];
};

export async function context(
	ctxArg: GetServerSidePropsContext
): Promise<Context> {
	const { req, res } = ctxArg;
	// const session = await getSession({ req });
	const session = await getServerAuthSession({ req, res });

	return {
		prisma,
		session,
		req,
		res,
	};
}
