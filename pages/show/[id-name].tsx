import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import RoundProgressBar from '../../components/RoundProgressBar';
import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { useSession } from 'next-auth/react';
import { ICast, ICurrentSeasonEpisode } from '@ts/interfaces';
import { watchStatusOptions, ratingOptions } from 'models/dropDownOptions';
import { getEnglishName } from 'all-iso-language-codes';
import { CommonMethods } from '../../utils/CommonMethods';
import { WatchStatusTypes } from 'graphql/generated/code-gen/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { RESULTS_PER_PAGE } from 'utils/constants';
import { AiFillControl } from 'react-icons/ai';
import { TEpisodeCountDisplay, TSeasonEpisodeAction } from '@ts/types';
import _ from 'lodash';
import { SpinningCircles } from 'react-loading-icons';
import RelatedHorizontalScroller from '../../components/HorizontalScroller/Related/RelatedHorizontalScroller';
import MediaCastHorizontalScroller from 'components/HorizontalScroller/MediaCast/MediaCastHorizontalScroller';
import EpisodeDetailsHorizontalScroller from '../../components/HorizontalScroller/EpisodeDetails/EpisodeDetailsHorizontalScroller';

const ShowDetails = () => {
	const { data: session, status } = useSession();

	const router = useRouter();

	const [watchStatus, setWatchStatus] = useState<WatchStatusTypes>(WatchStatusTypes.NotWatching);

	const [rating, setRating] = useState<number | string>(ratingOptions[0].value);

	const [currEp, setCurrEp] = useState<string>('0');

	const [currSeasonEp, setCurrSeasonEp] = useState<ICurrentSeasonEpisode>({
		seasonNo: '0',
		episode: '0',
	});

	const [currTotalEpCount, setCurrTotalEpCount] = useState<number>(0);

	const [currTotalSeasonCount, setCurrTotalSeasonCount] = useState<number>(0);

	const [totalEpCountGathered, setTotalEpCountGathered] = useState<boolean>(false);

	const id = (router.query?.['id-name'] as string)?.split('-')[0] ?? '';

	const [episodeCountDisplay, setEpisodeCountDisplay] = useState<TEpisodeCountDisplay>();

	const { data: showDetailsData, loading: showDetailsLoading } = useQuery(Queries.SHOW_DETAILS, {
		skip: !id,
		variables: {
			showDetailsId: id,
		},
		fetchPolicy: 'network-only',
	});

	const { data: usersShowData, loading: usersShowLoading } = useQuery(Queries.USERS_SHOW, {
		skip: !showDetailsData?.showDetails.id,
		variables: {
			showId: showDetailsData?.showDetails.id!,
		},
		fetchPolicy: 'network-only',
	});

	const { data: recShowsData, loading: recShowsLoading } = useQuery(Queries.RECOMMENDED_SHOWS, {
		skip: !showDetailsData?.showDetails.id,
		variables: {
			recommendedShowsId: showDetailsData?.showDetails.id!,
		},
	});

	const { data: showsCastCrewData, loading: showsCastCrewLoading } = useQuery(
		Queries.GET_SHOWS_CAST_CREW,
		{
			skip: !showDetailsData?.showDetails.id,
			variables: {
				showId: showDetailsData?.showDetails.id!,
			},
		}
	);

	const [addShow, { loading: addShowLoading }] = useMutation(Mutations.ADD_SHOW, {
		variables: {
			showId: showDetailsData?.showDetails.id!,
			showName: showDetailsData?.showDetails.name!,
			watchStatus,
			currentEpisode: +currEp,
		},
		refetchQueries: () => [
			{
				query: Queries.USERS_SHOW,
				variables: {
					showId: showDetailsData?.showDetails.id!,
				},
			},
			'UsersShow',
		],
	});

	const [updateShow, { loading: updateShowLoading }] = useMutation(Mutations.UPDATE_SHOW, {
		variables: {
			showId: showDetailsData?.showDetails.id!,
			watchStatus,
			showRating: typeof rating === 'number' ? rating : null,
			currentEpisode: +currEp,
		},
		refetchQueries: () => [
			{
				query: Queries.USERS_SHOW,
				variables: {
					showId: showDetailsData?.showDetails.id!,
				},
			},
			'UsersShow',
		],
	});

	const [deleteShow, { loading: deleteShowLoading }] = useMutation(Mutations.DELETE_SHOW, {
		variables: {
			showId: showDetailsData?.showDetails.id!,
		},
		refetchQueries: () => [
			{
				query: Queries.USERS_SHOW,
				variables: {
					showId: showDetailsData?.showDetails.id!,
				},
			},
			'UsersShow',
		],
	});

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
				(!season.air_date || currDate.getTime() < new Date(season.air_date).getTime())
			) {
				totalEpCount -= season.episode_count;
				totalSeasonCount--;
			}
		}
		setCurrTotalEpCount(totalEpCount);
		setCurrTotalSeasonCount(totalSeasonCount);
		setTotalEpCountGathered(true);
	}, [
		showDetailsData?.showDetails.number_of_episodes,
		showDetailsData?.showDetails.number_of_seasons,
		showDetailsData?.showDetails.seasons,
	]);

	const handleChangeWatchStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (!showDetailsData?.showDetails.id || !showDetailsData?.showDetails.name) {
			return;
		}

		const { value } = e.target;
		const showId = showDetailsData.showDetails.id;
		const usersShow = usersShowData?.usersShow;

		const showVariables = {
			showId,
			watchStatus: value as WatchStatusTypes,
			currentEpisode: 0,
			showRating: null,
		};

		if (usersShow) {
			if (value === WatchStatusTypes.NotWatching) {
				deleteShow({ variables: { showId: showVariables.showId } });
			} else if (
				value === WatchStatusTypes.Watching &&
				usersShow.status === WatchStatusTypes.Completed
			) {
				updateShow({
					variables: {
						...showVariables,
						currentEpisode: currTotalEpCount - 1,
					},
				});
			} else if (value === WatchStatusTypes.PlanToWatch) {
				updateShow({
					variables: {
						...showVariables,
						watchStatus: WatchStatusTypes.PlanToWatch,
					},
				});
			} else if (value === WatchStatusTypes.Completed) {
				updateShow({
					variables: {
						...showVariables,
						watchStatus: WatchStatusTypes.Completed,
						currentEpisode: currTotalEpCount,
						showRating: usersShow.rating ?? null,
					},
				});
			} else {
				updateShow({
					variables: {
						...showVariables,
						currentEpisode: usersShow.current_episode ?? 0,
						showRating: usersShow.rating ?? null,
					},
				});
			}
		} else {
			const addShowVariables = {
				...showVariables,
				showName: showDetailsData.showDetails.name,
				currentEpisode: value === WatchStatusTypes.Completed ? currTotalEpCount : +currEp,
			};
			addShow({ variables: addShowVariables });
		}
	};

	const handleChangeRating = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;

		setRating(value === '' ? '' : +value);

		if (!showDetailsData?.showDetails.id) return;

		updateShow({
			variables: {
				showId: String(showDetailsData.showDetails.id),
				showRating: +value,
				watchStatus,
				currentEpisode: +currEp,
			},
		});
	};

	const handleEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		if (/[\D]/g.test(value)) {
			setCurrEp(String(usersShowData?.usersShow?.current_episode ?? '0'));
			return;
		}
		if (
			+value > currTotalEpCount ||
			value.startsWith('00') ||
			(value.startsWith('0') && /[1-9]/.test(value.slice(1)))
		) {
			return;
		}
		setCurrEp(value);
	};

	const handleSeasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!showDetailsData?.showDetails.id) return;

		const { value } = e.target;

		if (+value > currTotalSeasonCount || value.startsWith('0')) {
			return;
		}

		setCurrSeasonEp(currSeasonEp => ({
			...currSeasonEp,
			episode: '1',
			seasonNo: value,
		}));

		const totalEpCount = getTotalEpCountForChangedSeason(+value);

		if (totalEpCount === undefined) return;

		setCurrEp(totalEpCount);
	};

	const handleSeasonEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		if (/[\D]/g.test(value)) {
			setCurrSeasonEp(currSeasonEp => ({
				...currSeasonEp,
				episode: '0',
			}));
			return;
		}
		if (
			+value > +calculateSeasonEpisodeNumber().seasonEpCount ||
			value.startsWith('00') ||
			(value.startsWith('0') && /[1-9]/.test(value.slice(1)))
		) {
			return;
		}
		setCurrSeasonEp(currSeasonEp => ({
			...currSeasonEp,
			episode: value,
		}));
	};

	const handleSeasonOnBlur = () => {
		if (!showDetailsData?.showDetails.id) return;

		if (!usersShowData?.usersShow) {
			addShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					showName: showDetailsData.showDetails.name,
					watchStatus: WatchStatusTypes.Watching,
					currentEpisode: +currEp,
				},
			});
		} else {
			updateShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: watchStatus,
					currentEpisode: +currEp,
				},
			});
		}
	};

	const handleSeasonEpisodeOnBlur = () => {
		if (!showDetailsData?.showDetails.id) return;

		const seasonNo = Number(currSeasonEp.seasonNo);
		const totalEpCountForChangedSeason = Number(getTotalEpCountForChangedSeason(seasonNo));
		const seasonEpCount = Number(calculateSeasonEpisodeNumber().seasonEpCount);
		const currentEpCount = Number(currSeasonEp.episode);

		const totalEpisode =
			totalEpCountForChangedSeason - 1 + seasonEpCount - (seasonEpCount - currentEpCount);

		if (!usersShowData?.usersShow) {
			addShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					showName: showDetailsData.showDetails.name,
					watchStatus: WatchStatusTypes.Watching,
					currentEpisode: totalEpisode,
				},
			});
		} else {
			updateShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: watchStatus,
					currentEpisode: totalEpisode,
				},
			});
		}
	};

	const getTotalEpCountForChangedSeason = (seasonNum: number) => {
		if (!showDetailsData?.showDetails) return;

		let totalEpisodesCount = 0;
		const seasons = showDetailsData.showDetails.seasons.filter(
			season => season.season_number && season.season_number > 0
		);

		for (const season of seasons) {
			totalEpisodesCount += season.episode_count;
			if (seasonNum === season.season_number) {
				totalEpisodesCount = totalEpisodesCount - season.episode_count + 1;
				return String(totalEpisodesCount);
			}
		}
	};

	const handleEpisodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (currEp === '' || +currEp > currTotalEpCount || !showDetailsData?.showDetails?.id) return;

		if (+currEp === currTotalEpCount) {
			setWatchStatus(WatchStatusTypes.Completed);

			updateShow({
				variables: {
					showId: String(showDetailsData.showDetails.id),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: WatchStatusTypes.Completed,
					currentEpisode: currTotalEpCount,
				},
			});
			return;
		}

		updateShow({
			variables: {
				showId: String(showDetailsData.showDetails.id),
				showRating: typeof rating === 'string' ? null : rating,
				watchStatus,
				currentEpisode: +currEp,
			},
		});
	};

	const handleSeasonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			currSeasonEp.seasonNo === '' ||
			+currSeasonEp.seasonNo > currTotalSeasonCount ||
			!showDetailsData?.showDetails?.id
		)
			return;

		const totalEpCount = getTotalEpCountForChangedSeason(+currSeasonEp.seasonNo);

		if (totalEpCount === undefined) return;

		if (!usersShowData?.usersShow) {
			addShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					showName: showDetailsData.showDetails.name,
					watchStatus: WatchStatusTypes.Watching,
					currentEpisode: +totalEpCount,
				},
			});
		} else {
			updateShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: WatchStatusTypes.Watching,
					currentEpisode: +totalEpCount,
				},
			});
		}
	};

	const handleSeasonEpisodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (
			currSeasonEp.episode === '' ||
			+currSeasonEp.episode > +calculateSeasonEpisodeNumber().seasonEpCount ||
			!showDetailsData?.showDetails?.id
		)
			return;

		const seasonNo = Number(currSeasonEp.seasonNo);
		const totalEpCountForChangedSeason = Number(getTotalEpCountForChangedSeason(seasonNo));
		const seasonEpCount = Number(calculateSeasonEpisodeNumber().seasonEpCount);
		const currentEpCount = Number(currSeasonEp.episode);

		const totalEpCount =
			totalEpCountForChangedSeason - 1 + seasonEpCount - (seasonEpCount - currentEpCount);

		if (!usersShowData?.usersShow) {
			addShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					showName: showDetailsData.showDetails.name,
					watchStatus: WatchStatusTypes.Watching,
					currentEpisode: totalEpCount,
				},
			});
		} else {
			updateShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: WatchStatusTypes.Watching,
					currentEpisode: totalEpCount,
				},
			});
		}
	};

	const handleEpisodeOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (!showDetailsData?.showDetails?.id) return;

		if (usersShowData?.usersShow?.id) {
			if (usersShowData.usersShow.current_episode === e.target.valueAsNumber) {
				return;
			}
			if (e.target.value === '' || +e.target.value > currTotalEpCount) {
				setCurrEp(String(usersShowData?.usersShow.current_episode) ?? '0');
			} else {
				if (watchStatus === WatchStatusTypes.Watching && +e.target.value === currTotalEpCount) {
					setWatchStatus(WatchStatusTypes.Completed);

					updateShow({
						variables: {
							showId: showDetailsData.showDetails.id,
							showRating: typeof rating === 'string' ? null : rating,
							watchStatus: WatchStatusTypes.Completed,
							currentEpisode: currTotalEpCount,
						},
					});
					return;
				}
				updateShow({
					variables: {
						showId: showDetailsData.showDetails.id,
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus,
						currentEpisode: +currEp,
					},
				});
			}
		} else {
			if (e.target.value !== '' && e.target.value !== '0' && +e.target.value <= currTotalEpCount) {
				addShow({
					variables: {
						showId: showDetailsData.showDetails.id,
						showName: showDetailsData.showDetails.name,
						watchStatus:
							e.target.valueAsNumber === currTotalEpCount
								? WatchStatusTypes.Completed
								: WatchStatusTypes.Watching,
						currentEpisode: +currEp,
					},
				});
			}
		}
	};

	const handleTotalEpisodeBtn = (action: TSeasonEpisodeAction) => {
		if (!showDetailsData?.showDetails.id || !showDetailsData?.showDetails.name) {
			return;
		}

		const prevEp = +currEp;
		const epPostAction = action === 'increment' ? prevEp + 1 : prevEp - 1;

		const updateShowVariables = {
			showId: showDetailsData.showDetails.id,
			showRating: typeof rating === 'string' ? null : rating,
			currentEpisode: epPostAction,
		};

		if (epPostAction === 1) {
			if (!usersShowData?.usersShow?.status) {
				addShow({
					variables: {
						...updateShowVariables,
						showName: showDetailsData.showDetails.name,
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
		} else if (epPostAction < currTotalEpCount && usersShowData?.usersShow?.status) {
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
		} else if (epPostAction === currTotalEpCount && usersShowData?.usersShow) {
			updateShow({
				variables: {
					...updateShowVariables,
					watchStatus: WatchStatusTypes.Completed,
				},
			});
		}
	};

	const handleSeasonBtn = (action: TSeasonEpisodeAction) => {
		if (!showDetailsData?.showDetails.id || !showDetailsData?.showDetails.name) {
			return;
		}

		const prevSeason = +currSeasonEp.seasonNo;

		if (
			(action === 'increment' && prevSeason === +currTotalSeasonCount) ||
			(action === 'decrement' && prevSeason === 1)
		) {
			return;
		}

		const seasonPostAction = action === 'increment' ? prevSeason + 1 : prevSeason - 1;

		if (!usersShowData?.usersShow) {
			addShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					showName: showDetailsData.showDetails.name,
					watchStatus: WatchStatusTypes.Watching,
					currentEpisode: Number(getTotalEpCountForChangedSeason(seasonPostAction)),
				},
			});
		} else {
			updateShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					watchStatus: WatchStatusTypes.Watching,
					currentEpisode: Number(getTotalEpCountForChangedSeason(seasonPostAction)),
				},
			});
		}
	};

	const handleSeasonEpisodeBtn = (action: TSeasonEpisodeAction) => {
		if (!showDetailsData?.showDetails.id || !showDetailsData?.showDetails.name) {
			return;
		}

		const prevEp = +currSeasonEp.episode;
		const epPostAction = action === 'increment' ? prevEp + 1 : prevEp - 1;

		if (
			(action === 'increment' && prevEp === +calculateSeasonEpisodeNumber().seasonEpCount) ||
			(action === 'decrement' && prevEp === 0)
		) {
			return;
		}

		const seasonNo = Number(currSeasonEp.seasonNo);
		const totalEpCountForChangedSeason = Number(getTotalEpCountForChangedSeason(seasonNo));
		const seasonEpCount = Number(calculateSeasonEpisodeNumber().seasonEpCount);
		const currentEpCount = epPostAction;

		const totalEpisode =
			totalEpCountForChangedSeason - 1 + seasonEpCount - (seasonEpCount - currentEpCount);

		if (!usersShowData?.usersShow) {
			addShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					showName: showDetailsData.showDetails.name,
					watchStatus:
						totalEpisode === currTotalEpCount
							? WatchStatusTypes.Completed
							: WatchStatusTypes.Watching,
					currentEpisode: totalEpisode,
				},
			});
		} else {
			updateShow({
				variables: {
					showId: showDetailsData.showDetails.id,
					watchStatus:
						totalEpisode === currTotalEpCount
							? WatchStatusTypes.Completed
							: WatchStatusTypes.Watching,
					currentEpisode: totalEpisode,
				},
			});
		}
	};

	const toggleEpisodeCountDisplay = () => {
		if (episodeCountDisplay === 'total-episodes') {
			localStorage.setItem('episode-count-display', 'season-episode');
			setEpisodeCountDisplay('season-episode');
			return;
		}

		if (episodeCountDisplay === 'season-episode') {
			localStorage.setItem('episode-count-display', 'total-episodes');
			setEpisodeCountDisplay('total-episodes');
			return;
		}
	};

	useEffect(() => {
		if (usersShowLoading || !showDetailsData?.showDetails) return;

		getCurrTotalSeasonAndEpCount();

		if (usersShowData?.usersShow && typeof usersShowData.usersShow.current_episode === 'number') {
			setWatchStatus(usersShowData.usersShow.status ?? WatchStatusTypes.NotWatching);
			setRating(usersShowData.usersShow.rating ?? '');
			setCurrEp(String(usersShowData.usersShow.current_episode ?? ''));

			if (
				usersShowData.usersShow.current_episode === currTotalEpCount &&
				usersShowData.usersShow.status === WatchStatusTypes.Watching &&
				totalEpCountGathered
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
				usersShowData.usersShow.current_episode >= 0 &&
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
		totalEpCountGathered,
		updateShow,
		usersShowData?.usersShow,
		usersShowLoading,
	]);

	const calculateSeasonEpisodeNumber = useCallback(() => {
		if (showDetailsData && showDetailsData.showDetails) {
			let totalEpisodesCount = 0;
			const seasons = showDetailsData.showDetails.seasons.filter(
				season => season.season_number && season.season_number > 0
			);

			for (const season of seasons) {
				totalEpisodesCount += season.episode_count;
				if (totalEpisodesCount >= +currEp) {
					const episodeInSeason = season.episode_count - (totalEpisodesCount - Number(currEp));
					return {
						seasonNo: String(season.season_number),
						seasonEpCount: String(season.episode_count),
						episode: String(episodeInSeason),
					};
				}
			}
		}
		return {
			seasonNo: '0',
			seasonEpCount: '0',
			episode: '0',
		};
	}, [currEp, showDetailsData]);

	useEffect(() => {
		const checkEpisodeCountDisplay = () => {
			const epCountDisplay = localStorage.getItem('episode-count-display');
			if (!epCountDisplay) {
				localStorage.setItem('episode-count-display', 'total-episodes');
				setEpisodeCountDisplay('total-episodes');
			} else {
				setEpisodeCountDisplay(epCountDisplay as any);
			}
		};
		checkEpisodeCountDisplay();
	}, []);

	useEffect(() => {
		const { seasonNo, episode } = calculateSeasonEpisodeNumber();
		setCurrSeasonEp({
			seasonNo,
			episode,
		});
	}, [calculateSeasonEpisodeNumber]);

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
						src={CommonMethods.getTheMovieDbImage(showDetailsData.showDetails.poster_path)}
						alt={showDetailsData.showDetails.name}
						layout='fill'
					/>
				</section>

				<section className='mt-4'>
					<section className='relative mb-8 mt-8 flex items-center'>
						<div className='flex items-center'>
							<section className='h-[5rem] w-[5rem]'>
								<RoundProgressBar
									percentageVal={+(showDetailsData.showDetails.vote_average ?? 0).toFixed(1) * 10}
								/>
							</section>
							<p className='ml-[.5rem] text-base font-medium'>
								{commaNumber(showDetailsData.showDetails.vote_count ?? 0)} voted users
							</p>

							<AiFillControl
								size={35}
								onClick={toggleEpisodeCountDisplay}
								className='ml-8 cursor-pointer'
							/>
						</div>

						{isDBPending && (
							<div className='absolute left-1/2 top-12 -translate-x-1/2 transform'>
								<SpinningCircles height={50} stroke='#00b3ff' />
							</div>
						)}
					</section>

					{status === 'authenticated' && session && (
						<section className='my-4 flex items-center space-x-4'>
							<div className='relative'>
								<select
									className='appearance-none rounded border border-gray-300 bg-transparent px-2 py-2 pr-8 leading-tight text-gray-700 focus:bg-transparent focus:outline-none'
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
								<IoMdArrowDropdown className='pointer-events-none absolute inset-y-0 right-0 mr-3 mt-3 text-black' />
							</div>

							<div className='relative'>
								<select
									className='appearance-none rounded border border-gray-300 bg-transparent px-2 py-2 pr-8 leading-tight text-gray-700 focus:bg-transparent focus:outline-none'
									value={rating}
									onChange={handleChangeRating}
									disabled={
										watchStatus === 'NOT_WATCHING' || watchStatus === 'PLAN_TO_WATCH' || isDBPending
									}
								>
									{ratingOptions.map(option => (
										<option key={option.value} value={option.value}>
											{option.text}
										</option>
									))}
								</select>
								<IoMdArrowDropdown className='pointer-events-none absolute inset-y-0 right-0 mr-3 mt-3 text-black' />
							</div>

							{episodeCountDisplay === 'total-episodes' && (
								<form
									className='flex items-center rounded border border-gray-300'
									onSubmit={handleEpisodeSubmit}
								>
									<span className='px-3 text-gray-700'>Episodes:</span>
									<button
										className='cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none'
										onClick={() => handleTotalEpisodeBtn('decrement')}
										type='button'
										disabled={+currEp <= 0 || isDBPending}
									>
										<FaMinus className={`${+currEp <= 0 ? 'text-gray-500' : 'text-blue-500'}`} />
									</button>
									<input
										className='w-12 bg-transparent px-2 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-transparent focus:outline-none'
										type='text'
										value={currEp}
										onChange={handleEpisodeChange}
										onBlur={handleEpisodeOnBlur}
										disabled={watchStatus === 'PLAN_TO_WATCH' || isDBPending}
									/>
									<span className='px-1 text-gray-700'>/</span>{' '}
									<span className='px-1 text-gray-700'>{currTotalEpCount}</span>
									<button
										className='cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none'
										onClick={() => handleTotalEpisodeBtn('increment')}
										type='button'
										disabled={+currEp >= currTotalEpCount || isDBPending}
									>
										<FaPlus
											className={`${+currEp >= currTotalEpCount ? 'text-gray-500' : 'text-blue-500'}`}
										/>
									</button>
								</form>
							)}

							{episodeCountDisplay === 'season-episode' && (
								<>
									<form
										className='flex items-center rounded border border-gray-300'
										onSubmit={handleSeasonSubmit}
									>
										<div>
											<span className='px-3 text-gray-700'>Season:</span>
											<button
												className='cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none'
												onClick={() => handleSeasonBtn('decrement')}
												type='button'
												disabled={+currSeasonEp.seasonNo <= 1 || isDBPending}
											>
												<FaMinus
													className={`${+currSeasonEp.seasonNo <= 1 ? 'text-gray-500' : 'text-blue-500'}`}
												/>
											</button>
											<input
												className='w-12 bg-transparent px-2 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-transparent focus:outline-none'
												type='text'
												value={currSeasonEp.seasonNo}
												onChange={handleSeasonChange}
												onBlur={handleSeasonOnBlur}
												disabled={watchStatus === 'PLAN_TO_WATCH' || isDBPending}
											/>
											<span className='px-1 text-gray-700'>/</span>{' '}
											<span className='px-1 text-gray-700'>{currTotalSeasonCount}</span>
										</div>

										<button
											className='cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none'
											onClick={() => handleSeasonBtn('increment')}
											type='button'
											disabled={+currEp >= currTotalEpCount || isDBPending}
										>
											<FaPlus
												className={`${+currSeasonEp.seasonNo >= currTotalSeasonCount ? 'text-gray-500' : 'text-blue-500'}`}
											/>
										</button>
									</form>

									<form
										className='flex items-center rounded border border-gray-300'
										onSubmit={handleSeasonEpisodeSubmit}
									>
										<div>
											<span className='px-3 text-gray-700'>Episode:</span>
											<button
												className='cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none'
												onClick={() => handleSeasonEpisodeBtn('decrement')}
												type='button'
												disabled={+currSeasonEp.episode <= 0 || isDBPending}
											>
												<FaMinus
													className={`${+currSeasonEp.episode <= 0 ? 'text-gray-500' : 'text-blue-500'}`}
												/>
											</button>
											<input
												className='w-12 bg-transparent px-2 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-transparent focus:outline-none'
												type='text'
												value={currSeasonEp.episode}
												onChange={handleSeasonEpisodeChange}
												onBlur={handleSeasonEpisodeOnBlur}
												disabled={watchStatus === 'PLAN_TO_WATCH' || isDBPending}
											/>
											<span className='px-1 text-gray-700'>/</span>{' '}
											<span className='px-1 text-gray-700'>
												{calculateSeasonEpisodeNumber().seasonEpCount}
											</span>
										</div>

										<button
											className='cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none'
											onClick={() => handleSeasonEpisodeBtn('increment')}
											type='button'
											disabled={+currEp >= currTotalEpCount || isDBPending}
										>
											<FaPlus
												className={`${+currSeasonEp.episode >= +calculateSeasonEpisodeNumber().seasonEpCount ? 'text-gray-500' : 'text-blue-500'}`}
											/>
										</button>
									</form>
								</>
							)}
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
							{CommonMethods.formatDate(showDetailsData.showDetails.first_air_date)}
						</p>
					) : (
						<p className='ml-1'>N/A</p>
					)}
					<h4 className='mt-4'>Last Episode to Air</h4>
					{showDetailsData.showDetails.last_episode_to_air ? (
						<div className='ml-1'>
							<p>
								Season {showDetailsData.showDetails.last_episode_to_air.season_number} Episode{' '}
								{showDetailsData.showDetails.last_episode_to_air.episode_number}
								<br />
								{CommonMethods.formatDate(showDetailsData.showDetails.last_episode_to_air.air_date)}
							</p>
						</div>
					) : (
						<p className='ml-1'>N/A</p>
					)}
					<h4 className='mt-4'>Next Episode to Air</h4>
					{showDetailsData.showDetails.next_episode_to_air ? (
						<div className='ml-1'>
							<p>
								Season {showDetailsData.showDetails?.next_episode_to_air.season_number} Episode{' '}
								{showDetailsData.showDetails?.next_episode_to_air.episode_number}
								<br />
								{CommonMethods.formatDate(showDetailsData.showDetails.next_episode_to_air.air_date)}
							</p>
						</div>
					) : (
						<p className='ml-1'>N/A</p>
					)}
					<h4 className='mt-4'>Status</h4>
					<p className='ml-1'>{showDetailsData.showDetails?.status}</p>
					<h4 className='mt-4'>In Production</h4>
					<p className='ml-1'>{showDetailsData.showDetails.in_production ? 'Yes' : 'No'}</p>
					<h4 className='mt-4'>Genre(s)</h4>
					<div className='ml-1'>
						{showDetailsData.showDetails.genres.map((genre, idx) => (
							<p key={idx}>{genre.name}</p>
						))}
					</div>
					<h4 className='mt-4'>Original Language</h4>
					<p className='ml-1'>{getEnglishName(showDetailsData.showDetails.original_language)}</p>
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
										season => season.season_number && season.season_number > 0
									)}
									showId={showDetailsData.showDetails.id}
								/>
							</section>
						)}

					{!showsCastCrewLoading &&
						showsCastCrewData?.showsCastCrew &&
						!_.isEmpty(showsCastCrewData.showsCastCrew.cast) && (
							<section>
								<h3 className='mb-4 ml-8 mt-4'>Cast</h3>
								<MediaCastHorizontalScroller
									items={
										showsCastCrewData.showsCastCrew
											?.cast!.map(cast => ({
												id: cast.id,
												name: cast.name,
												character: cast.character,
												profile_path: cast.profile_path,
												type: cast.__typename,
											}))
											.slice(0, RESULTS_PER_PAGE) as ICast[]
									}
								/>
							</section>
						)}
					{!recShowsLoading &&
						recShowsData?.recommendedShows &&
						!_.isEmpty(recShowsData.recommendedShows.results) && (
							<section className='pb-4'>
								<h3 className='mb-4 ml-8 mt-4'>Recommended Shows</h3>
								<RelatedHorizontalScroller
									items={recShowsData.recommendedShows.results.map(show => ({
										id: show.id,
										imagePath: show.poster_path,
										name: show.name,
										popularity: show.popularity ?? 0,
										type: 'show',
									}))}
									mediaType={'shows'}
								/>
							</section>
						)}
				</section>
			</main>
		</>
	);
};

export default ShowDetails;
