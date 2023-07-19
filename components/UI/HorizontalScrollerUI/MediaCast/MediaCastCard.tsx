import React from 'react';
import Image from 'next/image';
import { BASE_IMG_URL } from '../../../../utils/constants';
import { ICast, IHorizontalScrollerItemClickInfo } from '@ts/interfaces';
import { ESearchType } from '@ts/enums';

interface Props {
	item: ICast;

	handleItemClick: (
		itemClickInfo: IHorizontalScrollerItemClickInfo
	) => false | void | undefined;
}

const MediaCastCard = ({ item, handleItemClick }: Props) => {
	return (
		<section
			className='relative mx-4 h-[15rem] w-[10rem] select-none'
			onClick={() =>
				handleItemClick({
					mediaType: ESearchType.PERSON,
					id: item.id,
					title: item.name,
				})
			}
			role='button'
			tabIndex={0}
		>
			<div className='relative h-full w-full'>
				<Image
					className='rounded-lg'
					src={BASE_IMG_URL + item.profile_path}
					alt={item.name}
					layout='fill'
				/>
			</div>

			<div className='relative flex w-full flex-wrap content-start whitespace-normal'>
				<h2 className='m-0 w-full break-words text-center text-base'>
					<p className='font-bold'>{item.name}</p>
					<p className='break-words'>{item.character}</p>
				</h2>
			</div>
		</section>
	);
};

export default MediaCastCard;
