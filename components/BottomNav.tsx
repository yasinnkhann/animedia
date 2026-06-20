'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { TbSearch } from 'react-icons/tb';
import { MdExplore, MdOutlineExplore, MdVideoLibrary, MdOutlineVideoLibrary } from 'react-icons/md';

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      href: '/',
      activeIcon: <AiFillHome size={26} />,
      inactiveIcon: <AiOutlineHome size={26} />,
    },
    {
      name: 'Search',
      href: '/search',
      activeIcon: <TbSearch size={26} strokeWidth={3} />,
      inactiveIcon: <TbSearch size={26} strokeWidth={2} />,
    },
    {
      name: 'Discover',
      href: '/discover',
      activeIcon: <MdExplore size={26} />,
      inactiveIcon: <MdOutlineExplore size={26} />,
    },
    {
      name: 'Library',
      href: '/my-shows/watching',
      activeIcon: <MdVideoLibrary size={26} />,
      inactiveIcon: <MdOutlineVideoLibrary size={26} />,
    },
  ];

  return (
    <div className='pb-safe fixed bottom-0 left-0 right-0 z-[999] flex h-16 items-center justify-around border-t border-border bg-background/90 backdrop-blur-md lg:hidden'>
      {navItems.map(item => {
        const isActive =
          pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex h-full w-full flex-col items-center justify-center transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isActive ? item.activeIcon : item.inactiveIcon}
            <span className='mt-1 text-[10px] font-medium'>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
