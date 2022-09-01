import React from 'react';
import Image from 'next/image';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen/index';
import { BASE_IMG_URL } from '../../../utils/URLs';
import { ESearchType } from '@ts/enums';
import { IHorizontalScrollerItemClickInfo } from '@ts/interfaces';

interface Props {
	item: NexusGenObjects['MovieResult'] | NexusGenObjects['ShowResult'];
	handleItemClick: (
		itemClickInfo: IHorizontalScrollerItemClickInfo
	) => false | void | undefined;
}

const Card = ({ item, handleItemClick }: Props) => {
	const mediaTitle = 'title' in item ? item.title : item.name;

	return (
		<div
			className='w-[10rem] h-[15rem] border-2 border-black select-none mx-4'
			onClick={() =>
				handleItemClick({
					mediaType: 'title' in item ? ESearchType.MOVIE : ESearchType.SHOW,
					id: item.id,
					title: mediaTitle,
				})
			}
			role='button'
			tabIndex={0}
		>
			<div>
				<p className='text-center'>{mediaTitle}</p>
			</div>
			<div>
				<Image
					src={BASE_IMG_URL + item.poster_path}
					alt={mediaTitle}
					height='100%'
					width='100%'
				/>
			</div>
		</div>
	);
};

export default Card;
