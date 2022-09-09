import React, { useState } from 'react';
import { Dropdown, Space } from 'antd';

interface Props {
	menu: JSX.Element;
	name: string;
}

const DropDownItem = ({ menu, name }: Props) => {
	const [open, setOpen] = useState(false);

	const handleOpenChange = (flag: boolean) => {
		setOpen(flag);
	};

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
