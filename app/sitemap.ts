import { MetadataRoute } from 'next';
import { CLIENT_BASE_URL } from '@/utils/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: CLIENT_BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${CLIENT_BASE_URL}/discover`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${CLIENT_BASE_URL}/my-movies/watching`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.5,
    },
    {
      url: `${CLIENT_BASE_URL}/my-shows/watching`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.5,
    },
    {
      url: `${CLIENT_BASE_URL}/my-games/playing`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.5,
    },
  ];
}
