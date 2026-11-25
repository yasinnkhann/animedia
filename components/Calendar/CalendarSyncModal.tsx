'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { FaApple, FaGoogle, FaCopy, FaCheck } from 'react-icons/fa6';
import { BsDownload, BsCalendarPlus } from 'react-icons/bs';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
}

export default function CalendarSyncModal({ isOpen, onClose, userId }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://animedia.vercel.app';
  const icsUrl = userId ? `${origin}/api/calendar/${userId}` : `${origin}/api/calendar/demo`;
  const webcalUrl = icsUrl.replace(/^https?:\/\//i, 'webcal://');

  const handleCopy = () => {
    if (!userId) {
      toast.error('Please log in to get your personalized calendar feed.');
      return;
    }
    navigator.clipboard.writeText(webcalUrl);
    setCopied(true);
    toast.success('Calendar feed URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const googleCalUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(
    webcalUrl
  )}`;

  return (
    <AnimatePresence>
      <div className='fixed inset-0 z-[1000] flex items-center justify-center p-4'>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className='fixed inset-0 bg-black/80 backdrop-blur-sm'
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className='relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-card p-6 shadow-2xl'
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <IoMdClose size={20} />
          </button>

          <div className='mb-4 flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary'>
              <BsCalendarPlus size={24} />
            </div>
            <div>
              <h2 className='text-xl font-bold text-foreground'>Sync to Your Calendar</h2>
              <p className='text-xs text-muted-foreground'>
                Never miss a movie, show, or game release date.
              </p>
            </div>
          </div>

          {!userId ? (
            <div className='mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200'>
              Please sign in to generate your unique, auto-updating release calendar feed.
            </div>
          ) : (
            <div className='space-y-4'>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                Subscribe once to your private live feed. Any time you add a planned movie, TV show,
                or game with a release date, it will automatically appear in your native calendar.
              </p>

              {/* Feed URL Box */}
              <div className='flex items-center gap-2 rounded-xl border border-border bg-background/60 p-2 pl-3'>
                <input
                  type='text'
                  readOnly
                  value={webcalUrl}
                  className='w-full bg-transparent text-xs text-muted-foreground focus:outline-none'
                />
                <button
                  onClick={handleCopy}
                  className='text-primary-foreground flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold transition-all hover:bg-primary/90'
                >
                  {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Quick Subscribe Buttons */}
              <div className='grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2'>
                <a
                  href={webcalUrl}
                  className='flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10'
                >
                  <FaApple size={18} />
                  <span>Apple Calendar</span>
                </a>

                <a
                  href={googleCalUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10'
                >
                  <FaGoogle size={16} />
                  <span>Google Calendar</span>
                </a>
              </div>

              {/* Direct .ics download */}
              <div className='flex justify-center pt-2'>
                <a
                  href={icsUrl}
                  download='animedia-releases.ics'
                  className='flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary'
                >
                  <BsDownload size={13} />
                  <span>Download .ics file directly</span>
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
