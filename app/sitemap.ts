import { MetadataRoute } from 'next';
import { CLIENT_BASE_URL } from '@/utils/constants';
import { prisma } from '@/lib/prisma';

export const revalidate = 86400; // Cache sitemap for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: CLIENT_BASE_URL,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${CLIENT_BASE_URL}/discover`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${CLIENT_BASE_URL}/movies/popular`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${CLIENT_BASE_URL}/movies/top-rated`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${CLIENT_BASE_URL}/movies/popular-anime`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${CLIENT_BASE_URL}/shows/popular`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${CLIENT_BASE_URL}/shows/top-rated`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${CLIENT_BASE_URL}/shows/popular-anime`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${CLIENT_BASE_URL}/games/popular`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${CLIENT_BASE_URL}/games/top-rated`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${CLIENT_BASE_URL}/people/popular`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${CLIENT_BASE_URL}/collections`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  try {
    const [movies, shows, games] = await Promise.all([
      prisma.movie.findMany({
        select: { id: true },
        distinct: ['id'],
        take: 150,
      }),
      prisma.show.findMany({
        select: { id: true },
        distinct: ['id'],
        take: 150,
      }),
      prisma.game.findMany({
        select: { id: true },
        distinct: ['id'],
        take: 150,
      }),
    ]);

    const movieUrls: MetadataRoute.Sitemap = movies.map(m => ({
      url: `${CLIENT_BASE_URL}/movie/${m.id}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    const showUrls: MetadataRoute.Sitemap = shows.map(s => ({
      url: `${CLIENT_BASE_URL}/show/${s.id}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    const gameUrls: MetadataRoute.Sitemap = games.map(g => ({
      url: `${CLIENT_BASE_URL}/game/${g.id}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticUrls, ...movieUrls, ...showUrls, ...gameUrls];
  } catch {
    return staticUrls;
  }
}
