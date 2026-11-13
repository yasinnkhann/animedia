import { MetadataRoute } from 'next';
import { CLIENT_BASE_URL } from '@/utils/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
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
  ];
}
