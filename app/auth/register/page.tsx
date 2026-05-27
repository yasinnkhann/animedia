'use client';

import Link from 'next/link';
import * as Mutations from '../../../graphql/mutations';
import { useState } from 'react';
import { HiAtSymbol, HiOutlineUser } from 'react-icons/hi';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useFormik } from 'formik';
import { registerValidate } from '../../../lib/nextAuth/account-validate';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import _ from 'lodash';

type ErrorRes = {
  message: string;
};

export default function RegisterPage() {
  const [showPW, setShowPW] = useState({
    password: false,
    confirmPassword: false,
  });

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: registerValidate,
    onSubmit,
  });

  const [registerErrs, setRegisterErrs] = useState<ErrorRes[]>([]);

  const [registerUser, { loading: registerLoading }] = useMutation(Mutations.REGISTER_USER);

  const [sendVerificationEmail] = useMutation(Mutations.SEND_VERIFICATION_EMAIL);

  async function onSubmit() {
    const { name, email, password } = formik.values;
    try {
      const registerUserRes = await registerUser({
        variables: {
          name,
          email,
          password,
        },
      });

      if (registerUserRes.data?.registerUser?.createdUser?.id) {
        const sendVerificationEmailRes = await sendVerificationEmail({
          variables: {
            userId: registerUserRes.data.registerUser.createdUser.id,
          },
        });
        if (
          sendVerificationEmailRes.data?.sendVerificationEmail?.userId &&
          sendVerificationEmailRes.data?.sendVerificationEmail?.token
        ) {
          router.push(
            `/auth/verification-email-sent?uid=${sendVerificationEmailRes.data.sendVerificationEmail.userId}&token=${sendVerificationEmailRes.data.sendVerificationEmail.token}`
          );
        } else {
          throw new Error('Could not send verification email');
        }
      }
      if (
        registerUserRes.data?.registerUser &&
        !_.isEmpty(registerUserRes.data.registerUser.errors)
      ) {
        setRegisterErrs(registerUserRes.data.registerUser.errors ?? []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className='mx-auto mt-[calc(var(--header-height-mobile)+2rem)] flex w-full items-center justify-center px-4'>
      <section className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg'>
        <div className='mb-8 flex flex-col items-center justify-center gap-2'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900'>Register</h1>
          <p className='text-sm text-gray-500'>Create your account to join Animedia.</p>
        </div>

        <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <input
                {...formik.getFieldProps('name')}
                type='text'
                placeholder='Full Name'
                className={`w-full rounded-lg border py-3 pl-4 pr-12 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                  formik.errors.name && formik.touched.name
                    ? 'border-rose-600 bg-rose-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              />
              <span className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400'>
                <HiOutlineUser size={24} />
              </span>
            </div>
            {formik.errors.name && formik.touched.name && (
              <span className='text-xs font-medium text-rose-600'>{formik.errors.name}</span>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <input
                {...formik.getFieldProps('email')}
                type='email'
                placeholder='Email Address'
                className={`w-full rounded-lg border py-3 pl-4 pr-12 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                  formik.errors.email && formik.touched.email
                    ? 'border-rose-600 bg-rose-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              />
              <span className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400'>
                <HiAtSymbol size={24} />
              </span>
            </div>
            {formik.errors.email && formik.touched.email && (
              <span className='text-xs font-medium text-rose-600'>{formik.errors.email}</span>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <input
                {...formik.getFieldProps('password')}
                type={showPW.password ? 'text' : 'password'}
                placeholder='Password'
                className={`w-full rounded-lg border py-3 pl-4 pr-12 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                  formik.errors.password && formik.touched.password
                    ? 'border-rose-600 bg-rose-50'
                    : 'border-gray-300 bg-gray-50'
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
            {formik.errors.password && formik.touched.password && (
              <span className='text-xs font-medium text-rose-600'>{formik.errors.password}</span>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <input
                {...formik.getFieldProps('confirmPassword')}
                type={showPW.confirmPassword ? 'text' : 'password'}
                placeholder='Confirm Password'
                className={`w-full rounded-lg border py-3 pl-4 pr-12 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                  formik.errors.confirmPassword && formik.touched.confirmPassword
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
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <span className='text-xs font-medium text-rose-600'>
                {formik.errors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type='submit'
            disabled={registerLoading}
            className='mt-2 rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none active:scale-[0.98] disabled:opacity-50'
          >
            {registerLoading ? 'Creating account...' : 'Sign Up'}
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
