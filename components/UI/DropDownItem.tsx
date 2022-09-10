import React, { useState } from 'react';
import { Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { Menu } from 'antd';
import { signOut } from 'next-auth/react';

interface Props {
	items: {
		label: string;
		key: string;
	}[];
	name: string;
}

const DropDownItem = ({ items, name }: Props) => {
	const router = useRouter();

	const [open, setOpen] = useState(false);

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
			return signOut();
		}

		router.push(`/${routeType}/${e.key}`);
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
				<Space>{name}</Space>
			</a>
		</Dropdown>
	);
};

export default DropDownItem;
