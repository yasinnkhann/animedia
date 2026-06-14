'use client';

import { lazy, Suspense, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import { useSession } from 'next-auth/react';
import { CommonMethods } from '@/utils/CommonMethods';

import _ from 'lodash';
import { MAX_SUMMARY_WORD_LENGTH, RESULTS_PER_PAGE } from '@/utils/constants';
import { ICast } from '@ts/interfaces';
import { ratingOptions } from '@/models/dropDownOptions';
import { Button } from 'antd';
import { IoMdArrowDropdown } from 'react-icons/io';
import RoundProgressBar from '@/components/RoundProgressBar';
import RelatedHorizontalScroller from '@/components/HorizontalScroller/Related/RelatedHorizontalScroller';
import GamePreviewHorizontalScroller from '../../../components/HorizontalScroller/GamePreview/GamePreviewHorizontalScroller';
import MediaCastHorizontalScroller from '../../../components/HorizontalScroller/MediaCast/MediaCastHorizontalScroller';
import { useUserMedia } from '@/components/UserMediaProvider';
import {
  addGame as addGameAction,
  updateGame as updateGameAction,
  deleteGame as deleteGameAction,
} from '@/app/actions/media';

const Modal = lazy(() => import('../../../components/Modal'));

interface Props {
  gameDetailsData: any;
  gamePlatformsData: any;
  gameCompanyData: any;
  gameThemesData: any;
  gameCollectionsData: any;
  similarGamesData: any;
  gameCharactersData: any;
  dlcGamesData: any;
  gamePreviewsData: any;
  gameGenresData: any;
}

const GameDetailsClient = ({
  gameDetailsData,
  gamePlatformsData,
  gameCompanyData,
  gameThemesData,
  gameCollectionsData,
  similarGamesData,
  gameCharactersData,
  dlcGamesData,
  gamePreviewsData,
  gameGenresData,
}: Props) => {
  const { data: session, status } = useSession();

  const params = useParams();

  const id = (params?.['id-name'] as string)?.split('-')[0] ?? '';

  const [ratingInput, setRating] = useState<number | string | null>(null);

  const [addToWishlistInput, setAddToWishlist] = useState<boolean | null>(null);

  const [showFullDescription, setShowFullDescription] = useState(false);

  const { userGames } = useUserMedia();
  const usersGame = userGames?.find(game => game.id === id);

  const rating = ratingInput ?? usersGame?.rating ?? ratingOptions[0].value;
  const addToWishlist = addToWishlistInput ?? usersGame?.wishlist ?? false;

  const gameName = gameDetailsData?.gameDetails.results[0]?.name ?? '';

  const [isPending, startTransition] = useTransition();

  const addGame = ({ variables }: { variables: any }) => {
    startTransition(async () => {
      await addGameAction(
        variables.gameId,
        variables.gameName,
        variables.wishlist ?? undefined,
        variables.rating ?? undefined
      );
    });
  };

  const updateGame = ({ variables }: { variables: any }) => {
    startTransition(async () => {
      await updateGameAction(
        variables.gameId,
        variables.wishlist ?? undefined,
        variables.rating ?? undefined
      );
    });
  };

  const deleteGame = ({ variables }: { variables: any }) => {
    startTransition(async () => {
      await deleteGameAction(variables.gameId);
    });
  };

  const isDBPending = isPending;

  const handleWishlist = () => {
    if (usersGame?.id && usersGame.wishlist && !usersGame.rating) {
      deleteGame({
        variables: { gameId: id },
      });
      return;
    }

    if (!usersGame?.id) {
      addGame({
        variables: {
          gameId: id,
          gameName: game.name,
          rating: typeof rating === 'number' ? rating : null,
          wishlist: true,
        },
      });
      setAddToWishlist(true);
      return;
    }

    if (!usersGame?.wishlist) {
      updateGame({
        variables: {
          gameId: id,
          wishlist: true,
        },
      });
      setAddToWishlist(true);
      return;
    }

    if (usersGame?.wishlist) {
      updateGame({
        variables: {
          gameId: id,
          wishlist: false,
        },
      });
      setAddToWishlist(false);
      return;
    }
  };

  const handleChangeRating = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setRating(value === '' ? '' : +value);

    if (usersGame?.id && value === '' && !usersGame.wishlist) {
      deleteGame({
        variables: { gameId: id },
      });
      return;
    }

    if (!usersGame?.id) {
      addGame({
        variables: {
          gameId: id,
          gameName: game.name,
          rating: isNaN(parseInt(value)) ? null : parseInt(value),
          wishlist: addToWishlist,
        },
      });
      return;
    }

    updateGame({
      variables: {
        gameId: id,
        rating: isNaN(parseInt(value)) ? null : parseInt(value),
      },
    });
    return;
  };

  if (
    !gameDetailsData?.gameDetails.results ||
    gameDetailsData.gameDetails.results.length === 0 ||
    !gamePlatformsData?.gamePlatforms ||
    !gameCompanyData?.gameCompany ||
    !gameThemesData?.gameThemes ||
    !gameGenresData?.gameGenres
  ) {
    return (
      <section className='flex h-screen items-center justify-center'>
        <Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
      </section>
    );
  }

  if (gameDetailsData.gameDetails.results.length !== 1) {
    return (
      <section className='flex h-screen items-center justify-center'>Error getting game</section>
    );
  }

  const game = gameDetailsData.gameDetails.results[0];
  const gameSummary = game.storyline || game.summary;

  return (
    <motion.main
      className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className='aspect-h-16 aspect-w-16 relative mx-4 mt-4'>
        <Image
          className='rounded-lg'
          src={CommonMethods.getIgdbImage(game.coverUrl)}
          alt={game.name}
          fill
          sizes='100vw'
        />
      </section>

      <section className='mt-4'>
        <section className='mb-8 mt-8 flex items-center'>
          <section className='h-[5rem] w-[5rem]'>
            <RoundProgressBar percentageVal={+(game.rating ?? 0).toFixed(1)} />
          </section>
          <p className='ml-[.5rem] text-base font-medium'>
            {commaNumber(game.rating_count ?? 0)} voted users
          </p>
        </section>

        {status === 'authenticated' && session && (
          <section className='my-4 flex items-center space-x-4'>
            <div className='relative'>
              <Button
                onClick={handleWishlist}
                type='primary'
                disabled={isDBPending}
                style={{
                  backgroundColor: addToWishlist ? '#52c41a' : '',
                  borderColor: addToWishlist ? '#52c41a' : '',
                }}
              >
                {addToWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            <div className='relative'>
              <select
                className='appearance-none rounded border border-gray-300 bg-transparent px-2 py-2 pr-8 leading-tight text-gray-700 focus:bg-transparent focus:outline-none'
                value={rating}
                onChange={handleChangeRating}
                disabled={isDBPending}
              >
                {ratingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
              <IoMdArrowDropdown className='pointer-events-none absolute inset-y-0 right-0 mr-3 mt-3 text-black' />
            </div>
          </section>
        )}

        <section className='pb-32'>
          <h1>{game.name}</h1>
          <div>
            {gameSummary ? (
              gameSummary.split(' ').length <= MAX_SUMMARY_WORD_LENGTH ? (
                gameSummary
              ) : (
                <div>
                  <p>
                    {gameSummary.split(' ').slice(0, MAX_SUMMARY_WORD_LENGTH).join(' ') + '...'}
                  </p>
                  <button
                    className='mt-2 text-blue-500 underline'
                    onClick={() => setShowFullDescription(state => !state)}
                  >
                    {showFullDescription ? 'See Less' : 'See More'}
                  </button>
                </div>
              )
            ) : (
              <i>Storyline Not Available</i>
            )}
          </div>
        </section>
      </section>

      <section className='my-4 ml-8'>
        <h3 className='mb-4 underline underline-offset-4'>Details</h3>
        <h4 className='mt-4'>Release Date</h4>
        {game.first_release_date ? (
          <p className='ml-1'>
            {CommonMethods.formatDate(
              new Date(Number(game.first_release_date) * 1000).toISOString()
            )}
          </p>
        ) : (
          <p className='ml-1'>N/A</p>
        )}

        {game.platforms && game.platforms.length > 0 && (
          <>
            <h4 className='mt-4'>Console(s)</h4>
            <div className='ml-1'>
              {gamePlatformsData.gamePlatforms
                .filter((platform: any) =>
                  game.platforms!.some((platformId: any) => platform!.id === platformId)
                )
                .map((platform: any) => (
                  <p key={platform!.id}>{CommonMethods.toTitleCase(platform!.name)}</p>
                ))}
            </div>
          </>
        )}

        {game.genres &&
          !_.isEmpty(game.genres) &&
          gameGenresData.gameGenres &&
          !_.isEmpty(gameGenresData.gameGenres) && (
            <>
              <h4 className='mt-4'>Genre(s)</h4>
              <div className='ml-1'>
                {gameGenresData.gameGenres
                  .filter((genre: any) =>
                    (game.genres ?? []).some((genreId: any) => genreId === genre.id)
                  )
                  .map((genre: any) => (
                    <p key={genre.id}>{genre.name}</p>
                  ))}
              </div>
            </>
          )}

        {!_.isEmpty(game.themes) && (
          <>
            <h4 className='mt-4'>Theme</h4>
            <div className='ml-1'>
              {gameThemesData.gameThemes
                .filter((theme: any) => game.themes!.some((themeId: any) => theme!.id === themeId))
                .map((theme: any) => (
                  <p key={theme!.id}>{theme!.name}</p>
                ))}
            </div>
          </>
        )}

        {!_.isEmpty(gameCompanyData.gameCompany) && (
          <>
            <h4 className='mt-4'>Developers:</h4>
            <div className='ml-1'>
              {gameCompanyData.gameCompany.map((company: any) => (
                <p key={company?.id}>{company?.name}</p>
              ))}
            </div>
          </>
        )}
      </section>

      <section className='col-start-2 mt-4'>
        {gamePreviewsData?.gamePreviews && !_.isEmpty(gamePreviewsData.gamePreviews) && (
          <section className='pb-4'>
            <h3 className='mb-4 ml-8 mt-4'>Preview</h3>
            <GamePreviewHorizontalScroller items={gamePreviewsData.gamePreviews} />
          </section>
        )}

        {gameCharactersData?.gameCharacters && !_.isEmpty(gameCharactersData.gameCharacters) && (
          <section>
            <h3 className='mb-4 ml-8'>Characters</h3>
            <MediaCastHorizontalScroller
              items={
                gameCharactersData.gameCharacters
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

        {dlcGamesData?.dlcGames && !_.isEmpty(dlcGamesData.dlcGames) && (
          <section className='pb-4'>
            <h3 className='mb-4 ml-8 mt-4'>DLC</h3>
            <RelatedHorizontalScroller
              items={dlcGamesData.dlcGames.map((dlc: any) => ({
                id: dlc.id,
                imagePath: dlc.coverUrl,
                name: dlc.name,
                popularity: dlc.rating ?? 0,
                type: 'game',
              }))}
            />
          </section>
        )}

        {gameCollectionsData?.gameCollections &&
          !_.isEmpty(gameCollectionsData.gameCollections.games) && (
            <section className='pb-4'>
              <h3 className='mb-4 ml-8 mt-4'>Check out the series</h3>
              <RelatedHorizontalScroller
                items={gameCollectionsData.gameCollections.games.map((game: any) => ({
                  id: game.id,
                  imagePath: game.coverUrl,
                  name: game.name,
                  popularity: game.rating ?? 0,
                  type: 'game',
                }))}
              />
            </section>
          )}

        {similarGamesData?.similarGames && !_.isEmpty(similarGamesData.similarGames) && (
          <section className='pb-4'>
            <h3 className='mb-4 ml-8 mt-4'>Games you might like</h3>
            <RelatedHorizontalScroller
              items={similarGamesData.similarGames.map((game: any) => ({
                id: game.id,
                imagePath: game.coverUrl,
                name: game.name,
                popularity: game.rating ?? 0,
                type: 'game',
              }))}
            />
          </section>
        )}
      </section>
      <AnimatePresence mode='wait'>
        {showFullDescription && (
          <Suspense fallback={<div>Loading...</div>}>
            <Modal closeModal={() => setShowFullDescription(false)}>
              <h3 className='mb-4 text-xl font-semibold'>Storyline</h3>
              <p>{game.storyline}</p>
            </Modal>
          </Suspense>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default GameDetailsClient;
