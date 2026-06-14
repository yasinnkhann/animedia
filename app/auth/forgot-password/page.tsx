'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmailInput } from '@/utils/validations';
import { z } from 'zod';
import { Oval } from 'react-loading-icons';
import _ from 'lodash';
import { useState } from 'react';
import { sendForgotPasswordEmailAction } from '../../actions/auth';

type ErrorRes = { message: string };

type FormValues = z.infer<typeof EmailInput>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ errors?: ErrorRes[] } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(EmailInput),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(formData: FormValues) {
    setLoading(true);
    setData(null);
    const { email } = formData;
    try {
      const res = await sendForgotPasswordEmailAction({ email });
      setData(res);
    } catch (err) {
      console.error(err);
      setData({ errors: [{ message: 'An unexpected error occurred.' }] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='mx-auto mt-[calc(var(--header-height-mobile)+2rem)] flex w-full items-center justify-center px-4'>
      <section className='w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg'>
        <div className='mb-8 text-center'>
          <h2 className='text-3xl font-extrabold tracking-tight text-foreground'>
            Forgot Password
          </h2>
          <p className='mt-3 text-sm text-muted-foreground'>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email' className='text-sm font-medium text-foreground'>
              Email Address
            </label>
            <input
              {...register('email')}
              type='email'
              id='email'
              placeholder='you@example.com'
              className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.email ? 'border-red-500 bg-red-500/10' : 'border-border bg-muted/30'
              }`}
            />
            {errors.email && (
              <span className='text-xs font-medium text-rose-600'>{errors.email.message}</span>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none active:scale-[0.98] disabled:opacity-50'
          >
            {loading ? 'Sending link...' : 'Send reset link'}
          </button>

          {loading && !data && (
            <div className='flex justify-center'>
              <Oval className='h-8 w-8' stroke='#00b3ff' />
            </div>
          )}

          {!loading && data && _.isEmpty(data.errors) && (
            <div className='rounded-lg bg-green-50 p-4 text-center'>
              <p className='text-sm font-medium text-green-800'>Reset link has been sent!</p>
              <p className='mt-1 text-xs text-green-700'>
                Please check your email to follow the instructions.
              </p>
            </div>
          )}

          {!loading &&
            data &&
            !_.isEmpty(data.errors) &&
            data.errors!.map((err, idx: number) => (
              <div key={idx} className='rounded-lg bg-rose-50 p-3'>
                <p className='text-center text-sm font-medium text-rose-600'>{err.message}</p>
              </div>
            ))}
        </form>
      </section>
    </main>
  );
}
