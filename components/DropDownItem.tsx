'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import tinycolor from 'tinycolor2';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import Avatar from '@/components/ui/Avatar';
import DropdownMenu from '@/components/ui/DropdownMenu';

interface Props {
  items: {
    label: string | React.ReactNode;
    key: string;
  }[];
  name?: string;
  routeType?: string;
  isProfile?: boolean;
}

const DropDownItem = ({ items, isProfile, name, routeType }: Props) => {
  const { data: session } = useSession();

  const router = useRouter();

  const [color] = useState(() => {
    while (true) {
      const randomBetween = function (min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min + 1));
      };

      const r = randomBetween(0, 255);
      const g = randomBetween(0, 255);
      const b = randomBetween(0, 255);

      const rgb = `rgb(${String(r)},${String(g)},${String(b)})`;

      if (tinycolor(rgb).isDark()) return rgb;
    }
  });

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'theme-switcher') {
      return;
    }

    if (routeType) {
      router.push(`/${routeType}/${e.key}`);
    } else if (e.key === 'log-out') {
      signOut({
        callbackUrl: '/',
      });
    }
  };

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
    <DropdownMenu items={items} onClick={handleMenuClick} placement='bottom'>
      <div className='cursor-pointer'>
        {isProfile ? renderAvatar() : <p className='m-0 text-base text-primary'>{name}</p>}
      </div>
    </DropdownMenu>
  );
};

export default DropDownItem;
