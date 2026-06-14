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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    setRegisterErrs([]);
    const { name, email, password } = data;
    try {
      const registerRes = await registerUserAction({ name, email, password });

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
      <section className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg'>
        <div className='mb-8 flex flex-col items-center justify-center gap-2'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900'>Register</h1>
          <p className='text-sm text-gray-500'>Create your account to join Animedia.</p>
        </div>

        <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <input
                {...register('name')}
                type='text'
                placeholder='Full Name'
                className={`w-full rounded-lg border py-3 pl-4 pr-12 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                  errors.name ? 'border-rose-600 bg-rose-50' : 'border-gray-300 bg-gray-50'
                }`}
              />
              <span className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400'>
                <HiOutlineUser size={24} />
              </span>
            </div>
            {errors.name && (
              <span className='text-xs font-medium text-rose-600'>{errors.name.message}</span>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <input
                {...register('email')}
                type='email'
                placeholder='Email Address'
                className={`w-full rounded-lg border py-3 pl-4 pr-12 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                  errors.email ? 'border-rose-600 bg-rose-50' : 'border-gray-300 bg-gray-50'
                }`}
              />
              <span className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400'>
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
                className={`w-full rounded-lg border py-3 pl-4 pr-12 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                  errors.password ? 'border-rose-600 bg-rose-50' : 'border-gray-300 bg-gray-50'
                }`}
              />
              <button
                type='button'
                onClick={() => setShowPW({ ...showPW, password: !showPW.password })}
                className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-blue-500 focus:outline-none'
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
                className={`w-full rounded-lg border py-3 pl-4 pr-12 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                  errors.confirmPassword
                    ? 'border-rose-600 bg-rose-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              />
              <button
                type='button'
                onClick={() => setShowPW({ ...showPW, confirmPassword: !showPW.confirmPassword })}
                className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-blue-500 focus:outline-none'
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
            className='text-sm font-medium text-blue-600 hover:text-blue-800'
          >
            Already have an account? Login
          </Link>
        </div>
      </section>
    </main>
  );
}
