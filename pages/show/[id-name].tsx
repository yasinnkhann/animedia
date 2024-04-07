import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import RoundProgressBar from '../../components/RoundProgressBar';
import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import RelatedHorizontalScroller from '../../components/HorizontalScroller/Related/RelatedHorizontalScroller';
import MediaCastHorizontalScroller from '../../components/HorizontalScroller/MediaCast/MediaCastHorizontalScroller';
import EpisodeDetailsHorizontalScroller from '../../components/HorizontalScroller/EpisodeDetails/EpisodeDetailsHorizontalScroller';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { useSession } from 'next-auth/react';
import { ICast } from '@ts/interfaces';
import { watchStatusOptions, ratingOptions } from 'models/dropDownOptions';
import { getEnglishName } from 'all-iso-language-codes';
import { CommonMethods } from '../../utils/CommonMethods';
import { WatchStatusTypes } from 'graphql/generated/code-gen/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { EContent } from '@ts/enums';
import _ from 'lodash';

const ShowDetails = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [watchStatus, setWatchStatus] = useState<WatchStatusTypes>(
		WatchStatusTypes.NotWatching
	);

	const [rating, setRating] = useState<string | number>(ratingOptions[0].value);

	const [currEp, setCurrEp] = useState<string>('0');

	const [currTotalEpCount, setCurrTotalEpCount] = useState<number>(0);

	const [currTotalSeasonCount, setCurrTotalSeasonCount] = useState<number>(0);

	const id = (router.query?.['id-name'] as string)?.split('-')[0];

	const { data: showDetailsData, loading: showDetailsLoading } = useQuery(
		Queries.SHOW_DETAILS,
		{
			skip: !id,
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

	const getCurrTotalSeasonAndEpCount = useCallback(() => {
		let totalEpCount = 0;
		let totalSeasonCount = 0;

		if (
			!showDetailsData?.showDetails.number_of_episodes ||
			!showDetailsData?.showDetails.number_of_seasons
		) {
			return;
		}

		totalEpCount = showDetailsData.showDetails.number_of_episodes;
		totalSeasonCount = showDetailsData.showDetails.number_of_seasons;

		for (let i = showDetailsData.showDetails.seasons.length - 1; i > -1; i--) {
			const season = showDetailsData.showDetails.seasons[i];
			const currDate = new Date();

			if (
				season?.name.startsWith('Season') &&
				season.season_number !== 0 &&
				(!season.air_date ||
					currDate.getTime() < new Date(season.air_date).getTime())
			) {
				totalEpCount -= season.episode_count;
				totalSeasonCount--;
			}
		}
		setCurrTotalEpCount(totalEpCount);
		setCurrTotalSeasonCount(totalSeasonCount);
	}, [
		showDetailsData?.showDetails.number_of_episodes,
		showDetailsData?.showDetails.number_of_seasons,
		showDetailsData?.showDetails.seasons,
	]);

	const handleChangeWatchStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		const showId = showDetailsData?.showDetails?.id!;
		const usersShow = usersShowData?.usersShow;

		if (usersShow) {
			if (value === WatchStatusTypes.NotWatching) {
				deleteShow({
					variables: { showId: String(showId) },
				});
			} else if (value === WatchStatusTypes.PlanToWatch) {
				updateShow({
					variables: {
						showId: String(showId),
						watchStatus: WatchStatusTypes.PlanToWatch,
						currentEpisode: 0,
						showRating: null,
					},
				});
			} else if (value === WatchStatusTypes.Completed) {
				updateShow({
					variables: {
						showId: String(showId),
						watchStatus: WatchStatusTypes.Completed,
						currentEpisode: currTotalEpCount ?? 0,
						showRating: usersShow?.rating ?? null,
					},
				});
			} else {
				updateShow({
					variables: {
						showId: String(showId),
						watchStatus: value as WatchStatusTypes,
						currentEpisode: usersShow?.current_episode ?? 0,
						showRating: usersShow?.rating ?? null,
					},
				});
			}
		} else {
			if (value === WatchStatusTypes.Completed) {
				addShow({
					variables: {
						showId: String(showId),
						showName: showDetailsData?.showDetails?.name!,
						watchStatus: value as WatchStatusTypes,
						currentEpisode: currTotalEpCount,
					},
				});
			} else {
				addShow({
					variables: {
						showId: String(showId),
						showName: showDetailsData?.showDetails?.name!,
						watchStatus: value as WatchStatusTypes,
						currentEpisode: Number(currEp),
					},
				});
			}
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
		if (currEp === '' || +currEp > currTotalEpCount) return;

		if (+currEp === currTotalEpCount) {
			setWatchStatus(WatchStatusTypes.Completed);

			updateShow({
				variables: {
					showId: String(showDetailsData?.showDetails?.id),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: WatchStatusTypes.Completed,
					currentEpisode: currTotalEpCount,
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
		if (e.target.value === '' || +e.target.value > currTotalEpCount) {
			setCurrEp(String(usersShowData?.usersShow?.current_episode) ?? '0');
		} else {
			if (
				watchStatus === WatchStatusTypes.Watching &&
				+e.target.value === currTotalEpCount
			) {
				setWatchStatus(WatchStatusTypes.Completed);

				updateShow({
					variables: {
						showId: String(showDetailsData?.showDetails?.id),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: WatchStatusTypes.Completed,
						currentEpisode: currTotalEpCount,
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

		const updateShowVariables = {
			showId: String(showDetailsData?.showDetails?.id!),
			showRating: typeof rating === 'string' ? null : rating,
			currentEpisode: prevEp + 1,
		};

		if (prevEp + 1 === 1) {
			if (!usersShowData?.usersShow?.status) {
				addShow({
					variables: {
						...updateShowVariables,
						showName: showDetailsData?.showDetails?.name!,
						watchStatus: WatchStatusTypes.Watching,
					},
				});
			} else if (
				usersShowData.usersShow.status === WatchStatusTypes.PlanToWatch ||
				usersShowData.usersShow.status === WatchStatusTypes.Dropped ||
				usersShowData.usersShow.status === WatchStatusTypes.OnHold
			) {
				updateShow({
					variables: {
						...updateShowVariables,
						watchStatus: WatchStatusTypes.Watching,
					},
				});
			} else {
				updateShow({
					variables: {
						...updateShowVariables,
						watchStatus: usersShowData.usersShow.status,
					},
				});
			}
		} else if (
			prevEp + 1 < currTotalEpCount &&
			usersShowData?.usersShow?.status
		) {
			if (
				usersShowData.usersShow.status === WatchStatusTypes.Dropped ||
				usersShowData.usersShow.status === WatchStatusTypes.OnHold
			) {
				updateShow({
					variables: {
						...updateShowVariables,
						watchStatus: WatchStatusTypes.Watching,
					},
				});
			} else {
				updateShow({
					variables: {
						...updateShowVariables,
						watchStatus: usersShowData.usersShow.status,
					},
				});
			}
		} else if (prevEp + 1 === currTotalEpCount && usersShowData?.usersShow) {
			updateShow({
				variables: {
					...updateShowVariables,
					watchStatus: WatchStatusTypes.Completed,
				},
			});
		}
	};

	useEffect(() => {
		if (usersShowLoading || !showDetailsData?.showDetails) return;

		getCurrTotalSeasonAndEpCount();

		if (usersShowData?.usersShow) {
			setWatchStatus(
				usersShowData.usersShow.status ?? WatchStatusTypes.NotWatching
			);
			setRating(usersShowData.usersShow.rating ?? '');
			setCurrEp(String(usersShowData.usersShow.current_episode ?? 0));

			if (
				usersShowData.usersShow.current_episode === currTotalEpCount &&
				usersShowData.usersShow.status === WatchStatusTypes.Watching
			) {
				setWatchStatus(WatchStatusTypes.Completed);
				updateShow({
					variables: {
						showId: String(showDetailsData.showDetails.id),
						showRating: usersShowData.usersShow.rating ?? null,
						watchStatus: WatchStatusTypes.Completed,
						currentEpisode: currTotalEpCount,
					},
				});
			} else if (
				usersShowData.usersShow.current_episode &&
				usersShowData.usersShow.current_episode < currTotalEpCount &&
				usersShowData.usersShow.status === WatchStatusTypes.Completed
			) {
				setWatchStatus(WatchStatusTypes.Watching);
				updateShow({
					variables: {
						showId: String(showDetailsData.showDetails.id),
						showRating: usersShowData.usersShow.rating ?? null,
						watchStatus: WatchStatusTypes.Watching,
						currentEpisode: usersShowData.usersShow.current_episode,
					},
				});
			}
		} else {
			setWatchStatus(WatchStatusTypes.NotWatching);
			setRating('');
			setCurrEp('0');
		}
	}, [
		currTotalEpCount,
		getCurrTotalSeasonAndEpCount,
		showDetailsData?.showDetails,
		updateShow,
		usersShowData?.usersShow,
		usersShowLoading,
	]);

	if (showDetailsLoading || !showDetailsData?.showDetails || usersShowLoading) {
		return (
			<section className='flex h-screen items-center justify-center'>
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
				<section className='aspect-h-16 aspect-w-16 relative mx-4 mt-4'>
					<Image
						className='rounded-lg'
						src={CommonMethods.getImage(
							showDetailsData.showDetails.poster_path
						)}
						alt={showDetailsData.showDetails.name}
						layout='fill'
					/>
				</section>

				<section className='mt-4'>
					<section className='mb-8 mt-8 flex items-center'>
						<section className='h-[5rem] w-[5rem]'>
							<RoundProgressBar
								percentageVal={
									+showDetailsData.showDetails.vote_average.toFixed(1) * 10
								}
							/>
						</section>
						<p className='ml-[.5rem] text-base font-medium'>
							{commaNumber(showDetailsData.showDetails.vote_count)} voted users
						</p>
					</section>

					{status === 'authenticated' && session && (
						<section className='my-4 flex h-[1.5rem]'>
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
									className='w-12 text-right focus:outline-none'
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
								<span>{currTotalEpCount}</span>
								<button
									className='mx-1 text-blue-500'
									onClick={handleIncrementBtn}
									type='button'
									disabled={+currEp >= currTotalEpCount || isDBPending}
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

				<section className='my-4 ml-8'>
					<h3 className='mb-4 underline underline-offset-4'>Details</h3>
					<h4 className='mt-4'>No. of Seasons</h4>
					<p className='ml-1'>{currTotalSeasonCount}</p>
					<h4 className='mt-4'>No. of Episodes</h4>
					<p className='ml-1'>{currTotalEpCount}</p>
					<h4 className='mt-4'>First Air Date</h4>
					{showDetailsData.showDetails.first_air_date ? (
						<p className='ml-1'>
							{CommonMethods.formatDate(
								showDetailsData.showDetails.first_air_date
							)}
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
								{CommonMethods.formatDate(
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
								{CommonMethods.formatDate(
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
								<a className='ml-1 underline' target='_blank'>
									Learn More
								</a>
							</Link>
						</>
					)}
				</section>

				<section className='col-start-2 mt-4'>
					{!_.isEmpty(showDetailsData.showDetails.seasons) &&
						showDetailsData.showDetails.number_of_episodes <= 500 && (
							<section>
								<h3 className='mb-4 ml-8'>Episodes</h3>
								<EpisodeDetailsHorizontalScroller
									seasons={showDetailsData.showDetails.seasons.filter(
										season => season?.season_number && season.season_number > 0
									)}
									showId={showDetailsData.showDetails.id}
								/>
							</section>
						)}

					{!showsCastCrewLoading &&
						!_.isEmpty(showsCastCrewData?.showsCastCrew?.cast) && (
							<section>
								<h3 className='mb-4 ml-8 mt-4'>Cast</h3>
								<MediaCastHorizontalScroller
									items={
										showsCastCrewData!.showsCastCrew
											?.cast!.map(cast => ({
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
						!_.isEmpty(recShowsData?.recommendedShows.results) && (
							<section className='pb-4'>
								<h3 className='mb-4 ml-8 mt-4'>Recommended Shows</h3>
								<RelatedHorizontalScroller
									items={recShowsData!.recommendedShows.results.map(show => ({
										id: show.id,
										poster_path: show.poster_path,
										name: show.name,
										popularity: show.popularity,
									}))}
									mediaType={EContent.SHOWS}
								/>
							</section>
						)}
				</section>
			</main>
		</>
	);
};

export default ShowDetails;
