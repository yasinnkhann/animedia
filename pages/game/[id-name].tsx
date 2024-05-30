import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import * as Queries from '../../graphql/queries';
import RoundProgressBar from '../../components/RoundProgressBar';
import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import RelatedHorizontalScroller from '../../components/HorizontalScroller/Related/RelatedHorizontalScroller';
import { useSession } from 'next-auth/react';
import { CommonMethods } from '../../utils/CommonMethods';
import { useQuery } from '@apollo/client';
import _ from 'lodash';
import { GAME_GENRES, MAX_SUMMARY_WORD_LENGTH } from 'utils/constants';
import Modal from 'components/Modal';

const GameDetails = () => {
	const { data: session, status } = useSession();

	const router = useRouter();

	const id = (router.query?.['id-name'] as string)?.split('-')[0];

	const [showFullDescription, setShowFullDescription] = useState(false);

	const { data: gameDetailsData, loading: gameDetailsLoading } = useQuery(
		Queries.GAME_DETAILS,
		{
			skip: !id,
			variables: {
				gameId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	const { data: gamePlatformsData, loading: gamePlatformsLoading } = useQuery(
		Queries.GAME_PLATFORMS
	);

	const { data: gameCompanyData, loading: gameCompanyLoading } = useQuery(
		Queries.GAME_COMPANY,
		{ skip: !id, variables: { gameId: id } }
	);
	const { data: gameThemesData, loading: gameThemesLoading } = useQuery(
		Queries.GAME_THEMES
	);

	const { data: gameCollectionsData, loading: gameCollectionsLoading } =
		useQuery(Queries.GAME_COLLECTIONS, {
			skip: !id,
			variables: { gameId: id },
		});

	const { data: similarGamesData, loading: similarGamesLoading } = useQuery(
		Queries.SIMILAR_GAMES,
		{
			skip: !gameDetailsData?.gameDetails.results[0]?.similar_games,
			variables: {
				gameIds: gameDetailsData?.gameDetails.results[0]
					?.similar_games as string[],
			},
		}
	);

	const { data: dlcGamesData, loading: dlcGamesLoading } = useQuery(
		Queries.DLC_GAMES,
		{
			skip: !gameDetailsData?.gameDetails.results[0]?.dlcs,
			variables: {
				gameIds: gameDetailsData?.gameDetails.results[0]?.dlcs as string[],
			},
		}
	);

	if (
		gameDetailsLoading ||
		!gameDetailsData?.gameDetails.results ||
		gamePlatformsLoading ||
		!gamePlatformsData?.gamePlatforms ||
		gameCompanyLoading ||
		!gameCompanyData?.gameCompany ||
		gameThemesLoading ||
		!gameThemesData?.gameThemes
	) {
		return (
			<section className='flex h-screen items-center justify-center'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	if (gameDetailsData.gameDetails.results.length !== 1) {
		return (
			<section className='flex h-screen items-center justify-center'>
				Error getting game
			</section>
		);
	}

	const game = gameDetailsData.gameDetails.results[0];
	console.log(game);

	return (
		<>
			<Head>
				<title>{game.name}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
				<section className='aspect-h-16 aspect-w-16 relative mx-4 mt-4'>
					<Image
						className='rounded-lg'
						src={CommonMethods.getIgdbImage(game.coverUrl ?? '')}
						alt={game.name}
						layout='fill'
					/>
				</section>

				<section className='mt-4'>
					<section className='mb-8 mt-8 flex items-center'>
						<section className='h-[5rem] w-[5rem]'>
							<RoundProgressBar
								percentageVal={+(game.rating ?? 0).toFixed(1)}
							/>
						</section>
						<p className='ml-[.5rem] text-base font-medium'>
							{commaNumber(game.rating_count ?? 0)} voted users
						</p>
					</section>

					{status === 'authenticated' && session && (
						<section className='my-4 h-[1.5rem]'></section>
					)}

					<section className='pb-32'>
						<h1>{game.name}</h1>
						<div>
							{game.storyline ? (
								game.storyline.split(' ').length <= MAX_SUMMARY_WORD_LENGTH ? (
									game.storyline
								) : (
									<div>
										<p>
											{game.storyline
												.split(' ')
												.slice(0, MAX_SUMMARY_WORD_LENGTH)
												.join(' ') + '...'}
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
								new Date(game.first_release_date * 1000).toISOString()
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
									.filter(platform =>
										game.platforms!.some(
											platformId => platform!.id === platformId
										)
									)
									.map(platform => (
										<p key={platform!.id}>
											{CommonMethods.toTitleCase(platform!.name)}
										</p>
									))}
							</div>
						</>
					)}

					{game.genres && !_.isEmpty(game.genres) && (
						<>
							<h4 className='mt-4'>Genre(s)</h4>
							<div className='ml-1'>
								{game.genres.map(genreId => (
									<p key={genreId}>
										{CommonMethods.toTitleCase(
											GAME_GENRES[
												genreId as unknown as keyof typeof GAME_GENRES
											]
										)}
									</p>
								))}
							</div>
						</>
					)}

					{!_.isEmpty(game.themes) && (
						<>
							<h4 className='mt-4'>Theme</h4>
							<div className='ml-1'>
								{gameThemesData.gameThemes
									.filter(theme =>
										game.themes!.some(themeId => theme!.id === themeId)
									)
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

					{game.url && (
						<>
							<h4 className='mt-4'>Official Page</h4>
							<Link href={game.url}>
								<a className='ml-1 underline' target='_blank'>
									Learn More
								</a>
							</Link>
						</>
					)}
				</section>

				<section className='col-start-2 mt-4'>
					{!dlcGamesLoading &&
						dlcGamesData?.dlcGames &&
						!_.isEmpty(dlcGamesData.dlcGames) && (
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
									height={30}
									items={gameCollectionsData.gameCollections.games.map(
										game => ({
											id: game.id,
											imagePath: game.coverUrl,
											name: game.name,
											popularity: game.rating ?? 0,
											type: 'game',
										})
									)}
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
				<Modal closeModal={() => setShowFullDescription(false)}>
					<h3 className='mb-4 text-xl font-semibold'>Storyline</h3>
					<p>{game.storyline}</p>
				</Modal>
			)}
		</>
	);
};

export default GameDetails;
