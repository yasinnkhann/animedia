import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CLIENT_BASE_URL } from '@/utils/constants';
import UserProfileClient from './UserProfileClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          movie: true,
          show: true,
          game: true,
        },
      },
    },
  });

  if (!user) {
    return {
      title: 'User Not Found | AniMedia',
    };
  }

  const title = `${user.name || 'User'}'s Profile | AniMedia`;
  const description = `View ${user.name || 'User'}'s tracked movies, shows, games, ratings, and stats on AniMedia.`;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || CLIENT_BASE_URL;
  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set('type', 'PROFILE');
  ogUrl.searchParams.set('title', user.name || 'AniMedia User');
  if (user.image) ogUrl.searchParams.set('avatar', user.image);
  ogUrl.searchParams.set('movies', String(user._count?.movie ?? 0));
  ogUrl.searchParams.set('shows', String(user._count?.show ?? 0));
  ogUrl.searchParams.set('games', String(user._count?.game ?? 0));

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

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <UserProfileClient userId={resolvedParams.id} />;
}
