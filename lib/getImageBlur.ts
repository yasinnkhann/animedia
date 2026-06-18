import { unstable_cache } from 'next/cache';
import type { StaticImageData } from 'next/image';

const getBase64ImageUrl = async (
  url: string | StaticImageData | null | undefined
): Promise<string | undefined> => {
  if (!url || typeof url !== 'string') return undefined;

  try {
    // Optimize the URL to fetch the smallest possible thumbnail to save memory and bandwidth
    let fetchUrl = url;
    if (fetchUrl.includes('image.tmdb.org/t/p/original')) {
      fetchUrl = fetchUrl.replace('/original/', '/w92/');
    } else if (fetchUrl.includes('images.igdb.com/igdb/image/upload/')) {
      // IGDB uses t_cover_big, etc. Replace with t_thumb for extreme speed
      fetchUrl = fetchUrl.replace(/t_[a-zA-Z0-9_]+/, 't_thumb');
    }

    const res = await fetch(fetchUrl);
    if (!res.ok) return undefined;

    const buffer = Buffer.from(await res.arrayBuffer());

    // Guess mime type roughly based on URL extension, fallback to jpeg
    const mimeType = fetchUrl.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error('Failed to generate base64 image for', url, err);
    return undefined;
  }
};

export const getCachedBlurDataUrl = unstable_cache(getBase64ImageUrl, ['blur-data-url-v2'], {
  revalidate: 86400 * 30, // cache for 30 days
});
