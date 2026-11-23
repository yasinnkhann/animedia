import { Metadata } from 'next';
import { igdbClient } from '@/lib/api';
import { CLIENT_BASE_URL } from '@/utils/constants';
import GameDetailsClient from './GameDetailsClient';
import { Suspense } from 'react';
import HorizontalScrollerSkeleton from '@/components/Skeletons/HorizontalScrollerSkeleton';
import GamePreviewsServer from '@/components/Game/GamePreviewsServer';
import GameRelatedServer from '@/components/Game/GameRelatedServer';

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

  let gameDetails: any = null;
  try {
    const gameRes = await igdbClient.getGameDetails(id);
    gameDetails = gameRes?.results?.[0];
  } catch (err) {
    console.warn('generateMetadata: could not fetch game details', err);
  }

  const title = gameDetails?.name ? `${gameDetails.name} | AniMedia` : 'Game | AniMedia';
  const description = gameDetails?.summary || 'View game details on AniMedia.';
  const posterUrl = gameDetails?.cover_url || '';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || CLIENT_BASE_URL;
  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set('title', gameDetails?.name || 'Game');
  if (posterUrl) ogUrl.searchParams.set('poster', posterUrl);
  if (gameDetails?.first_release_date) {
    const year = new Date(gameDetails.first_release_date * 1000).getFullYear().toString();
    ogUrl.searchParams.set('year', year);
  }
  if (gameDetails?.rating) {
    ogUrl.searchParams.set('rating', String(Math.round(gameDetails.rating)));
  }
  ogUrl.searchParams.set('type', 'GAME');

  const images = [ogUrl.toString()];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
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

  let gameDetails: any = null;
  let gamePlatforms: any = [];
  let gameCompany: any = null;
  let gameThemes: any = [];
  let gameGenres: any = [];

  try {
    const results = await Promise.allSettled([
      igdbClient.getGameDetails(id),
      igdbClient.getGamePlatforms(),
      igdbClient.getGameCompany(id),
      igdbClient.getGameThemes(),
      igdbClient.getGameGenres(),
    ]);

    if (results[0].status === 'fulfilled') gameDetails = results[0].value;
    if (results[1].status === 'fulfilled') gamePlatforms = results[1].value;
    if (results[2].status === 'fulfilled') gameCompany = results[2].value;
    if (results[3].status === 'fulfilled') gameThemes = results[3].value;
    if (results[4].status === 'fulfilled') gameGenres = results[4].value;
  } catch (err) {
    console.warn('GameDetails: error fetching game data', err);
  }

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
