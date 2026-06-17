import { getPlaiceholder } from 'plaiceholder';
import { unstable_cache } from 'next/cache';

export async function generateBlurDataUrl(
  url: string | any | null | undefined
): Promise<string | undefined> {
  if (!url || typeof url !== 'string') return undefined;

  try {
    const res = await fetch(url);
    if (!res.ok) return undefined;

    const buffer = Buffer.from(await res.arrayBuffer());
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64;
  } catch (err) {
    console.error('Failed to generate blurhash for', url, err);
    return undefined;
  }
}

// Cache the function so it only runs once per URL indefinitely.
export const getCachedBlurDataUrl = unstable_cache(
  generateBlurDataUrl,
  ['blur-hash-cache'],
  { revalidate: false } // Never revalidate, TMDB posters don't change at the same URL
);
