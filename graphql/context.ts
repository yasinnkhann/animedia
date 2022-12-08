import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { Session } from 'next-auth';
import type { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export type Context = {
	prisma: PrismaClient;
	redis: typeof redis;
	session: Session | null;
	req: GetServerSidePropsContext['req'];
	res: GetServerSidePropsContext['res'];
};

export async function context(
	ctxArg: GetServerSidePropsContext
): Promise<Context> {
	const { req, res } = ctxArg;
	const session = await getSession({ req });

	return {
		prisma,
		redis,
		session,
		req,
		res,
	};
}
