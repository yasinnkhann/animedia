'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RxCross1 } from 'react-icons/rx';
import Avatar from '../ui/Avatar';

interface RecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId: string;
  mediaType: 'MOVIE' | 'SHOW' | 'GAME';
  mediaTitle: string;
  mediaImage: string | null;
}

export default function RecommendModal({
  isOpen,
  onClose,
  mediaId,
  mediaType,
  mediaTitle,
  mediaImage,
}: RecommendModalProps) {
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/following');
      if (res.ok) {
        const data = await res.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen) {
      timeoutId = setTimeout(() => {
        fetchFriends();
      }, 0);
    } else {
      timeoutId = setTimeout(() => {
        setSuccess(false);
        setSelectedFriends([]);
      }, 0);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  const toggleFriend = (id: string) => {
    setSelectedFriends(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (selectedFriends.length === 0) return;
    setIsSending(true);

    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientIds: selectedFriends,
          type: 'RECOMMENDATION',
          mediaId,
          mediaType,
          mediaTitle,
          mediaImage,
          message: `I think you should check out ${mediaTitle}!`,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => onClose(), 2000);
      }
    } catch (error) {
      console.error('Error sending recommendation:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className='relative w-[90%] max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl'
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className='absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground'
          >
            <RxCross1 size={20} />
          </button>

          <h2 className='mb-2 text-xl font-bold'>Recommend to a Friend</h2>
          <p className='mb-6 text-sm text-muted-foreground'>
            Select friends to recommend <strong>{mediaTitle}</strong> to.
          </p>

          {success ? (
            <div className='flex flex-col items-center justify-center py-10'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-500'>
                <svg
                  className='h-8 w-8'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <p className='text-lg font-medium text-green-500'>Sent successfully!</p>
            </div>
          ) : (
            <>
              <div className='max-h-60 overflow-y-auto pr-2'>
                {isLoading ? (
                  <p className='text-center text-muted-foreground'>Loading friends...</p>
                ) : friends.length === 0 ? (
                  <p className='text-center text-muted-foreground'>
                    You aren&apos;t following anyone yet. Find some friends to recommend this to!
                  </p>
                ) : (
                  <div className='flex flex-col gap-2'>
                    {friends.map(friend => (
                      <div
                        key={friend.id}
                        className={`flex cursor-pointer items-center justify-between rounded-xl p-3 transition-colors ${
                          selectedFriends.includes(friend.id)
                            ? 'border border-primary bg-primary/20'
                            : 'hover:bg-card-hover border border-transparent bg-background'
                        }`}
                        onClick={() => toggleFriend(friend.id)}
                      >
                        <div className='flex items-center gap-3'>
                          <Avatar
                            src={friend.image}
                            initials={friend.name?.charAt(0).toUpperCase()}
                          />
                          <span className='font-medium'>{friend.name}</span>
                        </div>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            selectedFriends.includes(friend.id)
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}
                        >
                          {selectedFriends.includes(friend.id) && (
                            <svg
                              className='h-3 w-3 text-white'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={3}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='mt-6 flex justify-end gap-3'>
                <button
                  onClick={onClose}
                  className='rounded-lg px-4 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={selectedFriends.length === 0 || isSending}
                  className='text-primary-foreground rounded-lg bg-primary px-6 py-2 font-medium shadow-lg transition-all hover:bg-primary/90 disabled:opacity-50'
                >
                  {isSending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
