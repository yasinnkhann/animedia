import { Fragment, useEffect, useRef } from 'react';
import Image from 'next/image';
import { BASE_IMG_URL } from '../utils/URLs';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { GrClose } from 'react-icons/gr';
import { formatDate } from '../utils/formatDate';
import commaNumber from 'comma-number';
import RoundProgressBar from './RoundProgressBar';

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
			<section
				className='block fixed z-[1] pt-20 left-0 top-0 w-full h-full overflow-auto bg-black bg-black/[0.4]'
				onClick={handleClickOutside}
			>
				<section
					className='bg-white m-auto p-4 rounded w-[90vw]	h-[85vh] relative'
					ref={contentRef}
				>
					<section className='flex flex-col'>
						<h2 className='text-center mt-4'>{episodeDetails.name}</h2>
						<div className='flex items-center mb-8 mt-8 justify-end mr-16'>
							<div className='h-[5rem] w-[5rem]'>
								<RoundProgressBar
									percentageVal={+episodeDetails.vote_average!.toFixed(1) * 10}
								/>
							</div>
							<p className='ml-[.5rem] font-medium text-base'>
								{commaNumber(episodeDetails.vote_count!)} voted users
							</p>
						</div>
					</section>
					<section className='w-3/4 mt-[-3rem]'>
						<div className='mt-12 mb-8'>
							<h5 className='mb-2 underline underline-offset-4'>
								Description:
							</h5>
							<p>{episodeDetails.overview}</p>
						</div>

						<div className='mt-2'>
							<p>
								<span className='font-bold'>Season: </span>
								{episodeDetails.season_number}
							</p>
						</div>

						<div className='mt-2'>
							<p>
								<span className='font-bold'>Episode: </span>
								{episodeDetails.episode_number}
							</p>
						</div>

						<div className='mt-2'>
							<p>
								<span className='font-bold'>Runtime: </span>
								{episodeDetails.runtime}
							</p>
						</div>

						<div className='mt-2'>
							<p>
								<span className='font-bold'>Air Date: </span>
								{formatDate(episodeDetails.air_date!)}
							</p>
						</div>
					</section>

					{/* <div className='absolute bottom-2 right-4'>
						<Image
							className='rounded-lg'
							src={BASE_IMG_URL + episodeDetails.still_path}
							alt={episodeDetails.name ?? undefined}
							height={300}
							width={300}
						/>
					</div> */}

					<button className='absolute top-2 right-2' onClick={closeModal}>
						<GrClose size={25} />
					</button>
				</section>
			</section>
		</Fragment>
	);
};

export default EpisodeDetailsModal;
