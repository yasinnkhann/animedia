import React, { useRef, forwardRef, useState } from 'react';
import { useRouter } from 'next/router';

const SearchBar = forwardRef<HTMLInputElement>((props, ref) => {
	const router = useRouter();

	const [searchQuery, setSearchQuery] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (searchQuery.trim().length === 0) return;

		router.push(`/search?q=${searchQuery.trim().split(' ').join('+')}`);
	};

	return (
		<form
			className='flex justify-center w-full relative'
			onSubmit={handleSubmit}
		>
			<input
				className='w-[calc(100%-2rem)] text-base py-4 pl-[3rem] pr-4 bg-gray-300 text-gray-700 rounded-md border-none transition duration-300 focus:border-0 focus:outline-none focus:shadow-[0_1px_12px_#5272a2]'
				type='text'
				placeholder='Search for a movie, tv show, or person...'
				ref={ref}
				onChange={e => setSearchQuery(e.target.value)}
				{...props}
			/>
			<button
				className='absolute bg-transparent text-[1.5rem] text-gray-700 z-10 border-none transition-all hover:cursor-pointer hover:text-black hover:scale-125 focus:text-black focus:outline-none left-[calc(100%-3rem)] top-2'
				type='submit'
			>
				<i className='fas fa-search'></i>
			</button>
		</form>
	);
});
SearchBar.displayName = 'SearchBar';

export default SearchBar;
