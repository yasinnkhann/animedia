import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import DropDownItem from './DropDownItem';
import { AiFillHome } from 'react-icons/ai';
import { BiLogIn } from 'react-icons/bi';
import { TbSearch } from 'react-icons/tb';
import { RxCross1 } from 'react-icons/rx';
import SearchBar from '../components/UI/SearchUI/SearchBar';
import { motion } from 'framer-motion';
import {
	MY_MEDIA_ITEMS,
	MOVIES_ITEMS,
	SHOWS_ITEMS,
	PEOPLE_ITEMS,
} from 'models/dropDownOptions';

const Header = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [isSearchBtnClicked, setIsSearchBtnClicked] = useState(false);
	const searchBarRef = useRef<HTMLInputElement>(null);

	if (status === 'loading') {
		return <></>;
	}

	return (
		<>
			<header className='fixed top-0 z-[999] !flex h-[var(--header-height-mobile)] w-full !items-center bg-gray-100 !font-[Rubik] !text-base'>
				<nav className='ml-[4rem] !flex w-full !items-center'>
					<section>
						<Link href='/'>
							<a className='!mb-0 text-black hover:text-black'>
								<AiFillHome
									size={25}
									onClick={() => setIsSearchBtnClicked(false)}
								/>
							</a>
						</Link>
					</section>
					<section className='ml-[4rem] !flex w-full !items-center justify-between'>
						<ul
							id='left-section'
							className='!mb-0 !flex w-[50%] justify-around'
						>
							<li>
								<DropDownItem
									items={MOVIES_ITEMS}
									name='Movies'
									routeType='movies'
								/>
							</li>
							<li>
								<DropDownItem
									items={SHOWS_ITEMS}
									name='Shows'
									routeType='shows'
								/>
							</li>
							<li>
								<DropDownItem
									items={PEOPLE_ITEMS}
									name='People'
									routeType='people'
								/>
							</li>
						</ul>
						<ul
							id='right-section'
							className='!mr-4 !flex !w-[20rem] !justify-around'
						>
							<li
								className={`!flex !w-full !items-center ${
									status === 'authenticated'
										? '!justify-around'
										: 'mr-8 !justify-end'
								}`}
							>
								{status === 'authenticated' && session && (
									<>
										<DropDownItem
											items={MY_MEDIA_ITEMS}
											name='My Shows'
											routeType='my-shows'
										/>
										<DropDownItem
											items={MY_MEDIA_ITEMS}
											name='My Movies'
											routeType='my-movies'
										/>
									</>
								)}

								{router.pathname !== '/' &&
									router.pathname !== '/search' &&
									router.pathname !== '/auth/login' &&
									router.pathname !== '/auth/register' &&
									(!isSearchBtnClicked ? (
										<TbSearch
											className='mr-4 cursor-pointer'
											size={25}
											onClick={() => {
												setIsSearchBtnClicked(curr => !curr);
												if (searchBarRef.current) {
													searchBarRef.current.placeholder =
														'Search for a movie, tv show, or person...';
													searchBarRef.current.focus();
												}
												window.scrollTo(0, 0);
											}}
										/>
									) : (
										<RxCross1
											className='mr-4 cursor-pointer'
											size={25}
											onClick={() => {
												setIsSearchBtnClicked(curr => !curr);
												searchBarRef.current!.value = '';
											}}
										/>
									))}

								{status === 'unauthenticated' &&
									router.pathname !== '/auth/login' && (
										<div
											className='flex cursor-pointer items-center'
											onClick={() => signIn()}
										>
											<BiLogIn size={30} />
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
					initial={{ y: 0 }}
					animate={{ y: 75 }}
					transition={{
						duration: 1.3,
						ease: [0.08, 0.69, 0.2, 0.99],
					}}
				>
					<div className='mb-24'>
						<SearchBar
							ref={searchBarRef}
							closeSearch={() => setIsSearchBtnClicked(false)}
							isSearchBtnClicked={isSearchBtnClicked}
						/>
					</div>
				</motion.div>
			)}
		</>
	);
};

export default Header;
