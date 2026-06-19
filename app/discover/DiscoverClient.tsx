'use client';

import React, { useState } from 'react';
import { recommendMedia } from '@/app/actions/ai';
import { useUserMedia } from '@/components/UserMediaProvider';
import HomeCard from '@/components/HorizontalScroller/Home/HomeCard';
import { BaseHorizontalScroller } from '@/components/HorizontalScroller/BaseHorizontalScroller';
import { FaRobot, FaSearch, FaFilm, FaTv, FaGamepad } from 'react-icons/fa';

export default function DiscoverClient() {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState<'MOVIE' | 'SHOW' | 'GAME'>('MOVIE');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ type: string; data: any }>>([]);
  const { userMovies, userShows, userGames } = useUserMedia();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const recommendations = await recommendMedia(prompt, mediaType);
      setResults(recommendations);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      alert('Ensure you have set the GROQ_API_KEY environment variable.');
    } finally {
      setLoading(false);
    }
  };

  const getMatchedMedias = (type: string) => {
    if (type === 'MOVIE') return userMovies ?? [];
    if (type === 'SHOW') return userShows ?? [];
    if (type === 'GAME') return userGames ?? [];
    return [];
  };

  return (
    <div className='w-full'>
      <div className='mb-8 flex justify-center space-x-4'>
        <button
          onClick={() => setMediaType('MOVIE')}
          className={`flex items-center space-x-2 rounded-full px-6 py-3 font-semibold transition-all ${
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
          className={`flex items-center space-x-2 rounded-full px-6 py-3 font-semibold transition-all ${
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
          className={`flex items-center space-x-2 rounded-full px-6 py-3 font-semibold transition-all ${
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
            className='relative w-full rounded-full border border-gray-700 bg-slate-900 px-8 py-6 pl-14 text-lg text-white shadow-2xl placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
            disabled={loading}
          />
          <FaRobot className='absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-blue-500' />
          <button
            type='submit'
            disabled={loading || !prompt.trim()}
            className='absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:bg-gray-700'
          >
            {loading ? (
              <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
            ) : (
              <FaSearch />
            )}
          </button>
        </div>
      </form>

      {loading && (
        <div className='flex flex-col items-center justify-center space-y-4 py-20 opacity-70'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
          <p className='animate-pulse text-lg font-medium text-blue-400'>
            Consulting the AI Oracle...
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className='mx-auto max-w-full overflow-hidden text-left'>
          <BaseHorizontalScroller
            items={results}
            keyExtractor={item => String(item.data.id)}
            renderItem={(item, idx, dragging) => (
              <div className='px-2'>
                <HomeCard
                  item={{ ...item.data, mediaType: item.type.toLowerCase() }}
                  dragging={dragging}
                  userMatchedMedias={getMatchedMedias(item.type) as any}
                  itemId={String(item.data.id)}
                />
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}
