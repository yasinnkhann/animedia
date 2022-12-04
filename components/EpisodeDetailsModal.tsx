import { Fragment, useEffect, useRef } from 'react';
import Image from 'next/image';
import { BASE_IMG_URL } from '../utils/URLs';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { GrClose } from 'react-icons/gr';
import { formatDate } from '../utils/formatDate';

interface Props {
	episodeDetails: NexusGenObjects['EpisodeDetails'];
	closeModal: () => void;
}

const EpisodeDetailsModal = ({ closeModal, episodeDetails }: Props) => {
	const contentRef = useRef<HTMLDivElement>(null);
	console.log('EP DETAILS: ', episodeDetails);

	useEffect(() => {
		const close = (e: any) => {
			if (e.keyCode === 27) {
				closeModal();
			}
		};
		window.addEventListener('keydown', close);
		return () => window.removeEventListener('keydown', close);
	}, [closeModal]);

	const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
		if (contentRef?.current?.contains(e.target as Node)) {
			return;
		}
		closeModal();
	};

	return (
		<Fragment>
			<div
				className='block fixed z-[1] pt-20 left-0 top-0 w-full h-full overflow-auto bg-black bg-black/[0.4]'
				onClick={handleClickOutside}
			>
				<div
					className='bg-white m-auto p-4 rounded w-[90vw]	h-[85vh] relative'
					ref={contentRef}
				>
					<h2 className='text-center'>{episodeDetails.name}</h2>
					<p>Description: {episodeDetails.overview}</p>
					<p>Season Number: {episodeDetails.season_number}</p>
					<p>Episode Number: {episodeDetails.episode_number}</p>
					<p>Air Date: {formatDate(episodeDetails.air_date!)}</p>
					<p>Runtime: {episodeDetails.runtime} minutes</p>
					<p>Vote Average: {episodeDetails.vote_average}</p>
					<p>Vote Count: {episodeDetails.vote_count}</p>

					<div className='absolute bottom-0 right-0'>
						<Image
							className='rounded-lg'
							src={BASE_IMG_URL + episodeDetails.still_path}
							alt={episodeDetails.name ?? undefined}
							height={300}
							width={300}
						/>
					</div>
					<button className='absolute top-0 right-0' onClick={closeModal}>
						<GrClose size={25} />
					</button>
				</div>
			</div>
		</Fragment>
	);
};

export default EpisodeDetailsModal;
