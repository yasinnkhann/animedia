'use client';

import Link from 'next/link';
import { FaGoogle, FaFacebook, FaDiscord } from 'react-icons/fa';
import _ from 'lodash';
import { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginUserInput } from '@/utils/validations';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { ThreeDots } from 'react-loading-icons';
import { CommonMethods } from '../../../utils/CommonMethods';
import { ACCOUNT_NOT_FOUND_MESSAGE } from '../../../utils/constants';
import { checkAccountVerifiedAction } from '../../actions/auth';

type FormValues = z.infer<typeof LoginUserInput>;

export default function LoginPage() {
  const [showPW, setShowPW] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(LoginUserInput),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    const { email, password } = data;

    setLoading(true);
    const res = await checkAccountVerifiedAction(email);
    setLoading(false);

    if (res.errors && res.errors.length > 0) {
      CommonMethods.notifyError(ACCOUNT_NOT_FOUND_MESSAGE, 'bottom-center', 3000);
      return;
    }

    const status = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/',
    });

    if (status?.ok && status.url) {
      router.push(status.url);
    } else {
      CommonMethods.notifyError(ACCOUNT_NOT_FOUND_MESSAGE, 'bottom-center', 3000);
    }
  };

  const onErrors = () => {
    CommonMethods.notifyError(ACCOUNT_NOT_FOUND_MESSAGE, 'bottom-center', 3000);
  };

  return (
    <main className='mx-auto mt-[calc(var(--header-height-mobile)+2rem)] flex w-full items-center justify-center px-4'>
      <section className='w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg'>
        <div className='mb-8 flex flex-col items-center justify-center gap-2'>
          <h1 className='text-4xl font-bold tracking-tight text-foreground'>Animedia</h1>
          <p className='text-sm text-muted-foreground'>
            Welcome back! Please login to your account.
          </p>
        </div>

        <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit, onErrors)}>
          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <input
                {...register('email')}
                type='email'
                placeholder='Email Address'
                className={`w-full rounded-lg border bg-background py-3 pl-4 pr-4 text-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? 'border-red-500 bg-red-500/10' : 'border-border bg-muted/30'
                }`}
              />
            </div>
            {errors.email && (
              <span className='text-xs font-medium text-rose-600'>{errors.email.message}</span>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <input
                {...register('password')}
                type={showPW ? 'text' : 'password'}
                placeholder='Password'
                className={`w-full rounded-lg border bg-background py-3 pl-4 pr-12 text-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.password ? 'border-red-500 bg-red-500/10' : 'border-border bg-muted/30'
                }`}
              />
              <div className='absolute right-3 top-1/2 -translate-y-1/2 transform'>
                <button
                  type='button'
                  onClick={() => setShowPW(!showPW)}
                  className='flex items-center justify-center text-muted-foreground hover:text-primary focus:outline-none'
                >
                  {showPW ? <BsFillEyeSlashFill size={20} /> : <BsFillEyeFill size={20} />}
                </button>
              </div>
            </div>
            {errors.password && (
              <span className='text-xs font-medium text-rose-600'>{errors.password.message}</span>
            )}
          </div>

          <button
            className='mt-2 rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none active:scale-[0.98]'
            type='submit'
            disabled={loading}
          >
            {loading ? (
              <div className='flex items-center justify-center'>
                <ThreeDots className='h-6 w-12' stroke='#ffffff' />
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className='relative my-8'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-border'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-card px-2 text-muted-foreground'>Or continue with</span>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <button
            className='flex items-center justify-center gap-3 rounded-lg border border-border bg-card py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted focus:outline-none active:bg-muted/80'
            type='button'
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <FaGoogle className='h-5 w-5 text-red-500' />
            <span>Google</span>
          </button>

          <button
            className='flex items-center justify-center gap-3 rounded-lg border border-border bg-card py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted focus:outline-none active:bg-muted/80'
            type='button'
            onClick={() => signIn('facebook', { callbackUrl: '/' })}
          >
            <FaFacebook className='h-5 w-5 text-blue-600' />
            <span>Facebook</span>
          </button>

          <button
            className='flex items-center justify-center gap-3 rounded-lg border border-border bg-card py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted focus:outline-none active:bg-muted/80'
            type='button'
            onClick={() => signIn('discord', { callbackUrl: '/' })}
          >
            <FaDiscord className='h-5 w-5 text-indigo-500' />
            <span>Discord</span>
          </button>
        </div>

        <div className='mt-8 flex flex-col items-center gap-2'>
          <Link
            href='/auth/register'
            className='text-sm font-medium text-primary hover:text-primary/80'
          >
            Don&apos;t have an account? Sign up
          </Link>
          <Link
            href='/auth/forgot-password'
            className='text-sm text-muted-foreground hover:text-foreground'
          >
            Forgot your password?
          </Link>
        </div>
      </section>
    </main>
  );
}
