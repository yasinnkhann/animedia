import React from 'react';
import Image from 'next/image';
import { BASE_IMG_URL } from '../../../utils/URLs';
import * as Queries from '../../../graphql/queries';
import { useGQLQuery } from '../../../hooks/useGQL';
import { IUseGQLQuery, IEPDetailsCard } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../../graphql/generated/nexus-typegen';

interface Props {
	item: any;
}

const EpisodeDetailsCard = ({ item }: Props) => {
	const {
		data: epDetailsCardData,
		loading: epDetailsCardLoading,
	}: IUseGQLQuery<
		NexusGenObjects['EpisodeDetails'],
		NexusGenArgTypes['Query']['episodeDetails']
	> = useGQLQuery<NexusGenArgTypes['Query']['episodeDetails']>(
		Queries.QUERY_GET_EPISODE_DETAILS,
		{
			variables: {
				showId: item.showId,
				seasonNum: item.season,
				episodeNum: item.episode,
			},
		}
	);

	console.log('epDetailsCardData: ', epDetailsCardData?.still_path);

	return (
		<section
			className='w-[10rem] h-[5rem] select-none mx-4 relative'
			role='button'
			tabIndex={0}
		>
			<div className='w-full h-full relative'>
				<Image
					className='rounded-lg object-contain'
					src={BASE_IMG_URL + epDetailsCardData?.still_path}
					alt={epDetailsCardData?.name ?? undefined}
					layout='fill'
				/>
			</div>
			<div className='w-full relative whitespace-normal flex content-start flex-wrap'>
				<h2 className='text-base m-0 w-full break-words text-center'>
					<p>
						Season {epDetailsCardData?.season_number} Ep.{' '}
						{epDetailsCardData?.episode_number}
					</p>
					<p className='font-bold'>{epDetailsCardData?.name}</p>
				</h2>
			</div>
		</section>
	);
};

export default EpisodeDetailsCard;
