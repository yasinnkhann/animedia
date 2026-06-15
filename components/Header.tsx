'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import DropDownItem from './DropDownItem';
import { AiFillHome } from 'react-icons/ai';
import { BiLogIn } from 'react-icons/bi';
import { TbSearch } from 'react-icons/tb';
import { RxCross1 } from 'react-icons/rx';
import SearchBar from './Search/SearchBar';
import { motion } from 'framer-motion';
import {
  MY_MEDIA_ITEMS,
  MOVIES_ITEMS,
  SHOWS_ITEMS,
  PEOPLE_ITEMS,
  GAME_ITEMS,
} from '@/models/dropDownOptions';

import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isSearchBtnClicked, setIsSearchBtnClicked] = useState(false);
  const searchBarRef = useRef<HTMLInputElement>(null);

  if (status === 'loading') {
    return (
      <header className='fixed top-0 z-[999] !flex h-[var(--header-height-mobile)] w-full !items-center border-b border-border bg-background/80 !font-[Rubik] !text-base backdrop-blur-md transition-colors duration-300'>
        <nav className='ml-[4rem] !flex w-full !items-center'></nav>
      </header>
    );
  }

  return (
    <>
      <header className='fixed top-0 z-[999] !flex h-[var(--header-height-mobile)] w-full !items-center border-b border-border bg-background/80 !font-[Rubik] !text-base backdrop-blur-md transition-colors duration-300'>
        <nav className='ml-[4rem] !flex w-full !items-center'>
          <section>
            <Link href='/' className='!mb-0 text-foreground transition-colors hover:text-primary'>
              <AiFillHome size={25} onClick={() => setIsSearchBtnClicked(false)} />
            </Link>
          </section>
          <section className='ml-[4rem] !flex w-full !items-center justify-between'>
            <ul id='left-section' className='!mb-0 !flex w-[50%] justify-around'>
              <li>
                <DropDownItem items={MOVIES_ITEMS} name='Movies' routeType='movies' />
              </li>
              <li>
                <DropDownItem items={SHOWS_ITEMS} name='Shows' routeType='shows' />
              </li>
              <li>
                <DropDownItem items={GAME_ITEMS} name='Games' routeType='games' />
              </li>
              <li>
                <DropDownItem items={PEOPLE_ITEMS} name='People' routeType='people' />
              </li>
            </ul>
            <ul id='right-section' className='!mr-4 !flex !w-[30rem] items-center !justify-around'>
              {status !== 'authenticated' && (
                <li className='mr-4'>
                  <ThemeSwitcher />
                </li>
              )}
              <li
                className={`!flex !w-full !items-center ${
                  status === 'authenticated' ? '!justify-around' : 'mr-8 !justify-end'
                }`}
              >
                {status === 'authenticated' && session && (
                  <>
                    <DropDownItem items={MY_MEDIA_ITEMS} name='My Shows' routeType='my-shows' />
                    <DropDownItem items={MY_MEDIA_ITEMS} name='My Movies' routeType='my-movies' />
                    <Link href='/my-games' className='cursor-pointer no-underline'>
                      <p className='text-base'>My Games</p>
                    </Link>
                  </>
                )}

                {pathname !== '/' &&
                  pathname !== '/search' &&
                  pathname !== '/auth/login' &&
                  pathname !== '/auth/register' &&
                  (!isSearchBtnClicked ? (
                    <TbSearch
                      className='mr-4 cursor-pointer text-foreground transition-colors hover:text-primary'
                      size={25}
                      onClick={() => {
                        setIsSearchBtnClicked(curr => !curr);
                        if (searchBarRef.current) {
                          searchBarRef.current.placeholder =
                            'Search for a movie, tv show, or person...';
                          searchBarRef.current.focus();
                        }
                        window.scrollTo(0, 0);
                      }}
                    />
                  ) : (
                    <RxCross1
                      className='mr-4 cursor-pointer text-foreground transition-colors hover:text-primary'
                      size={25}
                      onClick={() => {
                        setIsSearchBtnClicked(curr => !curr);
                        searchBarRef.current!.value = '';
                      }}
                    />
                  ))}

                {status === 'unauthenticated' && pathname !== '/auth/login' && (
                  <div
                    className='flex cursor-pointer items-center text-foreground transition-colors hover:text-primary'
                    onClick={() => signIn()}
                  >
                    <BiLogIn size={30} />
                  </div>
                )}

                {status === 'authenticated' && (
                  <DropDownItem
                    items={[
                      {
                        label: (
                          <Link
                            href='/stats'
                            className='block w-full font-medium text-foreground no-underline hover:text-primary'
                          >
                            Watchlist Stats
                          </Link>
                        ),
                        key: 'stats',
                      },
                      {
                        label: (
                          <div
                            className='flex w-full items-center justify-between'
                            onClick={e => e.stopPropagation()}
                          >
                            <span className='mr-4 font-medium'>Theme</span>
                            <ThemeSwitcher />
                          </div>
                        ),
                        key: 'theme-switcher',
                      },
                      {
                        label: <span className='font-medium text-red-500'>Log Out</span>,
                        key: 'log-out',
                      },
                    ]}
                    isProfile={true}
                  />
                )}
              </li>
            </ul>
          </section>
        </nav>
      </header>
      {isSearchBtnClicked && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 75 }}
          transition={{
            duration: 1.3,
            ease: [0.08, 0.69, 0.2, 0.99],
          }}
        >
          <div className='mb-24'>
            <SearchBar
              ref={searchBarRef}
              closeSearch={() => setIsSearchBtnClicked(false)}
              isSearchBtnClicked={isSearchBtnClicked}
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Header;
