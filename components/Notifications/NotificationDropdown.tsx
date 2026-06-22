'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiBell } from 'react-icons/bi';
import Link from 'next/link';
import Avatar from '../ui/Avatar';
import Image from 'next/image';
import { CommonMethods } from '@/utils/CommonMethods';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const doFetch = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok && mounted) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    // Defer the initial fetch to avoid synchronous state update in effect
    const timeoutId = setTimeout(doFetch, 0);
    const interval = setInterval(doFetch, 60000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, []);

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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (notification: any) => {
    setIsOpen(false);
    if (!notification.isRead) {
      try {
        await fetch(`/api/notifications/${notification.id}`, { method: 'PATCH' });
        setNotifications(prev =>
          prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
        );
      } catch (error) {
        console.error('Error marking notification read:', error);
      }
    }
  };

  const getMediaUrl = (type: string, id: string) => {
    const mediaTypeMap: Record<string, string> = {
      MOVIE: 'movie',
      SHOW: 'show',
      GAME: 'game',
    };
    return `/${mediaTypeMap[type] || 'movie'}/${id}-redirect`; // We need to handle this simple route or just use the id-name formatting
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
                notifications.map(notification => (
                  <Link
                    key={notification.id}
                    href={getMediaUrl(notification.mediaType, notification.mediaId)}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex items-start gap-4 border-b border-border p-4 transition-colors hover:bg-muted ${
                      !notification.isRead ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className='shrink-0'>
                      <Avatar
                        src={notification.sender?.image}
                        initials={notification.sender?.name?.charAt(0).toUpperCase()}
                        size={40}
                      />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm text-foreground'>
                        <span className='font-semibold'>{notification.sender?.name}</span> thinks
                        you should check out{' '}
                        <span className='font-semibold'>{notification.mediaTitle}</span>!
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
