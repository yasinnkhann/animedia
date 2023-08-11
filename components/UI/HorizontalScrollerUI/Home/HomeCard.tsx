import React from 'react';
import Image from 'next/image';
import { EContent } from '@ts/enums';
import { formatDate } from '../../../../utils/formatDate';
import RoundProgressBar from '../../../RoundProgressBar';
import { getImage } from 'utils/getImage';
import Link from 'next/link';
import { getDetailsPageRoute } from 'utils/getDetailsPageRoute';
import {
	MovieResult,
	ShowResult,
} from '../../../../graphql/generated/code-gen/graphql';

interface Props {
	item: MovieResult | ShowResult;
	dragging: Boolean;
}

const HomeCard = ({ item, dragging }: Props) => {
	const isMovie = 'title' in item;

	const mediaTitle = isMovie ? item.title : item.name;

	return (
		<Link
			href={getDetailsPageRoute(
				isMovie ? EContent.MOVIE : EContent.SHOW,
				item.id,
				mediaTitle
			)}
			passHref
		>
			<a
				onClick={e => dragging && e.preventDefault()}
				className='text-inherit no-underline'
			>
				<section className='relative mx-4 h-[15rem] w-[10rem] select-none'>
					<div className='relative h-full w-full'>
						<Image
							className='rounded-lg'
							src={getImage(item.poster_path)}
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
			</a>
		</Link>
	);
};

export default HomeCard;
