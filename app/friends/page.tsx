import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import FriendsClient from './FriendsClient';

export const metadata = {
  title: 'My Friends - Animedia',
  description: 'Manage your social connections on Animedia.',
};

export default async function FriendsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const [followingData, followersData] = await Promise.all([
    prisma.follows.findMany({
      where: { followerId: session.user.id },
      include: {
        following: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { following: { name: 'asc' } },
    }),
    prisma.follows.findMany({
      where: { followingId: session.user.id },
      include: {
        follower: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { follower: { name: 'asc' } },
    }),
  ]);

  const following = followingData.map(f => f.following);
  const followers = followersData.map(f => f.follower);

  return (
    <main className='min-h-screen'>
      <FriendsClient followers={followers} following={following} />
    </main>
  );
}
