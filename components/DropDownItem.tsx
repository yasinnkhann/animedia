import React, { useState } from 'react';
import { Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { Menu } from 'antd';
import { signOut } from 'next-auth/react';
import { Avatar } from 'antd';
import tinycolor from 'tinycolor2';
import { useSession } from 'next-auth/react';

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
		const { textContent } = e.domEvent.currentTarget;
		let routeType;

		if (textContent?.includes('Movies')) {
			routeType = 'movies';
		} else if (textContent?.includes('Shows')) {
			routeType = 'shows';
		} else if (textContent?.includes('People')) {
			routeType = 'people';
		} else {
			return signOut({
				callbackUrl: '/',
			});
		}

		router.push(`/${routeType}/${e.key}`);
	};

	const renderAvatar = () => {
		if (session?.user?.image || (session?.token as any)?.picture) {
			return (
				<Avatar
					src={session?.user?.image || (session?.token as any)?.picture}
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
						(session?.token as any)?.name![0].toUpperCase()}
				</Avatar>
			);
		}
	};

	const menu = <Menu onClick={handleMenuClick} items={items} />;

	return (
		<Dropdown
			overlay={menu}
			placement='bottom'
			arrow={{ pointAtCenter: true }}
			onOpenChange={handleOpenChange}
			open={open}
		>
			<a onClick={e => e.preventDefault()}>
				{isProfile ? renderAvatar() : <Space>{name}</Space>}
			</a>
		</Dropdown>
	);
};

export default DropDownItem;
