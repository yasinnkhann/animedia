import React from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import DropDownItem from './DropDownItem';
import { AiFillHome } from 'react-icons/ai';
import 'antd/dist/antd.css';

const Header = () => {
	const { data: session, status } = useSession();

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
				<section>
					<Link href='/'>
						<a className='text-black hover:text-black text-2xl !mb-0'>
							<AiFillHome />
						</a>
					</Link>
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
							{status === 'authenticated' && session && (
								<>
									<Link href='/my-shows'>
										<a>My Shows</a>
									</Link>

									<Link href='/my-movies'>
										<a>My Movies</a>
									</Link>
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
