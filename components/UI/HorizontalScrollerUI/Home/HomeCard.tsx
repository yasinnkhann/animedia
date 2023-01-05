import React from 'react';
import Image from 'next/image';
import { NexusGenObjects } from '../../../../graphql/generated/nexus-typegen/index';
import { BASE_IMG_URL } from '../../../../utils/URLs';
import { ESearchType } from '@ts/enums';
import { formatDate } from '../../../../utils/formatDate';
import RoundProgressBar from '../../../RoundProgressBar';
import { IHorizontalScrollerItemClickInfo } from '@ts/interfaces';

interface Props {
	item: NexusGenObjects['MovieResult'] | NexusGenObjects['ShowResult'];

	handleItemClick: (
		itemClickInfo: IHorizontalScrollerItemClickInfo
	) => false | void | undefined;
}

const HomeCard = ({ item, handleItemClick }: Props) => {
	const isMovie = 'title' in item;

	const mediaTitle = isMovie ? item.title : item.name;

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
					src={BASE_IMG_URL + item.poster_path}
					alt={mediaTitle}
					layout='fill'
					priority
				/>
			</div>

			<div className='w-full relative whitespace-normal flex content-start flex-wrap'>
				<div className='h-[2.5rem] w-[2.5rem] relative bottom-[1rem] left-4'>
					<RoundProgressBar
						percentageVal={+item.vote_average.toFixed(1) * 10}
					/>
				</div>

				<h2 className='text-base m-0 w-full break-words'>
					<p className='font-bold'>{mediaTitle}</p>
				</h2>

				<p className='text-sm m-0 p-0'>
					{isMovie
						? item.release_date
							? formatDate(item.release_date)
							: 'Release Date Not Available'
						: item.first_air_date
						? formatDate(item.first_air_date)
						: 'First Air Date Not Available'}
				</p>
			</div>
		</section>
	);
};

export default HomeCard;
