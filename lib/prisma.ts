import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { __prod__ } from 'utils/constants';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL or DIRECT_URL must be provided for Prisma adapter');
}

const prismaAdapter = new PrismaPg({
	connectionString,
});

declare global {
	var prisma: PrismaClient | undefined;
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		adapter: prismaAdapter,
		log: !__prod__ ? ['query', 'error', 'warn'] : ['error'],
	});

if (!__prod__) {
	global.prisma = prisma;
}
