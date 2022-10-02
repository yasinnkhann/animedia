import React from 'react';
import Image from 'next/image';
import { BASE_IMG_URL } from '../../../utils/URLs';
import { ESearchType } from '@ts/enums';
import {
	IKnownForMedia,
	IHorizontalScrollerItemClickInfo,
} from '@ts/interfaces';

interface Props {
	item: IKnownForMedia;

	handleItemClick: (
		itemClickInfo: IHorizontalScrollerItemClickInfo
	) => false | void | undefined;
}

const KnownForCard = ({ item, handleItemClick }: Props) => {
	const isMovie = 'title' in item;

	const mediaTitle = isMovie ? (item.title as string) : (item.name as string);

	return (
		<section
			className='w-[10rem] h-[15rem] select-none mx-4 relative'
			onClick={() =>
				handleItemClick({
					mediaType: isMovie ? ESearchType.MOVIE : ESearchType.SHOW,
					id: item.id,
					title: mediaTitle,
				})
			}
			role='button'
			tabIndex={0}
		>
			<div className='w-full h-full relative'>
				<Image
					className='rounded-lg'
					src={BASE_IMG_URL + item.image}
					alt={mediaTitle}
					layout='fill'
				/>
			</div>

			<div className='w-full relative whitespace-normal flex content-start flex-wrap'>
				<h2 className='text-base m-0 w-full break-words'>
					<p className='font-bold'>{mediaTitle}</p>
				</h2>
			</div>
		</section>
	);
};

export default KnownForCard;
