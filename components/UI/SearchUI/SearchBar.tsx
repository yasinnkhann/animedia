import { forwardRef, useState, useEffect, RefObject } from 'react';
import { useRouter } from 'next/router';
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from 'hooks/useDebounce';

interface Props {
	closeSearch?: () => void;
	isSearchBtnClicked?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, Props>(
	({ closeSearch, isSearchBtnClicked }, ref) => {
		const router = useRouter();

		const [searchQuery, setSearchQuery] = useState('');

		// useDebounce(() => alert(searchQuery), 3000, [searchQuery]);

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
				className='relative flex w-full flex-col items-center justify-center'
				onSubmit={handleSubmit}
			>
				<input
					className='w-[calc(100%-2rem)] rounded-md border-none bg-gray-300 py-4 pl-12 pr-4 text-base text-gray-700 transition duration-300 focus:border-0 focus:shadow-[0_1px_12px_#5272a2] focus:outline-none'
					type='text'
					placeholder='Search for a movie, tv show, or person...'
					ref={ref}
					onChange={e => setSearchQuery(e.target.value)}
				/>
				<button
					className='absolute left-[calc(100%-3.5rem)] top-3.5 z-10 border-none bg-transparent text-[1.5rem] text-gray-700 transition-all focus:text-black focus:outline-none hover:scale-125 hover:cursor-pointer hover:text-black'
					type='submit'
				>
					<FaSearch />
				</button>
				{/* <div className='h-9 w-[calc(100%-2rem)] bg-gray-500'>Howdy</div> */}
			</form>
		);
	}
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
