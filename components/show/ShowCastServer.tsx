import MediaCastHorizontalScroller from '@/components/HorizontalScroller/MediaCast/MediaCastHorizontalScroller';
import { tmdbClient } from '@/lib/api';
import { RESULTS_PER_PAGE } from '@/utils/constants';
import { ICast } from '@ts/interfaces';

export default async function ShowCastServer({ showId }: { showId: string }) {
  const showsCastCrew = await tmdbClient.getShowCredits(showId);

  if (!showsCastCrew?.cast?.length) return null;

  return (
    <section>
      <h3 className='mb-4 ml-8'>Cast</h3>
      <MediaCastHorizontalScroller
        items={
          showsCastCrew.cast
            .map((cast: any) => ({
              id: cast.id,
              name: cast.name,
              character: cast.character,
              profile_path: cast.profile_path,
              type: 'character',
            }))
            .slice(0, RESULTS_PER_PAGE) as ICast[]
        }
      />
    </section>
  );
}
