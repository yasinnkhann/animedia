import React from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';

interface Props {
	id: number;
	title: string;
	onClick: () => void;
	selected: boolean;
}

const Card = (props: Props) => {
	const visibility = React.useContext(VisibilityContext);

	const visible = visibility.isItemVisible(String(props.id));

	return (
		<div
			onClick={() => props.onClick()}
			role='button'
			style={{
				border: '1px solid',
				display: 'inline-block',
				margin: '0 10px',
				width: '160px',
				userSelect: 'none',
			}}
			tabIndex={0}
			className='card'
		>
			<div>
				<div>{props.title}</div>
				<div style={{ backgroundColor: visible ? 'transparent' : 'gray' }}>
					visible: {JSON.stringify(visible)}
				</div>
				<div>selected: {JSON.stringify(!!props.selected)}</div>
			</div>
			<div
				style={{
					backgroundColor: props.selected ? 'green' : 'bisque',
					height: '200px',
				}}
			/>
		</div>
	);
};

export default Card;
