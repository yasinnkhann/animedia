import React from 'react';

interface Props {}

const SearchBar = (props: Props) => {
	return (
		<form className='flex justify-center w-full relative'>
			<input
				className='w-[98%] text-base py-4 pl-[3rem] pr-4 bg-gray-300 text-gray-700 rounded-md border-none transition duration-300 focus:border-0 focus:outline-none focus:shadow-[0_1px_12px_#b8c6db]'
				type='text'
				placeholder='Search for a movie, tv show, or person...'
			/>
			<button
				className='absolute bg-transparent text-[1.5rem] text-gray-700 z-10 border-none transition-all hover:cursor-pointer hover:text-black hover:scale-125 focus:text-black focus:outline-none left-[calc(100%-3rem)] top-2'
				type='button'
			>
				<i className='fas fa-search'></i>
			</button>
		</form>
	);
};

export default SearchBar;
