'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FaPlay } from 'react-icons/fa';
import { BiMoviePlay } from 'react-icons/bi';

export interface TMDBVideo {
  id: string;
  iso_639_1?: string;
  iso_3166_1?: string;
  key: string;
  name: string;
  site: string;
  size?: number;
  type: string;
  official?: boolean;
  published_at?: string;
}

export function selectBestTrailer(videos?: TMDBVideo[] | null): TMDBVideo | null {
  if (!videos || videos.length === 0) return null;

  const yt = videos.filter(v => v.site === 'YouTube' && v.key);
  if (yt.length === 0) return null;

  // 1. Official Trailer
  const officialTrailer = yt.find(v => v.type === 'Trailer' && v.official);
  if (officialTrailer) return officialTrailer;

  // 2. Any Trailer
  const anyTrailer = yt.find(v => v.type === 'Trailer');
  if (anyTrailer) return anyTrailer;

  // 3. Official Teaser
  const officialTeaser = yt.find(v => v.type === 'Teaser' && v.official);
  if (officialTeaser) return officialTeaser;

  // 4. Any Teaser
  const anyTeaser = yt.find(v => v.type === 'Teaser');
  if (anyTeaser) return anyTeaser;

  // 5. First YouTube video
  return yt[0];
}

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaTitle: string;
  videos?: TMDBVideo[] | null;
  mediaType?: 'MOVIE' | 'SHOW';
  mediaId?: string;
}

export default function TrailerModal({
  isOpen,
  onClose,
  mediaTitle,
  videos: initialVideos,
  mediaType,
  mediaId,
}: TrailerModalProps) {
  const [fetchedVideos, setFetchedVideos] = useState<TMDBVideo[] | null>(null);
  const [selectedVideoKey, setSelectedVideoKey] = useState<string | null>(null);

  // Derived loading state: true when waiting for client fetch
  const loading = isOpen && initialVideos === undefined && fetchedVideos === null && !!mediaId;

  // Use initialVideos if provided, otherwise fallback to client-fetched videos
  const allVideos = initialVideos !== undefined ? initialVideos : fetchedVideos;

  // Client-side fetch only if initialVideos was not supplied
  useEffect(() => {
    if (!isOpen || initialVideos !== undefined || !mediaType || !mediaId) return;

    let isMounted = true;
    fetch(
      `/api/media/videos?type=${encodeURIComponent(mediaType)}&id=${encodeURIComponent(mediaId)}`
    )
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (isMounted && data?.results) {
          setFetchedVideos(data.results);
        }
      })
      .catch(err => console.error('Error fetching trailer videos:', err));

    return () => {
      isMounted = false;
    };
  }, [isOpen, initialVideos, mediaType, mediaId]);

  const youtubeVideos = useMemo(() => {
    if (!allVideos) return [];
    return allVideos.filter(v => v.site === 'YouTube' && v.key);
  }, [allVideos]);

  const bestTrailer = useMemo(() => selectBestTrailer(youtubeVideos), [youtubeVideos]);

  const activeVideo = useMemo(() => {
    if (selectedVideoKey) {
      const match = youtubeVideos.find(v => v.key === selectedVideoKey);
      if (match) return match;
    }
    return bestTrailer;
  }, [youtubeVideos, selectedVideoKey, bestTrailer]);

  const handleClose = useCallback(() => {
    setSelectedVideoKey(null);
    onClose();
  }, [onClose]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6 md:p-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <motion.div
            className='relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/90 shadow-2xl backdrop-blur-2xl'
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className='flex items-center justify-between border-b border-border/40 px-4 py-3 sm:px-6'>
              <div className='flex items-center gap-2.5 overflow-hidden'>
                <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                  <BiMoviePlay size={18} />
                </span>
                <div className='min-w-0'>
                  <h3 className='truncate text-sm font-bold text-foreground sm:text-base'>
                    {mediaTitle}
                  </h3>
                  <p className='truncate text-xs text-muted-foreground'>
                    {activeVideo?.name || 'Official Video'}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <button
                  onClick={handleClose}
                  className='flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground'
                  title='Close (Esc)'
                >
                  <IoClose size={20} />
                </button>
              </div>
            </div>

            {/* Video Player Container (16:9 Aspect Ratio) */}
            <div
              className='relative w-full overflow-hidden bg-black'
              style={{ aspectRatio: '16 / 9', maxHeight: '72vh' }}
            >
              {loading ? (
                <div className='flex h-full w-full items-center justify-center'>
                  <div className='flex flex-col items-center gap-2 text-muted-foreground'>
                    <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                    <span className='text-xs'>Loading trailer...</span>
                  </div>
                </div>
              ) : activeVideo ? (
                <iframe
                  key={activeVideo.key}
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.key}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeVideo.name}
                  className='h-full w-full border-0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center p-6 text-center text-sm text-muted-foreground'>
                  No trailer video available for this title.
                </div>
              )}
            </div>

            {/* Video Switcher Tabs (when multiple trailers/teasers exist) */}
            {youtubeVideos.length > 1 && (
              <div className='flex items-center gap-1.5 overflow-x-auto border-t border-border/40 bg-background/50 px-4 py-2.5 sm:px-6'>
                <span className='shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  Videos:
                </span>
                <div className='flex items-center gap-1.5 overflow-x-auto'>
                  {youtubeVideos.slice(0, 6).map(video => {
                    const isSelected = (activeVideo?.key ?? '') === video.key;
                    return (
                      <button
                        key={video.id || video.key}
                        onClick={() => setSelectedVideoKey(video.key)}
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                          isSelected
                            ? 'text-primary-foreground shadow-xs bg-primary'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                        title={video.name}
                      >
                        {video.type}:{' '}
                        {video.name.length > 28 ? `${video.name.slice(0, 28)}...` : video.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface WatchTrailerButtonProps {
  mediaTitle: string;
  mediaType: 'MOVIE' | 'SHOW';
  mediaId: string;
  initialVideos?: TMDBVideo[] | null;
  variant?: 'hero' | 'poster' | 'badge';
  className?: string;
}

export function WatchTrailerButton({
  mediaTitle,
  mediaType,
  mediaId,
  initialVideos,
  variant = 'hero',
  className = '',
}: WatchTrailerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If initial videos provided and contains 0 youtube videos, hide the button
  const hasVideos = useMemo(() => {
    if (initialVideos === undefined) return true; // not yet known, keep visible
    if (!initialVideos || initialVideos.length === 0) return false;
    return initialVideos.some(v => v.site === 'YouTube' && v.key);
  }, [initialVideos]);

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  }, []);

  if (!hasVideos) return null;

  return (
    <>
      {variant === 'hero' && (
        <button
          type='button'
          onClick={handleOpen}
          className={`shadow-xs hover:text-primary-foreground group flex h-10 items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 text-xs font-bold text-primary transition-all hover:scale-[1.02] hover:border-primary hover:bg-primary active:scale-[0.98] sm:text-sm ${className}`}
          title={`Watch trailer for ${mediaTitle}`}
        >
          <span className='group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors'>
            <FaPlay size={9} className='ml-0.5' />
          </span>
          <span>Watch Trailer</span>
        </button>
      )}

      {variant === 'poster' && (
        <button
          type='button'
          onClick={handleOpen}
          className={`absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-primary/60 hover:bg-black/90 active:scale-95 ${className}`}
          title={`Watch trailer for ${mediaTitle}`}
        >
          <FaPlay size={9} className='ml-0.5 text-primary' />
          <span>Trailer</span>
        </button>
      )}

      {variant === 'badge' && (
        <button
          type='button'
          onClick={handleOpen}
          className={`shadow-xs flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-background/90 text-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary ${className}`}
          title='Watch Trailer'
        >
          <FaPlay size={11} className='ml-0.5 text-primary' />
        </button>
      )}

      <TrailerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mediaTitle={mediaTitle}
        videos={initialVideos}
        mediaType={mediaType}
        mediaId={mediaId}
      />
    </>
  );
}
