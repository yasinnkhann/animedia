import Image from 'next/image';
import * as Queries from '../../../graphql/queries';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { IEPDetails } from '@ts/interfaces';
import { CommonMethods } from 'utils/CommonMethods';
import RoundProgressBar from 'components/RoundProgressBar';
import commaNumber from 'comma-number';
import { lazy, Suspense } from 'react';
import { Puff } from 'react-loading-icons';

const Modal = lazy(() => import('components/Modal'));

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
			<section className='relative mx-4 h-[7rem] w-[15rem] select-none' role='button' tabIndex={0}>
				<section className='relative h-full w-full' onClick={() => setShowModal(true)}>
					<div className='relative h-full w-full'>
						<Image
							className='rounded-lg object-contain'
							src={CommonMethods.getTheMovieDbImage(epDetailsCardData.episodeDetails.still_path)}
							alt={epDetailsCardData.episodeDetails.name ?? ''}
							fill
							sizes='100vw'
						/>
					</div>
					<div className='relative flex w-full flex-wrap content-start whitespace-normal'>
						<h2 className='m-0 w-full break-words text-center text-base'>
							<p>
								Season {epDetailsCardData.episodeDetails.season_number} Ep.{' '}
								{epDetailsCardData.episodeDetails.episode_number}
							</p>
							<p className='font-bold'>{epDetailsCardData.episodeDetails.name}</p>
						</h2>
					</div>
				</section>
			</section>
			{showModal && (
				<Suspense
					fallback={
						<div className='flex justify-center'>
							<Puff stroke='#00b3ff' />
						</div>
					}
				>
					<Modal closeModal={() => setShowModal(false)}>
						<div className='w-full rounded-lg bg-white'>
							<div className='flex items-center justify-between border-b border-gray-300 px-6 py-4'>
								<h2 className='text-lg font-semibold'>{epDetailsCardData.episodeDetails.name}</h2>
							</div>
							<div className='p-6'>
								<div className='flex items-center space-x-4'>
									<div className='h-16 w-16'>
										<RoundProgressBar
											percentageVal={
												+(epDetailsCardData.episodeDetails.vote_average ?? 0).toFixed(1) * 10
											}
										/>
									</div>
									<p className='text-sm text-gray-600'>
										{commaNumber(epDetailsCardData.episodeDetails.vote_count ?? 0)} voted users
									</p>
								</div>
								<div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
									<div>
										<h4 className='font-semibold'>Season</h4>
										<p>{epDetailsCardData.episodeDetails.season_number}</p>
									</div>
									<div>
										<h4 className='font-semibold'>Episode</h4>
										<p>{epDetailsCardData.episodeDetails.episode_number}</p>
									</div>
									<div>
										<h4 className='font-semibold'>Runtime</h4>
										<p>
											{epDetailsCardData.episodeDetails.runtime
												? `${epDetailsCardData.episodeDetails.runtime} min`
												: 'Runtime Not Available'}
										</p>
									</div>
									<div>
										<h4 className='font-semibold'>Air Date</h4>
										<p>
											{epDetailsCardData.episodeDetails.air_date
												? CommonMethods.formatDate(epDetailsCardData.episodeDetails.air_date)
												: 'Air Date Not Available'}
										</p>
									</div>
								</div>
								<div className='mt-6'>
									<h4 className='mb-2 font-semibold'>Description:</h4>
									<p>
										{epDetailsCardData.episodeDetails.overview
											? epDetailsCardData.episodeDetails.overview
											: 'No Description Available'}
									</p>
								</div>
							</div>
							{epDetailsCardData.episodeDetails.still_path && (
								<div className='relative h-[35rem] w-full overflow-hidden rounded-lg border'>
									<div className='relative h-full'>
										<Image
											src={CommonMethods.getTheMovieDbImage(
												epDetailsCardData.episodeDetails.still_path
											)}
											alt={epDetailsCardData.episodeDetails.name ?? ''}
											className='object-cover'
											fill
											sizes='100vw'
										/>
									</div>
								</div>
							)}
						</div>
					</Modal>
				</Suspense>
			)}
		</>
	);
};

export default EpisodeDetailsCard;
