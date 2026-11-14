'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import { FaDice, FaHeart } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import MediaCard from '@/components/MediaCard/MediaCard';
import WatchRouletteModal from './WatchRouletteModal';
import RoundProgressBar from '@/components/RoundProgressBar';

export interface FriendSummary {
  id: string;
  name: string | null;
  image: string | null;
}

interface Props {
  initialFriendId?: string;
  friendsList: FriendSummary[];
  currentUser: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
}

interface CardWrapperProps {
  item: any;
  mediaType: 'MOVIE' | 'SHOW';
  index: number;
}

const WatchTogetherMediaCardWrapper = ({ item, mediaType, index }: CardWrapperProps) => {
  const [data, setData] = useState<{
    poster_path?: string | null;
    release_date?: string | null;
    first_air_date?: string | null;
  }>({
    poster_path: item.poster_path || item.image || null,
    release_date: item.release_date || null,
    first_air_date: item.first_air_date || item.release_date || null,
  });

  useEffect(() => {
    const hasImage = Boolean(item.poster_path || item.image || data.poster_path);
    const hasDate = Boolean(
      item.release_date || item.first_air_date || data.release_date || data.first_air_date
    );

    if (!hasImage || !hasDate) {
      fetch(
        `/api/media/details?type=${encodeURIComponent(mediaType)}&id=${encodeURIComponent(item.id)}`
      )
        .then(res => (res.ok ? res.json() : null))
        .then((d: any) => {
          if (!d) return;
          if (mediaType === 'MOVIE') {
            setData({
              poster_path: d.poster_path,
              release_date: d.release_date,
            });
          } else if (mediaType === 'SHOW') {
            setData({
              poster_path: d.poster_path,
              first_air_date: d.first_air_date,
              release_date: d.first_air_date,
            });
          }
        })
        .catch(() => {});
    }
  }, [
    item.id,
    item.poster_path,
    item.image,
    item.release_date,
    item.first_air_date,
    mediaType,
    data.poster_path,
    data.release_date,
    data.first_air_date,
  ]);

  const effectivePoster = data.poster_path || item.poster_path || item.image;
  const effectiveReleaseDate = data.release_date || item.release_date;
  const effectiveAirDate = data.first_air_date || item.first_air_date || item.release_date;

  return (
    <MediaCard
      key={`${mediaType}-${item.id}`}
      item={{
        ...item,
        title: item.title || item.name,
        name: item.name || item.title,
        image: effectivePoster,
        poster_path: effectivePoster,
        release_date: effectiveReleaseDate,
        first_air_date: effectiveAirDate,
        recommendedReason: item.reason || item.recommendedReason,
      }}
      mediaType={mediaType}
      index={index}
    />
  );
};

export default function WatchTogetherClient({ initialFriendId, friendsList, currentUser }: Props) {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(
    initialFriendId || (friendsList.length > 0 ? friendsList[0].id : null)
  );
  const [friendSearch, setFriendSearch] = useState('');
  const [loadedFriendId, setLoadedFriendId] = useState<string | null>(null);
  const [blendData, setBlendData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'mutual' | 'friendPicks' | 'yourPicks' | 'favorites' | 'blendedRecs'
  >('mutual');
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);

  const loading = Boolean(selectedFriendId && loadedFriendId !== selectedFriendId);

  // Filtered friends list for picker
  const filteredFriends = useMemo(() => {
    if (!friendSearch) return friendsList;
    const q = friendSearch.toLowerCase();
    return friendsList.filter(f => f.name?.toLowerCase().includes(q));
  }, [friendsList, friendSearch]);

  const selectedFriend = useMemo(() => {
    return friendsList.find(f => f.id === selectedFriendId) || null;
  }, [friendsList, selectedFriendId]);

  // Fetch blend data when selectedFriendId changes
  useEffect(() => {
    if (!selectedFriendId) return;

    let ignore = false;
    fetch(`/api/watch-together?friendId=${encodeURIComponent(selectedFriendId)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch blend');
        return res.json();
      })
      .then(data => {
        if (!ignore) {
          setBlendData(data);
          setLoadedFriendId(selectedFriendId);
        }
      })
      .catch(err => {
        console.error('Error fetching watch together data:', err);
        if (!ignore) setLoadedFriendId(selectedFriendId);
      });

    return () => {
      ignore = true;
    };
  }, [selectedFriendId]);

  const blend = blendData?.blend;
  const blendedRecs = useMemo(
    () => blendData?.blendedRecommendations || [],
    [blendData?.blendedRecommendations]
  );

  // Candidates for Watch Roulette based on active context
  const rouletteCandidates = useMemo(() => {
    if (!blend) return [];
    if (activeTab === 'mutual' && blend.mutualPlanToWatch?.length > 0) {
      return blend.mutualPlanToWatch;
    }
    if (activeTab === 'friendPicks' && blend.friendPicksForYou?.length > 0) {
      return blend.friendPicksForYou;
    }
    if (activeTab === 'blendedRecs' && blendedRecs.length > 0) {
      return blendedRecs;
    }
    // Fallback: combine mutual queue + friend picks + fresh recs
    return [...(blend.mutualPlanToWatch || []), ...(blend.friendPicksForYou || []), ...blendedRecs];
  }, [blend, blendedRecs, activeTab]);

  return (
    <div className='mx-auto max-w-7xl px-4 pb-20 pt-[calc(var(--header-height-mobile)+2rem)] sm:px-6 md:px-8 lg:px-12'>
      {/* Page Title */}
      <div className='mb-8 text-center sm:text-left'>
        <div className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary'>
          <span>🍿 AniMedia Blend</span>
        </div>
        <h1 className='mt-3 text-3xl font-black tracking-tight text-foreground sm:text-5xl'>
          Watch Together
        </h1>
        <p className='mt-2 text-base text-muted-foreground'>
          Find mutual watchlist overlap, compare tastes, and solve movie night debates.
        </p>
      </div>

      {/* Friend Selector Bar */}
      <div className='mb-10 rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-md sm:p-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
              Watching With:
            </span>
            {friendsList.length === 0 ? (
              <span className='text-sm text-slate-400'>
                You aren&apos;t following anyone yet.{' '}
                <Link href='/users' className='text-primary underline'>
                  Find friends
                </Link>
              </span>
            ) : null}
          </div>

          {friendsList.length > 4 && (
            <div className='relative w-full sm:w-64'>
              <FaSearch
                size={14}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
              />
              <input
                type='text'
                placeholder='Search friends...'
                value={friendSearch}
                onChange={e => setFriendSearch(e.target.value)}
                className='w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs outline-none focus:border-primary'
              />
            </div>
          )}
        </div>

        {/* Horizontal Friend Avatars Carousel */}
        {friendsList.length > 0 && (
          <div className='custom-scrollbar mt-4 flex items-center gap-3 overflow-x-auto pb-2'>
            {filteredFriends.map(friend => {
              const isSelected = friend.id === selectedFriendId;
              return (
                <button
                  key={friend.id}
                  onClick={() => setSelectedFriendId(friend.id)}
                  className={`flex flex-shrink-0 items-center gap-3 rounded-2xl border px-4 py-2.5 transition-all active:scale-95 ${
                    isSelected
                      ? 'border-primary bg-primary/15 shadow-md shadow-primary/10'
                      : 'border-border/70 bg-card hover:border-primary/40 hover:bg-muted/60'
                  }`}
                >
                  <Avatar
                    src={friend.image}
                    size={38}
                    initials={friend.name?.[0]?.toUpperCase() || 'U'}
                    backgroundColor='hsl(var(--primary))'
                  />
                  <div className='text-left'>
                    <div className='text-sm font-bold text-foreground'>
                      {friend.name || 'Friend'}
                    </div>
                    {isSelected && (
                      <span className='text-[11px] font-semibold text-primary'>● Active Blend</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Blend View */}
      {selectedFriend && (
        <>
          {/* Header Compatibility Gauge Card */}
          <div className='relative mb-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card/90 to-background p-6 shadow-xl sm:p-10'>
            {/* Ambient background glow */}
            <div className='pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl' />
            <div className='pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl' />

            <div className='relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row'>
              {/* Avatars Connector */}
              <div className='flex items-center gap-4 sm:gap-6'>
                {/* You */}
                <div className='flex flex-col items-center gap-2'>
                  <div className='rounded-full border-4 border-primary/60 p-1 shadow-lg shadow-primary/20'>
                    <Avatar
                      src={currentUser?.image}
                      size={76}
                      initials={currentUser?.name?.[0]?.toUpperCase() || 'Y'}
                      backgroundColor='hsl(var(--primary))'
                    />
                  </div>
                  <span className='text-sm font-bold'>{currentUser?.name || 'You'}</span>
                </div>

                {/* Animated Heart / Blend Symbol */}
                <div className='flex flex-col items-center justify-center'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary shadow-inner'>
                    <FaHeart size={20} className='animate-pulse text-rose-500' />
                  </div>
                  <span className='mt-1 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground'>
                    Blend
                  </span>
                </div>

                {/* Friend */}
                <div className='flex flex-col items-center gap-2'>
                  <div className='rounded-full border-4 border-purple-500/60 p-1 shadow-lg shadow-purple-500/20'>
                    <Avatar
                      src={selectedFriend.image}
                      size={76}
                      initials={selectedFriend.name?.[0]?.toUpperCase() || 'F'}
                      backgroundColor='#a855f7'
                    />
                  </div>
                  <span className='text-sm font-bold'>{selectedFriend.name || 'Friend'}</span>
                </div>
              </div>

              {/* Match Stats & Roulette Trigger */}
              <div className='flex flex-wrap items-center justify-center gap-6'>
                {/* Taste Match Gauge */}
                {blend && (
                  <div className='flex items-center gap-4 rounded-2xl border border-border/80 bg-background/80 px-5 py-3 shadow-sm'>
                    <div className='relative h-14 w-14'>
                      <RoundProgressBar percentageVal={blend.compatibilityScore} />
                    </div>
                    <div>
                      <div className='text-2xl font-black text-foreground'>
                        {blend.compatibilityScore}%
                      </div>
                      <div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                        Taste Match
                      </div>
                    </div>
                  </div>
                )}

                {/* Spin Roulette Button */}
                <button
                  onClick={() => setIsRouletteOpen(true)}
                  disabled={loading || rouletteCandidates.length === 0}
                  className='flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 font-black text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:from-amber-400 hover:to-orange-400 active:scale-95 disabled:opacity-50'
                >
                  <FaDice size={20} />
                  <span>Spin Movie Roulette</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className='custom-scrollbar mb-8 flex overflow-x-auto border-b border-border'>
            <button
              onClick={() => setActiveTab('mutual')}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
                activeTab === 'mutual'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>🎯 Mutual Watchlist</span>
              {blend && (
                <span className='rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary'>
                  {blend.mutualPlanToWatch?.length || 0}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('friendPicks')}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
                activeTab === 'friendPicks'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>🍿 {selectedFriend.name?.split(' ')[0]}&apos;s Favorites For You</span>
              {blend && (
                <span className='rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400'>
                  {blend.friendPicksForYou?.length || 0}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('yourPicks')}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
                activeTab === 'yourPicks'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>🤝 Your Favorites For Them</span>
              {blend && (
                <span className='rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400'>
                  {blend.yourPicksForFriend?.length || 0}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
                activeTab === 'favorites'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>⭐ Both Loved</span>
              {blend && (
                <span className='rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400'>
                  {blend.mutualFavorites?.length || 0}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('blendedRecs')}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
                activeTab === 'blendedRecs'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>🧠 Fresh For Both</span>
              {blendedRecs.length > 0 && (
                <span className='rounded-full bg-sky-500/20 px-2 py-0.5 text-xs text-sky-400'>
                  {blendedRecs.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content Display */}
          {loading ? (
            <div className='flex h-64 items-center justify-center text-muted-foreground'>
              <span className='animate-pulse text-base'>Calculating your watch blend...</span>
            </div>
          ) : (
            <div>
              {/* 1. Mutual Watchlist */}
              {activeTab === 'mutual' && (
                <div>
                  <div className='mb-6'>
                    <h2 className='text-xl font-bold'>Mutual Plan-to-Watch</h2>
                    <p className='text-sm text-muted-foreground'>
                      Titles both you and {selectedFriend.name} have added to your queues.
                    </p>
                  </div>

                  {!blend?.mutualPlanToWatch || blend.mutualPlanToWatch.length === 0 ? (
                    <div className='flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center'>
                      <p className='text-base font-semibold text-muted-foreground'>
                        No shared Plan-to-Watch titles found.
                      </p>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Add titles to your watchlist, or spin the roulette from fresh
                        recommendations!
                      </p>
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                      {blend.mutualPlanToWatch.map((item: any, idx: number) => (
                        <WatchTogetherMediaCardWrapper
                          key={`${item.mediaType}-${item.id}`}
                          item={item}
                          mediaType={item.mediaType === 'show' ? 'SHOW' : 'MOVIE'}
                          index={idx}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Friend's Picks For You */}
              {activeTab === 'friendPicks' && (
                <div>
                  <div className='mb-6'>
                    <h2 className='text-xl font-bold'>
                      {selectedFriend.name}&apos;s Top Favorites
                    </h2>
                    <p className='text-sm text-muted-foreground'>
                      Masterpieces your friend rated highly that you haven&apos;t watched yet.
                    </p>
                  </div>

                  {!blend?.friendPicksForYou || blend.friendPicksForYou.length === 0 ? (
                    <div className='flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center'>
                      <p className='text-base font-semibold text-muted-foreground'>
                        No unwatched favorites found.
                      </p>
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                      {blend.friendPicksForYou.map((item: any, idx: number) => (
                        <WatchTogetherMediaCardWrapper
                          key={`${item.mediaType}-${item.id}`}
                          item={item}
                          mediaType={item.mediaType === 'show' ? 'SHOW' : 'MOVIE'}
                          index={idx}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Your Picks For Friend */}
              {activeTab === 'yourPicks' && (
                <div>
                  <div className='mb-6'>
                    <h2 className='text-xl font-bold'>Your Top Favorites For Them</h2>
                    <p className='text-sm text-muted-foreground'>
                      Titles you rated 8–10★ that {selectedFriend.name} hasn&apos;t tracked yet.
                    </p>
                  </div>

                  {!blend?.yourPicksForFriend || blend.yourPicksForFriend.length === 0 ? (
                    <div className='flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center'>
                      <p className='text-base font-semibold text-muted-foreground'>
                        No unwatched favorites found from your library.
                      </p>
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                      {blend.yourPicksForFriend.map((item: any, idx: number) => (
                        <WatchTogetherMediaCardWrapper
                          key={`${item.mediaType}-${item.id}`}
                          item={item}
                          mediaType={item.mediaType === 'show' ? 'SHOW' : 'MOVIE'}
                          index={idx}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Mutual Favorites */}
              {activeTab === 'favorites' && (
                <div>
                  <div className='mb-6'>
                    <h2 className='text-xl font-bold'>Common Favorites</h2>
                    <p className='text-sm text-muted-foreground'>
                      Titles you both watched and loved.
                    </p>
                  </div>

                  {!blend?.mutualFavorites || blend.mutualFavorites.length === 0 ? (
                    <div className='flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center'>
                      <p className='text-base font-semibold text-muted-foreground'>
                        No common completed favorites yet.
                      </p>
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                      {blend.mutualFavorites.map((item: any, idx: number) => (
                        <WatchTogetherMediaCardWrapper
                          key={`${item.mediaType}-${item.id}`}
                          item={item}
                          mediaType={item.mediaType === 'show' ? 'SHOW' : 'MOVIE'}
                          index={idx}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. Fresh Recommendations For Both */}
              {activeTab === 'blendedRecs' && (
                <div>
                  <div className='mb-6'>
                    <h2 className='text-xl font-bold'>Blended Joint Discovery</h2>
                    <p className='text-sm text-muted-foreground'>
                      Fresh titles neither of you has tracked, recommended using both of your
                      top-rated seeds!
                    </p>
                  </div>

                  {blendedRecs.length === 0 ? (
                    <div className='flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center'>
                      <p className='text-base font-semibold text-muted-foreground'>
                        No blended recommendations generated yet.
                      </p>
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                      {blendedRecs.map((item: any, idx: number) => (
                        <WatchTogetherMediaCardWrapper
                          key={`${item.mediaType}-${item.id}`}
                          item={item}
                          mediaType={item.mediaType === 'show' ? 'SHOW' : 'MOVIE'}
                          index={idx}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Watch Roulette Modal */}
          <WatchRouletteModal
            isOpen={isRouletteOpen}
            onClose={() => setIsRouletteOpen(false)}
            candidates={rouletteCandidates}
            friendName={selectedFriend.name || 'Friend'}
          />
        </>
      )}
    </div>
  );
}
