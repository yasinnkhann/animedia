import Image from 'next/image';
import commaNumber from 'comma-number';
import RoundProgressBar from './RoundProgressBar';
import { useEffect, useRef } from 'react';
import { CommonMethods } from 'utils/CommonMethods';
import { GrClose } from 'react-icons/gr';
import { EpisodeDetailsRes } from '../graphql/generated/code-gen/graphql';

interface Props {
	episodeDetails: EpisodeDetailsRes;
	closeModal: () => void;
}

const EpisodeDetailsModal = ({ closeModal, episodeDetails }: Props) => {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const close = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		};
		window.addEventListener('keydown', close);
		return () => window.removeEventListener('keydown', close);
	}, [closeModal]);

	const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
		if (contentRef.current?.contains(e.target as Node)) {
			return;
		}
		closeModal();
	};

	return (
		<>
			<section
				onClick={handleClickOutside}
				className='fixed left-0 top-0 z-[1] block h-full w-full overflow-auto bg-black bg-black/[0.4] pt-20'
			>
				<section
					className='relative m-auto h-[85vh] w-[70vw] overflow-scroll	rounded bg-white p-4 scrollbar-hide'
					ref={contentRef}
				>
					<div className='w-full rounded-lg bg-white'>
						<div className='flex items-center justify-between border-b border-gray-300 px-6 py-4'>
							<h2 className='text-lg font-semibold'>{episodeDetails.name}</h2>
							<button onClick={closeModal}>
								<GrClose className='h-6 w-6 text-gray-500 transition duration-300 hover:text-gray-700' />
							</button>
						</div>
						<div className='p-6'>
							<div className='flex items-center space-x-4'>
								<div className='h-16 w-16'>
									<RoundProgressBar
										percentageVal={+(episodeDetails.vote_average ?? 0).toFixed(1) * 10}
									/>
								</div>
								<p className='text-sm text-gray-600'>
									{commaNumber(episodeDetails.vote_count ?? 0)} voted users
								</p>
							</div>
							<div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
								<div>
									<h4 className='font-semibold'>Season</h4>
									<p>{episodeDetails.season_number}</p>
								</div>
								<div>
									<h4 className='font-semibold'>Episode</h4>
									<p>{episodeDetails.episode_number}</p>
								</div>
								<div>
									<h4 className='font-semibold'>Runtime</h4>
									<p>
										{episodeDetails.runtime
											? `${episodeDetails.runtime} min`
											: 'Runtime Not Available'}
									</p>
								</div>
								<div>
									<h4 className='font-semibold'>Air Date</h4>
									<p>
										{episodeDetails.air_date
											? CommonMethods.formatDate(episodeDetails.air_date)
											: 'Air Date Not Available'}
									</p>
								</div>
							</div>
							<div className='mt-6'>
								<h4 className='mb-2 font-semibold'>Description:</h4>
								<p>
									{episodeDetails.overview ? episodeDetails.overview : 'No Description Available'}
								</p>
							</div>
						</div>
						{episodeDetails.still_path && (
							<div className='relative h-[35rem] w-full overflow-hidden rounded-lg border'>
								<div className='relative h-full'>
									<Image
										src={CommonMethods.getTheMovieDbImage(episodeDetails.still_path)}
										alt={episodeDetails.name ?? ''}
										layout='fill'
										className='object-cover'
									/>
								</div>
							</div>
						)}
					</div>
				</section>
			</section>
		</>
	);
};

export default EpisodeDetailsModal;
