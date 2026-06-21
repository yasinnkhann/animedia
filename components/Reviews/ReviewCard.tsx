import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';
import { BiTrash } from 'react-icons/bi';

export interface Review {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  content: string;
  rating: number | null;
  createdAt: string;
}

interface Props {
  review: Review;
  currentUserId?: string;
  onDelete: (id: string) => void;
}

export default function ReviewCard({ review, currentUserId, onDelete }: Props) {
  const isAuthor = currentUserId === review.userId;

  return (
    <div className='flex gap-4 rounded-2xl border border-border bg-card p-5'>
      <Link href={`/user/${review.user.id}`} className='shrink-0'>
        <Avatar
          src={review.user.image}
          size={50}
          initials={review.user.name?.[0]?.toUpperCase()}
          backgroundColor='hsl(var(--primary))'
        />
      </Link>

      <div className='flex flex-1 flex-col gap-2'>
        <div className='flex items-start justify-between'>
          <div className='flex flex-col'>
            <Link
              href={`/user/${review.user.id}`}
              className='font-bold transition-colors hover:text-primary'
            >
              {review.user.name}
            </Link>
            <div className='mt-0.5 flex items-center gap-2 text-xs text-muted-foreground'>
              <span>
                {new Date(review.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {review.rating !== null && (
                <>
                  <span>•</span>
                  <span className='font-bold text-primary'>⭐ {review.rating}/10</span>
                </>
              )}
            </div>
          </div>

          {isAuthor && (
            <button
              onClick={() => onDelete(review.id)}
              className='p-1 text-muted-foreground transition-colors hover:text-red-500'
              title='Delete your review'
            >
              <BiTrash size={18} />
            </button>
          )}
        </div>

        <p className='mt-1 whitespace-pre-wrap text-sm leading-relaxed'>{review.content}</p>
      </div>
    </div>
  );
}
