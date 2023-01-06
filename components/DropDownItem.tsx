import React, { useState } from 'react';
import { Dropdown } from 'antd';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { Avatar } from 'antd';
import tinycolor from 'tinycolor2';
import { useSession } from 'next-auth/react';
import type { MenuProps } from 'antd';

interface Props {
	items: {
		label: string;
		key: string;
	}[];
	name?: string;
	isProfile?: boolean;
}

const DropDownItem = ({ items, isProfile, name }: Props) => {
	const { data: session } = useSession();

	const router = useRouter();

	const [open, setOpen] = useState(false);

	const [color, _setColor] = useState(() => {
		while (true) {
			const randomBetween = function (min: number, max: number) {
				return min + Math.floor(Math.random() * (max - min + 1));
			};

			const r = randomBetween(0, 255);
			const g = randomBetween(0, 255);
			const b = randomBetween(0, 255);
			const rgb = 'rgb('
				.concat(String(r), ',')
				.concat(String(g), ',')
				.concat(String(b), ')');

			if (tinycolor(rgb).isDark()) {
				return rgb;
			}
		}
	});

	const handleOpenChange = (flag: boolean) => {
		setOpen(flag);
	};

	const handleMenuClick: MenuProps['onClick'] = e => {
		setOpen(false);
		let routeType;

		if (name?.includes('My Movies')) {
			routeType = 'my-movies';
		} else if (name?.includes('My Shows')) {
			routeType = 'my-shows';
		} else if (name?.includes('Movies')) {
			routeType = 'movies';
		} else if (name?.includes('Shows')) {
			routeType = 'shows';
		} else if (name?.includes('People')) {
			routeType = 'people';
		} else {
			return signOut({
				callbackUrl: '/',
			});
		}

		router.push(`/${routeType}/${e.key}`);
	};

	const renderAvatar = () => {
		if (session?.user?.image || (session as any)?.token?.picture) {
			return (
				<Avatar
					src={session?.user?.image || (session as any)?.token?.picture}
					size='large'
				/>
			);
		} else {
			return (
				<Avatar
					style={{
						backgroundColor: color,
						verticalAlign: 'middle',
						fontSize: '1.3rem',
					}}
					size='large'
				>
					{session?.user?.name![0].toUpperCase() ||
						(session as any)?.token?.name![0].toUpperCase()}
				</Avatar>
			);
		}
	};

	return (
		<Dropdown
			menu={{ items, onClick: handleMenuClick }}
			placement='bottom'
			arrow={{ pointAtCenter: true }}
			onOpenChange={handleOpenChange}
			open={open}
		>
			<a className='no-underline' onClick={e => e.preventDefault()}>
				{isProfile ? renderAvatar() : <p className='text-base'>{name}</p>}
			</a>
		</Dropdown>
	);
};

export default DropDownItem;
