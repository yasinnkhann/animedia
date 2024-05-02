import Head from 'next/head';
import Link from 'next/link';
import * as Mutations from '../../graphql/mutations';
import { useState } from 'react';
import { HiAtSymbol, HiOutlineUser } from 'react-icons/hi';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useFormik } from 'formik';
import { registerValidate } from '../../lib/nextAuth/account-validate';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { ErrorRes } from '../../graphql/generated/code-gen/graphql';
import _ from 'lodash';

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

	const [registerErrs, setRegisterErrs] = useState<ErrorRes[]>([]);

	const [registerUser] = useMutation(Mutations.REGISTER_USER);

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
				setRegisterErrs(registerUserRes.data.registerUser.errors);
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

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] flex items-center justify-center bg-gray-100'>
				<div className='relative w-full max-w-md rounded-md p-8'>
					<div className='mb-6 flex items-center justify-center'>
						<h1 className='text-4xl font-bold text-gray-800'>Register</h1>
					</div>

					<form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
						<div className='relative'>
							<div className='relative'>
								<input
									{...formik.getFieldProps('name')}
									type='text'
									name='name'
									placeholder='Name'
									className={`w-full rounded-lg border py-3 pl-10 pr-12 focus:border-blue-500 focus:outline-none ${
										formik.errors.name && formik.touched.name
											? 'border-rose-600'
											: ''
									}`}
								/>
								<span className='icon absolute right-3 top-1/2 -translate-y-1/2 transform'>
									<HiOutlineUser size={25} />
								</span>
							</div>
							{formik.errors.name && formik.touched.name && (
								<span className='ml-2 text-red-500'>{formik.errors.name}</span>
							)}
						</div>

						<div className='relative'>
							<div className='relative'>
								<input
									{...formik.getFieldProps('email')}
									type='email'
									name='email'
									placeholder='Email'
									className={`w-full rounded-lg border py-3 pl-10 pr-12 focus:border-blue-500 focus:outline-none ${
										formik.errors.email && formik.touched.email
											? 'border-rose-600'
											: ''
									}`}
								/>
								<span className='icon absolute right-3 top-1/2 -translate-y-1/2 transform'>
									<HiAtSymbol size={25} />
								</span>
							</div>
							{formik.errors.email && formik.touched.email && (
								<span className='ml-2 text-red-500'>{formik.errors.email}</span>
							)}
						</div>

						<div className='relative'>
							<div className='relative'>
								<input
									{...formik.getFieldProps('password')}
									type={`${showPW.password ? 'text' : 'password'}`}
									name='password'
									placeholder='Password'
									className={`w-full rounded-lg border py-3 pl-10 pr-12 focus:border-blue-500 focus:outline-none ${
										formik.errors.password && formik.touched.password
											? 'border-rose-600'
											: ''
									}`}
								/>
								<span className='icon absolute right-3 top-1/2 -translate-y-1/2 transform'>
									<button
										type='button'
										onClick={() =>
											setShowPW({ ...showPW, password: !showPW.password })
										}
										className='text-gray-500 hover:text-blue-500 focus:outline-none'
									>
										{showPW.password ? (
											<BsFillEyeSlashFill size={25} />
										) : (
											<BsFillEyeFill size={25} />
										)}
									</button>
								</span>
							</div>
							{formik.errors.password && formik.touched.password && (
								<span className='ml-2 text-red-500'>
									{formik.errors.password}
								</span>
							)}
						</div>

						<div className='relative'>
							<div className='relative'>
								<input
									{...formik.getFieldProps('confirmPassword')}
									type={`${showPW.confirmPassword ? 'text' : 'password'}`}
									name='confirmPassword'
									placeholder='Confirm Password'
									className={`w-full rounded-lg border py-3 pl-10 pr-12 focus:border-blue-500 focus:outline-none ${
										formik.errors.confirmPassword &&
										formik.touched.confirmPassword
											? 'border-rose-600'
											: ''
									}`}
								/>
								<span className='icon absolute right-3 top-1/2 -translate-y-1/2 transform'>
									<button
										type='button'
										onClick={() =>
											setShowPW({
												...showPW,
												confirmPassword: !showPW.confirmPassword,
											})
										}
										className='text-gray-500 hover:text-blue-500 focus:outline-none'
									>
										{showPW.confirmPassword ? (
											<BsFillEyeSlashFill size={25} />
										) : (
											<BsFillEyeFill size={25} />
										)}
									</button>
								</span>
							</div>
							{formik.errors.confirmPassword &&
								formik.touched.confirmPassword && (
									<span className='ml-2 text-red-500'>
										{formik.errors.confirmPassword}
									</span>
								)}
						</div>

						<button
							type='submit'
							className='w-full rounded-lg bg-blue-500 py-3 font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none'
						>
							Sign Up
						</button>
					</form>

					{registerErrs.length > 0 && (
						<div className='absolute bottom-full left-0 w-full'>
							<div className='flex flex-col'>
								{registerErrs.map((err, idx) => (
									<span key={idx} className='ml-4 text-center text-red-500'>
										{err.message}
									</span>
								))}
							</div>
						</div>
					)}

					<div className='mt-4 flex flex-col items-center'>
						<Link href='/auth/login'>
							<a className='text-center text-gray-600 hover:text-blue-500'>
								Have an account?
							</a>
						</Link>
					</div>
				</div>
			</main>
		</>
	);
}
