'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RxCross1 } from 'react-icons/rx';
import { BiChevronDown } from 'react-icons/bi';
import { useSession, signOut } from 'next-auth/react';
import Avatar from '@/components/ui/Avatar';
import tinycolor from 'tinycolor2';

import {
  MY_MEDIA_ITEMS,
  MOVIES_ITEMS,
  SHOWS_ITEMS,
  PEOPLE_ITEMS,
  GAME_ITEMS,
} from '@/models/dropDownOptions';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccordionItem = ({ title, items, routeType, onClose }: any) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='border-b border-border/50'>
      <button
        onClick={() => setExpanded(!expanded)}
        className='flex w-full items-center justify-between py-4 text-lg font-medium text-foreground transition-colors hover:text-primary'
      >
        {title}
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <BiChevronDown size={24} />
        </motion.div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='overflow-hidden'
          >
            <div className='flex flex-col gap-3 pb-4 pl-4'>
              {items.map((item: any) => (
                <Link
                  key={item.key}
                  href={`/${routeType}/${item.key}`}
                  onClick={onClose}
                  className='truncate whitespace-nowrap text-base text-muted-foreground transition-colors hover:text-primary'
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const [color] = useState(() => {
    while (true) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const rgb = `rgb(${r},${g},${b})`;
      if (tinycolor(rgb).isDark()) return rgb;
    }
  });

  const renderAvatar = () => {
    if (session?.user?.image || (session as any)?.token?.picture) {
      return <Avatar src={session?.user?.image || (session as any)?.token?.picture} size='large' />;
    } else {
      const initials =
        session?.user?.name?.[0]?.toUpperCase() ??
        (session as any)?.token?.name?.[0]?.toUpperCase() ??
        '';
      return <Avatar backgroundColor={color} initials={initials} size='large' />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key='backdrop'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className='fixed inset-0 z-[1000] bg-background/80 backdrop-blur-sm lg:hidden'
        />
      )}
      {isOpen && (
        <motion.div
          key='drawer'
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className='fixed bottom-0 left-0 top-0 z-[1001] flex w-[80%] max-w-sm flex-col overflow-y-auto bg-card shadow-2xl lg:hidden'
        >
          <div className='flex items-center justify-between border-b border-border p-4'>
            <div className='flex items-center gap-3'>
              {status === 'authenticated' && session ? (
                <>
                  {renderAvatar()}
                  <div className='flex flex-col'>
                    <span className='font-bold'>{session.user?.name}</span>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className='text-left text-sm font-semibold text-red-500 hover:underline'
                    >
                      Log Out
                    </button>
                  </div>
                </>
              ) : (
                <span className='text-lg font-bold text-primary'>Menu</span>
              )}
            </div>
            <button
              onClick={onClose}
              className='rounded-full p-2 text-foreground transition-colors hover:bg-muted'
            >
              <RxCross1 size={24} />
            </button>
          </div>

          <div className='flex flex-col p-4'>
            <AccordionItem
              title='Movies'
              items={MOVIES_ITEMS}
              routeType='movies'
              onClose={onClose}
            />
            <AccordionItem title='Shows' items={SHOWS_ITEMS} routeType='shows' onClose={onClose} />
            <AccordionItem title='Games' items={GAME_ITEMS} routeType='games' onClose={onClose} />
            <AccordionItem
              title='People'
              items={PEOPLE_ITEMS}
              routeType='people'
              onClose={onClose}
            />

            <Link
              href='/discover'
              onClick={onClose}
              className='border-b border-border/50 py-4 text-lg font-medium transition-colors hover:text-primary'
            >
              <span className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:brightness-125'>
                AI Discover
              </span>
            </Link>

            {status === 'authenticated' && session && (
              <>
                <div className='mb-2 mt-6 text-sm font-bold uppercase tracking-wider text-muted-foreground'>
                  My Library
                </div>
                <AccordionItem
                  title='My Shows'
                  items={MY_MEDIA_ITEMS}
                  routeType='my-shows'
                  onClose={onClose}
                />
                <AccordionItem
                  title='My Movies'
                  items={MY_MEDIA_ITEMS}
                  routeType='my-movies'
                  onClose={onClose}
                />
                <Link
                  href='/my-games'
                  onClick={onClose}
                  className='border-b border-border/50 py-4 text-lg font-medium text-foreground transition-colors hover:text-primary'
                >
                  My Games
                </Link>
                <Link
                  href='/users'
                  onClick={onClose}
                  className='border-b border-border/50 py-4 text-lg font-medium text-foreground transition-colors hover:text-primary'
                >
                  Find Friends
                </Link>
                <Link
                  href='/stats'
                  onClick={onClose}
                  className='border-b border-border/50 py-4 text-lg font-medium text-foreground transition-colors hover:text-primary'
                >
                  Watchlist Stats
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
