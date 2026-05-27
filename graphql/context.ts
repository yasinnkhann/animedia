import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

export type Context = {
  prisma: PrismaClient;
  redis: typeof redis;
  session: Session | null;
};

export async function context(): Promise<Context> {
  const session = await getServerSession(authOptions);

  return {
    prisma,
    redis,
    session,
  };
}
