import React from 'react';
import { useRouter } from 'next/router';

const Header = () => {
	const router = useRouter();

	return (
		<header className='fixed top-0 flex items-center w-full h-[var(--header-height-mobile)] z-[999] font-[Rubik] bg-slate-300'>
			<nav className='flex items-center w-full ml-[4rem]'>
				<section onClick={() => router.push('/')} className='cursor-pointer'>
					<p>HOME</p>
				</section>
				<section className='flex w-full justify-between ml-[4rem] items-center'>
					<ul id='left-section' className='flex justify-around w-[50%]'>
						<li className='group relative inline-block hover:block'>
							<p className='text-black p-3 m-0 no-underline block'>Movies</p>
							<div className='hidden absolute bg-red-500 min-w-[160px] rounded shadow z-[1] group-hover:block'>
								<p
									className='text-black p-3 m-0 no-underline block hover:bg-slate-500 rounded'
									onClick={() => router.push('/movies/popular')}
								>
									Popular Movies
								</p>
								<p
									className='text-black p-3 m-0 no-underline block hover:bg-slate-500 rounded'
									onClick={() => router.push('/movies/top-rated')}
								>
									Top Rated
								</p>
								<p
									className='text-black p-3 m-0 no-underline block hover:bg-slate-500 rounded'
									onClick={() => router.push('/movies/popular-anime')}
								>
									Popular Anime Movies
								</p>
								<p
									className='text-black p-3 m-0 no-underline block hover:bg-slate-500 rounded'
									onClick={() => router.push('/movies/genre')}
								>
									Find Movies by Genre
								</p>
							</div>
						</li>
						<li className='group relative inline-block hover:block'>
							<p className='text-black p-3 m-0 no-underline block'>TV Shows</p>
							<div className='hidden absolute bg-red-500 min-w-[160px] rounded shadow z-[1] group-hover:block'>
								<p
									className='text-black p-3 m-0 no-underline block hover:bg-slate-500 rounded'
									onClick={() => router.push('/shows/popular')}
								>
									Most Popular
								</p>
								<p
									className='text-black p-3 m-0 no-underline block hover:bg-slate-500 rounded'
									onClick={() => router.push('/shows/top-rated')}
								>
									Top Rated
								</p>
								<p
									className='text-black p-3 m-0 no-underline block hover:bg-slate-500 rounded'
									onClick={() => router.push('/shows/popular-anime')}
								>
									Popular Anime Shows
								</p>
								<p
									className='text-black p-3 m-0 no-underline block hover:bg-slate-500 rounded'
									onClick={() => router.push('/shows/genre')}
								>
									Find Shows by Genre
								</p>
							</div>
						</li>
						<li className='group relative inline-block hover:block'>
							<p className='text-black p-3 m-0 no-underline block'>People</p>
							<div className='hidden absolute bg-red-500 min-w-[160px] rounded shadow z-[1] group-hover:block'>
								<p
									className='text-black p-3 m-0 no-underline block hover:bg-slate-500 rounded'
									onClick={() => router.push('/people/popular')}
								>
									Most Popular
								</p>
							</div>
						</li>
					</ul>
					<ul id='right-section' className='flex justify-around w-[15%]'>
						<li>EN</li>
						<li>Login</li>
					</ul>
				</section>
			</nav>
		</header>
	);
};

export default Header;
