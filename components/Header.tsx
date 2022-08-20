import React from 'react';

const Header = () => {
	return (
		<header className='fixed top-0 flex items-center w-full h-[var(--header-height-mobile)] z-[999] font-[Rubik] bg-slate-300'>
			<nav className='flex w-full'>
				<ul className='flex w-full justify-between'>
					<section id='leftSection' className='flex w-[40%] justify-around'>
						<li>Movies</li>
						<li>TV Shows</li>
						<li>People</li>
					</section>
					<section id='rightSection' className='flex justify-around w-[20%]'>
						<li>EN</li>
						<li className=''>Login</li>
					</section>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
