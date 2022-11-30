import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import RoundProgressBar from '../../components/RoundProgressBar';
import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import RecommendedShowsHorizontalScroller from '../../components/UI/HorizontalScrollerUI/KnownForHorizontalScroller';
import MediaCastHorizontalScroller from '../../components/UI/HorizontalScrollerUI/MediaCastHorizontalScroller';
import EpisodeDetailsHorizontalScroller from '../../components/UI/HorizontalScrollerUI/EpisodeDetailsHorizontalScroller';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { BASE_IMG_URL } from '../../utils/URLs';
import { useSession } from 'next-auth/react';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery, IUseGQLMutation, ICast } from '@ts/interfaces';
import { watchStatusOptions } from 'models/watchStatusOptions';
import { ratingOptions } from 'models/ratingOptions';
import { getEnglishName } from 'all-iso-language-codes';
import { formatDate } from '../../utils/formatDate';
import {
	NexusGenObjects,
	NexusGenArgTypes,
	NexusGenEnums,
} from '../../graphql/generated/nexus-typegen';

const ShowDetails = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const recShowsContainerRef = useRef<HTMLElement>(null);
	const showCastContainerRef = useRef<HTMLElement>(null);
	const episodesContainerRef = useRef<HTMLElement>(null);

	const [watchStatus, setWatchStatus] =
		useState<NexusGenEnums['WatchStatusTypes']>('NOT_WATCHING');

	const [rating, setRating] = useState<string | number>(ratingOptions[0].value);

	const [currEp, setCurrEp] = useState<string>('0');

	const id = Number((router.query?.['id-name'] as string)?.split('-')[0]);

	const {
		data: showDetailsData,
		loading: showDetailsLoading,
	}: IUseGQLQuery<
		NexusGenObjects['ShowDetailsRes'],
		NexusGenArgTypes['Query']['showDetails']
	> = useGQLQuery<NexusGenArgTypes['Query']['showDetails']>(
		Queries.QUERY_SHOW_DETAILS,
		{
			variables: {
				showDetailsId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	const {
		data: usersShowData,
		loading: usersShowLoading,
	}: IUseGQLQuery<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Query']['usersShow']
	> = useGQLQuery<NexusGenArgTypes['Query']['usersShow']>(
		Queries.QUERY_GET_USERS_SHOW,
		{
			variables: {
				showId: String(showDetailsData?.id),
			},
			fetchPolicy: 'network-only',
		}
	);

	const {
		data: recShowsData,
		loading: recShowsLoading,
	}: IUseGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['recommendedShows']
	> = useGQLQuery<NexusGenArgTypes['Query']['recommendedShows']>(
		Queries.QUERY_RECOMMENDED_SHOWS,
		{
			variables: {
				recommendedShowsId: showDetailsData?.id!,
			},
		}
	);

	const {
		data: showsCastCrewData,
		loading: showsCastCrewLoading,
	}: IUseGQLQuery<
		NexusGenObjects['ShowsCastCrewRes'],
		NexusGenArgTypes['Query']['showsCastCrew']
	> = useGQLQuery<NexusGenArgTypes['Query']['showsCastCrew']>(
		Queries.QUERY_GET_SHOWS_CAST_CREW,
		{
			variables: {
				showId: showDetailsData?.id!,
			},
		}
	);

	const {
		mutateFunction: addShow,
		mutateLoading: addShowLoading,
	}: IUseGQLMutation<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Mutation']['addedShow']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['addedShow']>(
		Mutations.MUTATION_ADD_SHOW,
		{
			variables: {
				showId: String(showDetailsData?.id),
				showName: showDetailsData?.name!,
				watchStatus,
				currentEpisode: Number(currEp),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_SHOW,
					variables: {
						showId: String(showDetailsData?.id),
					},
				},
				'UsersShow',
			],
		}
	);

	const {
		mutateFunction: updateShow,
		mutateLoading: updateShowLoading,
	}: IUseGQLMutation<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Mutation']['updatedShow']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['updatedShow']>(
		Mutations.MUTATION_UPDATE_SHOW,
		{
			variables: {
				showId: String(showDetailsData?.id),
				watchStatus,
				showRating: typeof rating === 'number' ? rating : null,
				currentEpisode: Number(currEp),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_SHOW,
					variables: {
						showId: String(showDetailsData?.id),
					},
				},
				'UsersShow',
			],
		}
	);

	const {
		mutateFunction: deleteShow,
		mutateLoading: deleteShowLoading,
	}: IUseGQLMutation<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Mutation']['deletedShow']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['deletedShow']>(
		Mutations.MUTATION_DELETE_SHOW,
		{
			variables: {
				showId: String(showDetailsData?.id),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_SHOW,
					variables: {
						showId: String(showDetailsData?.id),
					},
				},
				'UsersShow',
			],
		}
	);

	const isDBPending = addShowLoading || updateShowLoading || deleteShowLoading;

	const handleChangeWatchStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		setWatchStatus(value as NexusGenEnums['WatchStatusTypes']);

		if (usersShowData) {
			if ((value as NexusGenEnums['WatchStatusTypes']) === 'NOT_WATCHING') {
				deleteShow({
					variables: {
						showId: String(showDetailsData?.id),
					},
				});

				return;
			}

			if ((value as NexusGenEnums['WatchStatusTypes']) === 'PLAN_TO_WATCH') {
				setCurrEp('0');
				setRating('');

				updateShow({
					variables: {
						showId: String(showDetailsData?.id),
						watchStatus: 'PLAN_TO_WATCH',
						currentEpisode: 0,
						showRating: null,
					},
				});

				return;
			}

			if ((value as NexusGenEnums['WatchStatusTypes']) === 'COMPLETED') {
				setCurrEp(String(showDetailsData?.number_of_episodes));

				updateShow({
					variables: {
						showId: String(showDetailsData?.id),
						watchStatus: 'COMPLETED',
						currentEpisode: showDetailsData?.number_of_episodes,
					},
				});

				return;
			}

			updateShow({
				variables: {
					showId: String(showDetailsData?.id),
					watchStatus: value as NexusGenEnums['WatchStatusTypes'],
					currentEpisode: usersShowData.current_episode,
				},
			});
		} else {
			if ((value as NexusGenEnums['WatchStatusTypes']) === 'COMPLETED') {
				setCurrEp(String(showDetailsData?.number_of_episodes));

				addShow({
					variables: {
						showId: String(showDetailsData?.id),
						showName: showDetailsData?.name!,
						watchStatus: value as NexusGenEnums['WatchStatusTypes'],
						currentEpisode: showDetailsData?.number_of_episodes,
					},
				});

				return;
			}

			addShow({
				variables: {
					showId: String(showDetailsData?.id),
					showName: showDetailsData?.name!,
					watchStatus: value as NexusGenEnums['WatchStatusTypes'],
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
				showId: String(showDetailsData?.id),
				showRating: isNaN(parseInt(value)) ? null : parseInt(value),
				watchStatus,
			},
		});
	};

	const handleEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (/[\D]/gi.test(e.target.value)) {
			setCurrEp(String(usersShowData?.current_episode) ?? '0');

			e.target.selectionStart = 1;
		} else {
			setCurrEp(e.target.value);
		}
	};

	const handleEpisodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (currEp === '' || +currEp > showDetailsData!.number_of_episodes) return;

		if (+currEp === showDetailsData!.number_of_episodes) {
			setWatchStatus('COMPLETED');

			updateShow({
				variables: {
					showId: String(showDetailsData?.id),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: 'COMPLETED',
					currentEpisode: showDetailsData?.number_of_episodes,
				},
			});

			return;
		}

		updateShow({
			variables: {
				showId: String(showDetailsData?.id),
				showRating: typeof rating === 'string' ? null : rating,
				watchStatus,
				currentEpisode: Number(currEp),
			},
		});
	};

	const handleEpisodeOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (
			e.target.value === '' ||
			+e.target.value > showDetailsData!.number_of_episodes
		) {
			setCurrEp(String(usersShowData?.current_episode) ?? '0');
		} else {
			if (
				watchStatus === 'WATCHING' &&
				+e.target.value === showDetailsData!.number_of_episodes
			) {
				setWatchStatus('COMPLETED');

				updateShow({
					variables: {
						showId: String(showDetailsData?.id),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: 'COMPLETED',
						currentEpisode: showDetailsData?.number_of_episodes,
					},
				});

				return;
			}
			updateShow({
				variables: {
					showId: String(showDetailsData?.id),
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
			setWatchStatus('WATCHING');
			setCurrEp('1');

			addShow({
				variables: {
					showId: String(showDetailsData?.id),
					showName: showDetailsData?.name!,
					watchStatus: 'WATCHING',
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
				setWatchStatus('WATCHING');
				setCurrEp('1');

				updateShow({
					variables: {
						showId: String(showDetailsData?.id),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: 'WATCHING',
						currentEpisode: 1,
					},
				});

				return;
			}

			setCurrEp(String(prevEp + 1));

			updateShow({
				variables: {
					showId: String(showDetailsData?.id),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: usersShowData.status!,
					currentEpisode: prevEp + 1,
				},
			});

			return;
		}

		if (prevEp + 1 < showDetailsData!.number_of_episodes && usersShowData) {
			setTimeout(() => {
				setCurrEp(String(prevEp + 1));

				if (watchStatus === 'DROPPED' || watchStatus === 'ON_HOLD') {
					setWatchStatus('WATCHING');

					updateShow({
						variables: {
							showId: String(showDetailsData?.id),
							showRating: typeof rating === 'string' ? null : rating,
							watchStatus: 'WATCHING',
							currentEpisode: prevEp + 1,
						},
					});

					return;
				}

				updateShow({
					variables: {
						showId: String(showDetailsData?.id),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: usersShowData.status!,
						currentEpisode: prevEp + 1,
					},
				});
			}, 500);

			return;
		}

		if (prevEp + 1 === showDetailsData!.number_of_episodes && usersShowData) {
			setWatchStatus('COMPLETED');
			setCurrEp(String(prevEp + 1));

			updateShow({
				variables: {
					showId: String(showDetailsData?.id),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: 'COMPLETED',
					currentEpisode: prevEp + 1,
				},
			});

			return;
		}
	};

	useEffect(() => {
		if (!usersShowLoading) {
			if (usersShowData) {
				setWatchStatus(usersShowData.status!);
				setRating(usersShowData?.rating ?? '');
				setCurrEp(String(usersShowData.current_episode!));
			} else {
				setWatchStatus('NOT_WATCHING');
				setRating('');
				setCurrEp('0');
			}
		}
	}, [usersShowData, usersShowLoading]);

	useEffect(() => {
		if (!usersShowLoading && usersShowData) {
			if (
				+currEp === showDetailsData!.number_of_episodes &&
				watchStatus !== 'DROPPED' &&
				watchStatus !== 'ON_HOLD' &&
				watchStatus !== 'WATCHING' &&
				watchStatus !== 'NOT_WATCHING'
			) {
				setWatchStatus('COMPLETED');

				updateShow({
					variables: {
						showId: String(showDetailsData?.id),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: 'COMPLETED',
						currentEpisode: showDetailsData?.number_of_episodes,
					},
				});

				return;
			}

			if (
				usersShowData.current_episode! < showDetailsData!.number_of_episodes &&
				watchStatus === 'COMPLETED'
			) {
				setWatchStatus('WATCHING');

				updateShow({
					variables: {
						showId: String(showDetailsData?.id),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: 'WATCHING',
						currentEpisode: usersShowData.current_episode!,
					},
				});

				return;
			}
		}

		if (!usersShowLoading && !usersShowData) {
			setWatchStatus('NOT_WATCHING');
			setRating('');
			setCurrEp('0');

			return;
		}
	}, [
		rating,
		currEp,
		showDetailsData?.number_of_episodes!,
		usersShowLoading,
		usersShowData,
		watchStatus,
		updateShow,
		showDetailsData?.id!,
	]);

	useEffect(() => {
		const scrollerClass = '.react-horizontal-scrolling-menu--scroll-container';

		if (recShowsContainerRef.current) {
			const recMoviesScroller = recShowsContainerRef.current.querySelector(
				scrollerClass
			) as HTMLDivElement;

			recMoviesScroller.style.height = '23rem';
		}

		if (showCastContainerRef.current) {
			const showCastScroller = showCastContainerRef.current.querySelector(
				scrollerClass
			) as HTMLDivElement;

			showCastScroller.style.height = '23rem';
		}

		if (episodesContainerRef.current) {
			const episodesScroller = episodesContainerRef.current.querySelector(
				scrollerClass
			) as HTMLDivElement;

			episodesScroller.style.height = '14rem';
		}
	});

	if (showDetailsLoading) {
		return (
			<section className='flex justify-center items-center h-screen'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>{showDetailsData?.name}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
				<section className='relative mx-4 mt-4'>
					<Image
						className='rounded-lg'
						src={BASE_IMG_URL + showDetailsData!.poster_path}
						alt={showDetailsData!.name ?? undefined}
						layout='fill'
					/>
				</section>

				<section className='mt-4'>
					<section className='flex items-center mb-8 mt-8'>
						<section className='h-[5rem] w-[5rem]'>
							<RoundProgressBar
								percentageVal={+showDetailsData!.vote_average.toFixed(1) * 10}
							/>
						</section>
						<p className='ml-[.5rem] font-medium text-base'>
							{commaNumber(showDetailsData!.vote_count)} voted users
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
								<span>{showDetailsData!.number_of_episodes}</span>
								<button
									className='mx-1 text-blue-500'
									onClick={handleIncrementBtn}
									type='button'
									disabled={
										+currEp >= showDetailsData!.number_of_episodes ||
										isDBPending
									}
								>
									+
								</button>
							</form>
						</section>
					)}

					<section className='pb-32'>
						<h1>{showDetailsData!.name}</h1>
						<h4 className='my-4'>{showDetailsData!.tagline}</h4>
						<p>{showDetailsData!.overview}</p>
					</section>
				</section>

				<section className='ml-8 my-4'>
					<h3 className='mb-4 underline underline-offset-4'>Details</h3>
					<h4 className='mt-4'>No. of Seasons</h4>
					<p className='ml-1'>{showDetailsData!.number_of_seasons}</p>
					<h4 className='mt-4'>No. of Episodes</h4>
					<p className='ml-1'>{showDetailsData!.number_of_episodes}</p>
					<h4 className='mt-4'>First Air Date</h4>
					{showDetailsData!.first_air_date ? (
						<p className='ml-1'>
							{formatDate(showDetailsData!.first_air_date)}
						</p>
					) : (
						<p className='ml-1'>N/A</p>
					)}
					<h4 className='mt-4'>Last Episode to Air</h4>
					{showDetailsData!.last_episode_to_air ? (
						<div className='ml-1'>
							<p>
								Season {showDetailsData!.last_episode_to_air.season_number}{' '}
								Episode {showDetailsData!.last_episode_to_air.episode_number}
								<br />
								{formatDate(showDetailsData!.last_episode_to_air.air_date!)}
							</p>
						</div>
					) : (
						<p className='ml-1'>N/A</p>
					)}
					<h4 className='mt-4'>Next Episode to Air</h4>
					{showDetailsData!.next_episode_to_air ? (
						<div className='ml-1'>
							<p>
								Season {showDetailsData!.next_episode_to_air.season_number}{' '}
								Episode {showDetailsData!.next_episode_to_air.episode_number}
								<br />
								{formatDate(showDetailsData!.next_episode_to_air.air_date!)}
							</p>
						</div>
					) : (
						<p className='ml-1'>N/A</p>
					)}
					<h4 className='mt-4'>Status</h4>
					<p className='ml-1'>{showDetailsData!.status}</p>
					<h4 className='mt-4'>In Production</h4>
					<p className='ml-1'>
						{showDetailsData!.in_production ? 'Yes' : 'No'}
					</p>
					<h4 className='mt-4'>Genre(s)</h4>
					<div className='ml-1'>
						{showDetailsData!.genres.map((genre, idx) => (
							<p key={idx}>{genre.name}</p>
						))}
					</div>
					<h4 className='mt-4'>Original Language</h4>
					<p className='ml-1'>
						{getEnglishName(showDetailsData!.original_language)}
					</p>
					{showDetailsData!.homepage.length > 0 && (
						<>
							<h4 className='mt-4'>Official Page</h4>
							<Link href={showDetailsData!.homepage}>
								<a className='underline ml-1' target='_blank'>
									Learn More
								</a>
							</Link>
						</>
					)}
				</section>

				<section className='col-start-2 mt-4'>
					{showDetailsData!.seasons.length > 0 &&
						showDetailsData!.number_of_episodes! <= 500 && (
							<section ref={episodesContainerRef}>
								<h3 className='mb-4 ml-8'>Episodes</h3>
								<EpisodeDetailsHorizontalScroller
									seasons={showDetailsData!.seasons!.filter(
										season => season?.season_number! > 0
									)}
									showId={showDetailsData!.id}
								/>
							</section>
						)}

					{!showsCastCrewLoading && showsCastCrewData?.cast?.length! > 0 && (
						<section ref={showCastContainerRef}>
							<h3 className='mb-4 ml-8'>Cast</h3>
							<MediaCastHorizontalScroller
								items={
									showsCastCrewData?.cast
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
					{!recShowsLoading && recShowsData?.results?.length! > 0 && (
						<section ref={recShowsContainerRef}>
							<h3 className='mb-4 ml-8'>Recommended Shows</h3>
							<RecommendedShowsHorizontalScroller
								items={recShowsData!.results.map(show => ({
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
