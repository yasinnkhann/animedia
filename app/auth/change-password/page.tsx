import { redirect } from 'next/navigation';
import { FORGOT_PASSWORD_EMAIL_PREFIX } from '../../../utils/constants';
import { redis } from '../../../lib/redis';
import ChangePasswordForm from './ChangePasswordForm';

interface PageProps {
  searchParams: Promise<{ uid?: string; token?: string }>;
}

export default async function ChangePasswordPage({ searchParams }: PageProps) {
  const { uid, token } = await searchParams;

  if (!uid || !token) {
    redirect('/');
  }

  try {
    const storedToken = await redis.get(`${FORGOT_PASSWORD_EMAIL_PREFIX}:${uid}`);

    if (!storedToken || storedToken !== token) {
      redirect('/');
    }
  } catch (err) {
    console.error(err);
    redirect('/');
  }

  return (
    <main className='mx-auto mt-[calc(var(--header-height-mobile)+2rem)] flex w-full items-center justify-center px-4'>
      <ChangePasswordForm userId={uid} token={token} />
    </main>
  );
}
