import { useState, useEffect, useContext } from 'react';
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
		// detect if whole component visible
		if (visibleItemsWithoutSeparators.length) {
			setDisabled(isFirstItemVisible);
		}
	}, [isFirstItemVisible, visibleItemsWithoutSeparators]);

	return (
		<section className='relative flex pl-10'>
			<Arrow handleDisabled={disabled} handleOnClick={() => scrollPrev()}>
				<FaArrowLeft className='absolute left-3 top-[30%] text-xl' />
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
		<section className='relative flex pr-10'>
			<Arrow handleDisabled={disabled} handleOnClick={() => scrollNext()}>
				<FaArrowRight className='absolute left-3 top-[30%] text-xl' />
			</Arrow>
		</section>
	);
}
