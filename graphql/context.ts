import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';

export type TContext = {
	prisma: PrismaClient;
};

export async function context(): Promise<TContext> {
	return {
		prisma,
	};
}
