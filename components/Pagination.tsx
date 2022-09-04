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

	return (
		<div className='pagination'>
			<div className='prev_container'>
				<button
					className='prev_btn'
					onClick={goToPrevPage}
					disabled={currPage === 1}
					style={{ color: currPage === 1 ? 'gray' : undefined }}
				>
					Prev
				</button>
			</div>
			{pageNums.map(num => (
				<div key={num} className='page_item' onClick={() => paginate(num)}>
					<button
						className='page_btn'
						style={{ color: currPage === num ? 'red' : undefined }}
					>
						{num}
					</button>
				</div>
			))}
			<div className='next_container'>
				<button
					className='next_btn'
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
