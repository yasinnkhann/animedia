import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
	percentageVal: number;
}

const RoundProgressBar = ({ percentageVal }: Props) => {
	return (
		<CircularProgressbar
			value={percentageVal}
			text={`${percentageVal}%`}
			background={true}
			styles={{
				// Customize the root svg element
				root: {},
				// Customize the path, i.e. the "completed progress"
				path: {
					// Path color
					stroke:
						percentageVal >= 70
							? 'rgba(0, 255, 30, 0.502)'
							: percentageVal >= 50
							? 'rgba(255, 255, 30, 0.8)'
							: 'rgba(255, 0, 30, 0.8)',
					// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
					strokeLinecap: 'butt',
					// Customize transition animation
					transition: 'stroke-dashoffset 0.5s ease 0s',
					// Rotate the path
					transform: 'rotate(0.25turn)',
					transformOrigin: 'center center',
				},
				// Customize the circle behind the path, i.e. the "total progress"
				trail: {
					// Trail color
					stroke: '#d6d6d6',
					// Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
					strokeLinecap: 'butt',
					// Rotate the trail
					transform: 'rotate(0.25turn)',
					transformOrigin: 'center center',
				},
				// Customize the text
				text: {
					// Text color
					fill: 'white',
					// Text size
					fontSize: '1.5rem',
				},
				// Customize background - only used when the `background` prop is true
				background: {
					fill: '#002331',
				},
			}}
		/>
	);
};

export default RoundProgressBar;
