import React, { useRef } from 'react';
import { useRouter } from 'next/router';

const SearchBar = () => {
	const router = useRouter();
	const searchRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (searchRef.current?.value.trim().length === 0) return;

		router.push(
			`/search?q=${searchRef.current?.value.trim().split(' ').join('+')}`
		);
	};

	return (
		<form className='flex justify-center w-full relative'>
			<input
				className='w-[98%] text-base py-4 pl-[3rem] pr-4 bg-gray-300 text-gray-700 rounded-md border-none transition duration-300 focus:border-0 focus:outline-none focus:shadow-[0_1px_12px_#b8c6db]'
				type='text'
				placeholder='Search for a movie, tv show, or person...'
				ref={searchRef}
			/>
			<button
				onClick={handleSubmit}
				className='absolute bg-transparent text-[1.5rem] text-gray-700 z-10 border-none transition-all hover:cursor-pointer hover:text-black hover:scale-125 focus:text-black focus:outline-none left-[calc(100%-3rem)] top-2'
				type='submit'
			>
				<i className='fas fa-search'></i>
			</button>
		</form>
	);
};

export default SearchBar;
