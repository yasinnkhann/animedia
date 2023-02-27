import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import RoundProgressBar from '../../components/RoundProgressBar';
import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import RecommendedShowsHorizontalScroller from '../../components/UI/HorizontalScrollerUI/Related/RelatedHorizontalScroller';
import MediaCastHorizontalScroller from '../../components/UI/HorizontalScrollerUI/MediaCast/MediaCastHorizontalScroller';
import EpisodeDetailsHorizontalScroller from '../../components/UI/HorizontalScrollerUI/EpisodeDetails/EpisodeDetailsHorizontalScroller';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { BASE_IMG_URL } from '../../utils/constants';
import { useSession } from 'next-auth/react';
import { ICast } from '@ts/interfaces';
import { watchStatusOptions, ratingOptions } from 'models/dropDownOptions';
import { getEnglishName } from 'all-iso-language-codes';
import { formatDate } from '../../utils/formatDate';
import { WatchStatusTypes } from 'graphql/generated/code-gen/graphql';
import { useMutation, useQuery } from '@apollo/client';

const ShowDetails = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [watchStatus, setWatchStatus] = useState<WatchStatusTypes>(
		WatchStatusTypes.NotWatching
	);

	const [rating, setRating] = useState<string | number>(ratingOptions[0].value);

	const [currEp, setCurrEp] = useState<string>('0');

	const id = Number((router.query?.['id-name'] as string)?.split('-')[0]);

	const { data: showDetailsData, loading: showDetailsLoading } = useQuery(
		Queries.SHOW_DETAILS,
		{
			skip: isNaN(id),
			variables: {
				showDetailsId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	const { data: usersShowData, loading: usersShowLoading } = useQuery(
		Queries.GET_USERS_SHOW,
		{
			skip: !showDetailsData?.showDetails.id,
			variables: {
				showId: String(showDetailsData?.showDetails?.id!),
			},
			fetchPolicy: 'network-only',
		}
	);

	const { data: recShowsData, loading: recShowsLoading } = useQuery(
		Queries.RECOMMENDED_SHOWS,
		{
			skip: !showDetailsData?.showDetails?.id,
			variables: {
				recommendedShowsId: showDetailsData?.showDetails?.id!,
			},
		}
	);

	const { data: showsCastCrewData, loading: showsCastCrewLoading } = useQuery(
		Queries.GET_SHOWS_CAST_CREW,
		{
			skip: !showDetailsData?.showDetails?.id,
			variables: {
				showId: showDetailsData?.showDetails?.id!,
			},
		}
	);

	const [addShow, { loading: addShowLoading }] = useMutation(
		Mutations.ADD_SHOW,
		{
			variables: {
				showId: String(showDetailsData?.showDetails?.id!),
				showName: showDetailsData?.showDetails?.name!,
				watchStatus,
				currentEpisode: Number(currEp),
			},
			refetchQueries: () => [
				{
					query: Queries.GET_USERS_SHOW,
					variables: {
						showId: String(showDetailsData?.showDetails?.id!),
					},
				},
				'UsersShow',
			],
		}
	);

	const [updateShow, { loading: updateShowLoading }] = useMutation(
		Mutations.UPDATE_SHOW,
		{
			variables: {
				showId: String(showDetailsData?.showDetails.id!),
				watchStatus,
				showRating: typeof rating === 'number' ? rating : null,
				currentEpisode: Number(currEp),
			},
			refetchQueries: () => [
				{
					query: Queries.GET_USERS_SHOW,
					variables: {
						showId: String(showDetailsData?.showDetails?.id!),
					},
				},
				'UsersShow',
			],
		}
	);

	const [deleteShow, { loading: deleteShowLoading }] = useMutation(
		Mutations.DELETE_SHOW,
		{
			variables: {
				showId: String(showDetailsData?.showDetails?.id!),
			},
			refetchQueries: () => [
				{
					query: Queries.GET_USERS_SHOW,
					variables: {
						showId: String(showDetailsData?.showDetails?.id!),
					},
				},
				'UsersShow',
			],
		}
	);

	const isDBPending = addShowLoading || updateShowLoading || deleteShowLoading;

	const handleChangeWatchStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		setWatchStatus(value as WatchStatusTypes);

		if (usersShowData?.usersShow) {
			if ((value as WatchStatusTypes) === WatchStatusTypes.NotWatching) {
				deleteShow({
					variables: {
						showId: String(showDetailsData?.showDetails?.id!),
					},
				});
				return;
			}

			if ((value as WatchStatusTypes) === WatchStatusTypes.PlanToWatch) {
				setCurrEp('0');
				setRating('');

				updateShow({
					variables: {
						showId: String(showDetailsData?.showDetails?.id!),
						watchStatus: WatchStatusTypes.PlanToWatch,
						currentEpisode: 0,
						showRating: null,
					},
				});
				return;
			}

			if ((value as WatchStatusTypes) === WatchStatusTypes.Completed) {
				setCurrEp(String(showDetailsData?.showDetails?.number_of_episodes));

				updateShow({
					variables: {
						showId: String(showDetailsData?.showDetails?.id!),
						watchStatus: WatchStatusTypes.Completed,
						currentEpisode:
							showDetailsData?.showDetails?.number_of_episodes ?? 0,
						showRating: usersShowData.usersShow?.rating ?? null,
					},
				});
				return;
			}

			updateShow({
				variables: {
					showId: String(showDetailsData?.showDetails?.id!),
					watchStatus: value as WatchStatusTypes,
					currentEpisode: usersShowData.usersShow.current_episode ?? 0,
					showRating: usersShowData.usersShow?.rating ?? null,
				},
			});
		} else {
			if ((value as WatchStatusTypes) === 'COMPLETED') {
				setCurrEp(
					String(showDetailsData?.showDetails?.number_of_episodes ?? '0')
				);

				addShow({
					variables: {
						showId: String(showDetailsData?.showDetails?.id!),
						showName: showDetailsData?.showDetails?.name!,
						watchStatus: value as WatchStatusTypes,
						currentEpisode: showDetailsData?.showDetails?.number_of_episodes!,
					},
				});
				return;
			}

			addShow({
				variables: {
					showId: String(showDetailsData?.showDetails?.id!),
					showName: showDetailsData?.showDetails?.name!,
					watchStatus: value as WatchStatusTypes,
					currentEpisode: Number(currEp),
				},
			});
		}
	};

	const handleChangeRating = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		setRating(isNaN(parseInt(value)) ? '' : parseInt(value));

		updateShow({
			variables: {
				showId: String(showDetailsData?.showDetails?.id!),
				showRating: isNaN(parseInt(value)) ? null : parseInt(value),
				watchStatus,
				currentEpisode: Number(currEp),
			},
		});
	};

	const handleEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (/[\D]/gi.test(e.target.value)) {
			setCurrEp(String(usersShowData?.usersShow?.current_episode) ?? '0');

			e.target.selectionStart = 1;
		} else {
			setCurrEp(e.target.value);
		}
	};

	const handleEpisodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			currEp === '' ||
			+currEp > showDetailsData!.showDetails.number_of_episodes
		)
			return;

		if (+currEp === showDetailsData!.showDetails.number_of_episodes) {
			setWatchStatus(WatchStatusTypes.Completed);

			updateShow({
				variables: {
					showId: String(showDetailsData?.showDetails?.id),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: WatchStatusTypes.Completed,
					currentEpisode: showDetailsData?.showDetails?.number_of_episodes!,
				},
			});

			return;
		}

		updateShow({
			variables: {
				showId: String(showDetailsData?.showDetails?.id),
				showRating: typeof rating === 'string' ? null : rating,
				watchStatus,
				currentEpisode: Number(currEp),
			},
		});
	};

	const handleEpisodeOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (
			e.target.value === '' ||
			+e.target.value > showDetailsData!.showDetails.number_of_episodes
		) {
			setCurrEp(String(usersShowData?.usersShow?.current_episode) ?? '0');
		} else {
			if (
				watchStatus === 'WATCHING' &&
				+e.target.value === showDetailsData!.showDetails.number_of_episodes
			) {
				setWatchStatus(WatchStatusTypes.Completed);

				updateShow({
					variables: {
						showId: String(showDetailsData?.showDetails?.id),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: WatchStatusTypes.Completed,
						currentEpisode: showDetailsData?.showDetails?.number_of_episodes!,
					},
				});

				return;
			}
			updateShow({
				variables: {
					showId: String(showDetailsData?.showDetails?.id!),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus,
					currentEpisode: Number(currEp),
				},
			});
		}
	};

	const handleIncrementBtn = () => {
		const prevEp = +currEp;

		if (prevEp + 1 === 1 && !usersShowData) {
			setWatchStatus(WatchStatusTypes.Watching);
			setCurrEp('1');

			addShow({
				variables: {
					showId: String(showDetailsData?.showDetails?.id!),
					showName: showDetailsData?.showDetails?.name!,
					watchStatus: WatchStatusTypes.Watching,
					currentEpisode: 1,
				},
			});

			return;
		}

		if (prevEp + 1 === 1 && usersShowData) {
			if (
				(watchStatus === 'PLAN_TO_WATCH' ||
					watchStatus === 'DROPPED' ||
					watchStatus === 'ON_HOLD') &&
				prevEp === 0
			) {
				setWatchStatus(WatchStatusTypes.Watching);
				setCurrEp('1');

				updateShow({
					variables: {
						showId: String(showDetailsData?.showDetails?.id!),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: WatchStatusTypes.Watching,
						currentEpisode: 1,
					},
				});

				return;
			}

			setCurrEp(String(prevEp + 1));

			updateShow({
				variables: {
					showId: String(showDetailsData?.showDetails?.id!),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: usersShowData.usersShow?.status!,
					currentEpisode: prevEp + 1,
				},
			});

			return;
		}

		if (
			prevEp + 1 < showDetailsData!.showDetails.number_of_episodes &&
			usersShowData
		) {
			setTimeout(() => {
				setCurrEp(String(prevEp + 1));

				if (watchStatus === 'DROPPED' || watchStatus === 'ON_HOLD') {
					setWatchStatus(WatchStatusTypes.Watching);

					updateShow({
						variables: {
							showId: String(showDetailsData?.showDetails?.id!),
							showRating: typeof rating === 'string' ? null : rating,
							watchStatus: WatchStatusTypes.Watching,
							currentEpisode: prevEp + 1,
						},
					});

					return;
				}

				updateShow({
					variables: {
						showId: String(showDetailsData?.showDetails?.id!),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: usersShowData?.usersShow?.status!,
						currentEpisode: prevEp + 1,
					},
				});
			}, 500);

			return;
		}

		if (
			prevEp + 1 === showDetailsData?.showDetails!.number_of_episodes &&
			usersShowData
		) {
			setWatchStatus(WatchStatusTypes.Completed);
			setCurrEp(String(prevEp + 1));

			updateShow({
				variables: {
					showId: String(showDetailsData?.showDetails?.id!),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: WatchStatusTypes.Completed,
					currentEpisode: prevEp + 1,
				},
			});
			return;
		}
	};

	useEffect(() => {
		if (!usersShowLoading) {
			if (usersShowData?.usersShow) {
				setWatchStatus(usersShowData.usersShow.status!);
				setRating(usersShowData.usersShow.rating ?? '');
				setCurrEp(String(usersShowData.usersShow.current_episode!));
			} else {
				setWatchStatus(WatchStatusTypes.NotWatching);
				setRating('');
				setCurrEp('0');
			}
		}
	}, [usersShowData, usersShowLoading]);

	useEffect(() => {
		if (!usersShowLoading && usersShowData) {
			if (
				+currEp === showDetailsData!.showDetails.number_of_episodes &&
				watchStatus !== 'DROPPED' &&
				watchStatus !== 'ON_HOLD' &&
				watchStatus !== 'WATCHING' &&
				watchStatus !== 'NOT_WATCHING'
			) {
				setWatchStatus(WatchStatusTypes.Completed);

				updateShow({
					variables: {
						showId: String(showDetailsData?.showDetails?.id!),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: WatchStatusTypes.Completed,
						currentEpisode: showDetailsData?.showDetails?.number_of_episodes!,
					},
				});
				return;
			}

			if (
				usersShowData.usersShow?.current_episode! <
					showDetailsData!.showDetails.number_of_episodes &&
				watchStatus === 'COMPLETED'
			) {
				setWatchStatus(WatchStatusTypes.Watching);

				updateShow({
					variables: {
						showId: String(showDetailsData?.showDetails?.id!),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: WatchStatusTypes.Watching,
						currentEpisode: usersShowData.usersShow?.current_episode!,
					},
				});
				return;
			}
		}

		if (!usersShowLoading && !usersShowData) {
			setWatchStatus(WatchStatusTypes.NotWatching);
			setRating('');
			setCurrEp('0');
			return;
		}
	}, [
		rating,
		currEp,
		showDetailsData,
		usersShowLoading,
		usersShowData,
		watchStatus,
		updateShow,
	]);

	if (showDetailsLoading || !showDetailsData?.showDetails || usersShowLoading) {
		return (
			<section className='flex justify-center items-center h-screen'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>{showDetailsData.showDetails.name}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
				<section className='relative mx-4 mt-4 aspect-w-16 aspect-h-16'>
					<Image
						className='rounded-lg'
						src={BASE_IMG_URL + showDetailsData.showDetails.poster_path}
						alt={showDetailsData.showDetails.name}
						layout='fill'
					/>
				</section>

				<section className='mt-4'>
					<section className='flex items-center mb-8 mt-8'>
						<section className='h-[5rem] w-[5rem]'>
							<RoundProgressBar
								percentageVal={
									+showDetailsData.showDetails.vote_average.toFixed(1) * 10
								}
							/>
						</section>
						<p className='ml-[.5rem] font-medium text-base'>
							{commaNumber(showDetailsData.showDetails.vote_count)} voted users
						</p>
					</section>

					{status === 'authenticated' && session && (
						<section className='my-4 h-[1.5rem] flex'>
							<select
								className='h-full rounded outline-none'
								value={watchStatus}
								onChange={handleChangeWatchStatus}
								disabled={isDBPending}
							>
								{watchStatusOptions.map(option => (
									<option key={option.value} value={option.value}>
										{option.text}
									</option>
								))}
							</select>

							<select
								className='mx-4'
								value={rating}
								onChange={handleChangeRating}
								disabled={
									watchStatus === 'NOT_WATCHING' ||
									watchStatus === 'PLAN_TO_WATCH' ||
									isDBPending
								}
							>
								{ratingOptions.map(option => (
									<option key={option.value} value={option.value}>
										{option.text}
									</option>
								))}
							</select>

							<form
								className='border border-gray-200 bg-white'
								onSubmit={handleEpisodeSubmit}
							>
								<span>Episodes:</span>
								<input
									className='text-right w-12 focus:outline-none'
									type='text'
									value={currEp}
									onChange={handleEpisodeChange}
									onFocus={e => (e.target.selectionStart = 1)}
									disabled={
										watchStatus === 'NOT_WATCHING' ||
										watchStatus === 'PLAN_TO_WATCH' ||
										isDBPending
									}
									onBlur={handleEpisodeOnBlur}
								/>
								<span>/</span>
								<span>{showDetailsData.showDetails.number_of_episodes}</span>
								<button
									className='mx-1 text-blue-500'
									onClick={handleIncrementBtn}
									type='button'
									disabled={
										+currEp >= showDetailsData.showDetails.number_of_episodes ||
										isDBPending
									}
								>
									+
								</button>
							</form>
						</section>
					)}

					<section className='pb-32'>
						<h1>{showDetailsData.showDetails.name}</h1>
						<h4 className='my-4'>{showDetailsData.showDetails.tagline}</h4>
						<p>{showDetailsData.showDetails.overview}</p>
					</section>
				</section>

				<section className='ml-8 my-4'>
					<h3 className='mb-4 underline underline-offset-4'>Details</h3>
					<h4 className='mt-4'>No. of Seasons</h4>
					<p className='ml-1'>
						{showDetailsData.showDetails.number_of_seasons}
					</p>
					<h4 className='mt-4'>No. of Episodes</h4>
					<p className='ml-1'>
						{showDetailsData.showDetails.number_of_episodes}
					</p>
					<h4 className='mt-4'>First Air Date</h4>
					{showDetailsData.showDetails.first_air_date ? (
						<p className='ml-1'>
							{formatDate(showDetailsData.showDetails.first_air_date)}
						</p>
					) : (
						<p className='ml-1'>N/A</p>
					)}
					<h4 className='mt-4'>Last Episode to Air</h4>
					{showDetailsData.showDetails.last_episode_to_air ? (
						<div className='ml-1'>
							<p>
								Season{' '}
								{showDetailsData.showDetails.last_episode_to_air.season_number}{' '}
								Episode{' '}
								{showDetailsData.showDetails.last_episode_to_air.episode_number}
								<br />
								{formatDate(
									showDetailsData.showDetails.last_episode_to_air.air_date!
								)}
							</p>
						</div>
					) : (
						<p className='ml-1'>N/A</p>
					)}
					<h4 className='mt-4'>Next Episode to Air</h4>
					{showDetailsData.showDetails.next_episode_to_air ? (
						<div className='ml-1'>
							<p>
								Season{' '}
								{
									showDetailsData.showDetails?.next_episode_to_air
										?.season_number
								}{' '}
								Episode{' '}
								{
									showDetailsData.showDetails?.next_episode_to_air
										?.episode_number
								}
								<br />
								{formatDate(
									showDetailsData.showDetails.next_episode_to_air.air_date!
								)}
							</p>
						</div>
					) : (
						<p className='ml-1'>N/A</p>
					)}
					<h4 className='mt-4'>Status</h4>
					<p className='ml-1'>{showDetailsData.showDetails?.status}</p>
					<h4 className='mt-4'>In Production</h4>
					<p className='ml-1'>
						{showDetailsData.showDetails.in_production ? 'Yes' : 'No'}
					</p>
					<h4 className='mt-4'>Genre(s)</h4>
					<div className='ml-1'>
						{showDetailsData.showDetails.genres.map((genre, idx) => (
							<p key={idx}>{genre.name}</p>
						))}
					</div>
					<h4 className='mt-4'>Original Language</h4>
					<p className='ml-1'>
						{getEnglishName(showDetailsData.showDetails.original_language)}
					</p>
					{showDetailsData.showDetails.homepage.length > 0 && (
						<>
							<h4 className='mt-4'>Official Page</h4>
							<Link href={showDetailsData.showDetails.homepage}>
								<a className='underline ml-1' target='_blank'>
									Learn More
								</a>
							</Link>
						</>
					)}
				</section>

				<section className='col-start-2 mt-4'>
					{showDetailsData.showDetails.seasons.length > 0 &&
						showDetailsData.showDetails.number_of_episodes! <= 500 && (
							<section>
								<h3 className='mb-4 ml-8'>Episodes</h3>
								<EpisodeDetailsHorizontalScroller
									seasons={showDetailsData.showDetails.seasons!.filter(
										season => season?.season_number! > 0
									)}
									showId={showDetailsData.showDetails.id}
								/>
							</section>
						)}

					{!showsCastCrewLoading &&
						showsCastCrewData?.showsCastCrew?.cast?.length! > 0 && (
							<section>
								<h3 className='mb-4 ml-8 mt-4'>Cast</h3>
								<MediaCastHorizontalScroller
									items={
										showsCastCrewData?.showsCastCrew?.cast
											?.map(cast => ({
												id: cast!.id,
												name: cast!.name,
												character: cast!.character,
												profile_path: cast!.profile_path,
											}))
											.slice(0, 20) as ICast[]
									}
								/>
							</section>
						)}
					{!recShowsLoading &&
						recShowsData?.recommendedShows.results?.length! > 0 && (
							<section className='pb-4'>
								<h3 className='mb-4 ml-8 mt-4'>Recommended Shows</h3>
								<RecommendedShowsHorizontalScroller
									items={recShowsData!.recommendedShows.results.map(show => ({
										id: show.id,
										poster_path: show.poster_path,
										name: show.name,
										popularity: show.popularity,
									}))}
								/>
							</section>
						)}
				</section>
			</main>
		</>
	);
};

export default ShowDetails;
