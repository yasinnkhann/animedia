import RelatedHorizontalScroller from '@/components/HorizontalScroller/Related/RelatedHorizontalScroller';
import { igdbClient } from '@/lib/api';
import _ from 'lodash';

export default async function GameRelatedServer({
  gameId,
  dlcGamesIds,
  similarGamesIds,
}: {
  gameId: string;
  dlcGamesIds: string[];
  similarGamesIds: string[];
}) {
  const [gameCollections, dlcGames, similarGames] = await Promise.all([
    igdbClient.getGameCollections(gameId),
    dlcGamesIds.length > 0 ? igdbClient.getDlcGames(dlcGamesIds) : { results: [] },
    similarGamesIds.length > 0 ? igdbClient.getSimilarGames(similarGamesIds) : { results: [] },
  ]);

  return (
    <>
      {dlcGames?.results && !_.isEmpty(dlcGames.results) && (
        <section className='pb-4'>
          <h3 className='mb-4 ml-8 mt-4'>DLC</h3>
          <RelatedHorizontalScroller
            items={dlcGames.results.map((dlc: any) => ({
              id: dlc.id,
              imagePath: dlc.coverUrl,
              name: dlc.name,
              popularity: dlc.rating ?? 0,
              type: 'game',
            }))}
          />
        </section>
      )}

      {gameCollections && !_.isEmpty(gameCollections.games) && (
        <section className='pb-4'>
          <h3 className='mb-4 ml-8 mt-4'>Check out the series</h3>
          <RelatedHorizontalScroller
            items={gameCollections.games.map((game: any) => ({
              id: game.id,
              imagePath: game.coverUrl,
              name: game.name,
              popularity: game.rating ?? 0,
              type: 'game',
            }))}
          />
        </section>
      )}

      {similarGames?.results && !_.isEmpty(similarGames.results) && (
        <section className='pb-4'>
          <h3 className='mb-4 ml-8 mt-4'>Games you might like</h3>
          <RelatedHorizontalScroller
            items={similarGames.results.map((game: any) => ({
              id: game.id,
              imagePath: game.coverUrl,
              name: game.name,
              popularity: game.rating ?? 0,
              type: 'game',
            }))}
          />
        </section>
      )}
    </>
  );
}
