import React from 'react';

interface Props {
	itemsPerPage: number;
	totalItems: number;
	currPage: number;
	pageNums: number[];
	paginate: (pageNum: number) => void;
	goToPrevPage: () => void;
	goToNextPage: () => void;
}

export default function Pagination({
	itemsPerPage,
	totalItems,
	currPage,
	pageNums,
	paginate,
	goToPrevPage,
	goToNextPage,
}: Props) {
	const numOfPages = Math.ceil(totalItems / itemsPerPage);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	return (
		<div className='flex justify-center p-4'>
			<div className='flex items-center justify-center p-2 border border-solid border-gray-500 rounded cursor-pointer'>
				<button
					className='bg-none text-inherit border-none p-0 font-sans cursor-pointer outline-inherit text-blue-500'
					onClick={goToPrevPage}
					disabled={currPage === 1}
					style={{ color: currPage === 1 ? 'gray' : undefined }}
				>
					Prev
				</button>
			</div>
			{pageNums.map(num => (
				<div
					key={num}
					className='flex items-center justify-center p-2 border border-solid border-gray-500 rounded cursor-pointer'
					onClick={() => {
						paginate(num);
						scrollToTop();
					}}
				>
					<button
						className='bg-none text-inherit border-none p-0 font-sans cursor-pointer outline-inherit text-blue-500'
						style={{ color: currPage === num ? 'red' : undefined }}
					>
						{num}
					</button>
				</div>
			))}
			<div className='flex items-center justify-center p-2 border border-solid border-gray-500 rounded cursor-pointer'>
				<button
					className='bg-none text-inherit border-none p-0 font-sans cursor-pointer outline-inherit text-blue-500'
					onClick={goToNextPage}
					disabled={currPage === numOfPages}
					style={{ color: currPage === numOfPages ? 'gray' : undefined }}
				>
					Next
				</button>
			</div>
		</div>
	);
}
