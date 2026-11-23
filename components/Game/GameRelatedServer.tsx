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
  let gameCollections: any = null;
  let dlcGames: any = { results: [] };
  let similarGames: any = { results: [] };

  try {
    const results = await Promise.allSettled([
      igdbClient.getGameCollections(gameId),
      dlcGamesIds.length > 0
        ? igdbClient.getDlcGames(dlcGamesIds)
        : Promise.resolve({ results: [] }),
      similarGamesIds.length > 0
        ? igdbClient.getSimilarGames(similarGamesIds)
        : Promise.resolve({ results: [] }),
    ]);

    if (results[0].status === 'fulfilled') gameCollections = results[0].value;
    if (results[1].status === 'fulfilled') dlcGames = results[1].value;
    if (results[2].status === 'fulfilled') similarGames = results[2].value;
  } catch (err) {
    console.warn('Could not fetch related games data for gameId:', gameId, err);
  }

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
              first_release_date: dlc.first_release_date,
              rating: dlc.rating,
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
              first_release_date: game.first_release_date,
              rating: game.rating,
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
              first_release_date: game.first_release_date,
              rating: game.rating,
            }))}
          />
        </section>
      )}
    </>
  );
}
