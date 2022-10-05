import React, { useEffect } from 'react';
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

	let lastPage = paginationRange![paginationRange!.length - 1];

	console.log('Total Items: ', totalItems);

	useEffect(() => {
		if (currPage > lastPage) {
			paginate(lastPage as number);
		}
	}, [currPage, paginate, lastPage]);

	console.log('PR: ', paginationRange);

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
					className={`bg-none text-inherit border-none p-0 font-sans cursor-pointer outline-inherit ${
						currPage === 1 ? '!text-gray-500' : '!text-green-700'
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
					className={`bg-none text-inherit border-none p-0 font-sans cursor-pointer outline-inherit ${
						currPage === lastPage ? '!text-gray-500' : '!text-green-700'
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

// import React from 'react';
// import { RESULTS_PER_PAGE as searchItemsPerPage } from '../utils/specificNums';

// interface Props {
// 	totalItems: number;
// 	currPage: number;
// 	paginate: (pageNum: number) => void;
// 	goToPrevPage: () => void;
// 	goToNextPage: () => void;
// }

// export default function Pagination({
// 	totalItems,
// 	currPage,
// 	paginate,
// 	goToPrevPage,
// 	goToNextPage,
// }: Props) {
// 	const numOfPages = Math.ceil(totalItems / searchItemsPerPage);

// 	const getPaginationGroup = () => {
// 		let start =
// 			Math.floor((currPage - 1) / searchItemsPerPage) * searchItemsPerPage;
// 		console.log('TOTAL ITEMS: ', totalItems);
// 		console.log('START: ', start);
// 		let trial = Math.ceil(totalItems / searchItemsPerPage);
// 		console.log('TRIAL: ', trial);
// 		return new Array(trial >= searchItemsPerPage ? searchItemsPerPage : trial)
// 			.fill(null)
// 			.map((_, idx) => start + idx + 1);
// 	};

// 	console.log('PAG GROUP: ', getPaginationGroup());

// 	return (
// 		<div className='flex justify-center p-4'>
// 			<div className='flex items-center justify-center p-2 border border-solid border-gray-200 rounded cursor-pointer'>
// 				<button
// 					className={`bg-none text-inherit border-none p-0 font-sans cursor-pointer outline-inherit ${
// 						currPage === 1 ? '!text-gray-500' : '!text-green-700'
// 					}`}
// 					onClick={goToPrevPage}
// 					disabled={currPage === 1}
// 				>
// 					Prev
// 				</button>
// 			</div>
// 			{getPaginationGroup().map(num => (
// 				<div
// 					key={num}
// 					className='flex items-center justify-center p-2 border border-solid border-gray-200 rounded cursor-pointer'
// 					onClick={() => paginate(num)}
// 				>
// 					<button
// 						className={`bg-none text-inherit border-none p-0 font-sans cursor-pointer outline-inherit ${
// 							currPage === num ? '!text-red-500' : '!text-blue-500'
// 						}`}
// 					>
// 						{num}
// 					</button>
// 				</div>
// 			))}
// 			<div className='flex items-center justify-center p-2 border border-solid border-gray-200 rounded cursor-pointer'>
// 				<button
// 					className={`bg-none text-inherit border-none p-0 font-sans cursor-pointer outline-inherit ${
// 						currPage === numOfPages ? '!text-gray-500' : '!text-green-700'
// 					}`}
// 					onClick={goToNextPage}
// 					disabled={currPage === numOfPages}
// 				>
// 					Next
// 				</button>
// 			</div>
// 		</div>
// 	);
// }
