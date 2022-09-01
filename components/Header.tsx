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
				<ul className='flex w-full justify-around'>
					<section id='leftSection' className='flex w-[40%] justify-around'>
						<li>Movies</li>
						<li>TV Shows</li>
						<li>People</li>
					</section>
					<section id='rightSection' className='flex justify-around w-[15%]'>
						<li>EN</li>
						<li className=''>Login</li>
					</section>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
