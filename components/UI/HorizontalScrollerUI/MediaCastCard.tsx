import React from 'react';
import Image from 'next/image';
import { BASE_IMG_URL } from '../../../utils/URLs';
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
			className='w-[10rem] h-[15rem] select-none mx-4 relative'
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
			<div className='w-full h-full relative'>
				<Image
					className='rounded-lg'
					src={BASE_IMG_URL + item.profile_path}
					alt={item.name}
					layout='fill'
				/>
			</div>

			<div className='w-full relative whitespace-normal flex content-start flex-wrap'>
				<h2 className='text-base m-0 w-full break-words text-center'>
					<p className='font-bold'>{item.name}</p>
					<p className='break-words'>{item.character}</p>
				</h2>
			</div>
		</section>
	);
};

export default MediaCastCard;
