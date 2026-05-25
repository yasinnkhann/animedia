'use client';

import Link from 'next/link';
import { loginValidate } from '../../../lib/nextAuth/account-validate';
import * as Queries from '../../../graphql/queries';
import { FaGoogle, FaFacebook, FaDiscord } from 'react-icons/fa';
import _ from 'lodash';
import { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { signIn } from 'next-auth/react';
import { Field, Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useLazyQuery } from '@apollo/client/react';
import { ILogin } from '../../../models/ts/interfaces';
import { ThreeDots } from 'react-loading-icons';
import { CommonMethods } from '../../../utils/CommonMethods';
import { ACCOUNT_NOT_FOUND_MESSAGE } from '../../../utils/constants';

export default function LoginPage() {
  const [showPW, setShowPW] = useState(false);
  const router = useRouter();

  const [fetchAccountVerifiedData, { loading, error }] = useLazyQuery(Queries.ACCOUNT_VERIFIED);

  const handleSubmitBtnClick = (
    formikErrors: FormikErrors<{
      email: string;
      password: string;
    }>
  ) => {
    if (formikErrors.email || formikErrors.password) {
      CommonMethods.notifyError(ACCOUNT_NOT_FOUND_MESSAGE, 'bottom-center', 3000);
    }
  };

  const handleSubmit = async (values: ILogin, _formikHelpers: FormikHelpers<ILogin>) => {
    const { email, password } = values;

    const { data: { accountVerified } = {} } = await fetchAccountVerifiedData({
      variables: { email },
    });

    if (error || (accountVerified && accountVerified.errors.length > 0)) {
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
    }
  };

  return (
    <main className='mx-auto mt-[calc(var(--header-height-mobile)+2rem)] flex w-full items-center justify-center px-4'>
      <section className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg'>
        <div className='mb-8 flex flex-col items-center justify-center gap-2'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900'>Animedia</h1>
          <p className='text-sm text-gray-500'>Welcome back! Please login to your account.</p>
        </div>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validate={loginValidate}
          onSubmit={(values, formikHelpers) => {
            handleSubmit(values, formikHelpers);
          }}
        >
          {formikProps => (
            <Form className='flex flex-col gap-5'>
              <div className='relative'>
                <Field
                  name='email'
                  type='email'
                  placeholder='Email Address'
                  className='w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-4 pr-4 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100'
                />
              </div>

              <div className='relative'>
                <Field
                  type={showPW ? 'text' : 'password'}
                  name='password'
                  placeholder='Password'
                  className='w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-4 pr-12 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100'
                />

                <div className='absolute right-3 top-1/2 -translate-y-1/2 transform'>
                  <button
                    type='button'
                    onClick={() => setShowPW(!showPW)}
                    className='flex items-center justify-center text-gray-400 hover:text-blue-500 focus:outline-none'
                  >
                    {showPW ? <BsFillEyeSlashFill size={20} /> : <BsFillEyeFill size={20} />}
                  </button>
                </div>
              </div>

              <button
                className='mt-2 rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none active:scale-[0.98]'
                type='submit'
                onClick={() => handleSubmitBtnClick(formikProps.errors)}
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
            </Form>
          )}
        </Formik>

        <div className='relative my-8'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-200'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-white px-2 text-gray-500'>Or continue with</span>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <button
            className='flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none active:bg-gray-100'
            type='button'
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <FaGoogle className='h-5 w-5 text-red-500' />
            <span>Google</span>
          </button>

          <button
            className='flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none active:bg-gray-100'
            type='button'
            onClick={() => signIn('facebook', { callbackUrl: '/' })}
          >
            <FaFacebook className='h-5 w-5 text-blue-600' />
            <span>Facebook</span>
          </button>

          <button
            className='flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none active:bg-gray-100'
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
            className='text-sm font-medium text-blue-600 hover:text-blue-800'
          >
            Don&apos;t have an account? Sign up
          </Link>
          <Link href='/auth/forgot-password' className='text-sm text-gray-500 hover:text-gray-700'>
            Forgot your password?
          </Link>
        </div>
      </section>
    </main>
  );
}
