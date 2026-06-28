import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { BiBot, BiRightArrowAlt } from 'react-icons/bi';
import { DailyPick } from '@prisma/client';

export default async function DailyPickCard({ pick }: { pick: DailyPick }) {
  // Fetch media details based on type
  let mediaTitle = '';
  let mediaImage = '';
  let mediaLink = '';

  if (pick.mediaType === 'MOVIE') {
    const media = await prisma.movie.findUnique({
      where: { id_userId: { id: pick.mediaId, userId: pick.userId } },
    });
    if (media) {
      mediaTitle = media.name;
      mediaImage = media.image || '';
      mediaLink = `/movie/${media.id}`;
    }
  } else if (pick.mediaType === 'SHOW') {
    const media = await prisma.show.findUnique({
      where: { id_userId: { id: pick.mediaId, userId: pick.userId } },
    });
    if (media) {
      mediaTitle = media.name;
      mediaImage = media.image || '';
      mediaLink = `/show/${media.id}`;
    }
  } else if (pick.mediaType === 'GAME') {
    const media = await prisma.game.findUnique({
      where: { id_userId: { id: pick.mediaId, userId: pick.userId } },
    });
    if (media) {
      mediaTitle = media.name;
      mediaImage = media.image || '';
      mediaLink = `/game/${media.id}`;
    }
  }

  if (!mediaTitle) return null; // Fallback if media got deleted

  return (
    <div className='group relative mb-12 overflow-hidden rounded-3xl border border-border bg-card shadow-sm'>
      <div className='flex flex-col md:flex-row'>
        {/* Media Poster */}
        <div className='relative h-64 w-full shrink-0 overflow-hidden bg-muted md:h-auto md:w-64'>
          {mediaImage ? (
            <Image
              src={mediaImage}
              alt={mediaTitle}
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, 256px'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
              No Image
            </div>
          )}
          {/* Overlay gradient */}
          <div className='absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:hidden' />
        </div>

        {/* Content */}
        <div className='flex flex-col justify-center p-6 md:p-10'>
          <div className='mb-2 flex items-center gap-2 text-sm font-semibold tracking-wider text-primary'>
            <BiBot size={20} className='animate-pulse' />
            AI DAILY PICK
          </div>

          <h2 className='mb-4 text-3xl font-extrabold text-foreground'>
            <Link href={mediaLink} className='hover:underline'>
              {mediaTitle}
            </Link>
          </h2>

          <p className='mb-6 text-lg leading-relaxed text-muted-foreground'>
            &quot;{pick.pitch}&quot;
          </p>

          <div>
            <Link
              href={mediaLink}
              className='inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow transition-colors hover:bg-primary/90'
            >
              Start {pick.mediaType.toLowerCase()}
              <BiRightArrowAlt size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
