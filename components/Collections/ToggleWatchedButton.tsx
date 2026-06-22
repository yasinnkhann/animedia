'use client';

import { useState } from 'react';
import { BiCheckCircle } from 'react-icons/bi';

export default function ToggleWatchedButton({
  collectionId,
  itemId,
  initialWatched,
  canToggle,
}: {
  collectionId: string;
  itemId: string;
  initialWatched: boolean;
  canToggle: boolean;
}) {
  const [watched, setWatched] = useState(initialWatched);
  const [loading, setLoading] = useState(false);

  const toggleWatched = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the media page
    if (!canToggle || loading) return;

    const newWatched = !watched;
    setWatched(newWatched);
    setLoading(true);

    try {
      const res = await fetch(`/api/collections/${collectionId}/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watched: newWatched }),
      });

      if (!res.ok) {
        setWatched(!newWatched); // Revert on failure
      }
    } catch (err) {
      console.error(err);
      setWatched(!newWatched);
    } finally {
      setLoading(false);
    }
  };

  if (!canToggle && !watched) return null;

  return (
    <button
      onClick={toggleWatched}
      disabled={!canToggle || loading}
      className={`absolute bottom-2 right-2 z-10 rounded-full p-1 shadow-md backdrop-blur-md transition-all ${
        watched
          ? 'bg-green-500/90 text-white shadow-green-500/50'
          : 'bg-black/60 text-white hover:bg-black/80 hover:text-green-400'
      } ${!canToggle ? 'cursor-default opacity-90' : 'cursor-pointer hover:scale-110'}`}
      title={watched ? 'Watched' : 'Mark as watched'}
    >
      <BiCheckCircle size={24} />
    </button>
  );
}
