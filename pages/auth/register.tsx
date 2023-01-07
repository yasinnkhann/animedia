import Head from 'next/head';
import Link from 'next/link';
import * as Mutations from '../../graphql/mutations';
import { useState } from 'react';
import { CLIENT_BASE_URL } from '../../utils/URLs';
import { HiAtSymbol, HiOutlineUser } from 'react-icons/hi';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useFormik } from 'formik';
import { registerValidate } from '../../lib/nextAuth/account-validate';
import { useRouter } from 'next/router';
import { useGQLMutation } from '../../hooks/useGQL';
import {
	NexusGenArgTypes,
	NexusGenObjects,
} from '../../graphql/generated/nexus-typegen';

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

	const {
		mutateFunction: writeEmailVerificationToken,
		mutateData: writeEmailVerificationTokenData,
	} = useGQLMutation<
		NexusGenObjects['RedisRes'],
		NexusGenArgTypes['Mutation']['writeEmailVerificationToken']
	>(Mutations.WRITE_EMAIL_VERIFICATION_TOKEN, {
		variables: {
			email: formik.values.email,
		},
	});

	const { mutateFunction: registerUser, mutateData: registerUserData } =
		useGQLMutation<
			NexusGenObjects['RegisteredUserRes'],
			NexusGenArgTypes['Mutation']['registerUser']
		>(Mutations.REGISTER_USER);

	const { mutateFunction: sendVerificationEmail } = useGQLMutation<
		NexusGenObjects['NodeRes'],
		NexusGenArgTypes['Mutation']['sendVerificationEmail']
	>(Mutations.SEND_VERIFICATION_EMAIL);

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

			const userData: typeof registerUserData = registerUserRes.data?.[
				Object.keys(registerUserRes.data)[0] as keyof typeof registerUserData
			] as any;

			if (userData.createdUser) {
				const redisRes = await writeEmailVerificationToken({
					variables: {
						email: formik.values.email,
					},
				});

				const redisData: typeof writeEmailVerificationTokenData = redisRes
					.data?.[
					Object.keys(
						redisRes.data
					)[0] as keyof typeof writeEmailVerificationTokenData
				] as any;

				if (!redisData?.error && redisData?.token) {
					await sendVerificationEmail({
						variables: {
							recipientEmail: email,
							subject: 'Email Verification Link',
							text: 'This is the text',
							html: `<a href="${CLIENT_BASE_URL}/verification-email/${redisData.token}">Verify Email</a>`,
						},
					});
					router.push(`/verification-email-sent/${redisData.token}`);
				}
			}
			if (userData.error) {
				setRegisterErr({ error: userData.error });
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

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] w-3/4 mx-auto flex flex-col gap-10'>
				<div>
					<h1 className='text-gray-800 text-4xl font-bold py-4'>Register</h1>
				</div>

				<form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
					{formik.errors.name && formik.touched.name && (
						<span className='text-rose-500'>{formik.errors.name}</span>
					)}

					<div
						className={`border rounded-xl relative flex h-[2.5rem] ${
							formik.errors.name && formik.touched.name ? 'border-rose-600' : ''
						}`}
					>
						<input
							{...formik.getFieldProps('name')}
							type='text'
							name='name'
							placeholder='Name'
							className='w-full border-none outline-none bg-inherit pl-4'
						/>
						<span className='icon flex items-center px-4'>
							<HiOutlineUser size={25} />
						</span>
					</div>

					{formik.errors.email && formik.touched.email && (
						<span className='text-rose-500'>{formik.errors.email}</span>
					)}

					<div
						className={`border rounded-xl relative flex h-[2.5rem] ${
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
							className='w-full border-none outline-none bg-inherit pl-4'
						/>
						<span className='icon flex items-center px-4'>
							<HiAtSymbol size={25} />
						</span>
					</div>

					{formik.errors.password && formik.touched.password && (
						<span className='text-rose-500'>{formik.errors.password}</span>
					)}

					<div
						className={`border rounded-xl relative flex h-[2.5rem] ${
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
							className='w-full border-none outline-none bg-inherit pl-4'
						/>
						<span
							className='icon flex items-center px-4 cursor-pointer'
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
						className={`border rounded-xl relative flex h-[2.5rem] ${
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
							className='w-full border-none outline-none bg-inherit pl-4'
						/>
						<span
							className='icon flex items-center px-4 cursor-pointer'
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
							className='w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md py-3 text-gray-50 text-lg'
						>
							Sign Up
						</button>
					</div>
				</form>

				{registerErr.error && (
					<span className='text-rose-500 text-center'>{registerErr.error}</span>
				)}

				<div className='flex flex-col items-center'>
					<p className='text-center text-gray-400 '>Have an account? </p>
					<Link href='/auth/login'>Login</Link>
				</div>
			</main>
		</>
	);
}
