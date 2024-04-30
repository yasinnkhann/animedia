import { PrismaClient } from '@prisma/client';
import { __prod__ } from 'utils/constants';

declare global {
	var prisma: PrismaClient | undefined;
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		log: !__prod__ ? ['query', 'error', 'warn'] : ['error'],
	});

if (!__prod__) {
	global.prisma = prisma;
}
