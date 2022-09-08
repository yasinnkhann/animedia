import React from 'react';
import { Select } from 'antd';
import {
	SORT_BY_OPTIONS,
	MOVIE_GENRE_TYPE_OPTIONS,
	SHOW_GENRE_TYPE_OPTIONS,
} from '../../models/dropDownOptions';

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

const { Option } = Select;

const handleSortByChange = (value: string) => {
	console.log(`selected ${value}`);
};

const handleGenreTypeChange = (value: string | string[]) => {
	console.log(`Selected: ${value}`);
};

const Genre = () => {
	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			show genre
			<br />
			<br />
			<div>
				<label className='block mb-1 text-blue-500' htmlFor='sort-by-dropdown'>
					Sort By:
				</label>
				<Select
					id='sort-by-dropdown'
					defaultValue='Popular'
					style={{ width: 120 }}
					onChange={handleSortByChange}
				>
					{SORT_BY_OPTIONS.map(option => (
						<Option key={option.value} value={option.value}>
							{option.text}
						</Option>
					))}
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
					defaultValue='Action & Adventure'
					onChange={handleGenreTypeChange}
					style={{ width: 200 }}
				>
					{SHOW_GENRE_TYPE_OPTIONS.map(option => (
						<Option key={option.value} value={option.value}>
							{option.text}
						</Option>
					))}
				</Select>
				<br />
			</>
		</section>
	);
};

export default Genre;
