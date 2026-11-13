'use client';

import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiLock, FiPlus, FiMinus } from 'react-icons/fi';
import { BsTags, BsArrowRepeat } from 'react-icons/bs';
import { BiNote } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { updateMediaPersonalDetails } from '@/app/actions/media';

interface Props {
  mediaType: 'MOVIE' | 'SHOW' | 'GAME';
  mediaId: string;
  mediaTitle: string;
  isOpen: boolean;
  onClose: () => void;
  initialNotes?: string | null;
  initialTags?: string[];
  initialRewatchCount?: number;
  onSaveSuccess?: (data: { notes: string | null; tags: string[]; rewatchCount: number }) => void;
}

const TAG_SUGGESTIONS = [
  'favorite',
  'comfort',
  'masterpiece',
  'co-op',
  'soundtrack',
  'mind-bending',
  'emotional',
  'rewatch',
];

export default function PersonalDetailsModal({
  mediaType,
  mediaId,
  mediaTitle,
  isOpen,
  onClose,
  initialNotes = '',
  initialTags = [],
  initialRewatchCount = 0,
  onSaveSuccess,
}: Props) {
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [tags, setTags] = useState<string[]>(initialTags ?? []);
  const [rewatchCount, setRewatchCount] = useState<number>(initialRewatchCount ?? 0);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = (rawTag: string) => {
    const cleanTag = rawTag.trim().toLowerCase().replace(/^#/, '');
    if (!cleanTag) return;
    if (tags.includes(cleanTag)) {
      toast.error(`Tag "${cleanTag}" already added`);
      return;
    }
    if (tags.length >= 15) {
      toast.error('Maximum 15 tags allowed');
      return;
    }
    setTags([...tags, cleanTag]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const finalNotes = notes.trim() ? notes.trim() : null;
      await updateMediaPersonalDetails(mediaId, mediaType, {
        notes: finalNotes,
        tags,
        rewatchCount,
      });

      toast.success('Personal details saved!');
      onSaveSuccess?.({
        notes: finalNotes,
        tags,
        rewatchCount,
      });
      onClose();
    } catch (err: any) {
      console.error('Failed to save personal details:', err);
      toast.error(err?.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const rewatchLabel = mediaType === 'GAME' ? 'Times Replayed' : 'Times Rewatched';

  return (
    <div
      className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className='animate-in zoom-in-95 relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='mb-6 flex items-start justify-between'>
          <div>
            <h2 className='text-xl font-bold text-foreground'>Personal Log & Notes</h2>
            <p className='truncate text-sm text-muted-foreground'>{mediaTitle}</p>
          </div>
          <button
            onClick={onClose}
            className='rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <div className='custom-scrollbar max-h-[75vh] space-y-6 overflow-y-auto pr-1'>
          {/* Rewatch / Replay Counter */}
          <div className='rounded-xl border border-border/60 bg-muted/30 p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <BsArrowRepeat className='text-primary' size={20} />
                <div>
                  <span className='font-semibold text-foreground'>{rewatchLabel}</span>
                  <p className='text-xs text-muted-foreground'>
                    Track multiple viewings or playthroughs
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => setRewatchCount(Math.max(0, rewatchCount - 1))}
                  disabled={rewatchCount <= 0}
                  className='flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all hover:bg-muted disabled:opacity-40'
                >
                  <FiMinus size={14} />
                </button>
                <span className='min-w-[2.5rem] text-center text-lg font-bold text-foreground'>
                  {rewatchCount}
                </span>
                <button
                  type='button'
                  onClick={() => setRewatchCount(Math.min(999, rewatchCount + 1))}
                  className='flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all hover:bg-muted'
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Custom Tags */}
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <BsTags className='text-primary' size={18} />
              <label className='font-semibold text-foreground'>Custom Tags</label>
            </div>

            {/* Existing tags */}
            {tags.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {tags.map(tag => (
                  <span
                    key={tag}
                    className='inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary'
                  >
                    #{tag}
                    <button
                      type='button'
                      onClick={() => handleRemoveTag(tag)}
                      className='rounded-full p-0.5 hover:bg-primary/20'
                    >
                      <IoMdClose size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag input */}
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Add a tag (e.g. cozy, masterpiece)...'
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                className='flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none'
              />
              <button
                type='button'
                onClick={() => handleAddTag(tagInput)}
                disabled={!tagInput.trim()}
                className='rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 disabled:opacity-40'
              >
                Add
              </button>
            </div>

            {/* Tag suggestions */}
            <div className='flex flex-wrap items-center gap-1.5 pt-1'>
              <span className='text-xs text-muted-foreground'>Suggestions:</span>
              {TAG_SUGGESTIONS.filter(s => !tags.includes(s)).map(suggestion => (
                <button
                  key={suggestion}
                  type='button'
                  onClick={() => handleAddTag(suggestion)}
                  className='rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-primary'
                >
                  +{suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Private Notes */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <BiNote className='text-primary' size={18} />
                <label className='font-semibold text-foreground'>Private Notes</label>
              </div>
              <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                <FiLock size={12} />
                <span>Only visible to you</span>
              </div>
            </div>

            <textarea
              rows={4}
              maxLength={5000}
              placeholder='Add private notes, memories, watch parties, gameplay impressions...'
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className='w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none'
            />
            <div className='flex justify-end text-xs text-muted-foreground'>
              {notes.length} / 5,000
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-6 flex justify-end gap-3 border-t border-border pt-4'>
          <button
            type='button'
            onClick={onClose}
            disabled={isSaving}
            className='rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleSave}
            disabled={isSaving}
            className='text-primary-foreground flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium transition-all hover:bg-primary/90 disabled:opacity-50'
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
