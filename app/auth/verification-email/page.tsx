import { redirect } from 'next/navigation';
import {
  VERIFICATION_EMAIL_PREFIX,
  VERIFICATION_EMAIL_COUNT_PREFIX,
} from '../../../utils/constants';
import { redis } from '../../../lib/redis';
import { prisma } from '../../../lib/prisma';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ uid?: string; token?: string }>;
}

export default async function VerificationEmailPage({ searchParams }: PageProps) {
  const { uid, token } = await searchParams;

  if (!uid || !token) {
    redirect('/');
  }

  try {
    const storedToken = await redis.get(`${VERIFICATION_EMAIL_PREFIX}:${uid}`);

    if (!storedToken || storedToken !== token) {
      redirect('/');
    }

    await prisma.user.update({
      where: { id: uid },
      data: { emailVerified: new Date() },
    });

    await redis.del(`${VERIFICATION_EMAIL_PREFIX}:${uid}`);
    await redis.del(`${VERIFICATION_EMAIL_COUNT_PREFIX}:${uid}`);
  } catch (err) {
    console.error(err);
    redirect('/');
  }

  return (
    <main className='mx-auto mt-[calc(var(--header-height-mobile)+2rem)] flex w-full items-center justify-center px-4'>
      <section className='w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg'>
        <div className='mb-8 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50'>
            <svg
              className='h-8 w-8 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h2 className='text-3xl font-extrabold tracking-tight text-foreground'>Verified!</h2>
          <p className='mt-3 text-sm text-muted-foreground'>
            You have been successfully verified! You can now login to your account.
          </p>
        </div>

        <div className='flex flex-col gap-4'>
          <Link
            href='/auth/login'
            className='flex items-center justify-center rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none active:scale-[0.98]'
          >
            Go to Login
          </Link>
        </div>
      </section>
    </main>
  );
}
