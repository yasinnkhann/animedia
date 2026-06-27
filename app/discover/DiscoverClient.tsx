'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useUserMedia } from '@/components/UserMediaProvider';
import MediaCard from '@/components/MediaCard/MediaCard';
import { CommonMethods } from '@/utils/CommonMethods';
import { BaseHorizontalScroller } from '@/components/HorizontalScroller/BaseHorizontalScroller';
import { FaRobot, FaSearch, FaFilm, FaTv, FaGamepad } from 'react-icons/fa';

export default function DiscoverClient() {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState<'MOVIE' | 'SHOW' | 'GAME'>('MOVIE');
  const [results, setResults] = useState<Array<{ type: string; data: any }>>([]);
  const { userMovies, userShows, userGames } = useUserMedia();

  const discoverMutation = useMutation({
    mutationFn: async ({ isMore = false }: { isMore?: boolean } = {}) => {
      const excludedTitles = isMore
        ? results.map(r => r.data.name || r.data.title).filter(Boolean)
        : undefined;

      const response = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mediaType, excludedTitles }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      if (!response.body) throw new Error('No readable stream returned');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const recommendation = JSON.parse(line);
              setResults(prev => {
                if (prev.some(r => r.data.id === recommendation.data.id)) return prev;
                return [...prev, recommendation];
              });
            } catch (e) {
              console.error('Failed to parse line:', line);
            }
          }
        }
      }
    },
    onError: (error: any) => {
      console.error('Failed to fetch recommendations:', error);
      alert(error?.message || 'An error occurred fetching recommendations.');
    },
  });

  const loading = discoverMutation.isPending && !discoverMutation.variables?.isMore;
  const loadingMore = discoverMutation.isPending && discoverMutation.variables?.isMore;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || discoverMutation.isPending) return;
    setResults([]);
    discoverMutation.mutate({ isMore: false });
  };

  const handleGenerateMore = () => {
    if (!prompt.trim() || discoverMutation.isPending) return;
    discoverMutation.mutate({ isMore: true });
  };

  const getMatchedMedias = (type: string) => {
    if (type === 'MOVIE') return userMovies ?? [];
    if (type === 'SHOW') return userShows ?? [];
    if (type === 'GAME') return userGames ?? [];
    return [];
  };

  return (
    <div className='w-full'>
      <div className='mb-8 flex flex-wrap justify-center gap-3 sm:gap-4'>
        <button
          onClick={() => setMediaType('MOVIE')}
          className={`flex items-center space-x-2 rounded-full px-6 py-3 font-semibold transition-all active:scale-95 ${
            mediaType === 'MOVIE'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <FaFilm />
          <span>Movies</span>
        </button>
        <button
          onClick={() => setMediaType('SHOW')}
          className={`flex items-center space-x-2 rounded-full px-6 py-3 font-semibold transition-all active:scale-95 ${
            mediaType === 'SHOW'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <FaTv />
          <span>Shows</span>
        </button>
        <button
          onClick={() => setMediaType('GAME')}
          className={`flex items-center space-x-2 rounded-full px-6 py-3 font-semibold transition-all active:scale-95 ${
            mediaType === 'GAME'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/50'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <FaGamepad />
          <span>Games</span>
        </button>
      </div>

      <form onSubmit={handleSearch} className='relative mx-auto mb-16 max-w-2xl'>
        <div className='group relative'>
          <div className='absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-25 blur transition duration-1000 group-hover:opacity-75 group-hover:duration-200' />
          <input
            type='text'
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder='e.g., A dark fantasy anime similar to Berserk but with more magic...'
            className='relative w-full text-ellipsis rounded-full border border-gray-700 bg-slate-900 py-6 pl-14 pr-20 text-lg text-white shadow-2xl placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
            disabled={loading}
          />
          <FaRobot className='absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-blue-500' />
          <button
            type='submit'
            disabled={loading || !prompt.trim()}
            className='absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-500 active:scale-95 disabled:bg-gray-700'
          >
            {loading ? (
              <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
            ) : (
              <FaSearch />
            )}
          </button>
        </div>
      </form>

      {loading && results.length === 0 && (
        <div className='flex flex-col items-center justify-center space-y-4 py-20 opacity-70'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
          <p className='animate-pulse text-lg font-medium text-blue-400'>
            Consulting the AI Oracle...
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div
          className={`mx-auto max-w-full overflow-hidden text-left transition-all duration-700 ease-in-out ${
            loading || loadingMore
              ? 'rounded-2xl py-6 shadow-[0_0_80px_-20px_rgba(59,130,246,0.4)] ring-1 ring-blue-400/30'
              : 'py-2'
          }`}
        >
          {(loading || loadingMore) && (
            <div className='mb-6 flex items-center justify-center space-x-3 text-center font-medium tracking-wide text-blue-400'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent shadow-[0_0_10px_rgba(59,130,246,0.8)]' />
              <span className='animate-pulse drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'>
                AI is streaming your customized recommendations...
              </span>
            </div>
          )}
          <BaseHorizontalScroller
            items={results}
            keyExtractor={item => String(item.data.id)}
            renderItem={(item, idx, dragging) => (
              <div className='px-2'>
                <MediaCard
                  item={{ ...item.data, mediaType: item.type.toLowerCase() }}
                  dragging={dragging}
                  variant='fixed'
                  index={idx}
                  userStatus={CommonMethods.getUserStatusFromMedia(
                    getMatchedMedias(item.type) as any,
                    item.data
                  )}
                />
              </div>
            )}
          />

          <div className='mt-8 flex justify-center pb-8'>
            <button
              onClick={handleGenerateMore}
              disabled={loading || loadingMore}
              className='flex items-center space-x-2 rounded-full bg-slate-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-50'
            >
              {loadingMore ? (
                <>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                  <span>Loading more...</span>
                </>
              ) : (
                <>
                  <FaRobot />
                  <span>Generate More</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
