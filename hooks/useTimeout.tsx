import { useCallback, useEffect, useRef } from 'react';

export const useTimeout = (callback: () => void, delay: number) => {
	const callbackRef = useRef<() => void>(callback);
	const timeoutRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	const set = useCallback(() => {
		timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
	}, [delay]);

	const clear = useCallback(() => {
		timeoutRef.current && clearTimeout(timeoutRef.current);
	}, []);

	useEffect(() => {
		set();
		return clear;
	}, [delay, set, clear]);

	const reset = useCallback(() => {
		clear();
		set();
	}, [clear, set]);

	return { reset, clear };
};
