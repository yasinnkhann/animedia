import React from 'react';
import Image from 'next/image';
import { ESearchType } from '@ts/enums';
import {
	IRelatedMedia,
	IHorizontalScrollerItemClickInfo,
} from '@ts/interfaces';
import { getImage } from 'utils/getImage';

interface Props {
	item: IRelatedMedia;

	handleItemClick: (
		itemClickInfo: IHorizontalScrollerItemClickInfo
	) => false | void | undefined;
}

const RelatedCard = ({ item, handleItemClick }: Props) => {
	const isMovie = 'title' in item;

	const mediaTitle = isMovie ? (item.title as string) : (item.name as string);

	return (
		<section
			className='relative mx-4 h-[15rem] w-[10rem] select-none'
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
			<div className='relative h-full w-full'>
				<Image
					className='rounded-lg'
					src={getImage(item.poster_path)}
					alt={mediaTitle}
					layout='fill'
				/>
			</div>

			<div className='relative flex w-full flex-wrap content-start whitespace-normal'>
				<h2 className='m-0 w-full break-words text-center text-base'>
					<p className='font-bold'>{mediaTitle}</p>
				</h2>
			</div>
		</section>
	);
};

export default RelatedCard;
