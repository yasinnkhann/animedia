'use client';

import { useState } from 'react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';

export interface Friend {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Props {
  followers: Friend[];
  following: Friend[];
}

export default function FriendsClient({ followers, following }: Props) {
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');

  const activeList = activeTab === 'following' ? following : followers;

  return (
    <div className='mx-auto max-w-6xl px-4 py-8 pt-[calc(var(--header-height-mobile)+2.5rem)] sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24'>
      <h1 className='mb-10 text-4xl font-bold'>My Friends</h1>

      {/* Tabs */}
      <div className='mb-8 flex gap-12 border-b border-border'>
        <button
          onClick={() => setActiveTab('following')}
          className={`relative pb-3 text-lg font-medium transition-colors ${
            activeTab === 'following'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Following ({following.length})
          {activeTab === 'following' && (
            <motion.div
              layoutId='friendsTabIndicator'
              className='absolute bottom-0 left-0 h-0.5 w-full bg-primary'
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('followers')}
          className={`relative pb-3 text-lg font-medium transition-colors ${
            activeTab === 'followers'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Followers ({followers.length})
          {activeTab === 'followers' && (
            <motion.div
              layoutId='friendsTabIndicator'
              className='absolute bottom-0 left-0 h-0.5 w-full bg-primary'
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Content */}
      <div className='min-h-[400px]'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeList.length === 0 ? (
              <div className='flex h-40 items-center justify-center rounded-xl border border-dashed border-border bg-card/50'>
                <p className='text-lg text-muted-foreground'>
                  {activeTab === 'following'
                    ? "You aren't following anyone yet."
                    : "You don't have any followers yet."}
                </p>
              </div>
            ) : (
              <ul className='grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
                {activeList.map(user => (
                  <li
                    key={user.id}
                    className='group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md'
                  >
                    <Link
                      href={`/user/${user.id}`}
                      className='flex items-center gap-6 text-inherit no-underline'
                    >
                      <Avatar
                        src={user.image}
                        size={80}
                        initials={user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                        backgroundColor='hsl(var(--primary))'
                      />
                      <div className='flex flex-1 flex-col justify-center gap-1 overflow-hidden'>
                        <span className='truncate text-2xl font-bold transition-colors group-hover:text-primary'>
                          {user.name || 'Anonymous User'}
                        </span>
                        <span className='truncate text-base text-muted-foreground'>
                          {user.email}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
