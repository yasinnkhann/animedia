'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { MediaType } from '@prisma/client';
import ReviewCard, { Review } from './ReviewCard';
import ReviewComposer from './ReviewComposer';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { BsStars } from 'react-icons/bs';

interface Props {
  mediaType: MediaType;
  mediaId: string;
  mediaTitle: string;
  mediaImage: string | null;
  currentRating?: number | null;
}

export default function ReviewSection({
  mediaType,
  mediaId,
  mediaTitle,
  mediaImage,
  currentRating,
}: Props) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const queryClient = useQueryClient();
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [hasSummarized, setHasSummarized] = useState(false);

  const { data: reviews = [], isLoading: loading } = useQuery({
    queryKey: ['reviews', mediaType, mediaId],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?mediaType=${mediaType}&mediaId=${mediaId}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      return data.reviews as Review[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete review');
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(['reviews', mediaType, mediaId], (old: Review[]) =>
        old ? old.filter(r => r.id !== id) : []
      );
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleReviewSubmitted = (review: Review) => {
    queryClient.setQueryData(['reviews', mediaType, mediaId], (old: Review[]) =>
      old ? [review, ...old] : [review]
    );
  };

  const userHasReviewed = reviews.some(r => r.userId === currentUserId);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary('');
    setHasSummarized(true);

    try {
      const response = await fetch('/api/summarize-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaTitle,
          reviews: reviews.map(r => r.content),
        }),
      });

      if (!response.ok) throw new Error('Failed to summarize');
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        setSummary(prev => prev + text);
      }
    } catch (err) {
      console.error('Error summarizing reviews:', err);
      setSummary('Failed to generate summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className='flex w-full max-w-4xl flex-col gap-6'>
      <div className='flex items-center gap-2'>
        <BiMessageSquareDetail size={24} className='text-primary' />
        <h2 className='text-2xl font-bold'>Community Reviews</h2>
      </div>

      {currentUserId && !userHasReviewed && (
        <ReviewComposer
          mediaType={mediaType}
          mediaId={mediaId}
          mediaTitle={mediaTitle}
          mediaImage={mediaImage}
          currentRating={currentRating ?? null}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {loading ? (
        <div className='flex items-center justify-center py-10'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-border bg-card/50 py-12 text-center'>
          <p className='text-muted-foreground'>
            No reviews yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {reviews.length >= 2 && !hasSummarized && (
            <div className='flex justify-end'>
              <button
                onClick={handleSummarize}
                className='flex items-center gap-2 rounded-lg bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-600/30'
              >
                <BsStars />
                Summarize Reviews with AI
              </button>
            </div>
          )}

          {hasSummarized && (
            <div
              className={`mx-auto mb-4 w-full overflow-hidden text-left transition-all duration-700 ease-in-out ${
                isSummarizing
                  ? 'rounded-2xl px-6 py-6 shadow-[0_0_80px_-20px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400/30'
                  : 'rounded-2xl border border-cyan-900/50 bg-cyan-950/10 px-6 py-6'
              }`}
            >
              <div className='mb-4 flex items-center gap-2 text-cyan-400'>
                <BsStars
                  size={20}
                  className={
                    isSummarizing ? 'animate-spin shadow-[0_0_10px_rgba(6,182,212,0.8)]' : ''
                  }
                />
                <h3
                  className={`font-semibold ${isSummarizing ? 'animate-pulse drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : ''}`}
                >
                  AI Community Consensus
                </h3>
              </div>
              <p className='leading-relaxed text-slate-800 dark:text-slate-200'>
                {summary}
                {isSummarizing && (
                  <span className='animate-pulse text-cyan-500 dark:text-cyan-400'>...</span>
                )}
              </p>
            </div>
          )}

          {reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
