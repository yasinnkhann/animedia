import { useState } from 'react';
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
	routeType?: string;
	isProfile?: boolean;
}

const DropDownItem = ({ items, isProfile, name, routeType }: Props) => {
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

			const rgb = `rgb(${String(r)},${String(g)},${String(b)})`;

			if (tinycolor(rgb).isDark()) return rgb;
		}
	});

	const handleOpenChange = (flag: boolean) => {
		setOpen(flag);
	};

	const handleMenuClick: MenuProps['onClick'] = e => {
		setOpen(false);

		if (routeType) {
			router.push(`/${routeType}/${e.key}`);
		} else {
			signOut({
				callbackUrl: '/',
			});
		}
	};

	const renderAvatar = () => {
		if (session?.user?.image || (session as any)?.token?.picture) {
			return (
				<Avatar
					onClick={() => setOpen(currOpen => !currOpen)}
					src={session?.user?.image || (session as any)?.token?.picture}
					size='large'
				/>
			);
		} else {
			return (
				<Avatar
					onClick={() => setOpen(currOpen => !currOpen)}
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
			<a
				className='no-underline cursor-pointer'
				onClick={e => e.preventDefault()}
			>
				{isProfile ? (
					renderAvatar()
				) : (
					<p
						className='text-base'
						onClick={() => setOpen(currOpen => !currOpen)}
					>
						{name}
					</p>
				)}
			</a>
		</Dropdown>
	);
};

export default DropDownItem;
