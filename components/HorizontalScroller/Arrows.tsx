'use client';

import { useContext } from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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
	const visibility = useContext(VisibilityContext);
	const isFirstItemVisible = visibility.useIsVisible('first', true);

	return (
		<section className='relative flex pl-10'>
			<Arrow handleDisabled={isFirstItemVisible} handleOnClick={() => visibility.scrollPrev()}>
				<FaArrowLeft className='absolute left-3 top-[30%] text-xl' />
			</Arrow>
		</section>
	);
}

export function RightArrow() {
	const visibility = useContext(VisibilityContext);
	const isLastItemVisible = visibility.useIsVisible('last', false);

	return (
		<section className='relative flex pr-10'>
			<Arrow handleDisabled={isLastItemVisible} handleOnClick={() => visibility.scrollNext()}>
				<FaArrowRight className='absolute left-3 top-[30%] text-xl' />
			</Arrow>
		</section>
	);
}
