import { MetadataRoute } from 'next';
import { CLIENT_BASE_URL } from '@/utils/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    sitemap: `${CLIENT_BASE_URL}/sitemap.xml`,
  };
}
