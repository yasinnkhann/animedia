import React, { useContext } from 'react';
import Image from 'next/image';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen/index';
import { BASE_IMG_URL } from '../../../utils/URLs';

interface Props {
	item: NexusGenObjects['MovieResult'] | NexusGenObjects['ShowResult'];
	handleItemClick: (id: string) => void;
	selected: boolean;
}

const Card = ({ item, handleItemClick, selected }: Props) => {
	const visibility = useContext(VisibilityContext);

	const visible = visibility.isItemVisible(String(item.id));

	return (
		<div
			className='w-[10rem] h-[15rem] border-2 border-black select-none mx-4'
			onClick={() => handleItemClick(String(item.id))}
			role='button'
			tabIndex={0}
		>
			<div>
				<p className='text-center'>
					{'title' in item ? item.title : item.name}
				</p>
			</div>
			<div>
				<Image
					src={BASE_IMG_URL + item.poster_path}
					alt={'title' in item ? item.title : item.name}
					height='100%'
					width='100%'
				/>
			</div>
		</div>
	);
};

export default Card;
