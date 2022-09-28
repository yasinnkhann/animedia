import React, { useState, useEffect, useContext, Fragment } from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';

function Arrow({
	children,
	handleDisabled,
	handleOnClick,
}: {
	children: React.ReactNode;
	handleDisabled: boolean;
	handleOnClick: VoidFunction;
}) {
	return (
		<button
			disabled={handleDisabled}
			onClick={handleOnClick}
			style={{
				cursor: 'pointer',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				right: '1%',
				opacity: handleDisabled ? '0' : '1',
				userSelect: 'none',
			}}
		>
			{children}
		</button>
	);
}

export function LeftArrow() {
	const {
		isFirstItemVisible,
		scrollPrev,
		visibleItemsWithoutSeparators,
		initComplete,
	} = useContext(VisibilityContext);

	const [disabled, setDisabled] = useState(
		!initComplete || (initComplete && isFirstItemVisible)
	);

	useEffect(() => {
		// NOTE: detect if whole component visible
		if (visibleItemsWithoutSeparators.length) {
			setDisabled(isFirstItemVisible);
		}
	}, [isFirstItemVisible, visibleItemsWithoutSeparators]);

	return (
		<section className='flex pl-10 relative'>
			<Arrow handleDisabled={disabled} handleOnClick={() => scrollPrev()}>
				<i className='fa-solid fa-arrow-left absolute left-3 top-[30%] text-xl'></i>
			</Arrow>
		</section>
	);
}

export function RightArrow() {
	const { isLastItemVisible, scrollNext, visibleItemsWithoutSeparators } =
		useContext(VisibilityContext);

	const [disabled, setDisabled] = useState(
		!visibleItemsWithoutSeparators.length && isLastItemVisible
	);

	useEffect(() => {
		if (visibleItemsWithoutSeparators.length) {
			setDisabled(isLastItemVisible);
		}
	}, [isLastItemVisible, visibleItemsWithoutSeparators]);

	return (
		<section className='flex pr-10 relative'>
			<Arrow handleDisabled={disabled} handleOnClick={() => scrollNext()}>
				<i className='fa-solid fa-arrow-right absolute right-3 top-[30%] text-xl'></i>
			</Arrow>
		</section>
	);
}
