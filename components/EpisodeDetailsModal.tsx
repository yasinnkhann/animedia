import { Fragment, useEffect, useRef } from 'react';
import Image from 'next/image';
import { GrClose } from 'react-icons/gr';
import { CommonMethods } from 'utils/CommonMethods';
import commaNumber from 'comma-number';
import RoundProgressBar from './RoundProgressBar';
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
		<Fragment>
			<section
				className='fixed left-0 top-0 z-[1] block h-full w-full overflow-auto bg-black bg-black/[0.4] pt-20'
				onClick={handleClickOutside}
			>
				<section
					className='relative m-auto h-[85vh] w-[70vw] overflow-scroll	rounded bg-white p-4 scrollbar-hide'
					ref={contentRef}
				>
					<h2 className='mt-4 text-center'>{episodeDetails.name}</h2>
					<div className='mb-8 mr-16 mt-8 flex items-center justify-end'>
						<div className='h-[5rem] w-[5rem]'>
							<RoundProgressBar
								percentageVal={+episodeDetails.vote_average!.toFixed(1) * 10}
							/>
						</div>
						<p className='ml-[.5rem] text-base font-medium'>
							{commaNumber(episodeDetails.vote_count!)} voted users
						</p>
					</div>

					<section className='mt-16 flex justify-between'>
						<section className='mb-4 flex flex-col justify-center'>
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
									{episodeDetails.runtime ? (
										<p>{episodeDetails.runtime}</p>
									) : (
										<i>Runtime Not Available.</i>
									)}
								</p>
							</div>

							<div className='mt-2'>
								<p>
									<span className='font-bold'>Air Date: </span>
									{episodeDetails.air_date ? (
										<p>{CommonMethods.formatDate(episodeDetails.air_date)}</p>
									) : (
										<i>Air Date Not Available</i>
									)}
								</p>
							</div>
						</section>

						<section>
							<Image
								className='rounded-lg'
								src={CommonMethods.getImage(episodeDetails.still_path)}
								alt={episodeDetails.name ?? undefined}
								height={200}
								width={300}
							/>
						</section>
					</section>

					<section className='mt-4'>
						<h5 className='mb-2 underline underline-offset-4'>Description:</h5>
						{episodeDetails.overview ? (
							<p>{episodeDetails.overview}</p>
						) : (
							<i>No Description Available.</i>
						)}
					</section>

					<button className='absolute right-2 top-2' onClick={closeModal}>
						<GrClose size={25} />
					</button>
				</section>
			</section>
		</Fragment>
	);
};

export default EpisodeDetailsModal;
