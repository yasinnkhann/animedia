import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BASE_IMG_URL } from '../../../utils/URLs';
import * as Queries from '../../../graphql/queries';
import { useGQLQuery } from '../../../hooks/useGQL';
import { IUseGQLQuery, IEPDetails } from '@ts/interfaces';
import EpisodeDetailsModal from 'components/EpisodeDetailsModal';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../../graphql/generated/nexus-typegen';

interface Props {
	item: IEPDetails;
}

const EpisodeDetailsCard = ({ item }: Props) => {
	const [showModal, setShowModal] = useState(false);

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

	if (!epDetailsCardData) return <></>;

	return (
		<>
			<section
				className='w-[15rem] h-[7rem] select-none mx-4 relative'
				role='button'
				tabIndex={0}
			>
				<section
					className='w-full h-full relative'
					onClick={() => setShowModal(true)}
				>
					<div className='w-full h-full relative'>
						<Image
							className='rounded-lg object-contain'
							src={BASE_IMG_URL + epDetailsCardData.still_path}
							alt={epDetailsCardData.name ?? undefined}
							layout='fill'
						/>
					</div>
					<div className='w-full relative whitespace-normal flex content-start flex-wrap'>
						<h2 className='text-base m-0 w-full break-words text-center'>
							<p>
								Season {epDetailsCardData.season_number} Ep.{' '}
								{epDetailsCardData.episode_number}
							</p>
							<p className='font-bold'>{epDetailsCardData.name}</p>
						</h2>
					</div>
				</section>
			</section>
			{showModal && (
				<EpisodeDetailsModal
					closeModal={() => setShowModal(false)}
					episodeDetails={epDetailsCardData}
				/>
			)}
		</>
	);
};

export default EpisodeDetailsCard;
