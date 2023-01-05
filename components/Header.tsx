import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import DropDownItem from './DropDownItem';
import { AiFillHome } from 'react-icons/ai';
import { BiLogIn } from 'react-icons/bi';
import { TbSearch } from 'react-icons/tb';
import { ImCross } from 'react-icons/im';
import SearchBar from '../components/UI/SearchUI/SearchBar';
import { motion } from 'framer-motion';

const Header = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [isSearchBtnClicked, setIsSearchBtnClicked] = useState(false);
	const searchBarRef = useRef<HTMLInputElement>(null);

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
		<>
			<header className='fixed top-0 !flex !items-center w-full h-[var(--header-height-mobile)] z-[999] !font-[Rubik] bg-gray-100 !text-base'>
				<nav className='!flex !items-center w-full ml-[4rem]'>
					<section>
						<Link href='/'>
							<a className='text-black hover:text-black !mb-0'>
								<AiFillHome
									size={25}
									onClick={() => setIsSearchBtnClicked(false)}
								/>
							</a>
						</Link>
					</section>
					<section className='!flex w-full justify-between ml-[4rem] !items-center'>
						<ul
							id='left-section'
							className='!flex justify-around w-[50%] !mb-0'
						>
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
							<li
								className={`!flex !items-center !w-full ${
									status === 'authenticated'
										? '!justify-around'
										: '!justify-end mr-8'
								}`}
							>
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

								{router.pathname !== '/' &&
									router.pathname !== '/search' &&
									(!isSearchBtnClicked ? (
										<TbSearch
											className='cursor-pointer'
											size={25}
											onClick={() => {
												setIsSearchBtnClicked(curr => !curr);
												window.scrollTo(0, 0);
											}}
										/>
									) : (
										<ImCross
											className='cursor-pointer'
											size={20}
											onClick={() => setIsSearchBtnClicked(curr => !curr)}
										/>
									))}

								{status === 'unauthenticated' && (
									<div
										className='flex items-center cursor-pointer ml-8'
										onClick={() => signIn()}
									>
										<p className='text-base'>Login</p>
										<BiLogIn className='ml-2' size={30} />
									</div>
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
			{isSearchBtnClicked && (
				<motion.div
					animate={{ y: 75 }}
					transition={{
						duration: 1,
						ease: [0.08, 0.69, 0.2, 0.99],
					}}
				>
					<div className='mb-24'>
						<SearchBar
							ref={searchBarRef}
							closeSearch={() => setIsSearchBtnClicked(false)}
						/>
					</div>
				</motion.div>
			)}
		</>
	);
};

export default Header;
