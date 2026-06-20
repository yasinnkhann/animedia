'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TbSearch } from 'react-icons/tb';
import Avatar from '@/components/ui/Avatar';

export default function UsersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/user/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data.results || []);
        }
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (status === 'loading') return null;

  return (
    <main className='min-h-screen px-4 pb-10 pt-[calc(var(--header-height-mobile)+2.5rem)] sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24'>
      <div className='mx-auto max-w-3xl pt-8'>
        <h1 className='mb-6 text-3xl font-bold'>Find Friends</h1>

        <div className='relative mb-10 w-full'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
            <TbSearch className='text-muted-foreground' size={24} />
          </div>
          <input
            type='text'
            className='w-full rounded-full border border-border bg-muted/30 py-4 pl-12 pr-6 text-lg text-foreground placeholder-muted-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
            placeholder='Search by name or email...'
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {loading && <p className='text-center text-muted-foreground'>Searching...</p>}

        {!loading && query.length >= 2 && users.length === 0 && (
          <div className='mt-10 text-center'>
            <p className='text-lg text-muted-foreground'>
              No users found matching &quot;{query}&quot;
            </p>
          </div>
        )}

        <ul className='flex flex-col gap-4'>
          {users.map(user => (
            <li
              key={user.id}
              className='group rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md'
            >
              <Link
                href={`/user/${user.id}`}
                className='flex items-center gap-4 text-inherit no-underline'
              >
                <Avatar
                  src={user.image}
                  size={60}
                  initials={user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  backgroundColor='hsl(var(--primary))'
                />
                <div className='flex flex-col'>
                  <span className='text-xl font-medium transition-colors group-hover:text-primary'>
                    {user.name || 'Anonymous User'}
                  </span>
                  <span className='text-sm text-muted-foreground'>{user.email}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
