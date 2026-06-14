import { Metadata } from 'next';
import { igdbClient } from '@/lib/api';
import GameDetailsClient from './GameDetailsClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'id-name': string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.['id-name']?.split('-')[0] ?? '';

  if (!id) {
    return {
      title: 'Game Not Found | AniMedia',
    };
  }

  const gameRes = await igdbClient.getGameDetails(id);
  const gameDetails = gameRes.results?.[0];

  const title = gameDetails?.name ? `${gameDetails.name} | AniMedia` : 'Game | AniMedia';
  const description = gameDetails?.summary || 'View game details on AniMedia.';
  const images = gameDetails?.cover_url ? [gameDetails.cover_url] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
  };
}

export default async function GameDetails({ params }: { params: Promise<{ 'id-name': string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams?.['id-name']?.split('-')[0] ?? '';

  if (!id) return null;

  const [
    gameDetails,
    gamePlatforms,
    gameCompany,
    gameThemes,
    gameCollections,
    gamePreviews,
    gameGenres,
  ] = await Promise.all([
    igdbClient.getGameDetails(id),
    igdbClient.getGamePlatforms(),
    igdbClient.getGameCompany(id),
    igdbClient.getGameThemes(),
    igdbClient.getGameCollections(id),
    igdbClient.getGamePreviews(id),
    igdbClient.getGameGenres(),
  ]);

  const similarGamesIds = gameDetails?.results?.[0]?.similar_games ?? [];
  const similarGames =
    similarGamesIds.length > 0 ? await igdbClient.getSimilarGames(similarGamesIds) : [];

  const gameIdForCharacters = gameDetails?.results?.[0]?.id ?? '0';
  const gameCharacters =
    gameIdForCharacters !== '0' ? await igdbClient.getGameCharacters(gameIdForCharacters) : [];

  const dlcGamesIds = gameDetails?.results?.[0]?.dlcs ?? [];
  const dlcGames = dlcGamesIds.length > 0 ? await igdbClient.getDlcGames(dlcGamesIds) : [];

  return (
    <GameDetailsClient
      gameDetailsData={{ gameDetails }}
      gamePlatformsData={{ gamePlatforms }}
      gameCompanyData={{ gameCompany }}
      gameThemesData={{ gameThemes }}
      gameCollectionsData={{ gameCollections }}
      similarGamesData={{ similarGames }}
      gameCharactersData={{ gameCharacters }}
      dlcGamesData={{ dlcGames }}
      gamePreviewsData={{ gamePreviews }}
      gameGenresData={{ gameGenres }}
    />
  );
}
