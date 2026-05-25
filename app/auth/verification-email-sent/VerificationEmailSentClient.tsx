'use client';

import { useState } from 'react';
import { Oval } from 'react-loading-icons';
import { useMutation } from '@apollo/client/react';
import * as Mutations from '../../../graphql/mutations';
import _ from 'lodash';

interface Props {
  userId: string;
}

export default function VerificationEmailSentClient({ userId }: Props) {
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [sendVerificationEmail, { loading }] = useMutation(Mutations.SEND_VERIFICATION_EMAIL);

  const handleResendLink = async () => {
    try {
      const res = await sendVerificationEmail({
        variables: { userId },
      });

      if (res.data?.sendVerificationEmail?.userId) {
        setStatusMessage({
          type: 'success',
          message: 'Verification link has been resent! Please check your inbox.',
        });
      } else if (!_.isEmpty(res.data?.sendVerificationEmail?.errors)) {
        setStatusMessage({
          type: 'error',
          message:
            res.data?.sendVerificationEmail?.errors?.[0]?.message ??
            'Error occurred while resending link.',
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
  };

  return (
    <section className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg'>
      <div className='mb-8 text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50'>
          <svg
            className='h-8 w-8 text-blue-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
            />
          </svg>
        </div>
        <h2 className='text-3xl font-extrabold tracking-tight text-gray-900'>Check your email</h2>
        <p className='mt-3 text-sm text-gray-500'>
          A verification link has been sent to your email. If you cannot find it, be sure to check
          your spam folder.
        </p>
      </div>

      <div className='flex flex-col gap-6'>
        <button
          onClick={handleResendLink}
          disabled={loading}
          className='rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none active:scale-[0.98] disabled:opacity-50'
        >
          {loading ? 'Resending Link...' : 'Resend Link'}
        </button>

        {loading && (
          <div className='flex justify-center'>
            <Oval className='h-8 w-8' stroke='#00b3ff' />
          </div>
        )}

        {statusMessage && (
          <div
            className={`rounded-lg p-4 text-center ${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-rose-50 text-rose-800'}`}
          >
            <p className='text-sm font-medium'>{statusMessage.message}</p>
          </div>
        )}
      </div>
    </section>
  );
}
