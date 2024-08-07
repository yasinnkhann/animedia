import Head from 'next/head';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import { useSession } from 'next-auth/react';
import { CommonMethods } from '../../utils/CommonMethods';
import { useMutation, useQuery } from '@apollo/client';
import _ from 'lodash';
import { MAX_SUMMARY_WORD_LENGTH, RESULTS_PER_PAGE } from 'utils/constants';
import { ICast } from '@ts/interfaces';
import { ratingOptions } from 'models/dropDownOptions';
import { Button } from 'antd';
import { IoMdArrowDropdown } from 'react-icons/io';
import RoundProgressBar from '../../components/RoundProgressBar';
import RelatedHorizontalScroller from '../../components/HorizontalScroller/Related/RelatedHorizontalScroller';
import GamePreviewHorizontalScroller from 'components/HorizontalScroller/GamePreview/GamePreviewHorizontalScroller';
import MediaCastHorizontalScroller from 'components/HorizontalScroller/MediaCast/MediaCastHorizontalScroller';

const Modal = lazy(() => import('components/Modal'));

const GameDetails = () => {
	const { data: session, status } = useSession();

	const router = useRouter();

	const id = (router.query?.['id-name'] as string)?.split('-')[0] ?? '';

	const [rating, setRating] = useState<number | string>(ratingOptions[0].value);

	const [addToWishlist, setAddToWishlist] = useState<boolean>(false);

	const [showFullDescription, setShowFullDescription] = useState(false);

	const { data: gameDetailsData, loading: gameDetailsLoading } = useQuery(Queries.GAME_DETAILS, {
		skip: !id,
		variables: {
			gameId: id,
		},
	});

	const { data: usersGameData, loading: usersGameLoading } = useQuery(Queries.USERS_GAME, {
		skip: !id,
		variables: {
			gameId: id,
		},
		fetchPolicy: 'network-only',
	});

	const { data: gamePlatformsData, loading: gamePlatformsLoading } = useQuery(
		Queries.GAME_PLATFORMS
	);

	const { data: gameCompanyData, loading: gameCompanyLoading } = useQuery(Queries.GAME_COMPANY, {
		skip: !id,
		variables: { gameId: id },
	});
	const { data: gameThemesData, loading: gameThemesLoading } = useQuery(Queries.GAME_THEMES);

	const { data: gameCollectionsData, loading: gameCollectionsLoading } = useQuery(
		Queries.GAME_COLLECTIONS,
		{
			skip: !id,
			variables: { gameId: id },
		}
	);

	const { data: similarGamesData, loading: similarGamesLoading } = useQuery(Queries.SIMILAR_GAMES, {
		skip: !gameDetailsData?.gameDetails.results[0]?.similar_games,
		variables: {
			gameIds: gameDetailsData?.gameDetails.results[0]?.similar_games as string[],
		},
	});

	const { data: gameCharactersData, loading: gameCharactersLoading } = useQuery(
		Queries.GAME_CHARACTERS,
		{
			skip: !gameDetailsData?.gameDetails.results[0].id,
			variables: {
				gameId: gameDetailsData?.gameDetails.results[0].id ?? '0',
			},
		}
	);

	const { data: dlcGamesData, loading: dlcGamesLoading } = useQuery(Queries.DLC_GAMES, {
		skip: !gameDetailsData?.gameDetails.results[0]?.dlcs,
		variables: {
			gameIds: gameDetailsData?.gameDetails.results[0]?.dlcs as string[],
		},
	});

	const { data: gamePreviewsData, loading: gamePreviewsLoading } = useQuery(Queries.GAME_PREVIEWS, {
		skip: !id,
		variables: {
			gameId: id,
		},
	});

	const { data: gameGenresData, loading: gameGenresLoading } = useQuery(Queries.GAME_GENRES);

	const [addGame] = useMutation(Mutations.ADD_GAME, {
		variables: {
			gameId: id,
			gameName: gameDetailsData?.gameDetails.results[0]?.name!,
			rating: typeof rating === 'number' ? rating : null,
			wishlist: addToWishlist,
		},
		refetchQueries: () => [
			{
				query: Queries.USERS_GAME,
				variables: {
					gameId: id,
				},
			},
			'UsersGame',
		],
	});

	const [updateGame] = useMutation(Mutations.UPDATE_GAME, {
		variables: {
			gameId: id,
			rating: typeof rating === 'number' ? rating : null,
			wishlist: addToWishlist,
		},
		refetchQueries: () => [
			{
				query: Queries.USERS_GAME,
				variables: {
					movieId: id,
				},
			},
			'UsersGame',
		],
	});

	const [deleteGame] = useMutation(Mutations.DELETE_GAME, {
		variables: {
			gameId: id,
		},
		refetchQueries: () => [
			{
				query: Queries.USERS_GAME,
				variables: {
					movieId: id,
				},
			},
			'UsersGame',
		],
	});

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

	useEffect(() => {
		if (usersGameLoading) return;

		if (usersGameData?.usersGame?.id) {
			setRating(usersGameData.usersGame.rating ?? '');
			setAddToWishlist(usersGameData.usersGame.wishlist ?? false);
		} else {
			setRating('');
			setAddToWishlist(false);
		}
	}, [
		usersGameData?.usersGame?.id,
		usersGameData?.usersGame?.rating,
		usersGameData?.usersGame?.wishlist,
		usersGameLoading,
	]);

	if (
		gameDetailsLoading ||
		!gameDetailsData?.gameDetails.results ||
		gamePlatformsLoading ||
		!gamePlatformsData?.gamePlatforms ||
		gameCompanyLoading ||
		!gameCompanyData?.gameCompany ||
		gameThemesLoading ||
		!gameThemesData?.gameThemes ||
		gameGenresLoading ||
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
	const usersGame = usersGameData?.usersGame;

	return (
		<>
			<Head>
				<title>{game.name}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
				<section className='aspect-h-16 aspect-w-16 relative mx-4 mt-4'>
					<Image
						className='rounded-lg'
						src={CommonMethods.getIgdbImage(game.coverUrl)}
						alt={game.name}
						layout='fill'
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
									style={{
										backgroundColor: usersGame?.wishlist ? '#52c41a' : '',
										borderColor: usersGame?.wishlist ? '#52c41a' : '',
									}}
								>
									{usersGame?.wishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
								</Button>
							</div>

							<div className='relative'>
								<select
									className='appearance-none rounded border border-gray-300 bg-transparent px-2 py-2 pr-8 leading-tight text-gray-700 focus:bg-transparent focus:outline-none'
									value={rating}
									onChange={handleChangeRating}
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
							{CommonMethods.formatDate(new Date(game.first_release_date * 1000).toISOString())}
						</p>
					) : (
						<p className='ml-1'>N/A</p>
					)}

					{game.platforms && game.platforms.length > 0 && (
						<>
							<h4 className='mt-4'>Console(s)</h4>
							<div className='ml-1'>
								{gamePlatformsData.gamePlatforms
									.filter(platform =>
										game.platforms!.some(platformId => platform!.id === platformId)
									)
									.map(platform => (
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
										.filter(genre => (game.genres ?? []).some(genreId => genreId === genre.id))
										.map(genre => (
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
									.filter(theme => game.themes!.some(themeId => theme!.id === themeId))
									.map(theme => (
										<p key={theme!.id}>{theme!.name}</p>
									))}
							</div>
						</>
					)}

					{!_.isEmpty(gameCompanyData.gameCompany) && (
						<>
							<h4 className='mt-4'>Developers:</h4>
							<div className='ml-1'>
								{gameCompanyData.gameCompany.map(company => (
									<p key={company?.id}>{company?.name}</p>
								))}
							</div>
						</>
					)}
				</section>

				<section className='col-start-2 mt-4'>
					{!gamePreviewsLoading &&
						gamePreviewsData?.gamePreviews &&
						!_.isEmpty(gamePreviewsData.gamePreviews) && (
							<section className='pb-4'>
								<h3 className='mb-4 ml-8 mt-4'>Preview</h3>
								<GamePreviewHorizontalScroller items={gamePreviewsData.gamePreviews} />
							</section>
						)}

					{!gameCharactersLoading &&
						gameCharactersData?.gameCharacters &&
						!_.isEmpty(gameCharactersData.gameCharacters) && (
							<section>
								<h3 className='mb-4 ml-8'>Characters</h3>
								<MediaCastHorizontalScroller
									items={
										gameCharactersData.gameCharacters
											.map(char => ({
												id: char.id,
												name: char.name,
												profile_path: char.mugShotUrl,
												type: char.__typename,
											}))
											.slice(0, RESULTS_PER_PAGE) as ICast[]
									}
								/>
							</section>
						)}

					{!dlcGamesLoading && dlcGamesData?.dlcGames && !_.isEmpty(dlcGamesData.dlcGames) && (
						<section className='pb-4'>
							<h3 className='mb-4 ml-8 mt-4'>DLC</h3>
							<RelatedHorizontalScroller
								items={dlcGamesData.dlcGames.map(dlc => ({
									id: dlc.id,
									imagePath: dlc.coverUrl,
									name: dlc.name,
									popularity: dlc.rating ?? 0,
									type: 'game',
								}))}
							/>
						</section>
					)}

					{!gameCollectionsLoading &&
						gameCollectionsData?.gameCollections &&
						!_.isEmpty(gameCollectionsData.gameCollections.games) && (
							<section className='pb-4'>
								<h3 className='mb-4 ml-8 mt-4'>Check out the series</h3>
								<RelatedHorizontalScroller
									items={gameCollectionsData.gameCollections.games.map(game => ({
										id: game.id,
										imagePath: game.coverUrl,
										name: game.name,
										popularity: game.rating ?? 0,
										type: 'game',
									}))}
								/>
							</section>
						)}

					{!similarGamesLoading &&
						similarGamesData?.similarGames &&
						!_.isEmpty(similarGamesData.similarGames) && (
							<section className='pb-4'>
								<h3 className='mb-4 ml-8 mt-4'>Games you might like</h3>
								<RelatedHorizontalScroller
									items={similarGamesData.similarGames.map(game => ({
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
			</main>

			{showFullDescription && (
				<Suspense fallback={<div>Loading...</div>}>
					<Modal closeModal={() => setShowFullDescription(false)}>
						<h3 className='mb-4 text-xl font-semibold'>Storyline</h3>
						<p>{game.storyline}</p>
					</Modal>
				</Suspense>
			)}
		</>
	);
};

export default GameDetails;
