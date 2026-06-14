import GamePreviewHorizontalScroller from '@/components/HorizontalScroller/GamePreview/GamePreviewHorizontalScroller';
import MediaCastHorizontalScroller from '@/components/HorizontalScroller/MediaCast/MediaCastHorizontalScroller';
import { igdbClient } from '@/lib/api';
import { RESULTS_PER_PAGE } from '@/utils/constants';
import { ICast } from '@ts/interfaces';
import _ from 'lodash';

export default async function GamePreviewsServer({
  gameId,
  gameIdForCharacters,
}: {
  gameId: string;
  gameIdForCharacters: string;
}) {
  const [gamePreviews, gameCharacters] = await Promise.all([
    igdbClient.getGamePreviews(gameId),
    gameIdForCharacters !== '0'
      ? igdbClient.getGameCharacters(gameIdForCharacters)
      : { results: [] },
  ]);

  return (
    <>
      {gamePreviews && !_.isEmpty(gamePreviews) && (
        <section className='pb-4'>
          <h3 className='mb-4 ml-8 mt-4'>Preview</h3>
          <GamePreviewHorizontalScroller items={gamePreviews} />
        </section>
      )}

      {gameCharacters?.results && !_.isEmpty(gameCharacters.results) && (
        <section>
          <h3 className='mb-4 ml-8'>Characters</h3>
          <MediaCastHorizontalScroller
            items={
              gameCharacters.results
                .map((char: any) => ({
                  id: char.id,
                  name: char.name,
                  profile_path: char.mugShotUrl,
                  type: 'character',
                }))
                .slice(0, RESULTS_PER_PAGE) as ICast[]
            }
          />
        </section>
      )}
    </>
  );
}
