import React from 'react';

interface Props {}

const SearchBar = (props: Props) => {
	return (
		<div>
			<form>
				<input
					type='text'
					placeholder='Search for a movie, tv show, or person...'
				/>
				<button type='button'>
					<i className='fas fa-search'></i>
				</button>
			</form>
		</div>
	);
};

export default SearchBar;
