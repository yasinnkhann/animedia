import { useFormik } from 'formik';
import { loginValidate } from 'lib/nextAuth/account-validate';
import Head from 'next/head';

const ForgotPassword: React.FC = () => {
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validate: loginValidate,
		onSubmit,
	});

	async function onSubmit() {
		const { email, password } = formik.values;
	}
	return (
		<>
			<Head>
				<title>Forgot your Password</title>
			</Head>

			<main className='mx-auto mt-[calc(var(--header-height-mobile)+1rem)] flex w-1/2 flex-col gap-10'>
				<div className='flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8'>
					<div className='w-full max-w-md space-y-8'>
						<div>
							<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
								Forgot your password?
							</h2>
							<p className='mt-2 text-center text-sm text-gray-600'>
								Enter your email address and well send you a link to reset your
								password.
							</p>
						</div>
						<form className='mt-8 space-y-6' action='#' method='POST'>
							<input type='hidden' name='remember' defaultValue='true' />
							<div className='-space-y-px rounded-md shadow-sm'>
								<div>
									<label htmlFor='email-address' className='sr-only'>
										Email address
									</label>
									<input
										id='email-address'
										name='email'
										type='email'
										autoComplete='email'
										required
										className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
										placeholder='Email address'
									/>
								</div>
							</div>

							<div>
								<button
									type='submit'
									className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
								>
									Send reset link
								</button>
							</div>
						</form>
					</div>
				</div>
			</main>
		</>
	);
};

export default ForgotPassword;
