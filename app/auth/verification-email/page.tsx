import request from 'graphql-request';
import { redirect } from 'next/navigation';
import { SERVER_BASE_URL } from '../../../utils/constants';
import * as Queries from '../../../graphql/queries';
import * as Mutations from '../../../graphql/mutations';
import _ from 'lodash';
import Link from 'next/link';

interface PageProps {
	searchParams: Promise<{ uid?: string; token?: string }>;
}

export default async function VerificationEmailPage({ searchParams }: PageProps) {
	const { uid, token } = await searchParams;

	if (!uid || !token) {
		redirect('/');
	}

	try {
		const verifyTokenRes: any = await request(
			SERVER_BASE_URL,
			Queries.CHECK_EMAIL_VERIFICATION_TOKEN,
			{
				token: token,
				userId: uid,
			}
		);

		const verifyTokenData = verifyTokenRes.checkEmailVerificationToken;

		if (!verifyTokenData?.userId || !_.isEmpty(verifyTokenData.errors)) {
			redirect('/');
		}

		const verifyUserEmailRes: any = await request(SERVER_BASE_URL, Mutations.VERIFY_USER_EMAIL, {
			userId: verifyTokenData.userId,
		});

		if (
			!verifyUserEmailRes.verifyUserEmail ||
			!_.isEmpty(verifyUserEmailRes.verifyUserEmail?.errors)
		) {
			redirect('/');
		}
	} catch (err) {
		console.error(err);
		redirect('/');
	}

	return (
		<main className='mx-auto mt-[calc(var(--header-height-mobile)+2rem)] flex w-full items-center justify-center px-4'>
			<section className='w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg'>
				<div className='mb-8 text-center'>
					<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50'>
						<svg
							className='h-8 w-8 text-green-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M5 13l4 4L19 7'
							/>
						</svg>
					</div>
					<h2 className='text-3xl font-extrabold tracking-tight text-gray-900'>Verified!</h2>
					<p className='mt-3 text-sm text-gray-500'>
						You have been successfully verified! You can now login to your account.
					</p>
				</div>

				<div className='flex flex-col gap-4'>
					<Link
						href='/auth/login'
						className='flex items-center justify-center rounded-lg bg-blue-600 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none active:scale-[0.98]'
					>
						Go to Login
					</Link>
				</div>
			</section>
		</main>
	);
}
