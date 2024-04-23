import { useEffect } from 'react';
import { usePagination } from '../hooks/usePagination';

interface Props {
	totalItems: number;
	itemsPerPage: number;
	currPage: number;
	paginate: (pageNum: number) => void;
	siblingCount: number;
	maxPageNum?: number;
}

const Pagination = ({
	paginate,
	totalItems,
	siblingCount,
	currPage,
	itemsPerPage,
	maxPageNum,
}: Props) => {
	const paginationRange = usePagination({
		totalItems,
		itemsPerPage,
		siblingCount,
		currPage,
		maxPageNum,
	});

	const lastPage = paginationRange![paginationRange!.length - 1];

	useEffect(() => {
		if (typeof lastPage === 'number' && currPage > lastPage) {
			paginate(lastPage as number);
		}
	}, [currPage, paginate, lastPage]);

	// If there are less than 2 times in pagination range we shall not render the component
	if (currPage === 0 || paginationRange!.length < 2) {
		return null;
	}

	const goToNextPage = () => {
		paginate(currPage + 1);
	};

	const goToPrevPage = () => {
		paginate(currPage - 1);
	};

	return (
		<section className='flex justify-center py-4'>
			{/* Left navigation arrow */}
			<div className='px-2'>
				<button
					className={`cursor-pointer border-none bg-none p-0 font-sans text-inherit outline-inherit ${
						currPage === 1 ? 'cursor-default !text-gray-500' : '!text-green-700'
					}`}
					onClick={goToPrevPage}
					disabled={currPage === 1}
				>
					Back
				</button>
			</div>
			<div className='flex'>
				{paginationRange?.map((pageNumber, idx) => {
					// If the pageItem is a DOT, render the DOTS unicode character
					if (pageNumber === '...') {
						return (
							<button className='cursor-default' key={idx}>
								&#8230;
							</button>
						);
					}

					// Render our Page Pills
					return (
						<button
							className={`${
								pageNumber === currPage
									? 'cursor-default text-red-500'
									: 'cursor-pointer'
							} px-2`}
							key={idx}
							onClick={() => {
								typeof pageNumber === 'number' && paginate(pageNumber);
							}}
						>
							{pageNumber}
						</button>
					);
				})}
			</div>
			{/*  Right Navigation arrow */}
			<div className='px-2'>
				<button
					className={`cursor-pointer border-none bg-none p-0 font-sans text-inherit outline-inherit ${
						currPage === lastPage
							? 'cursor-default !text-gray-500'
							: '!text-green-700'
					}`}
					onClick={goToNextPage}
					disabled={currPage === lastPage}
				>
					Next
				</button>
			</div>
		</section>
	);
};

export default Pagination;
