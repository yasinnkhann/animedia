'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { BiBell } from 'react-icons/bi';
import Link from 'next/link';
import Avatar from '../ui/Avatar';
import Image from 'next/image';
import { CommonMethods } from '@/utils/CommonMethods';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to load notifications');
      return res.json();
    },
    refetchInterval: 60000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to mark as read');
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData(['notifications']);
      queryClient.setQueryData(['notifications'], (old: any[]) =>
        old ? old.map(n => (n.id === id ? { ...n, isRead: true } : n)) : []
      );
      return { previousNotifications };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['notifications'], context?.previousNotifications);
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleNotificationClick = (notification: any) => {
    setIsOpen(false);
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  const getMediaUrl = (notification: any) => {
    if (notification.type === 'COLLECTION_INVITE') return `/collection/${notification.mediaId}`;
    if (notification.type === 'FOLLOW') return `/profile/${notification.mediaId}`;
    const mediaTypeMap: Record<string, string> = {
      MOVIE: 'movie',
      SHOW: 'show',
      GAME: 'game',
    };
    return `/${mediaTypeMap[notification.mediaType] || 'movie'}/${notification.mediaId}-redirect`;
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-foreground transition-colors hover:bg-muted focus:outline-none'
      >
        <BiBell size={22} />
        {unreadCount > 0 && (
          <span className='absolute right-2 top-2 flex h-2 w-2 items-center justify-center rounded-full bg-red-500'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75'></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-2xl backdrop-blur-md sm:w-96'
          >
            <div className='border-b border-border bg-muted/50 p-4'>
              <h3 className='font-bold text-foreground'>Notifications</h3>
            </div>
            <div className='max-h-[400px] overflow-y-auto'>
              {notifications.length === 0 ? (
                <div className='p-6 text-center text-sm text-muted-foreground'>
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notification: any) => (
                  <Link
                    key={notification.id}
                    href={getMediaUrl(notification)}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex items-start gap-4 border-b border-border p-4 transition-colors hover:bg-muted ${
                      !notification.isRead ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className='shrink-0'>
                      <Avatar
                        src={
                          notification.type === 'RELEASE_ALERT'
                            ? notification.mediaImage
                            : notification.sender?.image
                        }
                        initials={
                          notification.type === 'RELEASE_ALERT'
                            ? notification.mediaTitle?.charAt(0).toUpperCase()
                            : notification.sender?.name?.charAt(0).toUpperCase()
                        }
                        size={40}
                      />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm text-foreground'>
                        {notification.type === 'COLLECTION_INVITE' ? (
                          <>
                            <span className='font-semibold'>{notification.sender?.name}</span>{' '}
                            invited you to collaborate on their collection!
                          </>
                        ) : notification.type === 'FOLLOW' ? (
                          <>
                            <span className='font-semibold'>{notification.sender?.name}</span>{' '}
                            started following you.
                          </>
                        ) : notification.type === 'ACTIVITY_LIKE' ? (
                          <>
                            <span className='font-semibold'>{notification.sender?.name}</span> liked
                            your activity about{' '}
                            <span className='font-semibold'>{notification.mediaTitle}</span>.
                          </>
                        ) : notification.type === 'ACTIVITY_COMMENT' ? (
                          <>
                            <span className='font-semibold'>{notification.sender?.name}</span>{' '}
                            commented on your activity: &quot;
                            <span className='italic'>{notification.message}</span>&quot;
                          </>
                        ) : notification.type === 'RELEASE_ALERT' ? (
                          <>
                            🎉 <span className='font-semibold'>{notification.mediaTitle}</span>{' '}
                            releases today! Time to dive in.
                          </>
                        ) : (
                          <>
                            <span className='font-semibold'>{notification.sender?.name}</span>{' '}
                            thinks you should check out{' '}
                            <span className='font-semibold'>{notification.mediaTitle}</span>!
                          </>
                        )}
                      </p>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {CommonMethods.formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {notification.mediaImage && (
                      <div className='shrink-0 overflow-hidden rounded'>
                        <Image
                          src={notification.mediaImage}
                          alt={notification.mediaTitle || 'Media'}
                          width={40}
                          height={60}
                          className='object-cover'
                        />
                      </div>
                    )}
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
