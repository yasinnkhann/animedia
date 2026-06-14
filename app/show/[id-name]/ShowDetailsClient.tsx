'use client';

import { useState, useCallback, useEffect, useMemo, useTransition } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import RoundProgressBar from '@/components/RoundProgressBar';
import { Circles, SpinningCircles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import { useSession } from 'next-auth/react';
import { ICast, ICurrentSeasonEpisode } from '@ts/interfaces';
import { watchStatusOptions, ratingOptions } from '@/models/dropDownOptions';
import { getEnglishName } from 'all-iso-language-codes';
import { CommonMethods } from '@/utils/CommonMethods';
import type { WatchStatus } from '@prisma/client';
import _ from 'lodash';
import { RESULTS_PER_PAGE } from '@/utils/constants';
import { IoMdArrowDropdown } from 'react-icons/io';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { AiFillControl } from 'react-icons/ai';
import { TEpisodeCountDisplay, TSeasonEpisodeAction } from '@ts/types';
import RelatedHorizontalScroller from '@/components/HorizontalScroller/Related/RelatedHorizontalScroller';
import MediaCastHorizontalScroller from '@/components/HorizontalScroller/MediaCast/MediaCastHorizontalScroller';
import EpisodeDetailsHorizontalScroller from '@/components/HorizontalScroller/EpisodeDetails/EpisodeDetailsHorizontalScroller';
import { useUserMedia } from '@/components/UserMediaProvider';
import {
  addShow as addShowAction,
  updateShow as updateShowAction,
  deleteShow as deleteShowAction,
} from '@/app/actions/media';

interface Props {
  showDetailsData: any;
  castNode: React.ReactNode;
  relatedNode: React.ReactNode;
}

const ShowDetailsClient = ({ showDetailsData, castNode, relatedNode }: Props) => {
  const { data: session, status } = useSession();

  const [watchStatusInput, setWatchStatus] = useState<WatchStatus | 'NOT_WATCHING' | null>(null);

  const [ratingInput, setRating] = useState<number | string | null>(null);

  const [currEpInput, setCurrEp] = useState<string | null>(null);

  const [currSeasonEpInput, setCurrSeasonEp] = useState<ICurrentSeasonEpisode | null>(null);

  const [isPending, startTransition] = useTransition();

  const [episodeCountDisplay, setEpisodeCountDisplay] = useState<TEpisodeCountDisplay>();

  const showDetails = showDetailsData?.showDetails;
  const showId = showDetails?.id ?? '';
  const showName = showDetails?.name ?? '';

  const { userShows } = useUserMedia();
  const usersShow = userShows?.find(show => show.id === showId);

  const watchStatus = watchStatusInput ?? usersShow?.status ?? 'NOT_WATCHING';
  const rating = ratingInput ?? usersShow?.rating ?? '';
  const currEp = currEpInput ?? String(usersShow?.current_episode ?? '0');

  const addShow = useCallback(({ variables }: { variables: any }) => {
    startTransition(async () => {
      await addShowAction(
        variables.showId,
        variables.showName,
        variables.watchStatus,
        variables.currentEpisode
      );
    });
  }, []);

  const updateShow = useCallback(({ variables }: { variables: any }) => {
    startTransition(async () => {
      await updateShowAction(
        variables.showId,
        variables.watchStatus,
        variables.showRating ?? undefined,
        variables.currentEpisode ?? undefined
      );
    });
  }, []);

  const deleteShow = useCallback(({ variables }: { variables: any }) => {
    startTransition(async () => {
      await deleteShowAction(variables.showId);
    });
  }, []);

  const isDBPending = isPending;
  const isInitialUsersShowLoading = false;

  const { currTotalEpCount, currTotalSeasonCount, totalEpCountGathered } = useMemo(() => {
    if (
      !showDetailsData?.showDetails.number_of_episodes ||
      !showDetailsData?.showDetails.number_of_seasons
    ) {
      return {
        currTotalEpCount: 0,
        currTotalSeasonCount: 0,
        totalEpCountGathered: false,
      };
    }

    let totalEpCount = showDetailsData.showDetails.number_of_episodes;
    let totalSeasonCount = showDetailsData.showDetails.number_of_seasons;

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

    return {
      currTotalEpCount: totalEpCount,
      currTotalSeasonCount: totalSeasonCount,
      totalEpCountGathered: true,
    };
  }, [showDetailsData?.showDetails]);

  const calculateSeasonEpisodeNumber = useCallback(
    (episodeValue = currEp) => {
      if (showDetailsData && showDetailsData.showDetails) {
        let totalEpisodesCount = 0;
        const seasons = showDetailsData.showDetails.seasons.filter(
          (season: any) => season.season_number && season.season_number > 0
        );

        for (const season of seasons) {
          totalEpisodesCount += season.episode_count;
          if (totalEpisodesCount >= +episodeValue) {
            const episodeInSeason =
              season.episode_count - (totalEpisodesCount - Number(episodeValue));
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
    },
    [currEp, showDetailsData]
  );

  const setCurrEpWithSeasonEpisode = useCallback(
    (episodeValue: string) => {
      const { seasonNo, episode } = calculateSeasonEpisodeNumber(episodeValue);
      setCurrEp(episodeValue);
      setCurrSeasonEp({
        seasonNo,
        episode,
      });
    },
    [calculateSeasonEpisodeNumber]
  );

  const currSeasonEp = currSeasonEpInput ?? calculateSeasonEpisodeNumber(currEp);

  const handleChangeWatchStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!showDetailsData?.showDetails.id || !showDetailsData?.showDetails.name) {
      return;
    }

    const { value } = e.target;
    const showId = showDetailsData.showDetails.id;

    const showVariables = {
      showId,
      watchStatus: value as WatchStatus,
      currentEpisode: 0,
      showRating: null,
    };

    if (usersShow) {
      if (value === 'NOT_WATCHING') {
        deleteShow({ variables: { showId: showVariables.showId } });
      } else if (value === 'WATCHING' && usersShow.status === 'COMPLETED') {
        updateShow({
          variables: {
            ...showVariables,
            currentEpisode: currTotalEpCount - 1,
          },
        });
      } else if (value === 'PLAN_TO_WATCH') {
        updateShow({
          variables: {
            ...showVariables,
            watchStatus: 'PLAN_TO_WATCH',
          },
        });
      } else if (value === 'COMPLETED') {
        updateShow({
          variables: {
            ...showVariables,
            watchStatus: 'COMPLETED',
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
        currentEpisode: value === 'COMPLETED' ? currTotalEpCount : +currEp,
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
      setCurrEpWithSeasonEpisode(String(usersShow?.current_episode ?? '0'));
      return;
    }
    if (
      +value > currTotalEpCount ||
      value.startsWith('00') ||
      (value.startsWith('0') && /[1-9]/.test(value.slice(1)))
    ) {
      return;
    }
    setCurrEpWithSeasonEpisode(value);
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!showDetailsData?.showDetails.id) return;

    const { value } = e.target;

    if (+value > currTotalSeasonCount || value.startsWith('0')) {
      return;
    }

    const totalEpCount = getTotalEpCountForChangedSeason(+value);

    if (totalEpCount === undefined) return;

    setCurrEpWithSeasonEpisode(totalEpCount);
  };

  const handleSeasonEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (/[\D]/g.test(value)) {
      setCurrSeasonEp(currSeasonEp => ({
        ...(currSeasonEp ?? calculateSeasonEpisodeNumber()),
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
      ...(currSeasonEp ?? calculateSeasonEpisodeNumber()),
      episode: value,
    }));
  };

  const handleSeasonOnBlur = () => {
    if (!showDetailsData?.showDetails.id) return;

    if (!usersShow) {
      addShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          showName: showDetailsData.showDetails.name,
          watchStatus: 'WATCHING',
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

    if (!usersShow) {
      addShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          showName: showDetailsData.showDetails.name,
          watchStatus: 'WATCHING',
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
      (season: any) => season.season_number && season.season_number > 0
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
      setWatchStatus('COMPLETED');

      updateShow({
        variables: {
          showId: String(showDetailsData.showDetails.id),
          showRating: typeof rating === 'string' ? null : rating,
          watchStatus: 'COMPLETED',
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

    if (!usersShow) {
      addShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          showName: showDetailsData.showDetails.name,
          watchStatus: 'WATCHING',
          currentEpisode: +totalEpCount,
        },
      });
    } else {
      updateShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          showRating: typeof rating === 'string' ? null : rating,
          watchStatus: 'WATCHING',
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

    if (!usersShow) {
      addShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          showName: showDetailsData.showDetails.name,
          watchStatus: 'WATCHING',
          currentEpisode: totalEpCount,
        },
      });
    } else {
      updateShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          showRating: typeof rating === 'string' ? null : rating,
          watchStatus: 'WATCHING',
          currentEpisode: totalEpCount,
        },
      });
    }
  };

  const handleEpisodeOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!showDetailsData?.showDetails?.id) return;

    if (usersShow?.id) {
      if (usersShow.current_episode === e.target.valueAsNumber) {
        return;
      }
      if (e.target.value === '' || +e.target.value > currTotalEpCount) {
        setCurrEpWithSeasonEpisode(String(usersShow.current_episode ?? '0'));
      } else {
        if (watchStatus === 'WATCHING' && +e.target.value === currTotalEpCount) {
          setWatchStatus('COMPLETED');

          updateShow({
            variables: {
              showId: showDetailsData.showDetails.id,
              showRating: typeof rating === 'string' ? null : rating,
              watchStatus: 'COMPLETED',
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
            watchStatus: e.target.valueAsNumber === currTotalEpCount ? 'COMPLETED' : 'WATCHING',
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
      if (!usersShow?.status) {
        addShow({
          variables: {
            ...updateShowVariables,
            showName: showDetailsData.showDetails.name,
            watchStatus: 'WATCHING',
          },
        });
      } else if (
        usersShow.status === 'PLAN_TO_WATCH' ||
        usersShow.status === 'DROPPED' ||
        usersShow.status === 'ON_HOLD'
      ) {
        updateShow({
          variables: {
            ...updateShowVariables,
            watchStatus: 'WATCHING',
          },
        });
      } else {
        updateShow({
          variables: {
            ...updateShowVariables,
            watchStatus: usersShow.status,
          },
        });
      }
    } else if (epPostAction < currTotalEpCount && usersShow?.status) {
      if (usersShow.status === 'DROPPED' || usersShow.status === 'ON_HOLD') {
        updateShow({
          variables: {
            ...updateShowVariables,
            watchStatus: 'WATCHING',
          },
        });
      } else {
        updateShow({
          variables: {
            ...updateShowVariables,
            watchStatus: usersShow.status,
          },
        });
      }
    } else if (epPostAction === currTotalEpCount && usersShow) {
      updateShow({
        variables: {
          ...updateShowVariables,
          watchStatus: 'COMPLETED',
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

    if (!usersShow) {
      addShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          showName: showDetailsData.showDetails.name,
          watchStatus: 'WATCHING',
          currentEpisode: Number(getTotalEpCountForChangedSeason(seasonPostAction)),
        },
      });
    } else {
      updateShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          watchStatus: 'WATCHING',
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

    if (!usersShow) {
      addShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          showName: showDetailsData.showDetails.name,
          watchStatus: totalEpisode === currTotalEpCount ? 'COMPLETED' : 'WATCHING',
          currentEpisode: totalEpisode,
        },
      });
    } else {
      updateShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          watchStatus: totalEpisode === currTotalEpCount ? 'COMPLETED' : 'WATCHING',
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
    if (!showDetailsData?.showDetails) return;

    if (usersShow && typeof usersShow.current_episode === 'number') {
      if (
        usersShow.current_episode === currTotalEpCount &&
        usersShow.status === 'WATCHING' &&
        totalEpCountGathered
      ) {
        updateShow({
          variables: {
            showId: String(showDetailsData.showDetails.id),
            showRating: usersShow.rating ?? null,
            watchStatus: 'COMPLETED',
            currentEpisode: currTotalEpCount,
          },
        });
      } else if (
        usersShow.current_episode >= 0 &&
        usersShow.current_episode < currTotalEpCount &&
        usersShow.status === 'COMPLETED'
      ) {
        updateShow({
          variables: {
            showId: String(showDetailsData.showDetails.id),
            showRating: usersShow.rating ?? null,
            watchStatus: 'WATCHING',
            currentEpisode: usersShow.current_episode,
          },
        });
      }
    }
  }, [currTotalEpCount, showDetailsData?.showDetails, totalEpCountGathered, updateShow, usersShow]);

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

  if (!showDetailsData?.showDetails || isInitialUsersShowLoading) {
    return (
      <section className='flex h-screen items-center justify-center'>
        <Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
      </section>
    );
  }
  return (
    <motion.main
      className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className='aspect-h-16 aspect-w-16 relative mx-4 mt-4'>
        <Image
          className='rounded-lg'
          src={CommonMethods.getTheMovieDbImage(showDetailsData.showDetails.poster_path)}
          alt={showDetailsData.showDetails.name}
          fill
          priority
          sizes='(max-width: 768px) 100vw, 30vw'
        />
      </section>

      <section className='mt-4 min-w-0'>
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
          {showDetailsData.showDetails.genres.map((genre: any, idx: number) => (
            <p key={idx}>{genre.name}</p>
          ))}
        </div>
        <h4 className='mt-4'>Original Language</h4>
        <p className='ml-1'>{getEnglishName(showDetailsData.showDetails.original_language)}</p>
        {showDetailsData.showDetails.homepage.length > 0 && (
          <>
            <h4 className='mt-4'>Official Page</h4>
            <Link
              href={showDetailsData.showDetails.homepage}
              className='ml-1 underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              Learn More
            </Link>
          </>
        )}
      </section>

      <section className='col-start-2 mt-4'>
        {!_.isEmpty(showDetailsData.showDetails.seasons) && (
          <section>
            <h3 className='mb-4 ml-8'>Episodes</h3>
            <EpisodeDetailsHorizontalScroller
              seasons={showDetailsData.showDetails.seasons.filter(
                (season: any) => season.season_number && season.season_number > 0
              )}
              showId={showDetailsData.showDetails.id}
            />
          </section>
        )}

        {castNode}
        {relatedNode}
      </section>
    </motion.main>
  );
};

export default ShowDetailsClient;
