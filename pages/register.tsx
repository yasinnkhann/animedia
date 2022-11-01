import Head from 'next/head';
import Link from 'next/link';
import { HiAtSymbol, HiFingerPrint, HiOutlineUser } from 'react-icons/hi';
import { useState } from 'react';
import { useFormik } from 'formik';
import { registerValidate } from '../lib/nextAuth/account-validate';
import { useRouter } from 'next/router';
import { useGQLMutation } from '../hooks/useGQL';
import { IUseGQLMutation, INodeMailerInfo } from '@ts/interfaces';
import {
	NexusGenArgTypes,
	NexusGenObjects,
} from '../graphql/generated/nexus-typegen';
import * as Mutations from '../graphql/mutations';
import { CLIENT_BASE_URL } from '../utils/URLs';

export default function Register() {
	const [show, setShow] = useState({ password: false, confirmPassword: false });

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

	const {
		mutateFunction: writeEmailVerificationToken,
		mutateData: writeEmailVerificationTokenData,
	}: IUseGQLMutation<
		NexusGenObjects['redisRes'],
		NexusGenArgTypes['Mutation']['writeEmailVerificationToken']
	> = useGQLMutation<
		NexusGenArgTypes['Mutation']['writeEmailVerificationToken']
	>(Mutations.MUTATION_WRITE_EMAIL_VERIFICATION_TOKEN, {
		variables: {
			email: formik.values.email,
		},
	});

	async function onSubmit() {
		const { name, email, password } = formik.values;
		const registerOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name,
				email,
				password,
			}),
		};
		try {
			const registerRes = await fetch(
				`${CLIENT_BASE_URL}/api/auth/register`,
				registerOptions
			);

			const registerData = await registerRes.json();

			if (registerData.status === 201 && registerData.user) {
				console.log('DATA FROM ON SUBMIT: ', registerData);
				const redisRes = await writeEmailVerificationToken({
					variables: {
						email: formik.values.email,
					},
				});

				const redisData: typeof writeEmailVerificationTokenData =
					redisRes.data?.[Object.keys(redisRes.data)[0]];

				console.log('REDIS DATA: ', redisData);
				if (!redisData?.error && redisData?.token) {
					const nodeMailerInfo: INodeMailerInfo = {
						recipientEmail: email,
						subject: 'Email Verification Link',
						text: 'This is the text',
						html: `<a href="${CLIENT_BASE_URL}/verification-email/${redisData.token}">Verify Email</a>`,
					};

					const nodeMailerOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(nodeMailerInfo),
					};

					const nodeMailerRes = await fetch(
						`${CLIENT_BASE_URL}/api/auth/send-verification-email`,
						nodeMailerOptions
					);

					const nodeMailerData = await nodeMailerRes.json();
					console.log('NODEMAILER DATA: ', nodeMailerData);
					router.push(`/verification-email-sent/${redisData.token}`);
				}
			}
		} catch (err) {
			console.error(err);
		}
	}

	console.log('FORMIK ERRS: ', formik.errors);

	return (
		<>
			<Head>
				<title>Register</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				<div className='title'>
					<h1 className='text-gray-800 text-4xl font-bold py-4'>Register</h1>
				</div>

				{/* form */}
				<form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
					<div>
						<input
							{...formik.getFieldProps('name')}
							type='text'
							placeholder='Name'
							name='name'
						/>
						<span className='icon flex items-center px-4'>
							<HiOutlineUser size={25} />
						</span>
					</div>
					{/* {formik.errors.name && formik.touched.name ? <span className='text-rose-500'>{formik.errors.name}</span> : <></>} */}
					<div>
						<input
							{...formik.getFieldProps('email')}
							type='email'
							placeholder='Email'
							name='email'
						/>
						<span className='icon flex items-center px-4'>
							<HiAtSymbol size={25} />
						</span>
					</div>
					{/* {formik.errors.email && formik.touched.email ? <span className='text-rose-500'>{formik.errors.email}</span> : <></>} */}
					<div>
						<input
							{...formik.getFieldProps('password')}
							type={`${show.password ? 'text' : 'password'}`}
							name='password'
							placeholder='password'
						/>
						<span
							className='icon flex items-center px-4'
							onClick={() => setShow({ ...show, password: !show.password })}
						>
							<HiFingerPrint size={25} />
						</span>
					</div>
					{/* {formik.errors.password && formik.touched.password ? <span className='text-rose-500'>{formik.errors.password}</span> : <></>} */}

					<div>
						<input
							{...formik.getFieldProps('confirmPassword')}
							type={`${show.confirmPassword ? 'text' : 'password'}`}
							name='confirmPassword'
							placeholder='Confirm Password'
						/>
						<span
							className='icon flex items-center px-4'
							onClick={() =>
								setShow({ ...show, confirmPassword: !show.confirmPassword })
							}
						>
							<HiFingerPrint size={25} />
						</span>
					</div>
					{/* {formik.errors.confirmPassword && formik.touched.confirmPassword ? <span className='text-rose-500'>{formik.errors.confirmPassword}</span> : <></>} */}

					{/* login buttons */}
					<div className='input-button'>
						<button type='submit'>Sign Up</button>
					</div>
				</form>

				{/* bottom */}
				<p className='text-center text-gray-400 '>
					Have an account?{' '}
					<Link href={'/login'}>
						<a className='text-blue-700'>Sign In</a>
					</Link>
				</p>
			</main>
		</>
	);
}
