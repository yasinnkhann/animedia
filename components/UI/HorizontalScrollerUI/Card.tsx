import React from 'react';
import Image from 'next/image';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen/index';
import { BASE_IMG_URL } from '../../../utils/URLs';
import { ESearchType } from '@ts/enums';
import { IHorizontalScrollerItemClickInfo } from '@ts/interfaces';
import { formatDate } from '../../../utils/formatDate';
import RoundProgressBar from '../RoundProgressBar';

interface Props {
	item: NexusGenObjects['MovieResult'] | NexusGenObjects['ShowResult'];
	handleItemClick: (
		itemClickInfo: IHorizontalScrollerItemClickInfo
	) => false | void | undefined;
}

const Card = ({ item, handleItemClick }: Props) => {
	const isMovie = 'title' in item;

	const mediaTitle = isMovie ? item.title : item.name;

	return (
		<section
			className='w-[10rem] h-[15rem] border-2 border-black select-none mx-4'
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
			<div>
				<Image
					src={BASE_IMG_URL + item.poster_path}
					alt={mediaTitle}
					height='100%'
					width='100%'
				/>
			</div>

			<div>
				<div>
					<p className='text-center'>{mediaTitle}</p>
				</div>

				<div>
					<p>
						{formatDate(
							isMovie
								? (item.release_date as string)
								: (item.first_air_date as string)
						)}
					</p>
				</div>

				<div className='h-[4rem] w-[4rem]'>
					<RoundProgressBar
						percentageVal={Math.round(item.vote_average * 10)}
					/>
				</div>
			</div>
		</section>
	);
};

export default Card;
