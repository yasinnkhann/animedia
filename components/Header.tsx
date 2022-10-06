import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import DropDownItem from './UI/DropDownItem';
import 'antd/dist/antd.css';

const Header = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	if (status === 'loading') {
		return <></>;
	}

	const moviesItems = [
		{
			label: 'Popular Movies',
			key: 'popular',
		},
		{
			label: 'Top Rated Movies',
			key: 'top-rated',
		},
		{
			label: 'Popular Anime Movies',
			key: 'popular-anime',
		},
		{
			label: 'Explore Movies by Genre',
			key: 'genre',
		},
	];

	const showsItems = [
		{
			label: 'Popular Shows',
			key: 'popular',
		},
		{
			label: 'Top Rated Shows',
			key: 'top-rated',
		},
		{
			label: 'Popular Anime Shows',
			key: 'popular-anime',
		},
		{
			label: 'Explore Shows by Genre',
			key: 'genre',
		},
	];

	const peopleItems = [
		{
			label: 'Popular People',
			key: 'popular',
		},
	];

	return (
		<header className='fixed top-0 !flex !items-center w-full h-[var(--header-height-mobile)] z-[999] !font-[Rubik] bg-gray-100 !text-base'>
			<nav className='!flex !items-center w-full ml-[4rem]'>
				<section onClick={() => router.push('/')} className='cursor-pointer'>
					<p className='!mb-0'>HOME</p>
				</section>
				<section className='!flex w-full justify-between ml-[4rem] !items-center'>
					<ul id='left-section' className='!flex justify-around w-[50%] !mb-0'>
						<li>
							<DropDownItem items={moviesItems} name='Movies' />
						</li>
						<li>
							<DropDownItem items={showsItems} name='Shows' />
						</li>
						<li>
							<DropDownItem items={peopleItems} name='People' />
						</li>
					</ul>
					<ul
						id='right-section'
						className='!flex !justify-around !w-[20rem] !mr-4'
					>
						<li className='!flex !justify-around !items-center !w-full'>
							{status === 'authenticated' && (
								<>
									<a onClick={() => router.push('/my-shows')}>My Shows</a>
									<a onClick={() => router.push('/my-movies')}>My Movies</a>
								</>
							)}
							{status === 'unauthenticated' && (
								<a onClick={() => signIn()}>Login</a>
							)}
							{status === 'authenticated' && (
								<DropDownItem
									items={[
										{
											label: 'Log Out',
											key: 'log-out',
										},
									]}
									isProfile={true}
								/>
							)}
						</li>
					</ul>
				</section>
			</nav>
		</header>
	);
};

export default Header;
