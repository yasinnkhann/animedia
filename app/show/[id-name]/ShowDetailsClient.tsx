'use client';

import { useState, useCallback, useEffect, useMemo, useTransition } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import RoundProgressBar from '@/components/RoundProgressBar';
import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import { useSession } from 'next-auth/react';
import { ICurrentSeasonEpisode } from '@ts/interfaces';
import { watchStatusOptions, ratingOptions } from '@/models/dropDownOptions';
import ReviewSection from '@/components/Reviews/ReviewSection';
import { getEnglishName } from 'all-iso-language-codes';
import { CommonMethods } from '@/utils/CommonMethods';
import type { WatchStatus } from '@prisma/client';
import _ from 'lodash';
import { IoMdArrowDropdown } from 'react-icons/io';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { FiSliders } from 'react-icons/fi';
import { TEpisodeCountDisplay, TSeasonEpisodeAction } from '@ts/types';
import EpisodeDetailsHorizontalScroller from '@/components/HorizontalScroller/EpisodeDetails/EpisodeDetailsHorizontalScroller';
import { useUserMedia } from '@/components/UserMediaProvider';
import {
  addShow as addShowAction,
  updateShow as updateShowAction,
  deleteShow as deleteShowAction,
  startShowRewatch,
} from '@/app/actions/media';
import { BiCollection, BiShare, BiNote, BiRevision } from 'react-icons/bi';
import toast from 'react-hot-toast';
import AddToCollectionModal from '@/components/Collections/AddToCollectionModal';
import RecommendModal from '@/components/Notifications/RecommendModal';
import PersonalDetailsModal from '@/components/MyMedia/PersonalDetailsModal';
import WatchProviders from '@/components/Media/WatchProviders';
import { WatchTrailerButton } from '@/components/Media/TrailerModal';

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

  const [, startTransition] = useTransition();

  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [episodeCountDisplay, setEpisodeCountDisplay] = useState<TEpisodeCountDisplay>();

  const showDetails = showDetailsData?.showDetails;
  const showId = String(showDetails?.id ?? '');
  const showName = showDetails?.name ?? '';

  const { userShows, isLoading, mutateUserMediaCache, getUserMediaCache } = useUserMedia();
  const usersShow = userShows?.find(show => show.id === showId);

  const { currTotalEpCount, currTotalSeasonCount, totalEpCountGathered } = useMemo(() => {
    const details = showDetailsData?.showDetails;
    if (!details?.number_of_episodes || !details?.number_of_seasons) {
      return {
        currTotalEpCount: 0,
        currTotalSeasonCount: 0,
        totalEpCountGathered: false,
      };
    }

    const totalEpCount = CommonMethods.getAiredEpisodeCount(details) ?? details.number_of_episodes;
    let totalSeasonCount = details.number_of_seasons;

    if (Array.isArray(details.seasons)) {
      const currDate = new Date();
      for (let i = details.seasons.length - 1; i > -1; i--) {
        const season = details.seasons[i];
        if (
          season?.name?.startsWith('Season') &&
          season.season_number !== 0 &&
          (!season.air_date || currDate.getTime() < new Date(season.air_date).getTime())
        ) {
          totalSeasonCount--;
        }
      }
    }

    return {
      currTotalEpCount: totalEpCount,
      currTotalSeasonCount: totalSeasonCount,
      totalEpCountGathered: true,
    };
  }, [showDetailsData?.showDetails]);

  const isCompletedWithNewEpisodes =
    usersShow?.status === 'COMPLETED' &&
    totalEpCountGathered &&
    currTotalEpCount > (usersShow.current_episode ?? 0);

  const watchStatus =
    watchStatusInput ??
    (isCompletedWithNewEpisodes ? 'WATCHING' : (usersShow?.status ?? 'NOT_WATCHING'));
  const rating = ratingInput ?? usersShow?.rating ?? '';
  const currEp = currEpInput ?? String(usersShow?.current_episode ?? '0');

  const addShow = useCallback(
    ({ variables }: { variables: any }) => {
      setCurrEp(null);
      setCurrSeasonEp(null);
      startTransition(async () => {
        const previousData = getUserMediaCache();
        mutateUserMediaCache((old: any) => {
          if (!old) return old;
          const newShows = [...old.userShows];
          newShows.push({
            id: String(variables.showId),
            name: variables.showName,
            mediaType: 'SHOW',
            status: variables.watchStatus,
            current_episode: variables.currentEpisode ?? 0,
            rating: variables.showRating ?? null,
          });
          return { ...old, userShows: newShows };
        });

        try {
          await addShowAction(
            variables.showId,
            variables.showName,
            variables.watchStatus,
            variables.currentEpisode
          );
        } catch (_err) {
          mutateUserMediaCache(() => previousData);
        }
      });
    },
    [mutateUserMediaCache, getUserMediaCache]
  );

  const updateShow = useCallback(
    ({ variables }: { variables: any }) => {
      setCurrEp(null);
      setCurrSeasonEp(null);
      startTransition(async () => {
        const previousData = getUserMediaCache();
        mutateUserMediaCache((old: any) => {
          if (!old) return old;
          const newShows = [...old.userShows];
          const index = newShows.findIndex((s: any) => s.id === String(variables.showId));
          if (index !== -1) {
            newShows[index] = {
              ...newShows[index],
              status: variables.watchStatus ?? newShows[index].status,
              current_episode: variables.currentEpisode ?? newShows[index].current_episode,
              rating:
                variables.showRating !== undefined ? variables.showRating : newShows[index].rating,
            };
          }
          return { ...old, userShows: newShows };
        });

        try {
          await updateShowAction(
            variables.showId,
            variables.watchStatus,
            variables.showRating ?? undefined,
            variables.currentEpisode ?? undefined
          );
        } catch (_err) {
          mutateUserMediaCache(() => previousData);
        }
      });
    },
    [mutateUserMediaCache, getUserMediaCache]
  );

  const deleteShow = useCallback(
    ({ variables }: { variables: any }) => {
      setCurrEp(null);
      setCurrSeasonEp(null);
      startTransition(async () => {
        const previousData = getUserMediaCache();
        mutateUserMediaCache((old: any) => {
          if (!old) return old;
          return {
            ...old,
            userShows: old.userShows.filter((s: any) => s.id !== String(variables.showId)),
          };
        });

        try {
          await deleteShowAction(variables.showId);
        } catch (_err) {
          mutateUserMediaCache(() => previousData);
        }
      });
    },
    [mutateUserMediaCache, getUserMediaCache]
  );

  const isInitialUsersShowLoading = false;

  useEffect(() => {
    if (isCompletedWithNewEpisodes && showDetailsData?.showDetails?.id) {
      const targetId = String(showDetailsData.showDetails.id);
      mutateUserMediaCache((old: any) => {
        if (!old) return old;
        return {
          ...old,
          userShows: old.userShows.map((s: any) =>
            s.id === targetId ? { ...s, status: 'WATCHING', total_episodes: currTotalEpCount } : s
          ),
        };
      });
      updateShowAction(
        showDetailsData.showDetails.id,
        'WATCHING',
        usersShow?.rating ?? undefined,
        usersShow?.current_episode ?? 0
      );
    }
  }, [
    isCompletedWithNewEpisodes,
    showDetailsData?.showDetails?.id,
    usersShow?.rating,
    usersShow?.current_episode,
    currTotalEpCount,
    mutateUserMediaCache,
  ]);

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
            currentEpisode: 1,
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

  const handleStartRewatch = () => {
    if (!showDetailsData?.showDetails?.id || !showDetailsData?.showDetails?.name) return;

    const nextRewatchCount = (usersShow?.rewatch_count ?? 0) + 1;
    setWatchStatus('WATCHING');
    setCurrEpWithSeasonEpisode('1');

    startTransition(async () => {
      const previousData = getUserMediaCache();
      mutateUserMediaCache((old: any) => {
        if (!old) return old;
        const newShows = old.userShows.map((s: any) =>
          s.id === String(showDetailsData.showDetails.id)
            ? { ...s, status: 'WATCHING', current_episode: 1, rewatch_count: nextRewatchCount }
            : s
        );
        return { ...old, userShows: newShows };
      });

      try {
        await startShowRewatch(String(showDetailsData.showDetails.id));
        toast.success(`Started rewatch #${nextRewatchCount} from Episode 1!`);
      } catch (_err) {
        mutateUserMediaCache(() => previousData);
        toast.error('Failed to start rewatch.');
      }
    });
  };

  const handleChangeRating = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setRating(value === '' ? '' : +value);

    if (!showDetailsData?.showDetails.id) return;

    updateShow({
      variables: {
        showId: String(showDetailsData.showDetails.id),
        showRating: value === '' ? null : +value,
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

    if (+currEp === currTotalEpCount && totalEpCountGathered) {
      setWatchStatus('COMPLETED');

      updateShow({
        variables: {
          showId: String(showDetailsData.showDetails.id),
          showRating: typeof rating === 'string' ? null : rating,
          watchStatus: 'COMPLETED',
          currentEpisode: currTotalEpCount,
        },
      });
      if (usersShow?.rewatch_count && usersShow.rewatch_count > 0) {
        toast.success(`Rewatch #${usersShow.rewatch_count} complete! Marked as Completed.`);
      }
      return;
    }

    const nextWatchStatus = watchStatus === 'COMPLETED' ? 'WATCHING' : watchStatus;
    if (watchStatus === 'COMPLETED') {
      setWatchStatus('WATCHING');
    }

    updateShow({
      variables: {
        showId: String(showDetailsData.showDetails.id),
        showRating: typeof rating === 'string' ? null : rating,
        watchStatus: nextWatchStatus,
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

    const nextWatchStatus =
      totalEpCount === currTotalEpCount && totalEpCountGathered
        ? 'COMPLETED'
        : watchStatus === 'COMPLETED' || usersShow?.status === 'COMPLETED'
          ? 'WATCHING'
          : watchStatus;

    if (totalEpCount === currTotalEpCount && totalEpCountGathered) {
      setWatchStatus('COMPLETED');
    } else if (watchStatus === 'COMPLETED') {
      setWatchStatus('WATCHING');
    }

    if (!usersShow) {
      addShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          showName: showDetailsData.showDetails.name,
          watchStatus: nextWatchStatus,
          currentEpisode: totalEpCount,
        },
      });
    } else {
      updateShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          showRating: typeof rating === 'string' ? null : rating,
          watchStatus: nextWatchStatus,
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
        if (
          watchStatus === 'WATCHING' &&
          +e.target.value === currTotalEpCount &&
          totalEpCountGathered
        ) {
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

        const nextWatchStatus =
          watchStatus === 'COMPLETED' && +e.target.value < currTotalEpCount
            ? 'WATCHING'
            : watchStatus;

        if (watchStatus === 'COMPLETED' && +e.target.value < currTotalEpCount) {
          setWatchStatus('WATCHING');
        }

        updateShow({
          variables: {
            showId: showDetailsData.showDetails.id,
            showRating: typeof rating === 'string' ? null : rating,
            watchStatus: nextWatchStatus,
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
      if (
        usersShow.status === 'DROPPED' ||
        usersShow.status === 'ON_HOLD' ||
        usersShow.status === 'COMPLETED'
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
    } else if (epPostAction === currTotalEpCount && usersShow) {
      updateShow({
        variables: {
          ...updateShowVariables,
          watchStatus: totalEpCountGathered ? 'COMPLETED' : usersShow.status,
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

    const totalEpisodeForSeason = Number(getTotalEpCountForChangedSeason(seasonPostAction));

    if (!usersShow) {
      addShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          showName: showDetailsData.showDetails.name,
          watchStatus:
            totalEpisodeForSeason === currTotalEpCount && totalEpCountGathered
              ? 'COMPLETED'
              : 'WATCHING',
          currentEpisode: totalEpisodeForSeason,
        },
      });
    } else {
      let newWatchStatus = usersShow.status;
      if (totalEpisodeForSeason === currTotalEpCount && totalEpCountGathered) {
        newWatchStatus = 'COMPLETED';
      } else if (
        usersShow.status === 'COMPLETED' ||
        usersShow.status === 'DROPPED' ||
        usersShow.status === 'ON_HOLD'
      ) {
        newWatchStatus = 'WATCHING';
      }

      updateShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          watchStatus: newWatchStatus,
          currentEpisode: totalEpisodeForSeason,
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
          watchStatus:
            totalEpisode === currTotalEpCount && totalEpCountGathered ? 'COMPLETED' : 'WATCHING',
          currentEpisode: totalEpisode,
        },
      });
    } else {
      let newWatchStatus = usersShow.status;
      if (totalEpisode === currTotalEpCount && totalEpCountGathered) {
        newWatchStatus = 'COMPLETED';
      } else if (
        usersShow.status === 'COMPLETED' ||
        usersShow.status === 'DROPPED' ||
        usersShow.status === 'ON_HOLD'
      ) {
        newWatchStatus = 'WATCHING';
      }

      updateShow({
        variables: {
          showId: showDetailsData.showDetails.id,
          watchStatus: newWatchStatus,
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
    <div className='relative w-full overflow-hidden'>
      {/* Cinematic Ambient Backdrop Glow */}
      {showDetailsData?.showDetails?.backdrop_path && (
        <div className='pointer-events-none absolute -top-12 left-0 right-0 -z-10 h-[480px] overflow-hidden opacity-25 blur-3xl dark:opacity-20'>
          <Image
            src={CommonMethods.getTheMovieDbImage(showDetailsData.showDetails.backdrop_path)}
            alt=''
            fill
            className='scale-110 object-cover object-top'
            priority={false}
          />
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background' />
        </div>
      )}

      <motion.main
        className='mt-[calc(var(--header-height-mobile)+1rem)] flex flex-col gap-8 px-4 sm:px-8 lg:flex-row lg:gap-10 lg:px-16'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Left Sidebar: Poster + Where to Watch + Show Details */}
        <aside className='flex w-full flex-col gap-5 lg:w-[280px] lg:shrink-0 xl:w-[320px]'>
          <section className='group relative mx-auto aspect-[2/3] w-[14rem] sm:w-[16rem] lg:w-full'>
            <Image
              className='rounded-2xl object-cover shadow-2xl ring-1 ring-white/10'
              src={CommonMethods.getTheMovieDbImage(showDetailsData.showDetails.poster_path)}
              alt={showDetailsData.showDetails.name}
              fill
              priority
              sizes='(max-width: 768px) 100vw, 320px'
            />
            {/* Quick Play Trailer on Poster */}
            <WatchTrailerButton
              mediaTitle={showDetailsData.showDetails.name}
              mediaType='SHOW'
              mediaId={String(showDetailsData.showDetails.id)}
              initialVideos={showDetailsData.videos}
              variant='poster'
            />
          </section>

          {/* Where to Watch / Streaming Providers */}
          <WatchProviders
            mediaType='SHOW'
            mediaId={String(showDetailsData.showDetails.id)}
            initialData={showDetailsData.watchProviders}
          />

          {/* Show Details Card */}
          <div className='rounded-2xl border border-border/60 bg-card/30 p-5 shadow-sm backdrop-blur-sm'>
            <h3 className='mb-4 text-base font-bold text-foreground'>Show Details</h3>
            <dl className='space-y-3.5 text-sm'>
              <div>
                <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                  No. of Seasons
                </dt>
                <dd className='mt-0.5 font-semibold text-foreground'>{currTotalSeasonCount}</dd>
              </div>
              <div>
                <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                  No. of Episodes
                </dt>
                <dd className='mt-0.5 font-semibold text-foreground'>{currTotalEpCount}</dd>
              </div>
              <div>
                <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                  First Air Date
                </dt>
                <dd className='mt-0.5 font-semibold text-foreground'>
                  {showDetailsData.showDetails.first_air_date
                    ? CommonMethods.formatDate(showDetailsData.showDetails.first_air_date)
                    : 'N/A'}
                </dd>
              </div>
              {showDetailsData.showDetails.last_episode_to_air && (
                <div>
                  <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                    Last Episode to Air
                  </dt>
                  <dd className='mt-0.5 text-xs text-foreground'>
                    Season {showDetailsData.showDetails.last_episode_to_air.season_number} Ep{' '}
                    {showDetailsData.showDetails.last_episode_to_air.episode_number}
                    {showDetailsData.showDetails.last_episode_to_air.air_date && (
                      <span className='ml-1 text-muted-foreground'>
                        (
                        {CommonMethods.formatDate(
                          showDetailsData.showDetails.last_episode_to_air.air_date
                        )}
                        )
                      </span>
                    )}
                  </dd>
                </div>
              )}
              {showDetailsData.showDetails.next_episode_to_air && (
                <div>
                  <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                    Next Episode to Air
                  </dt>
                  <dd className='mt-0.5 text-xs text-foreground'>
                    Season {showDetailsData.showDetails.next_episode_to_air.season_number} Ep{' '}
                    {showDetailsData.showDetails.next_episode_to_air.episode_number}
                    {showDetailsData.showDetails.next_episode_to_air.air_date && (
                      <span className='ml-1 text-muted-foreground'>
                        (
                        {CommonMethods.formatDate(
                          showDetailsData.showDetails.next_episode_to_air.air_date
                        )}
                        )
                      </span>
                    )}
                  </dd>
                </div>
              )}
              <div>
                <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                  Status
                </dt>
                <dd className='mt-0.5 font-semibold text-foreground'>
                  {showDetailsData.showDetails?.status || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                  In Production
                </dt>
                <dd className='mt-0.5 font-semibold text-foreground'>
                  {showDetailsData.showDetails.in_production ? 'Yes' : 'No'}
                </dd>
              </div>
              {showDetailsData.showDetails.genres &&
                showDetailsData.showDetails.genres.length > 0 && (
                  <div>
                    <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                      Genre(s)
                    </dt>
                    <dd className='mt-1 flex flex-wrap gap-1.5'>
                      {showDetailsData.showDetails.genres.map((genre: any, idx: number) => (
                        <span
                          key={idx}
                          className='rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs text-foreground'
                        >
                          {genre.name}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              <div>
                <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                  Original Language
                </dt>
                <dd className='mt-0.5 font-semibold text-foreground'>
                  {getEnglishName(showDetailsData.showDetails.original_language)}
                </dd>
              </div>
              {showDetailsData.showDetails.homepage?.length > 0 && (
                <div>
                  <dt className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                    Official Page
                  </dt>
                  <dd className='mt-0.5 truncate text-xs'>
                    <Link
                      href={showDetailsData.showDetails.homepage}
                      target='_blank'
                      rel='noreferrer'
                      className='text-primary hover:underline'
                    >
                      {showDetailsData.showDetails.homepage}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>

        {/* Right Main Content */}
        <div className='flex min-w-0 flex-1 flex-col gap-6'>
          <section className='flex min-w-0 flex-col'>
            <h1 className='mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
              {showDetailsData.showDetails.name}
            </h1>
            <section className='relative mb-5 mt-3 flex flex-wrap items-center justify-between gap-4'>
              <div className='flex items-center gap-3.5'>
                <section className='h-[4rem] w-[4rem] drop-shadow-md sm:h-[4.5rem] sm:w-[4.5rem]'>
                  <RoundProgressBar
                    percentageVal={+(showDetailsData.showDetails.vote_average ?? 0).toFixed(1) * 10}
                  />
                </section>
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold text-foreground sm:text-base'>
                    {commaNumber(showDetailsData.showDetails.vote_count ?? 0)} votes
                  </span>
                  <span className='text-xs text-muted-foreground'>User Rating</span>
                </div>

                <button
                  onClick={toggleEpisodeCountDisplay}
                  className='ml-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border/70 bg-card/50 p-2 text-muted-foreground transition-all hover:border-primary/50 hover:bg-muted hover:text-foreground focus:outline-none'
                  title='Toggle Episode Display Mode'
                >
                  <FiSliders size={18} />
                </button>
              </div>

              {/* Watch Trailer Button in Hero */}
              <WatchTrailerButton
                mediaTitle={showDetailsData.showDetails.name}
                mediaType='SHOW'
                mediaId={String(showDetailsData.showDetails.id)}
                initialVideos={showDetailsData.videos}
                variant='hero'
              />
            </section>

            {status === 'authenticated' && session && (
              <div className='my-4 w-full rounded-2xl border border-border/60 bg-card/40 p-2.5 shadow-sm backdrop-blur-md'>
                {isLoading ? (
                  <div className='flex items-center gap-3 py-1'>
                    <div className='h-10 w-36 animate-pulse rounded-xl bg-muted/60' />
                    <div className='h-10 w-28 animate-pulse rounded-xl bg-muted/60' />
                    <div className='h-10 w-44 animate-pulse rounded-xl bg-muted/60' />
                  </div>
                ) : (
                  <div className='flex flex-wrap items-center gap-2'>
                    {/* Watch Status Select */}
                    <div className='relative'>
                      <select
                        className='h-10 appearance-none rounded-xl border border-border/80 bg-background/90 pl-3 pr-8 text-sm font-medium leading-none text-foreground shadow-sm transition-all hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 [&>option]:bg-background'
                        value={watchStatus}
                        onChange={handleChangeWatchStatus}
                      >
                        {watchStatusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.text}
                          </option>
                        ))}
                      </select>
                      <IoMdArrowDropdown className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    </div>

                    {/* Rating Select */}
                    <div className='relative'>
                      <select
                        className='h-10 appearance-none rounded-xl border border-border/80 bg-background/90 pl-3 pr-8 text-sm font-medium leading-none text-foreground shadow-sm transition-all hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background'
                        value={rating}
                        onChange={handleChangeRating}
                        disabled={watchStatus === 'NOT_WATCHING' || watchStatus === 'PLAN_TO_WATCH'}
                      >
                        {ratingOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.text}
                          </option>
                        ))}
                      </select>
                      <IoMdArrowDropdown className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    </div>

                    {/* Episode Stepper (Total Episodes mode) */}
                    {episodeCountDisplay === 'total-episodes' && (
                      <form
                        className='flex h-10 items-center rounded-xl border border-border/80 bg-background/90 px-1.5 shadow-sm'
                        onSubmit={handleEpisodeSubmit}
                      >
                        <span className='px-1.5 text-xs font-medium text-muted-foreground'>
                          Ep:
                        </span>
                        <button
                          className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30'
                          onClick={() => handleTotalEpisodeBtn('decrement')}
                          type='button'
                          disabled={+currEp <= 0}
                        >
                          <FaMinus size={11} />
                        </button>
                        <input
                          className='w-10 bg-transparent text-center text-sm font-semibold text-foreground focus:outline-none'
                          type='text'
                          value={currEp}
                          onChange={handleEpisodeChange}
                          onBlur={handleEpisodeOnBlur}
                          disabled={watchStatus === 'PLAN_TO_WATCH'}
                        />
                        <span className='text-xs text-muted-foreground'>/ {currTotalEpCount}</span>
                        <button
                          className='ml-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30'
                          onClick={() => handleTotalEpisodeBtn('increment')}
                          type='button'
                          disabled={+currEp >= currTotalEpCount}
                        >
                          <FaPlus size={11} />
                        </button>
                      </form>
                    )}

                    {/* Season/Episode Stepper mode */}
                    {episodeCountDisplay === 'season-episode' && (
                      <div className='flex items-center gap-1.5'>
                        <form
                          className='flex h-10 items-center rounded-xl border border-border/80 bg-background/90 px-1.5 shadow-sm'
                          onSubmit={handleSeasonSubmit}
                        >
                          <span className='px-1.5 text-xs font-medium text-muted-foreground'>
                            S:
                          </span>
                          <button
                            className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30'
                            onClick={() => handleSeasonBtn('decrement')}
                            type='button'
                            disabled={+currSeasonEp.seasonNo <= 1}
                          >
                            <FaMinus size={11} />
                          </button>
                          <input
                            className='w-8 bg-transparent text-center text-sm font-semibold text-foreground focus:outline-none'
                            type='text'
                            value={currSeasonEp.seasonNo}
                            onChange={handleSeasonChange}
                            onBlur={handleSeasonOnBlur}
                            disabled={watchStatus === 'PLAN_TO_WATCH'}
                          />
                          <span className='text-xs text-muted-foreground'>
                            / {currTotalSeasonCount}
                          </span>
                          <button
                            className='ml-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30'
                            onClick={() => handleSeasonBtn('increment')}
                            type='button'
                            disabled={+currEp >= currTotalEpCount}
                          >
                            <FaPlus size={11} />
                          </button>
                        </form>

                        <form
                          className='flex h-10 items-center rounded-xl border border-border/80 bg-background/90 px-1.5 shadow-sm'
                          onSubmit={handleSeasonEpisodeSubmit}
                        >
                          <span className='px-1.5 text-xs font-medium text-muted-foreground'>
                            Ep:
                          </span>
                          <button
                            className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30'
                            onClick={() => handleSeasonEpisodeBtn('decrement')}
                            type='button'
                            disabled={+currSeasonEp.episode <= 0}
                          >
                            <FaMinus size={11} />
                          </button>
                          <input
                            className='w-8 bg-transparent text-center text-sm font-semibold text-foreground focus:outline-none'
                            type='text'
                            value={currSeasonEp.episode}
                            onChange={handleSeasonEpisodeChange}
                            onBlur={handleSeasonEpisodeOnBlur}
                            disabled={watchStatus === 'PLAN_TO_WATCH'}
                          />
                          <span className='text-xs text-muted-foreground'>
                            / {calculateSeasonEpisodeNumber().seasonEpCount}
                          </span>
                          <button
                            className='ml-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30'
                            onClick={() => handleSeasonEpisodeBtn('increment')}
                            type='button'
                            disabled={+currEp >= currTotalEpCount}
                          >
                            <FaPlus size={11} />
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Divider */}
                    <div className='hidden h-6 w-[1px] bg-border/80 sm:block' />

                    {/* Quick Action Buttons Group */}
                    <div className='flex items-center gap-1.5'>
                      {/* Collection Button */}
                      <button
                        onClick={() => setIsCollectionModalOpen(true)}
                        className='flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-background/90 text-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary'
                        title='Add to Collection'
                      >
                        <BiCollection size={19} />
                      </button>

                      {/* Recommend Button */}
                      <button
                        onClick={() => setIsRecommendModalOpen(true)}
                        className='flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-background/90 text-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary'
                        title='Recommend to a Friend'
                      >
                        <BiShare size={19} />
                      </button>

                      {/* Log Details Button */}
                      <button
                        onClick={() => setIsDetailsModalOpen(true)}
                        disabled={watchStatus === 'NOT_WATCHING'}
                        className={`flex h-10 items-center gap-1.5 rounded-xl border border-border/80 bg-background/90 px-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary ${
                          watchStatus === 'NOT_WATCHING' ? 'cursor-not-allowed opacity-40' : ''
                        } ${
                          usersShow?.notes ||
                          (usersShow?.tags && usersShow.tags.length > 0) ||
                          (usersShow?.rewatch_count && usersShow.rewatch_count > 0)
                            ? 'border-primary/70 text-primary'
                            : ''
                        }`}
                        title={
                          watchStatus === 'NOT_WATCHING'
                            ? 'Add to list first to log notes & tags'
                            : 'Personal Notes, Tags & Rewatches'
                        }
                      >
                        <BiNote size={17} />
                        <span className='hidden sm:inline'>Log Details</span>
                        {usersShow?.rewatch_count && usersShow.rewatch_count > 0 ? (
                          <span className='ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-xs font-semibold'>
                            {usersShow.rewatch_count}x
                          </span>
                        ) : null}
                      </button>

                      {/* Start Rewatch Button (when show is COMPLETED) */}
                      {usersShow?.status === 'COMPLETED' && (
                        <button
                          type='button'
                          onClick={handleStartRewatch}
                          className='flex h-10 items-center gap-1.5 rounded-xl border border-purple-500/50 bg-purple-500/15 px-3.5 text-sm font-semibold text-purple-300 shadow-sm transition-all hover:border-purple-400 hover:bg-purple-500/25'
                          title='Start rewatching this series from Episode 1'
                        >
                          <BiRevision size={17} />
                          <span>Start Rewatch</span>
                          {usersShow.rewatch_count > 0 ? (
                            <span className='ml-0.5 text-xs opacity-75'>
                              ({usersShow.rewatch_count}x)
                            </span>
                          ) : null}
                        </button>
                      )}

                      {/* Rewatching Badge (when currently WATCHING with rewatch_count > 0) */}
                      {usersShow?.status === 'WATCHING' && (usersShow?.rewatch_count ?? 0) > 0 && (
                        <div
                          className='flex h-10 items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/15 px-3 text-xs font-semibold text-purple-300 shadow-sm'
                          title={`Currently on rewatch #${usersShow.rewatch_count}`}
                        >
                          <BiRevision size={16} />
                          <span>Rewatching #{usersShow.rewatch_count}</span>
                        </div>
                      )}
                    </div>

                    {/* Personal Notes / Tags Pill Display */}
                    {(usersShow?.notes || (usersShow?.tags && usersShow.tags.length > 0)) && (
                      <div className='mt-1.5 w-full rounded-xl border border-border/60 bg-muted/30 p-2.5'>
                        {usersShow.tags && usersShow.tags.length > 0 && (
                          <div className='flex flex-wrap items-center gap-1.5'>
                            {usersShow.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className='rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {usersShow.notes && (
                          <p className='mt-1 text-xs italic text-muted-foreground'>
                            &ldquo;{usersShow.notes}&rdquo;
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <AddToCollectionModal
                  mediaType='SHOW'
                  mediaId={showId}
                  mediaTitle={showName}
                  mediaImage={
                    usersShow?.image ??
                    (showDetails?.poster_path
                      ? `https://image.tmdb.org/t/p/w500${showDetails.poster_path}`
                      : null)
                  }
                  isOpen={isCollectionModalOpen}
                  onClose={() => setIsCollectionModalOpen(false)}
                />

                <PersonalDetailsModal
                  mediaType='SHOW'
                  mediaId={showId}
                  mediaTitle={showName}
                  isOpen={isDetailsModalOpen}
                  onClose={() => setIsDetailsModalOpen(false)}
                  initialNotes={usersShow?.notes}
                  initialTags={usersShow?.tags}
                  initialRewatchCount={usersShow?.rewatch_count}
                  onSaveSuccess={({ notes, tags, rewatchCount }) => {
                    mutateUserMediaCache((old: any) => {
                      if (!old) return old;
                      const newShows = old.userShows.map((s: any) =>
                        s.id === showId ? { ...s, notes, tags, rewatch_count: rewatchCount } : s
                      );
                      return { ...old, userShows: newShows };
                    });
                  }}
                />

                <RecommendModal
                  mediaType='SHOW'
                  mediaId={showId}
                  mediaTitle={showName}
                  mediaImage={
                    usersShow?.image ??
                    (showDetails?.poster_path
                      ? `https://image.tmdb.org/t/p/w500${showDetails.poster_path}`
                      : null)
                  }
                  isOpen={isRecommendModalOpen}
                  onClose={() => setIsRecommendModalOpen(false)}
                />
              </div>
            )}

            <section className='mt-6 space-y-3'>
              {showDetailsData.showDetails.tagline && (
                <p className='text-lg font-medium italic text-primary/90'>
                  &ldquo;{showDetailsData.showDetails.tagline}&rdquo;
                </p>
              )}
              {showDetailsData.showDetails.overview && (
                <div>
                  <h3 className='mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    Overview
                  </h3>
                  <p className='max-w-3xl text-sm leading-relaxed text-foreground/85 sm:text-base'>
                    {showDetailsData.showDetails.overview}
                  </p>
                </div>
              )}
            </section>
          </section>

          {!_.isEmpty(showDetailsData.showDetails.seasons) && (
            <section>
              <h3 className='mb-4 text-xl font-bold text-foreground'>Episodes</h3>
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

          <section className='mt-8 pb-16'>
            <ReviewSection
              mediaType='SHOW'
              mediaId={String(showDetailsData.showDetails.id)}
              mediaTitle={showDetailsData.showDetails.name}
              mediaImage={showDetailsData.showDetails.poster_path}
            />
          </section>
        </div>
      </motion.main>
    </div>
  );
};

export default ShowDetailsClient;
