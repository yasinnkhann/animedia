import React, { forwardRef, useState, useEffect, RefObject } from 'react';
import { useRouter } from 'next/router';
import { FaSearch } from 'react-icons/fa';

interface Props {
	closeSearch?: () => void;
	isSearchBtnClicked?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, Props>(
	({ closeSearch, isSearchBtnClicked }, ref) => {
		const router = useRouter();

		const [searchQuery, setSearchQuery] = useState('');

		const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (closeSearch) closeSearch();

			if (searchQuery.trim().length === 0) return;

			router.push(`/search?q=${searchQuery.trim().split(' ').join('+')}`);
		};

		useEffect(() => {
			if (isSearchBtnClicked) {
				(ref as RefObject<HTMLButtonElement>).current?.focus();
			}
		}, [isSearchBtnClicked, ref]);

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
				/>
				<button
					className='absolute bg-transparent text-[1.5rem] text-gray-700 z-10 border-none transition-all hover:cursor-pointer hover:text-black hover:scale-125 focus:text-black focus:outline-none left-[calc(100%-3.5rem)] top-3.5'
					type='submit'
				>
					<FaSearch />
				</button>
			</form>
		);
	}
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
