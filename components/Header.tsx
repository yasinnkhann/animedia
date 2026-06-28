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
import { HiMenu } from 'react-icons/hi';
import MobileNav from './MobileNav';
import NotificationDropdown from './Notifications/NotificationDropdown';

const Header = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isSearchBtnClicked, setIsSearchBtnClicked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchBarRef = useRef<HTMLInputElement>(null);

  if (status === 'loading') {
    return (
      <header className='fixed top-0 z-[999] !flex h-[var(--header-height-mobile)] w-full !items-center border-b border-border bg-background/80 font-sans !text-base backdrop-blur-md transition-colors duration-300'>
        <nav className='ml-4 !flex w-full !items-center lg:ml-[4rem]'></nav>
      </header>
    );
  }

  return (
    <>
      <header className='fixed top-0 z-[999] !flex h-[var(--header-height-mobile)] w-full !items-center border-b border-border bg-background/80 font-sans !text-base backdrop-blur-md transition-colors duration-300'>
        <nav className='ml-4 !flex w-full !items-center lg:ml-[4rem]'>
          <section>
            <Link href='/' className='!mb-0 text-foreground transition-colors hover:text-primary'>
              <AiFillHome size={25} onClick={() => setIsSearchBtnClicked(false)} />
            </Link>
          </section>
          <section className='ml-[4rem] !flex w-full !items-center justify-between'>
            <ul id='left-section' className='!mb-0 hidden w-[50%] justify-around lg:!flex'>
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
              <li>
                <Link
                  href='/discover'
                  className='cursor-pointer text-foreground no-underline transition-colors hover:text-primary'
                >
                  <p className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-base font-medium text-transparent transition-all hover:brightness-125'>
                    AI Discover
                  </p>
                </Link>
              </li>
              <li className='flex items-center'>
                <ThemeSwitcher />
              </li>
            </ul>
            <ul
              id='right-section'
              className='!mr-12 hidden flex-1 items-center justify-end gap-6 lg:!flex'
            >
              <li className='flex items-center justify-end gap-6'>
                {status === 'authenticated' && session && <></>}

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

                {status === 'unauthenticated' && (
                  <div className='flex items-center gap-6'>
                    {pathname !== '/auth/login' && (
                      <div
                        className='flex cursor-pointer items-center text-foreground transition-colors hover:text-primary'
                        onClick={() => signIn()}
                      >
                        <BiLogIn size={30} />
                      </div>
                    )}
                  </div>
                )}

                {status === 'authenticated' && (
                  <div className='flex items-center gap-4'>
                    <NotificationDropdown />
                    <DropDownItem
                      items={[
                        {
                          label: (
                            <Link
                              href={`/user/${session?.user?.id}`}
                              className='block w-full font-medium text-foreground no-underline'
                            >
                              My Profile
                            </Link>
                          ),
                          key: 'my-profile',
                        },
                        {
                          label: (
                            <Link
                              href='/friends'
                              className='block w-full font-medium text-foreground no-underline'
                            >
                              Friends
                            </Link>
                          ),
                          key: 'friends',
                        },
                        {
                          label: <span className='font-medium text-red-500'>Log Out</span>,
                          key: 'log-out',
                        },
                      ]}
                      isProfile={true}
                    />
                  </div>
                )}
              </li>
            </ul>
            <div className='flex w-full justify-end pr-4 lg:hidden'>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className='text-foreground transition-colors hover:text-primary'
              >
                <HiMenu size={28} />
              </button>
            </div>
          </section>
        </nav>
      </header>
      {isSearchBtnClicked && (
        <motion.div
          className='relative z-50 px-4 md:px-[3rem]'
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
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Header;
