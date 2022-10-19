import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RoundProgressBar from '../../components/RoundProgressBar';
import commaNumber from 'comma-number';
import RecommendedShowsHorizontalScroller from '../../components/UI/HorizontalScrollerUI/KnownForHorizontalScroller';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { request } from 'graphql-request';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL, BASE_IMG_URL } from '../../utils/URLs';
import { useSession } from 'next-auth/react';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery, IUseGQLMutation } from '@ts/interfaces';
import { watchStatusOptions } from 'models/watchStatusOptions';
import { ratingOptions } from 'models/ratingOptions';
import { getEnglishName } from 'all-iso-language-codes';
import { formatDate } from '../../utils/formatDate';
import {
	NexusGenObjects,
	NexusGenArgTypes,
	NexusGenEnums,
} from '../../graphql/generated/nexus-typegen';

interface Props {
	showDetails: NexusGenObjects['ShowDetailsRes'];
}

const ShowDetails = ({ showDetails }: Props) => {
	const { data: session, status } = useSession();

	const recShowsContainerRef = useRef<HTMLElement>(null);

	const overviewRef = useRef<HTMLParagraphElement>(null);

	const [watchStatus, setWatchStatus] =
		useState<NexusGenEnums['WatchStatusTypes']>('NOT_WATCHING');

	const [rating, setRating] = useState<string | number>(ratingOptions[0].value);

	const [currEp, setCurrEp] = useState<string>('0');

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
				showId: String(showDetails.id),
			},
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
				recommendedShowsId: showDetails.id,
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
				showId: String(showDetails.id),
				showName: showDetails.name,
				watchStatus,
				currentEpisode: Number(currEp),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_SHOW,
					variables: {
						showId: String(showDetails.id),
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
				showId: String(showDetails.id),
				watchStatus,
				showRating: typeof rating === 'number' ? rating : null,
				currentEpisode: Number(currEp),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_SHOW,
					variables: {
						showId: String(showDetails.id),
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
				showId: String(showDetails.id),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_SHOW,
					variables: {
						showId: String(showDetails.id),
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
						showId: String(showDetails.id),
					},
				});

				return;
			}

			if ((value as NexusGenEnums['WatchStatusTypes']) === 'PLAN_TO_WATCH') {
				setCurrEp('0');
				setRating('');

				updateShow({
					variables: {
						showId: String(showDetails.id),
						watchStatus: 'PLAN_TO_WATCH',
						currentEpisode: 0,
						showRating: null,
					},
				});

				return;
			}

			if ((value as NexusGenEnums['WatchStatusTypes']) === 'COMPLETED') {
				setCurrEp(String(showDetails.number_of_episodes));

				updateShow({
					variables: {
						showId: String(showDetails.id),
						watchStatus: 'COMPLETED',
						currentEpisode: showDetails.number_of_episodes,
					},
				});

				return;
			}

			updateShow({
				variables: {
					showId: String(showDetails.id),
					watchStatus: value as NexusGenEnums['WatchStatusTypes'],
					currentEpisode: usersShowData.current_episode,
				},
			});
		} else {
			if ((value as NexusGenEnums['WatchStatusTypes']) === 'COMPLETED') {
				setCurrEp(String(showDetails.number_of_episodes));

				addShow({
					variables: {
						showId: String(showDetails.id),
						showName: showDetails.name,
						watchStatus: value as NexusGenEnums['WatchStatusTypes'],
						currentEpisode: showDetails.number_of_episodes,
					},
				});

				return;
			}

			addShow({
				variables: {
					showId: String(showDetails.id),
					showName: showDetails.name,
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
				showId: String(showDetails.id),
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
		if (currEp === '' || +currEp > showDetails.number_of_episodes) return;

		if (+currEp === showDetails.number_of_episodes) {
			setWatchStatus('COMPLETED');

			updateShow({
				variables: {
					showId: String(showDetails.id),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: 'COMPLETED',
					currentEpisode: showDetails.number_of_episodes,
				},
			});

			return;
		}

		updateShow({
			variables: {
				showId: String(showDetails.id),
				showRating: typeof rating === 'string' ? null : rating,
				watchStatus,
				currentEpisode: Number(currEp),
			},
		});
	};

	const handleEpisodeOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (
			e.target.value === '' ||
			+e.target.value > showDetails.number_of_episodes
		) {
			setCurrEp(String(usersShowData?.current_episode) ?? '0');
		} else {
			if (
				watchStatus === 'WATCHING' &&
				+e.target.value === showDetails.number_of_episodes
			) {
				setWatchStatus('COMPLETED');

				updateShow({
					variables: {
						showId: String(showDetails.id),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: 'COMPLETED',
						currentEpisode: showDetails.number_of_episodes,
					},
				});

				return;
			}
			updateShow({
				variables: {
					showId: String(showDetails.id),
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
					showId: String(showDetails.id),
					showName: showDetails.name,
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
						showId: String(showDetails.id),
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
					showId: String(showDetails.id),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: usersShowData.status!,
					currentEpisode: prevEp + 1,
				},
			});

			return;
		}

		if (prevEp + 1 < showDetails.number_of_episodes && usersShowData) {
			setTimeout(() => {
				setCurrEp(String(prevEp + 1));

				if (watchStatus === 'DROPPED' || watchStatus === 'ON_HOLD') {
					setWatchStatus('WATCHING');

					updateShow({
						variables: {
							showId: String(showDetails.id),
							showRating: typeof rating === 'string' ? null : rating,
							watchStatus: 'WATCHING',
							currentEpisode: prevEp + 1,
						},
					});

					return;
				}

				updateShow({
					variables: {
						showId: String(showDetails.id),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: usersShowData.status!,
						currentEpisode: prevEp + 1,
					},
				});
			}, 500);

			return;
		}

		if (prevEp + 1 === showDetails.number_of_episodes && usersShowData) {
			setWatchStatus('COMPLETED');
			setCurrEp(String(prevEp + 1));

			updateShow({
				variables: {
					showId: String(showDetails.id),
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
				+currEp === showDetails.number_of_episodes &&
				watchStatus !== 'DROPPED' &&
				watchStatus !== 'ON_HOLD' &&
				watchStatus !== 'WATCHING' &&
				watchStatus !== 'NOT_WATCHING'
			) {
				setWatchStatus('COMPLETED');

				updateShow({
					variables: {
						showId: String(showDetails.id),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: 'COMPLETED',
						currentEpisode: showDetails.number_of_episodes,
					},
				});

				return;
			}

			if (
				usersShowData.current_episode! < showDetails.number_of_episodes &&
				watchStatus === 'COMPLETED'
			) {
				setWatchStatus('WATCHING');

				updateShow({
					variables: {
						showId: String(showDetails.id),
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
		showDetails.number_of_episodes,
		usersShowLoading,
		usersShowData,
		watchStatus,
		updateShow,
		showDetails.id,
	]);

	useEffect(() => {
		if (recShowsContainerRef.current) {
			const scrollerClass =
				'.react-horizontal-scrolling-menu--scroll-container';

			const recMoviesScroller = recShowsContainerRef.current.querySelector(
				scrollerClass
			) as HTMLDivElement;

			recMoviesScroller.style.height = '23rem';
		}
	});

	if (recShowsLoading) {
		return;
	}

	return (
		<main
			className={`mt-[calc(var(--header-height-mobile)+1rem)] grid ${
				recShowsData?.results?.length! > 0
					? 'grid-rows-[1.3fr_2fr]'
					: `${
							overviewRef.current?.clientHeight === undefined ||
							overviewRef.current.clientHeight <= 609
								? 'grid-rows-[calc(100vh-var(--header-height-mobile)-2rem)]'
								: 'grid-rows-[1fr]'
					  }`
			} grid-cols-[30%_70%] px-16`}
		>
			<section className='relative mx-4 mt-4'>
				<Image
					className='rounded-lg'
					src={BASE_IMG_URL + showDetails.poster_path}
					alt={showDetails.name ?? undefined}
					layout='fill'
				/>
			</section>

			<section className='mt-4'>
				<section className='flex items-center mb-8 mt-8'>
					<section className='h-[5rem] w-[5rem]'>
						<RoundProgressBar
							percentageVal={+showDetails.vote_average.toFixed(1) * 10}
						/>
					</section>
					<p className='ml-[.5rem]'>
						{commaNumber(showDetails.vote_count)} voted users
					</p>
				</section>

				{status === 'authenticated' && session.user && (
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
							<span>{showDetails.number_of_episodes}</span>
							<button
								className='mx-1 text-blue-500'
								onClick={handleIncrementBtn}
								type='button'
								disabled={
									+currEp >= showDetails.number_of_episodes || isDBPending
								}
							>
								+
							</button>
						</form>
					</section>
				)}

				<section>
					<h1>{showDetails.name}</h1>
					<h4 className='my-4'>{showDetails.tagline}</h4>
					<p ref={overviewRef}>{showDetails.overview}</p>
				</section>
			</section>

			<section className='ml-8 my-4'>
				<h3 className='mb-4'>Details</h3>
				<h4 className='mt-4'>No. of Seasons</h4>
				<p>{showDetails.number_of_seasons}</p>
				<h4 className='mt-4'>No. of Episodes</h4>
				<p>{showDetails.number_of_episodes}</p>
				<h4 className='mt-4'>First Air Date</h4>
				{showDetails.first_air_date ? (
					<p>{formatDate(showDetails.first_air_date)}</p>
				) : (
					<p>N/A</p>
				)}
				<h4 className='mt-4'>Last Episode to Air</h4>
				{showDetails.last_episode_to_air ? (
					<div>
						<p>
							Season {showDetails.last_episode_to_air.season_number} Episode{' '}
							{showDetails.last_episode_to_air.episode_number}
							<br />
							{formatDate(showDetails.last_episode_to_air.air_date!)}
						</p>
					</div>
				) : (
					<p>N/A</p>
				)}
				<h4 className='mt-4'>Next Episode to Air</h4>
				{showDetails.next_episode_to_air ? (
					<div>
						<p>
							Season {showDetails.next_episode_to_air.season_number} Episode{' '}
							{showDetails.next_episode_to_air.episode_number}
							<br />
							{formatDate(showDetails.next_episode_to_air.air_date!)}
						</p>
					</div>
				) : (
					<p>N/A</p>
				)}
				<h4 className='mt-4'>Status</h4>
				<p>{showDetails.status}</p>
				<h4 className='mt-4'>In Production</h4>
				<p>{showDetails.in_production ? 'Yes' : 'No'}</p>
				<h4 className='mt-4'>Genre(s)</h4>
				<div>
					{showDetails.genres.map((genre, idx) => (
						<p key={idx}>{genre.name}</p>
					))}
				</div>
				<h4 className='mt-4'>Original Language</h4>
				<p>{getEnglishName(showDetails.original_language)}</p>
				{showDetails.homepage.length > 0 && (
					<>
						<h4 className='mt-4'>Official Page</h4>
						<Link href={showDetails.homepage}>
							<a className='underline' target='_blank'>
								Learn More
							</a>
						</Link>
					</>
				)}
			</section>

			{recShowsData?.results?.length! > 0 && (
				<section className='col-start-2 mt-4' ref={recShowsContainerRef}>
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
		</main>
	);
};
export default ShowDetails;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const id = Number((ctx.params?.['id-name'] as string).split('-')[0]);
	const data = await request(SERVER_BASE_URL, Queries.QUERY_SHOW_DETAILS, {
		showDetailsId: id,
	});

	const { showDetails } = data;

	return {
		props: {
			showDetails,
		},
	};
};
