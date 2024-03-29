import Head from 'next/head';
import Link from 'next/link';
import * as Mutations from '../../graphql/mutations';
import { useState } from 'react';
import { CLIENT_BASE_URL } from '../../utils/constants';
import { HiAtSymbol, HiOutlineUser } from 'react-icons/hi';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useFormik } from 'formik';
import { registerValidate } from '../../lib/nextAuth/account-validate';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';

export default function Register() {
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

	const [registerErr, setRegisterErr] = useState<{ error: null | string }>({
		error: null,
	});

	const [registerUser] = useMutation(Mutations.REGISTER_USER);

	const [writeEmailVerificationToken] = useMutation(
		Mutations.WRITE_EMAIL_VERIFICATION_TOKEN,
		{
			variables: {
				email: formik.values.email,
			},
		}
	);

	const [sendVerificationEmail] = useMutation(
		Mutations.SEND_VERIFICATION_EMAIL
	);

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

			if (registerUserRes?.data?.registerUser?.createdUser) {
				const writeEmailVerificationTokenRes =
					await writeEmailVerificationToken({
						variables: {
							email: formik.values.email,
						},
					});

				if (
					!writeEmailVerificationTokenRes.data?.writeEmailVerificationToken
						?.error &&
					writeEmailVerificationTokenRes.data?.writeEmailVerificationToken
						?.token
				) {
					const sendVerificationEmailRes = await sendVerificationEmail({
						variables: {
							recipientEmail: email,
							subject: 'Email Verification Link',
							text: 'Click the link below to verify your email.',
							html: `<a href="${CLIENT_BASE_URL}/verification-email/${writeEmailVerificationTokenRes.data.writeEmailVerificationToken.token}">Verify Email</a>`,
						},
					});

					if (sendVerificationEmailRes.data?.sendVerificationEmail?.ok) {
						router.push(
							`/verification-email-sent/${writeEmailVerificationTokenRes.data.writeEmailVerificationToken.token}`
						);
					} else {
						throw new Error('Could not send verification email');
					}
				}
			}
			if (registerUserRes.data?.registerUser?.error) {
				setRegisterErr({ error: registerUserRes.data.registerUser.error });
			}
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<>
			<Head>
				<title>Register</title>
			</Head>

			<main className='mx-auto mt-[calc(var(--header-height-mobile)+1rem)] flex w-3/4 flex-col gap-10'>
				<div>
					<h1 className='py-4 text-4xl font-bold text-gray-800'>Register</h1>
				</div>

				<form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
					{formik.errors.name && formik.touched.name && (
						<span className='text-rose-500'>{formik.errors.name}</span>
					)}

					<div
						className={`relative flex h-[2.5rem] rounded-xl border ${
							formik.errors.name && formik.touched.name ? 'border-rose-600' : ''
						}`}
					>
						<input
							{...formik.getFieldProps('name')}
							type='text'
							name='name'
							placeholder='Name'
							className='w-full border-none bg-inherit pl-4 outline-none'
						/>
						<span className='icon flex items-center px-4'>
							<HiOutlineUser size={25} />
						</span>
					</div>

					{formik.errors.email && formik.touched.email && (
						<span className='text-rose-500'>{formik.errors.email}</span>
					)}

					<div
						className={`relative flex h-[2.5rem] rounded-xl border ${
							formik.errors.email && formik.touched.email
								? 'border-rose-600'
								: ''
						}`}
					>
						<input
							{...formik.getFieldProps('email')}
							type='email'
							name='email'
							placeholder='Email'
							className='w-full border-none bg-inherit pl-4 outline-none'
						/>
						<span className='icon flex items-center px-4'>
							<HiAtSymbol size={25} />
						</span>
					</div>

					{formik.errors.password && formik.touched.password && (
						<span className='text-rose-500'>{formik.errors.password}</span>
					)}

					<div
						className={`relative flex h-[2.5rem] rounded-xl border ${
							formik.errors.password && formik.touched.password
								? 'border-rose-600'
								: ''
						}`}
					>
						<input
							{...formik.getFieldProps('password')}
							type={`${showPW.password ? 'text' : 'password'}`}
							name='password'
							placeholder='Password'
							className='w-full border-none bg-inherit pl-4 outline-none'
						/>
						<span
							className='icon flex cursor-pointer items-center px-4'
							onClick={() =>
								setShowPW({ ...showPW, password: !showPW.password })
							}
						>
							{showPW.password ? (
								<BsFillEyeFill size={25} />
							) : (
								<BsFillEyeSlashFill size={25} />
							)}
						</span>
					</div>

					{formik.errors.confirmPassword && formik.touched.confirmPassword && (
						<span className='text-rose-500'>
							{formik.errors.confirmPassword}
						</span>
					)}

					<div
						className={`relative flex h-[2.5rem] rounded-xl border ${
							formik.errors.confirmPassword && formik.touched.confirmPassword
								? 'border-rose-600'
								: ''
						}`}
					>
						<input
							{...formik.getFieldProps('confirmPassword')}
							type={`${showPW.confirmPassword ? 'text' : 'password'}`}
							name='confirmPassword'
							placeholder='Confirm Password'
							className='w-full border-none bg-inherit pl-4 outline-none'
						/>
						<span
							className='icon flex cursor-pointer items-center px-4'
							onClick={() =>
								setShowPW({
									...showPW,
									confirmPassword: !showPW.confirmPassword,
								})
							}
						>
							{showPW.confirmPassword ? (
								<BsFillEyeFill size={25} />
							) : (
								<BsFillEyeSlashFill size={25} />
							)}
						</span>
					</div>

					<div>
						<button
							type='submit'
							className='w-full rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 py-3 text-lg text-gray-50'
						>
							Sign Up
						</button>
					</div>
				</form>

				{registerErr.error && (
					<span className='text-center text-rose-500'>{registerErr.error}</span>
				)}

				<div className='flex flex-col items-center'>
					<p className='text-center text-gray-400 '>Have an account? </p>
					<Link href='/auth/login'>Login</Link>
				</div>
			</main>
		</>
	);
}
