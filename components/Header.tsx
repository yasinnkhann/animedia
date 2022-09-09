import React, { useState } from 'react';
import { useRouter } from 'next/router';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import DropDownItem from './UI/DropDownItem';
import 'antd/dist/antd.css';

const Header = () => {
	const router = useRouter();

	const [open, setOpen] = useState(false);

	const handleMenuClick: MenuProps['onClick'] = e => {
		setOpen(false);
		const { textContent } = e.domEvent.currentTarget;
		let routeType;

		if (textContent?.includes('Movies')) {
			routeType = 'movies';
		} else if (textContent?.includes('Shows')) {
			routeType = 'shows';
		} else if (textContent?.includes('People')) {
			routeType = 'people';
		}

		router.push(`/${routeType}/${e.key}`);
	};

	const moviesMenu = (
		<Menu
			onClick={handleMenuClick}
			items={[
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
			]}
		/>
	);

	const showsMenu = (
		<Menu
			onClick={handleMenuClick}
			items={[
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
			]}
		/>
	);

	const peopleMenu = (
		<Menu
			onClick={handleMenuClick}
			items={[
				{
					label: 'People People',
					key: 'popular',
				},
			]}
		/>
	);

	return (
		<header className='fixed top-0 !flex !items-center w-full h-[var(--header-height-mobile)] z-[999] !font-[Rubik] bg-slate-300 !text-base'>
			<nav className='!flex !items-center w-full ml-[4rem]'>
				<section onClick={() => router.push('/')} className='cursor-pointer'>
					<p className='!mb-0'>HOME</p>
				</section>
				<section className='!flex w-full justify-between ml-[4rem] !items-center'>
					<ul id='left-section' className='!flex justify-around w-[50%] !mb-0'>
						<li>
							<DropDownItem menu={moviesMenu} name='Movies' />
						</li>
						<li>
							<DropDownItem menu={showsMenu} name='Shows' />
						</li>
						<li>
							<DropDownItem menu={peopleMenu} name='People' />
						</li>
					</ul>
					<ul id='right-section' className='!flex justify-around w-[15%]'>
						<li>EN</li>
						<li>Login</li>
					</ul>
				</section>
			</nav>
		</header>
	);
};

export default Header;
