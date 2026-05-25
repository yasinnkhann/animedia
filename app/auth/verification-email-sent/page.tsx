import request from 'graphql-request';
import { redirect } from 'next/navigation';
import { SERVER_BASE_URL } from '../../../utils/constants';
import * as Queries from '../../../graphql/queries';
import _ from 'lodash';
import VerificationEmailSentClient from './VerificationEmailSentClient';

interface PageProps {
  searchParams: Promise<{ uid?: string; token?: string }>;
}

export default async function VerificationEmailSentPage({ searchParams }: PageProps) {
  const { uid, token } = await searchParams;

  if (!uid || !token) {
    redirect('/');
  }

  try {
    const verifyTokenRes: any = await request(
      SERVER_BASE_URL,
      Queries.CHECK_EMAIL_VERIFICATION_TOKEN,
      {
        token: token,
        userId: uid,
      }
    );

    const verifyTokenData = verifyTokenRes.checkEmailVerificationToken;

    if (!verifyTokenData || !_.isEmpty(verifyTokenData.errors)) {
      redirect('/');
    }
  } catch (err) {
    console.error(err);
    redirect('/');
  }

  return (
    <main className='mx-auto mt-[calc(var(--header-height-mobile)+2rem)] flex w-full items-center justify-center px-4'>
      <VerificationEmailSentClient userId={uid} />
    </main>
  );
}
