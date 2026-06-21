'use client';

import { useState } from 'react';
import { MediaType } from '@prisma/client';

interface Props {
  mediaType: MediaType;
  mediaId: string;
  mediaTitle: string;
  mediaImage: string | null;
  currentRating: number | null;
  onReviewSubmitted: (review: any) => void;
}

export default function ReviewComposer({
  mediaType,
  mediaId,
  mediaTitle,
  mediaImage,
  currentRating,
  onReviewSubmitted,
}: Props) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType,
          mediaId,
          mediaTitle,
          mediaImage,
          content,
          rating: currentRating,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      onReviewSubmitted(data.review);
      setContent('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-border bg-card p-5'>
      <h3 className='text-lg font-bold'>Write a Review</h3>
      {error && <p className='text-sm font-semibold text-red-500'>{error}</p>}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder='What did you think?'
        className='min-h-[120px] w-full resize-none rounded-xl border border-border bg-background p-4 text-sm focus:border-primary focus:outline-none'
      />
      <div className='flex justify-end'>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className='rounded-full bg-primary px-6 py-2 text-sm font-bold text-white transition-all hover:bg-primary/90 disabled:opacity-50'
        >
          {isSubmitting ? 'Posting...' : 'Post Review'}
        </button>
      </div>
    </div>
  );
}
