import { useMemo } from 'react';

interface Props {
	totalItems: number;
	itemsPerPage: number;
	currPage: number;
	siblingCount: number;
	maxPageNum?: number;
}

export const usePagination = ({
	totalItems,
	itemsPerPage,
	currPage,
	siblingCount,
	maxPageNum,
}: Props) => {
	const range = (start: number, end: number) => {
		const length = end - start + 1;
		/*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
		return Array.from({ length }, (_, idx) => idx + start);
	};

	const paginationRange = useMemo(() => {
		let totalPageCount = Math.ceil(totalItems / itemsPerPage);

		if (maxPageNum && totalPageCount > maxPageNum) {
			totalPageCount = maxPageNum;
		}

		// Pages count is determined as siblingCount + firstPage + lastPage + currPage + 2*DOTS
		const totalPageNumbers = siblingCount + 5;

		/*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
		if (totalPageNumbers >= totalPageCount) {
			return range(1, totalPageCount);
		}

		/*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
		const leftSiblingIndex = Math.max(currPage - siblingCount, 1);
		const rightSiblingIndex = Math.min(currPage + siblingCount, totalPageCount);

		/*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
		const shouldShowLeftDots = leftSiblingIndex > 2;
		const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

		const firstPageIndex = 1;
		const lastPageIndex = totalPageCount;

		/*
    	Case 2: No left dots to show, but rights dots to be shown
    */
		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = 3 + 2 * siblingCount;
			const leftRange = range(1, leftItemCount);

			return [...leftRange, '...', totalPageCount];
		}

		/*
    	Case 3: No right dots to show, but left dots to be shown
    */
		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightItemCount = 3 + 2 * siblingCount;
			const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
			return [firstPageIndex, '...', ...rightRange];
		}

		/*
    	Case 4: Both left and right dots to be shown
    */
		if (shouldShowLeftDots && shouldShowRightDots) {
			const middleRange = range(leftSiblingIndex, rightSiblingIndex);
			return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
		}
	}, [totalItems, itemsPerPage, siblingCount, currPage, maxPageNum]);
	return paginationRange ?? [1];
};
