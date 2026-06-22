'use client';

import { useState } from 'react';
import { BiUserPlus, BiX } from 'react-icons/bi';
import Avatar from '@/components/ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';

interface Friend {
  id: string;
  name: string;
  image: string | null;
}

export default function InviteCollaboratorsButton({ collectionId }: { collectionId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/following');
      if (res.ok) {
        const data = await res.json();
        setFriends(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchFriends();
  };

  const sendInvite = async (friendId: string) => {
    setSendingId(friendId);
    try {
      await fetch(`/api/collections/${collectionId}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: friendId }),
      });

      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'COLLECTION_INVITE',
          recipientIds: [friendId],
          mediaId: collectionId,
          mediaTitle: 'a collection',
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSendingId(null);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className='flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20'
      >
        <BiUserPlus size={20} />
        Invite
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl'
            >
              <div className='flex items-center justify-between border-b border-border p-4'>
                <h3 className='text-lg font-bold'>Invite Collaborators</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className='rounded-full p-1 transition-colors hover:bg-muted'
                >
                  <BiX size={24} />
                </button>
              </div>

              <div className='max-h-96 overflow-y-auto p-4'>
                {loading ? (
                  <div className='flex justify-center p-8'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
                  </div>
                ) : friends.length === 0 ? (
                  <div className='py-8 text-center text-muted-foreground'>
                    You aren&apos;t following anyone yet.
                  </div>
                ) : (
                  <div className='space-y-2'>
                    {friends.map(friend => (
                      <div
                        key={friend.id}
                        className='flex items-center justify-between rounded-xl border border-transparent p-3 transition-colors hover:bg-muted'
                      >
                        <div className='flex items-center gap-3'>
                          <Avatar
                            src={friend.image}
                            initials={friend.name?.charAt(0).toUpperCase()}
                          />
                          <span className='font-medium'>{friend.name}</span>
                        </div>
                        <button
                          onClick={() => sendInvite(friend.id)}
                          disabled={sendingId === friend.id}
                          className='text-primary-foreground rounded-lg bg-primary px-4 py-1.5 text-sm font-medium disabled:opacity-50'
                        >
                          {sendingId === friend.id ? 'Sending...' : 'Invite'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
