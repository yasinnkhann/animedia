'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordFormSchema } from '@/utils/validations';
import { z } from 'zod';
import { Oval } from 'react-loading-icons';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { changePasswordAction } from '../../actions/auth';

type ErrorRes = { message: string };

interface Props {
  userId: string;
  token: string;
}

type FormValues = z.infer<typeof ChangePasswordFormSchema>;

export default function ChangePasswordForm({ userId, token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ errors?: ErrorRes[] } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: {
      newPassword: '',
    },
  });

  async function onSubmit(formData: FormValues) {
    setLoading(true);
    setData(null);
    const { newPassword } = formData;
    try {
      const res = await changePasswordAction({ userId, newPassword }, token);
      setData(res);
      if (res && _.isEmpty(res.errors)) {
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setData({ errors: [{ message: 'An unexpected error occurred.' }] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg'>
      <div className='mb-8 text-center'>
        <h2 className='text-3xl font-extrabold tracking-tight text-gray-900'>New Password</h2>
        <p className='mt-3 text-sm text-gray-500'>Please enter your new password below.</p>
      </div>

      <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-1'>
          <label htmlFor='newPassword' className='text-sm font-medium text-gray-700'>
            New Password
          </label>
          <input
            {...register('newPassword')}
            type='password'
            id='newPassword'
            placeholder='••••••••'
            className={`w-full rounded-lg border px-4 py-3 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
              errors.newPassword ? 'border-rose-600 bg-rose-50' : 'border-gray-300 bg-gray-50'
            }`}
          />
          {errors.newPassword && (
            <span className='text-xs font-medium text-rose-600'>{errors.newPassword.message}</span>
          )}
        </div>

        <button
          type='submit'
          disabled={loading}
          className='rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none active:scale-[0.98] disabled:opacity-50'
        >
          {loading ? 'Updating...' : 'Change Password'}
        </button>

        {loading && !data && (
          <div className='flex justify-center'>
            <Oval className='h-8 w-8' stroke='#00b3ff' />
          </div>
        )}

        {!loading && data && !_.isEmpty(data.errors) && (
          <div className='rounded-lg bg-rose-50 p-3'>
            {data.errors!.map((err, idx: number) => (
              <p key={idx} className='text-center text-sm font-medium text-rose-600'>
                {err.message}
              </p>
            ))}
          </div>
        )}

        {!loading && data && _.isEmpty(data.errors) && (
          <div className='rounded-lg bg-green-50 p-4 text-center'>
            <p className='text-sm font-medium text-green-800'>Your password has been changed!</p>
            <p className='mt-1 text-xs text-green-700'>Redirecting to login page...</p>
          </div>
        )}
      </form>
    </section>
  );
}
