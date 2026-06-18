'use client';

import React, { useState } from 'react';
import { recommendMedia } from '@/app/actions/ai';
import { useUserMedia } from '@/components/UserMediaProvider';
import HomeCard from '@/components/HorizontalScroller/Home/HomeCard';
import { FaRobot, FaSearch } from 'react-icons/fa';

export default function DiscoverClient() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ type: string; data: any }>>([]);
  const { userMovies, userShows, userGames } = useUserMedia();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const recommendations = await recommendMedia(prompt);
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
        <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {results.map((item, idx) => (
            <div key={`${item.data.id}-${idx}`} className='flex flex-col items-center'>
              <div className='mb-2 text-xs font-bold uppercase tracking-widest text-blue-400'>
                {item.type}
              </div>
              <HomeCard
                item={item.data}
                dragging={false}
                userMatchedMedias={getMatchedMedias(item.type) as any}
                itemId={String(item.data.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
