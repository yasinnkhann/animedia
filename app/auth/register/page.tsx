'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HiAtSymbol, HiOutlineUser } from 'react-icons/hi';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormSchema } from '@/utils/validations';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import _ from 'lodash';
import { registerUserAction, sendVerificationEmailAction } from '../../actions/auth';

type ErrorRes = {
  message: string;
};

type FormValues = z.infer<typeof RegisterFormSchema>;

export default function RegisterPage() {
  const [showPW, setShowPW] = useState({
    password: false,
    confirmPassword: false,
  });

  const router = useRouter();

  const [registerErrs, setRegisterErrs] = useState<ErrorRes[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    setRegisterErrs([]);
    const { firstName, lastName, email, password } = data;
    try {
      const registerRes = await registerUserAction({ firstName, lastName, email, password });

      if (registerRes.createdUser?.id) {
        const emailRes = await sendVerificationEmailAction({ id: registerRes.createdUser.id });

        if (emailRes.userId && emailRes.token) {
          router.push(
            `/auth/verification-email-sent?uid=${emailRes.userId}&token=${emailRes.token}`
          );
        } else if (emailRes.errors && !_.isEmpty(emailRes.errors)) {
          setRegisterErrs(emailRes.errors);
        } else {
          throw new Error('Could not send verification email');
        }
      } else if (registerRes.errors && !_.isEmpty(registerRes.errors)) {
        setRegisterErrs(registerRes.errors);
      }
    } catch (err) {
      console.error(err);
      setRegisterErrs([{ message: 'An unexpected error occurred.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='mx-auto mt-[calc(var(--header-height-mobile)+2rem)] flex w-full items-center justify-center px-4'>
      <section className='w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg'>
        <div className='mb-8 flex flex-col items-center justify-center gap-2'>
          <h1 className='text-4xl font-bold tracking-tight text-foreground'>Register</h1>
          <p className='text-sm text-muted-foreground'>Create your account to join Animedia.</p>
        </div>

        <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex w-full gap-3'>
            <div className='flex w-1/2 flex-col gap-1'>
              <div className='relative'>
                <input
                  {...register('firstName')}
                  type='text'
                  placeholder='First Name'
                  className={`w-full rounded-lg border bg-background py-3 pl-4 pr-12 text-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.firstName ? 'border-red-500 bg-red-500/10' : 'border-border bg-muted/30'
                  }`}
                />
                <span className='absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground'>
                  <HiOutlineUser size={24} />
                </span>
              </div>
              {errors.firstName && (
                <span className='text-xs font-medium text-rose-600'>
                  {errors.firstName.message}
                </span>
              )}
            </div>

            <div className='flex w-1/2 flex-col gap-1'>
              <div className='relative'>
                <input
                  {...register('lastName')}
                  type='text'
                  placeholder='Last Name'
                  className={`w-full rounded-lg border bg-background py-3 pl-4 pr-12 text-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.lastName ? 'border-red-500 bg-red-500/10' : 'border-border bg-muted/30'
                  }`}
                />
                <span className='absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground'>
                  <HiOutlineUser size={24} />
                </span>
              </div>
              {errors.lastName && (
                <span className='text-xs font-medium text-rose-600'>{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <input
                {...register('email')}
                type='email'
                placeholder='Email Address'
                className={`w-full rounded-lg border bg-background py-3 pl-4 pr-12 text-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? 'border-red-500 bg-red-500/10' : 'border-border bg-muted/30'
                }`}
              />
              <span className='absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground'>
                <HiAtSymbol size={24} />
              </span>
            </div>
            {errors.email && (
              <span className='text-xs font-medium text-rose-600'>{errors.email.message}</span>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <input
                {...register('password')}
                type={showPW.password ? 'text' : 'password'}
                placeholder='Password'
                className={`w-full rounded-lg border bg-background py-3 pl-4 pr-12 text-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.password ? 'border-red-500 bg-red-500/10' : 'border-border bg-muted/30'
                }`}
              />
              <button
                type='button'
                onClick={() => setShowPW({ ...showPW, password: !showPW.password })}
                className='absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground hover:text-primary focus:outline-none'
              >
                {showPW.password ? <BsFillEyeSlashFill size={20} /> : <BsFillEyeFill size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className='text-xs font-medium text-rose-600'>{errors.password.message}</span>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <input
                {...register('confirmPassword')}
                type={showPW.confirmPassword ? 'text' : 'password'}
                placeholder='Confirm Password'
                className={`w-full rounded-lg border bg-background py-3 pl-4 pr-12 text-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.confirmPassword
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-border bg-muted/30'
                }`}
              />
              <button
                type='button'
                onClick={() => setShowPW({ ...showPW, confirmPassword: !showPW.confirmPassword })}
                className='absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground hover:text-primary focus:outline-none'
              >
                {showPW.confirmPassword ? (
                  <BsFillEyeSlashFill size={20} />
                ) : (
                  <BsFillEyeFill size={20} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className='text-xs font-medium text-rose-600'>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='mt-2 rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none active:scale-[0.98] disabled:opacity-50'
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {registerErrs.length > 0 && (
          <div className='mt-4 rounded-lg bg-rose-50 p-4'>
            {registerErrs.map((err, idx) => (
              <p key={idx} className='text-sm font-medium text-rose-600'>
                {err.message}
              </p>
            ))}
          </div>
        )}

        <div className='mt-8 flex flex-col items-center gap-2'>
          <Link
            href='/auth/login'
            className='text-sm font-medium text-primary hover:text-primary/80'
          >
            Already have an account? Login
          </Link>
        </div>
      </section>
    </main>
  );
}
