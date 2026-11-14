import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import WatchTogetherClient from '@/components/WatchTogether/WatchTogetherClient';

export const metadata: Metadata = {
  title: 'Watch Together | AniMedia Blend',
  description:
    'Compare watchlists with friends, find mutual plan-to-watch titles, and spin the movie night roulette.',
};

export default async function WatchTogetherPage({
  searchParams,
}: {
  searchParams: Promise<{ friendId?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/watch-together');
  }

  const resolvedSearchParams = await searchParams;
  const initialFriendId = resolvedSearchParams.friendId;

  // Fetch followed users
  const following = await prisma.follows.findMany({
    where: { followerId: session.user.id },
    include: {
      following: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: { following: { name: 'asc' } },
  });

  const friendsList = following.map(f => f.following);

  return (
    <WatchTogetherClient
      initialFriendId={initialFriendId}
      friendsList={friendsList}
      currentUser={{
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
      }}
    />
  );
}
