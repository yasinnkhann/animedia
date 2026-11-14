'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FaDice, FaPlay } from 'react-icons/fa';
import { BiRevision } from 'react-icons/bi';
import Link from 'next/link';
import Image from 'next/image';
import TrailerModal from '@/components/Media/TrailerModal';
import { CommonMethods } from '@/utils/CommonMethods';

export interface RouletteCandidate {
  id: string;
  name?: string;
  title?: string;
  mediaType: 'movie' | 'show';
  image?: string | null;
  poster_path?: string | null;
  release_date?: string | null;
  first_air_date?: string | null;
  reason?: string;
  recommendedReason?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  candidates: RouletteCandidate[];
  friendName: string;
}

export default function WatchRouletteModal({ isOpen, onClose, candidates, friendName }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [winner, setWinner] = useState<RouletteCandidate | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [enrichedData, setEnrichedData] = useState<Record<string, { poster_path?: string }>>({});

  const validCandidates = useMemo(() => {
    return candidates.filter(c => Boolean(c.name || c.title));
  }, [candidates]);

  const currentDisplay = winner || validCandidates[selectedIndex] || null;
  const currentTitle = currentDisplay?.name || currentDisplay?.title || 'Unknown Title';
  const displayId = currentDisplay?.id ? String(currentDisplay.id) : undefined;
  const displayType = currentDisplay?.mediaType === 'show' ? 'SHOW' : 'MOVIE';

  useEffect(() => {
    if (!isOpen || !displayId) return;
    const existing =
      currentDisplay?.poster_path || currentDisplay?.image || enrichedData[displayId]?.poster_path;
    if (!existing) {
      fetch(`/api/media/details?type=${displayType}&id=${encodeURIComponent(displayId)}`)
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data?.poster_path) {
            setEnrichedData(prev => ({
              ...prev,
              [displayId]: { poster_path: data.poster_path },
            }));
          }
        })
        .catch(() => {});
    }
  }, [isOpen, displayId, displayType, currentDisplay, enrichedData]);

  const spin = useCallback(() => {
    if (validCandidates.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    let current = 0;
    let speed = 60;
    const totalSpins = 25 + Math.floor(Math.random() * 15);
    let spinCount = 0;

    const tick = () => {
      spinCount++;
      current = (current + 1) % validCandidates.length;
      setSelectedIndex(current);

      if (spinCount < totalSpins) {
        speed = Math.floor(speed * 1.08); // Exponentially slow down
        setTimeout(tick, speed);
      } else {
        setIsSpinning(false);
        setWinner(validCandidates[current]);
      }
    };

    setTimeout(tick, speed);
  }, [validCandidates]);

  if (!isOpen) return null;

  const rawPoster =
    (displayId ? enrichedData[displayId]?.poster_path : null) ||
    currentDisplay?.poster_path ||
    currentDisplay?.image;
  const currentPoster = rawPoster ? CommonMethods.getTheMovieDbImage(rawPoster) : null;
  const reasonText = currentDisplay?.reason || currentDisplay?.recommendedReason || 'Mutual match';

  const detailsUrl = currentDisplay
    ? CommonMethods.getDetailsPageRoute(
        currentDisplay.mediaType === 'show' ? 'show' : 'movie',
        currentDisplay.id,
        currentTitle
      )
    : '#';

  return (
    <AnimatePresence>
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/85 backdrop-blur-md'
          onClick={onClose}
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className='relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/90 sm:p-8'
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400'>
                <FaDice size={22} className={isSpinning ? 'animate-spin' : ''} />
              </div>
              <div>
                <h3 className='text-lg font-extrabold text-white sm:text-xl'>
                  Movie Night Roulette
                </h3>
                <p className='text-xs text-slate-400'>Tiebreaker for you & {friendName}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className='flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white'
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Center Card Display */}
          <div className='flex flex-1 flex-col items-center justify-center py-2 text-center'>
            {validCandidates.length === 0 ? (
              <div className='py-12 text-slate-400'>
                No titles in this category to spin! Add more to your watchlist.
              </div>
            ) : (
              <>
                {/* Poster Container */}
                <div
                  className={`relative mb-5 overflow-hidden rounded-2xl border transition-all duration-200 ${
                    winner
                      ? 'border-amber-400/80 shadow-2xl shadow-amber-500/20 ring-4 ring-amber-500/30'
                      : 'border-white/10 shadow-lg'
                  }`}
                  style={{ width: '220px', height: '330px' }}
                >
                  {currentPoster ? (
                    <Image
                      src={currentPoster}
                      alt={currentTitle}
                      fill
                      className='object-cover'
                      sizes='220px'
                      priority
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-slate-900 text-4xl'>
                      🎬
                    </div>
                  )}

                  {winner && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className='absolute right-2.5 top-2.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-black shadow-lg'
                    >
                      Tonight&apos;s Pick!
                    </motion.div>
                  )}
                </div>

                {/* Title */}
                <h4 className='line-clamp-2 text-xl font-bold text-white sm:text-2xl'>
                  {currentTitle}
                </h4>

                {/* Reason badge */}
                <span className='mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary'>
                  ✨ {reasonText}
                </span>
              </>
            )}
          </div>

          {/* Action Footer */}
          <div className='mt-6 flex flex-col gap-2.5'>
            {winner ? (
              <>
                <div className='flex gap-2.5'>
                  <button
                    onClick={() => setIsTrailerOpen(true)}
                    className='flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-amber-400 active:scale-95'
                  >
                    <FaPlay size={13} />
                    Watch Trailer
                  </button>
                  <Link
                    href={detailsUrl}
                    onClick={onClose}
                    className='flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-3 text-sm font-bold text-white transition-all hover:bg-white/20 active:scale-95'
                  >
                    View Details
                  </Link>
                </div>

                <button
                  onClick={spin}
                  disabled={isSpinning}
                  className='flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-slate-400 transition-colors hover:text-white'
                >
                  <BiRevision size={16} />
                  Spin Again
                </button>
              </>
            ) : (
              <button
                onClick={spin}
                disabled={isSpinning || validCandidates.length === 0}
                className='flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary/90 disabled:opacity-50'
              >
                <FaDice size={18} />
                {isSpinning ? 'Deciding...' : 'Spin Roulette'}
              </button>
            )}
          </div>
        </motion.div>

        {/* Trailer Modal */}
        {winner && isTrailerOpen && (
          <TrailerModal
            isOpen={isTrailerOpen}
            onClose={() => setIsTrailerOpen(false)}
            mediaTitle={currentTitle}
            mediaType={winner.mediaType === 'show' ? 'SHOW' : 'MOVIE'}
            mediaId={winner.id}
          />
        )}
      </div>
    </AnimatePresence>
  );
}
