import { useState } from 'react';
import Image from 'next/image';
import * as Queries from '../../../../graphql/queries';
import { IEPDetails } from '@ts/interfaces';
import EpisodeDetailsModal from 'components/EpisodeDetailsModal';
import { useQuery } from '@apollo/client';
import { CommonMethods } from 'utils/CommonMethods';

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

	if (!epDetailsCardData?.episodeDetails?.id) return <></>;

	return (
		<>
			<section
				className='relative mx-4 h-[7rem] w-[15rem] select-none'
				role='button'
				tabIndex={0}
			>
				<section
					className='relative h-full w-full'
					onClick={() => setShowModal(true)}
				>
					<div className='relative h-full w-full'>
						<Image
							className='rounded-lg object-contain'
							src={CommonMethods.getImage(
								epDetailsCardData.episodeDetails.still_path
							)}
							alt={epDetailsCardData.episodeDetails.name ?? undefined}
							layout='fill'
						/>
					</div>
					<div className='relative flex w-full flex-wrap content-start whitespace-normal'>
						<h2 className='m-0 w-full break-words text-center text-base'>
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
