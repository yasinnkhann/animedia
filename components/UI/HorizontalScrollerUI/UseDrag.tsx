import React, { useState, useRef, useCallback } from 'react';

export default function UseDrag() {
	const [clicked, setClicked] = useState(false);
	const [dragging, setDragging] = useState(false);
	const position = useRef(0);

	const dragStart = useCallback((e: React.MouseEvent) => {
		position.current = e.clientX;
		setClicked(true);
	}, []);

	const dragStop = useCallback(
		() =>
			// NOTE: need some delay so item under cursor won't be clicked
			window.requestAnimationFrame(() => {
				setDragging(false);
				setClicked(false);
			}),
		[]
	);

	const dragMove = (e: React.MouseEvent, cb: (posDif: number) => void) => {
		const newDiff = position.current - e.clientX;

		const movedEnough = Math.abs(newDiff) > 5;

		if (clicked && movedEnough) {
			setDragging(true);
		}

		if (dragging && movedEnough) {
			position.current = e.clientX;
			cb(newDiff);
		}
	};

	return {
		dragStart,
		dragStop,
		dragMove,
		dragging,
		position,
		setDragging,
	};
}
