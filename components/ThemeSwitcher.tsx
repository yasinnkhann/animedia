'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BsSun, BsMoon } from 'react-icons/bs';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className='h-8 w-8' />; // placeholder space
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-800 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
      aria-label='Toggle Dark Mode'
    >
      {theme === 'dark' ? <BsSun size={18} /> : <BsMoon size={18} />}
    </button>
  );
}
