import React from 'react';
import { Select } from 'antd';

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

const { Option } = Select;

const handleSortByChange = (value: string) => {
	console.log(`selected ${value}`);
};

const children: React.ReactNode[] = [];
for (let i = 10; i < 36; i++) {
	children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const handleChange = (value: string | string[]) => {
	console.log(`Selected: ${value}`);
};

const Genre = () => {
	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			movie genre
			<br />
			<br />
			<div>
				<label className='block mb-1 text-blue-500' htmlFor='sort-by-dropdown'>
					Sort By:
				</label>
				<Select
					id='sort-by-dropdown'
					defaultValue='popular'
					style={{ width: 120 }}
					onChange={handleChange}
				>
					<Option value='popular'>Popular</Option>
					<Option value='trending'>Trending</Option>
				</Select>
			</div>
			<>
				<br />
				<br />
				<label
					className='block mb-1 text-blue-500'
					htmlFor='genre-type-dropdown'
				>
					Genre Type:
				</label>
				<Select
					id='genre-type-dropdown'
					size='middle'
					defaultValue='a1'
					onChange={handleChange}
					style={{ width: 200 }}
				>
					{children}
				</Select>
				<br />
			</>
		</section>
	);
};

export default Genre;
