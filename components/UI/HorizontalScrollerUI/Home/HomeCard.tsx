import React from 'react';
import Image from 'next/image';
import { NexusGenObjects } from '../../../../graphql/generated/nexus-typegen/index';
import { BASE_IMG_URL } from '../../../../utils/constants';
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
					src={BASE_IMG_URL + item.poster_path}
					alt={mediaTitle}
					layout='fill'
					priority
				/>
			</div>

			<div className='relative flex w-full flex-wrap content-start whitespace-normal'>
				<div className='relative bottom-[1rem] left-4 h-[2.5rem] w-[2.5rem]'>
					<RoundProgressBar
						percentageVal={+item.vote_average.toFixed(1) * 10}
					/>
				</div>

				<h2 className='m-0 w-full break-words text-base'>
					<p className='font-bold'>{mediaTitle}</p>
				</h2>

				<p className='m-0 p-0 text-sm'>
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
