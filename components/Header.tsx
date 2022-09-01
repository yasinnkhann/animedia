import React from 'react';
import { useRouter } from 'next/router';

const Header = () => {
	const router = useRouter();
	return (
		<header className='fixed top-0 flex items-center w-full h-[var(--header-height-mobile)] z-[999] font-[Rubik] bg-slate-300'>
			<nav className='flex w-full ml-[4rem]'>
				<section onClick={() => router.push('/')} className='cursor-pointer'>
					<p>HOME</p>
				</section>
				<section className='flex w-full justify-between ml-[4rem]'>
					<ul id='left-section' className='flex justify-around w-[50%]'>
						<li>Movies</li>
						<li>TV Shows</li>
						<li>People</li>
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
