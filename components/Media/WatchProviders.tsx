'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { CommonMethods } from '@/utils/CommonMethods';
import { BiTv, BiLinkExternal } from 'react-icons/bi';
import { IoMdArrowDropdown } from 'react-icons/io';

export interface WatchProviderItem {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority?: number;
}

export interface WatchProviderRegionData {
  link?: string;
  flatrate?: WatchProviderItem[];
  free?: WatchProviderItem[];
  ads?: WatchProviderItem[];
  rent?: WatchProviderItem[];
  buy?: WatchProviderItem[];
}

export interface WatchProvidersData {
  id?: number;
  results?: Record<string, WatchProviderRegionData>;
}

interface Props {
  mediaType: 'MOVIE' | 'SHOW';
  mediaId: string;
  initialData?: WatchProvidersData | null;
}

const COMMON_REGIONS: Record<string, { name: string; flag: string }> = {
  US: { name: 'United States', flag: '🇺🇸' },
  GB: { name: 'United Kingdom', flag: '🇬🇧' },
  CA: { name: 'Canada', flag: '🇨🇦' },
  AU: { name: 'Australia', flag: '🇦🇺' },
  DE: { name: 'Germany', flag: '🇩🇪' },
  FR: { name: 'France', flag: '🇫🇷' },
  JP: { name: 'Japan', flag: '🇯🇵' },
  IN: { name: 'India', flag: '🇮🇳' },
  BR: { name: 'Brazil', flag: '🇧🇷' },
  ES: { name: 'Spain', flag: '🇪🇸' },
  IT: { name: 'Italy', flag: '🇮🇹' },
  MX: { name: 'Mexico', flag: '🇲🇽' },
  KR: { name: 'South Korea', flag: '🇰🇷' },
  NL: { name: 'Netherlands', flag: '🇳🇱' },
  SE: { name: 'Sweden', flag: '🇸🇪' },
};

export default function WatchProviders({ mediaType, mediaId, initialData }: Props) {
  const [data, setData] = useState<WatchProvidersData | null>(initialData ?? null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    if (typeof window !== 'undefined' && navigator.language) {
      const parts = navigator.language.split('-');
      if (parts.length > 1) {
        return parts[1].toUpperCase();
      }
    }
    return 'US';
  });

  // Fetch if no initialData provided
  useEffect(() => {
    if (initialData || !mediaId) return;

    let isMounted = true;
    fetch(
      `/api/media/watch-providers?type=${encodeURIComponent(mediaType)}&id=${encodeURIComponent(mediaId)}`
    )
      .then(res => (res.ok ? res.json() : null))
      .then(d => {
        if (isMounted && d) setData(d);
      })
      .catch(err => console.error('Error fetching watch providers:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [mediaType, mediaId, initialData]);

  // List of available countries sorted by common priority then name
  const availableRegions = useMemo(() => {
    if (!data?.results) return [];
    const keys = Object.keys(data.results);
    return keys.sort((a, b) => {
      const aCommon = !!COMMON_REGIONS[a];
      const bCommon = !!COMMON_REGIONS[b];
      if (aCommon && !bCommon) return -1;
      if (!aCommon && bCommon) return 1;
      const aName = COMMON_REGIONS[a]?.name || a;
      const bName = COMMON_REGIONS[b]?.name || b;
      return aName.localeCompare(bName);
    });
  }, [data]);

  // Current region data
  const currentRegionData: WatchProviderRegionData | undefined = data?.results?.[selectedRegion];

  // Subscription streaming services
  const streamProviders = currentRegionData?.flatrate || [];

  // Free or ad-supported streaming
  const freeOrAdProviders = useMemo(() => {
    const list = [...(currentRegionData?.free || []), ...(currentRegionData?.ads || [])];
    const seen = new Set<number>();
    return list.filter(item => {
      if (seen.has(item.provider_id)) return false;
      seen.add(item.provider_id);
      return true;
    });
  }, [currentRegionData]);

  // Rent or Buy services (deduplicated by provider_id)
  const rentOrBuyProviders = useMemo(() => {
    const list = [...(currentRegionData?.rent || []), ...(currentRegionData?.buy || [])];
    const seen = new Set<number>();
    return list.filter(item => {
      if (seen.has(item.provider_id)) return false;
      seen.add(item.provider_id);
      return true;
    });
  }, [currentRegionData]);

  const hasAnyProviders =
    streamProviders.length > 0 || freeOrAdProviders.length > 0 || rentOrBuyProviders.length > 0;

  if (loading) {
    return (
      <div className='w-full rounded-2xl border border-border/60 bg-card/30 p-4 shadow-sm backdrop-blur-sm'>
        <div className='flex items-center gap-2.5 border-b border-border/40 pb-3'>
          <div className='h-7 w-7 animate-pulse rounded-lg bg-muted/60' />
          <div className='h-4 w-28 animate-pulse rounded bg-muted/60' />
        </div>
        <div className='mt-3 flex gap-2'>
          <div className='h-8 w-24 animate-pulse rounded-xl bg-muted/60' />
          <div className='h-8 w-24 animate-pulse rounded-xl bg-muted/60' />
        </div>
      </div>
    );
  }

  // If no providers exist across all regions and not loading, skip render
  if (!data?.results || Object.keys(data.results).length === 0) {
    return null;
  }

  const regionInfo = COMMON_REGIONS[selectedRegion] || { name: selectedRegion, flag: '🌐' };
  const justWatchLink = currentRegionData?.link || undefined;

  return (
    <div className='w-full rounded-2xl border border-border/60 bg-card/30 p-4 shadow-sm backdrop-blur-sm'>
      {/* Header with Title and Region Dropdown */}
      <div className='flex items-center justify-between gap-2 border-b border-border/40 pb-2.5'>
        <div className='flex min-w-0 items-center gap-2'>
          <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <BiTv size={14} />
          </span>
          <h3 className='whitespace-nowrap text-xs font-bold text-foreground'>Where to Watch</h3>
        </div>

        {/* Region Selector */}
        {availableRegions.length > 0 && (
          <div className='relative shrink-0'>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className='shadow-xs h-6 appearance-none rounded-lg border border-border/70 bg-background/90 pl-1.5 pr-5 text-[11px] font-semibold text-foreground transition-all hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 [&>option]:bg-background'
              title='Select Country / Region'
            >
              {availableRegions.map(code => {
                const info = COMMON_REGIONS[code];
                return (
                  <option key={code} value={code} title={info?.name || code}>
                    {info ? `${info.flag} ${code}` : code}
                  </option>
                );
              })}
            </select>
            <IoMdArrowDropdown className='pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground' />
          </div>
        )}
      </div>

      {/* Provider Sections */}
      {hasAnyProviders ? (
        <div className='space-y-3.5 pt-3'>
          {/* 1. Subscription Streaming */}
          {streamProviders.length > 0 && (
            <div>
              <div className='flex items-center gap-1.5'>
                <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                  Stream
                </span>
              </div>
              <div className='mt-1.5 flex flex-wrap gap-2'>
                {streamProviders.map(provider => (
                  <a
                    key={provider.provider_id}
                    href={justWatchLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='shadow-xs group flex items-center gap-2 rounded-xl border border-border/70 bg-background/80 p-1.5 pr-2.5 transition-all hover:scale-[1.02] hover:border-primary/50 hover:bg-muted/50'
                    title={`Watch on ${provider.provider_name}`}
                  >
                    <div className='shadow-xs relative h-6 w-6 overflow-hidden rounded-md'>
                      <Image
                        src={CommonMethods.getTheMovieDbImage(provider.logo_path) as string}
                        alt={provider.provider_name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <span className='text-xs font-medium text-foreground transition-colors group-hover:text-primary'>
                      {provider.provider_name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 2. Free or Ad-supported Streaming */}
          {freeOrAdProviders.length > 0 && (
            <div>
              <div className='flex items-center gap-1.5'>
                <span className='h-1.5 w-1.5 rounded-full bg-blue-500' />
                <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                  Free with Ads
                </span>
              </div>
              <div className='mt-1.5 flex flex-wrap gap-2'>
                {freeOrAdProviders.map(provider => (
                  <a
                    key={provider.provider_id}
                    href={justWatchLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='shadow-xs group flex items-center gap-2 rounded-xl border border-border/70 bg-background/80 p-1.5 pr-2.5 transition-all hover:scale-[1.02] hover:border-primary/50 hover:bg-muted/50'
                    title={`Watch free on ${provider.provider_name}`}
                  >
                    <div className='shadow-xs relative h-6 w-6 overflow-hidden rounded-md'>
                      <Image
                        src={CommonMethods.getTheMovieDbImage(provider.logo_path) as string}
                        alt={provider.provider_name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <span className='text-xs font-medium text-foreground transition-colors group-hover:text-primary'>
                      {provider.provider_name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 3. Rent or Buy */}
          {rentOrBuyProviders.length > 0 && (
            <div>
              <div className='flex items-center gap-1.5'>
                <span className='h-1.5 w-1.5 rounded-full bg-purple-500' />
                <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                  Rent or Buy
                </span>
              </div>
              <div className='mt-1.5 flex flex-wrap gap-1.5'>
                {rentOrBuyProviders.map(provider => (
                  <a
                    key={provider.provider_id}
                    href={justWatchLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/70 px-2 py-1 text-xs transition-all hover:border-primary/50 hover:bg-muted/40'
                    title={`Rent or buy on ${provider.provider_name}`}
                  >
                    <div className='relative h-4 w-4 overflow-hidden rounded'>
                      <Image
                        src={CommonMethods.getTheMovieDbImage(provider.logo_path) as string}
                        alt={provider.provider_name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <span className='text-xs text-foreground/90 group-hover:text-primary'>
                      {provider.provider_name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='py-3 text-center text-xs text-muted-foreground'>
          No streaming options currently listed for {regionInfo.name}.
        </div>
      )}

      {/* JustWatch Attribution Footer */}
      <div className='mt-3 flex items-center justify-between border-t border-border/30 pt-2 text-[10px] text-muted-foreground'>
        <span>Streaming data via JustWatch</span>
        {justWatchLink && (
          <a
            href={justWatchLink}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1 font-medium text-primary hover:underline'
          >
            <span>Options</span>
            <BiLinkExternal size={11} />
          </a>
        )}
      </div>
    </div>
  );
}
