import { Metadata } from 'next';
import DiscoverClient from './DiscoverClient';
import PageAnimationWrapper from '@/components/PageAnimationWrapper';

export const metadata: Metadata = {
  title: 'AI Discover | AniMedia',
  description:
    'Use Google Gemini to discover new movies, shows, and games based on natural language prompts.',
};

export default function DiscoverPage() {
  return (
    <PageAnimationWrapper className='mt-[calc(var(--header-height-mobile)+1rem)] px-16 pb-32'>
      <div className='mx-auto max-w-4xl text-center'>
        <h1 className='mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent'>
          AI Discover
        </h1>
        <p className='mb-12 text-lg text-gray-400'>
          Tell us exactly what you&apos;re in the mood for. Our AI will search TMDB and IGDB to find
          the perfect match.
        </p>

        <DiscoverClient />
      </div>
    </PageAnimationWrapper>
  );
}
