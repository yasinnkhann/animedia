import { useState } from 'react';
import Image from 'next/image';
import { BASE_IMG_URL } from '../../../../utils/constants';
import * as Queries from '../../../../graphql/queries';
import { IEPDetails } from '@ts/interfaces';
import EpisodeDetailsModal from 'components/EpisodeDetailsModal';
import { useQuery } from '@apollo/client';

interface Props {
	item: IEPDetails;
}

const EpisodeDetailsCard = ({ item }: Props) => {
	const [showModal, setShowModal] = useState(false);

	const { data: epDetailsCardData } = useQuery(Queries.GET_EPISODE_DETAILS, {
		variables: {
			showId: item.showId,
			seasonNum: item.season,
			episodeNum: item.episode,
		},
	});

	if (!epDetailsCardData?.episodeDetails) return <></>;

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
							src={BASE_IMG_URL + epDetailsCardData.episodeDetails.still_path}
							alt={epDetailsCardData.episodeDetails.name ?? undefined}
							layout='fill'
						/>
					</div>
					<div className='w-full relative whitespace-normal flex content-start flex-wrap'>
						<h2 className='text-base m-0 w-full break-words text-center'>
							<p>
								Season {epDetailsCardData.episodeDetails.season_number} Ep.{' '}
								{epDetailsCardData.episodeDetails.episode_number}
							</p>
							<p className='font-bold'>
								{epDetailsCardData.episodeDetails.name}
							</p>
						</h2>
					</div>
				</section>
			</section>
			{showModal && (
				<EpisodeDetailsModal
					closeModal={() => setShowModal(false)}
					episodeDetails={epDetailsCardData.episodeDetails}
				/>
			)}
		</>
	);
};

export default EpisodeDetailsCard;
