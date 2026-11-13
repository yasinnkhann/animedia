'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { BiCopy, BiCheck, BiDownload, BiShareAlt, BiUserCheck } from 'react-icons/bi';
import { FaXTwitter } from 'react-icons/fa6';
import { FaWhatsapp, FaRedditAlien } from 'react-icons/fa';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'MOVIE' | 'SHOW' | 'GAME' | 'COLLECTION' | 'PROFILE';
  ogImageUrl: string;
  url?: string;
  onOpenRecommend?: () => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  type,
  ogImageUrl,
  url,
  onOpenRecommend,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasNativeShare] = useState(
    () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  );

  const shareUrl =
    url || (typeof window !== 'undefined' ? window.location.href : 'https://animedia.app');

  const shareText =
    type === 'PROFILE'
      ? `Check out ${title}'s media profile on AniMedia!`
      : type === 'COLLECTION'
        ? `Check out the "${title}" collection on AniMedia!`
        : `Check out ${title} on AniMedia!`;

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyLink = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }, [shareUrl]);

  const handleDownload = useCallback(async () => {
    try {
      setIsDownloading(true);
      const res = await fetch(ogImageUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      const sanitized = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      a.download = `animedia-${sanitized}-card.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Failed to download OG image:', err);
    } finally {
      setIsDownloading(false);
    }
  }, [ogImageUrl, title]);

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title,
        text: shareText,
        url: shareUrl,
      });
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Native share failed:', err);
      }
    }
  }, [shareText, shareUrl, title]);

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText} ${shareUrl}`
  )}`;

  const redditShareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
    shareUrl
  )}&title=${encodeURIComponent(shareText)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6'>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black/80 backdrop-blur-md'
            onClick={onClose}
            aria-hidden='true'
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className='relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/80'
            role='dialog'
            aria-modal='true'
            aria-labelledby='share-modal-title'
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className='flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6'>
              <div className='flex items-center gap-2.5'>
                <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary'>
                  <BiShareAlt size={20} />
                </div>
                <div>
                  <h3 id='share-modal-title' className='text-base font-bold text-white sm:text-lg'>
                    Share {type === 'PROFILE' ? 'Profile' : 'Social Card'}
                  </h3>
                  <p className='text-xs text-slate-400'>Preview & share across the web</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white'
                aria-label='Close share dialog'
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className='custom-scrollbar flex-1 overflow-y-auto p-5 sm:p-6'>
              {/* Card Preview Box */}
              <div className='relative mb-5 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-xl'>
                <div
                  className='relative w-full overflow-hidden'
                  style={{ aspectRatio: '1200 / 630', maxHeight: '42vh' }}
                >
                  {!imageLoaded && (
                    <div className='absolute inset-0 flex animate-pulse items-center justify-center bg-slate-800 text-slate-500'>
                      <span className='text-sm font-medium'>Rendering social preview...</span>
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ogImageUrl}
                    alt={`${title} Social Preview`}
                    onLoad={() => setImageLoaded(true)}
                    className={`h-full w-full object-cover transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className='absolute right-2.5 top-2.5 rounded-md bg-black/60 px-2 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm'>
                    1200 × 630
                  </div>
                </div>
              </div>

              {/* Copy Link Input Bar */}
              <div className='mb-5'>
                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400'>
                  Direct Link
                </label>
                <div className='flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/90 p-1.5 focus-within:border-primary/50'>
                  <input
                    type='text'
                    readOnly
                    value={shareUrl}
                    className='flex-1 truncate bg-transparent px-3 text-sm text-slate-200 outline-none'
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                      copied
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-primary text-white shadow-sm hover:bg-primary/90'
                    }`}
                  >
                    {copied ? (
                      <>
                        <BiCheck size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <BiCopy size={16} />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Channels & Download Bar */}
              <div className='flex flex-wrap items-center gap-2.5'>
                {/* Download Image Button */}
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className='flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:border-primary/40 hover:bg-white/5 active:scale-95 disabled:opacity-50'
                >
                  <BiDownload size={16} className={isDownloading ? 'animate-bounce' : ''} />
                  {isDownloading ? 'Saving...' : 'Download Card'}
                </button>

                {/* Native Share (if supported) */}
                {hasNativeShare && (
                  <button
                    onClick={handleNativeShare}
                    className='flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white transition-all hover:border-primary/40 hover:bg-white/5 active:scale-95'
                    title='Share via device'
                  >
                    <BiShareAlt size={16} />
                    Share
                  </button>
                )}

                {/* Twitter / X */}
                <a
                  href={twitterShareUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-white transition-all hover:border-white/30 hover:bg-white/10 hover:text-primary active:scale-95'
                  title='Share on X'
                >
                  <FaXTwitter size={15} />
                </a>

                {/* WhatsApp */}
                <a
                  href={whatsappShareUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-white transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 active:scale-95'
                  title='Share on WhatsApp'
                >
                  <FaWhatsapp size={17} />
                </a>

                {/* Reddit */}
                <a
                  href={redditShareUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-white transition-all hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 active:scale-95'
                  title='Share on Reddit'
                >
                  <FaRedditAlien size={17} />
                </a>
              </div>

              {/* Optional: Recommend to AniMedia friends */}
              {onOpenRecommend && (
                <div className='mt-5 border-t border-white/10 pt-4'>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRecommend();
                    }}
                    className='flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20'
                  >
                    <BiUserCheck size={18} />
                    Recommend directly to friends on AniMedia
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
