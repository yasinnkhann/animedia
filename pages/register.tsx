import Head from 'next/head';
import Link from 'next/link';
import { HiAtSymbol, HiFingerPrint, HiOutlineUser } from 'react-icons/hi';
import { useState } from 'react';
import { useFormik } from 'formik';
import { registerValidate } from '../lib/nextAuth/account-validate';
import { useRouter } from 'next/router';

export default function Register() {
	const [show, setShow] = useState({ password: false, cpassword: false });
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			password: '',
			cpassword: '',
		},
		validate: registerValidate,
		onSubmit,
	});

	async function onSubmit(values: any) {
		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
		};

		await fetch('http://localhost:3000/api/auth/register', options)
			.then(res => res.json())
			.then(data => {
				if (data) router.push('http://localhost:3000');
			});
	}

	return (
		<>
			<Head>
				<title>Register</title>
			</Head>

			<section className='w-3/4 mx-auto flex flex-col gap-10'>
				<div className='title'>
					<h1 className='text-gray-800 text-4xl font-bold py-4'>Register</h1>
					<p className='w-3/4 mx-auto text-gray-400'>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
						officia?
					</p>
				</div>

				{/* form */}
				<form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
					<div>
						<input
							{...formik.getFieldProps('name')}
							type='text'
							name='Name'
							placeholder='Name'
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
							{...formik.getFieldProps('cpassword')}
							type={`${show.cpassword ? 'text' : 'password'}`}
							name='cpassword'
							placeholder='Confirm Password'
						/>
						<span
							className='icon flex items-center px-4'
							onClick={() => setShow({ ...show, cpassword: !show.cpassword })}
						>
							<HiFingerPrint size={25} />
						</span>
					</div>
					{/* {formik.errors.cpassword && formik.touched.cpassword ? <span className='text-rose-500'>{formik.errors.cpassword}</span> : <></>} */}

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
			</section>
		</>
	);
}
