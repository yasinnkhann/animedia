'use client';

import React, { useMemo } from 'react';
import type { Movie, Show, Game } from '@prisma/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

interface Props {
  userMovies: Movie[];
  userShows: Show[];
  userGames: Game[];
  userName?: string;
}

const COLORS = ['#00b3ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const MEDIA_COLORS = ['#00b3ff', '#8b5cf6', '#10b981'];

const WatchStatusLabels: Record<string, string> = {
  NOT_WATCHING: 'Not Watching',
  WATCHING: 'Watching / Playing',
  PLAN_TO_WATCH: 'Plan to Watch',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  DROPPED: 'Dropped',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-lg border border-border bg-background p-3 shadow-lg'>
        <p className='font-bold text-primary'>{`${label || payload[0].name}`}</p>
        <p className='text-sm text-foreground'>{`Count : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function StatsDashboard({ userMovies, userShows, userGames, userName }: Props) {
  const allMedia = useMemo(
    () => [...userMovies, ...userShows, ...userGames],
    [userMovies, userShows, userGames]
  );

  // 1. Total & Averages
  const totalTracked = allMedia.length;
  const avgRating = useMemo(() => {
    const rated = allMedia.filter(m => typeof m.rating === 'number' && m.rating > 0);
    if (rated.length === 0) return 0;
    const sum = rated.reduce((acc, curr) => acc + (curr.rating as number), 0);
    return (sum / rated.length).toFixed(1);
  }, [allMedia]);

  const totalMovies = userMovies.length;
  const totalShows = userShows.length;
  const totalGames = userGames.length;

  // 2. Rating Distribution (Bar Chart)
  const ratingData = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) counts[i] = 0;

    allMedia.forEach(m => {
      if (m.rating && m.rating >= 1 && m.rating <= 10) {
        counts[m.rating]++;
      }
    });

    return Object.keys(counts).map(rating => ({
      rating: parseInt(rating),
      count: counts[parseInt(rating)],
    }));
  }, [allMedia]);

  // 3. Status Distribution (Donut Chart)
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    allMedia.forEach(m => {
      // Game model doesn't have status, just wishlist boolean. Let's map it.
      let status = 'NOT_WATCHING';
      if ('status' in m) {
        status = m.status;
      } else {
        // It's a game
        status = (m as any).wishlist ? 'PLAN_TO_WATCH' : 'COMPLETED'; // Simplified fallback for games
      }

      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.keys(counts).map((key, index) => ({
      name: WatchStatusLabels[key] || key,
      value: counts[key],
      fill: COLORS[index % COLORS.length],
    }));
  }, [allMedia]);

  // 4. Media Type Split
  const mediaTypeData = [
    { name: 'Movies', value: totalMovies, fill: MEDIA_COLORS[0] },
    { name: 'Shows', value: totalShows, fill: MEDIA_COLORS[1] },
    { name: 'Games', value: totalGames, fill: MEDIA_COLORS[2] },
  ].filter(d => d.value > 0);

  if (totalTracked === 0) {
    return (
      <div className='flex flex-1 items-center justify-center text-muted-foreground'>
        {userName
          ? `${userName.split(' ')[0]} hasn't tracked any media yet.`
          : "You haven't tracked any media yet! Start adding movies, shows, or games to see your stats."}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-8'
    >
      {/* Summary Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-card p-6 shadow-sm'>
          <h3 className='text-sm font-medium text-muted-foreground'>Total Tracked</h3>
          <p className='mt-2 text-3xl font-bold text-primary'>{totalTracked}</p>
        </div>
        <div className='rounded-xl border border-border bg-card p-6 shadow-sm'>
          <h3 className='text-sm font-medium text-muted-foreground'>Average Rating</h3>
          <p className='mt-2 text-3xl font-bold text-primary'>{avgRating} / 10</p>
        </div>
        <div className='rounded-xl border border-border bg-card p-6 shadow-sm'>
          <h3 className='text-sm font-medium text-muted-foreground'>Total Movies</h3>
          <p className='mt-2 text-3xl font-bold text-foreground'>{totalMovies}</p>
        </div>
        <div className='rounded-xl border border-border bg-card p-6 shadow-sm'>
          <h3 className='text-sm font-medium text-muted-foreground'>Total Shows</h3>
          <p className='mt-2 text-3xl font-bold text-foreground'>{totalShows}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Rating Bar Chart */}
        <div className='rounded-xl border border-border bg-card p-6 shadow-sm'>
          <h3 className='mb-6 text-lg font-bold'>Rating Distribution</h3>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%' minWidth={0} minHeight={0}>
              <BarChart data={ratingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey='rating'
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#888888', fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#888888', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip content={CustomTooltip} cursor={{ fill: 'transparent' }} />
                <Bar dataKey='count' fill='#00b3ff' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className='rounded-xl border border-border bg-card p-6 shadow-sm'>
          <h3 className='mb-6 text-lg font-bold'>Watch Status Breakdown</h3>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%' minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey='value'
                />
                <Tooltip content={CustomTooltip} />
                <Legend iconType='circle' wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Media Type Pie Chart */}
        <div className='rounded-xl border border-border bg-card p-6 shadow-sm'>
          <h3 className='mb-6 text-lg font-bold'>Media Type Split</h3>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%' minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={mediaTypeData}
                  cx='50%'
                  cy='50%'
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey='value'
                />
                <Tooltip content={CustomTooltip} />
                <Legend iconType='circle' wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
