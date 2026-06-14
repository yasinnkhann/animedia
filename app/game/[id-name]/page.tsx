import { Metadata } from 'next';
import { igdbClient } from '@/lib/api';
import GameDetailsClient from './GameDetailsClient';
import { Suspense } from 'react';
import HorizontalScrollerSkeleton from '@/components/Skeletons/HorizontalScrollerSkeleton';
import GamePreviewsServer from '@/components/game/GamePreviewsServer';
import GameRelatedServer from '@/components/game/GameRelatedServer';

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

  const [gameDetails, gamePlatforms, gameCompany, gameThemes, gameGenres] = await Promise.all([
    igdbClient.getGameDetails(id),
    igdbClient.getGamePlatforms(),
    igdbClient.getGameCompany(id),
    igdbClient.getGameThemes(),
    igdbClient.getGameGenres(),
  ]);

  const similarGamesIds = gameDetails?.results?.[0]?.similar_games ?? [];
  const gameIdForCharacters = gameDetails?.results?.[0]?.id ?? '0';
  const dlcGamesIds = gameDetails?.results?.[0]?.dlcs ?? [];

  return (
    <GameDetailsClient
      gameDetailsData={{ gameDetails }}
      gamePlatformsData={{ gamePlatforms }}
      gameCompanyData={{ gameCompany }}
      gameThemesData={{ gameThemes }}
      gameGenresData={{ gameGenres }}
      previewsNode={
        <Suspense key='previews' fallback={<HorizontalScrollerSkeleton />}>
          <GamePreviewsServer gameId={id} gameIdForCharacters={gameIdForCharacters} />
        </Suspense>
      }
      relatedNode={
        <Suspense key='related' fallback={<HorizontalScrollerSkeleton />}>
          <GameRelatedServer
            gameId={id}
            dlcGamesIds={dlcGamesIds}
            similarGamesIds={similarGamesIds}
          />
        </Suspense>
      }
    />
  );
}
