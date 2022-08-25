import React, { useContext } from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import Image from 'next/image';
import { BASE_IMG_URL } from '../../utils/URLs';

interface Props {
	id: number;
	title: string;
	poster_path: string;
	handleItemClick: (id: string) => void;
	selected: boolean;
}

const Card = ({ id, title, handleItemClick, selected, poster_path }: Props) => {
	const visibility = useContext(VisibilityContext);

	const visible = visibility.isItemVisible(String(id));

	return (
		<div
			className='w-[10rem] h-[15rem] border-2 border-black select-none mx-4'
			onClick={() => handleItemClick(String(id))}
			role='button'
			tabIndex={0}
		>
			<div>
				<p className='text-center'>{title}</p>
			</div>
			<div>
				<Image
					src={BASE_IMG_URL + poster_path}
					alt={title}
					height='100%'
					width='100%'
				/>
			</div>
		</div>
	);
};

export default Card;
