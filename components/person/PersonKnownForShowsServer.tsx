import RelatedHorizontalScroller from '@/components/HorizontalScroller/Related/RelatedHorizontalScroller';
import { tmdbClient } from '@/lib/api';

export default async function PersonKnownForShowsServer({ personId }: { personId: string }) {
  const knownForShows = await tmdbClient.getPersonShowCredits(personId);

  if (!knownForShows?.cast?.length) return null;

  return (
    <section className='pb-4'>
      <h3 className='mb-4 ml-8 mt-4'>Known For Shows</h3>
      <RelatedHorizontalScroller
        items={knownForShows.cast.map((show: any) => ({
          id: show.id,
          imagePath: show.poster_path,
          name: show.name,
          popularity: show.popularity ?? 0,
          type: 'show',
        }))}
        mediaType={'shows'}
      />
    </section>
  );
}
