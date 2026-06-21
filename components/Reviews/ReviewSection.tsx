'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { MediaType } from '@prisma/client';
import ReviewCard, { Review } from './ReviewCard';
import ReviewComposer from './ReviewComposer';
import { BiMessageSquareDetail } from 'react-icons/bi';

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

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?mediaType=${mediaType}&mediaId=${mediaId}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [mediaType, mediaId]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete review');
    }
  };

  const handleReviewSubmitted = (review: Review) => {
    setReviews([review, ...reviews]);
  };

  const userHasReviewed = reviews.some(r => r.userId === currentUserId);

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
