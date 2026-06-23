'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { BiHeart, BiSolidHeart, BiMessageRounded } from 'react-icons/bi';
import Avatar from '@/components/ui/Avatar';
import { CommonMethods } from '@/utils/CommonMethods';

interface Props {
  activityId: string;
  initialLikes: { userId: string }[];
  initialCommentCount: number;
}

export default function ActivityInteractions({
  activityId,
  initialLikes,
  initialCommentCount,
}: Props) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [likes, setLikes] = useState(initialLikes);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isLiked, setIsLiked] = useState(
    userId ? initialLikes.some(l => l.userId === userId) : false
  );
  const [isLiking, setIsLiking] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    if (!userId || isLiking) return;
    setIsLiking(true);

    // Optimistic update
    const previousIsLiked = isLiked;
    setIsLiked(!isLiked);
    if (!previousIsLiked) {
      setLikes([...likes, { userId }]);
    } else {
      setLikes(likes.filter(l => l.userId !== userId));
    }

    try {
      const res = await fetch(`/api/activity/${activityId}/like`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to toggle like');
    } catch (err) {
      // Revert on error
      setIsLiked(previousIsLiked);
      if (previousIsLiked) {
        if (!likes.find(l => l.userId === userId)) setLikes([...likes, { userId }]);
      } else {
        setLikes(likes.filter(l => l.userId !== userId));
      }
    } finally {
      setIsLiking(false);
    }
  };

  const toggleComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);
    if (comments.length === 0) {
      setIsLoadingComments(true);
      try {
        const res = await fetch(`/api/activity/${activityId}/comment`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments);
          setCommentCount(data.comments.length);
        }
      } catch (err) {
        console.error('Failed to load comments', err);
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/activity/${activityId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments([...comments, data.comment]);
        setCommentCount(prev => prev + 1);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='mt-3 flex flex-col gap-2'>
      <div className='flex items-center gap-4 text-muted-foreground'>
        <button
          onClick={handleLike}
          disabled={!userId || isLiking}
          className={`flex items-center gap-1.5 transition-colors hover:text-red-500 ${
            isLiked ? 'text-red-500' : ''
          }`}
        >
          {isLiked ? <BiSolidHeart size={18} /> : <BiHeart size={18} />}
          <span className='text-sm font-medium'>{likes.length}</span>
        </button>

        <button
          onClick={toggleComments}
          className='flex items-center gap-1.5 transition-colors hover:text-primary'
        >
          <BiMessageRounded size={18} />
          <span className='text-sm font-medium'>{commentCount}</span>
        </button>
      </div>

      {showComments && (
        <div className='animate-in fade-in slide-in-from-top-2 mt-2'>
          <div className='space-y-4 rounded-xl border border-border bg-card/40 p-4'>
            {isLoadingComments ? (
              <div className='flex justify-center py-4'>
                <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
              </div>
            ) : comments.length === 0 ? (
              <p className='text-center text-sm text-muted-foreground'>
                No comments yet. Be the first to reply!
              </p>
            ) : (
              <div className='space-y-4'>
                {comments.map(comment => (
                  <div key={comment.id} className='flex gap-3'>
                    <Avatar
                      src={comment.user.image}
                      initials={comment.user.name?.charAt(0).toUpperCase()}
                      size={32}
                    />
                    <div className='flex-1 rounded-lg bg-muted/50 px-3 py-2'>
                      <div className='flex items-center justify-between gap-2'>
                        <span className='text-sm font-semibold'>{comment.user.name}</span>
                        <span className='text-xs text-muted-foreground'>
                          {CommonMethods.formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className='mt-1 text-sm text-foreground'>{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {userId && (
              <form onSubmit={submitComment} className='mt-4 flex gap-2'>
                <input
                  type='text'
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder='Add a comment...'
                  className='flex-1 rounded-full border border-border bg-transparent px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                  disabled={isSubmitting}
                />
                <button
                  type='submit'
                  disabled={!newComment.trim() || isSubmitting}
                  className='text-primary-foreground rounded-full bg-primary px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50'
                >
                  Post
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
