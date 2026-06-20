'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

export interface DropdownMenuItem {
  key: string;
  label: React.ReactNode | string;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  onClick?: (e: { key: string }) => void;
  children: React.ReactNode;
  placement?: 'bottom' | 'bottomRight' | 'bottomLeft';
}

const DropdownMenu = ({ items, onClick, children, placement = 'bottom' }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  let placementClasses = 'left-1/2 -translate-x-1/2';
  if (placement === 'bottomRight') placementClasses = 'right-0';
  if (placement === 'bottomLeft') placementClasses = 'left-0';

  const handleItemClick = (key: string) => {
    setIsOpen(false);
    onClick?.({ key });
  };

  return (
    <div
      className='relative inline-block'
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className='cursor-pointer'>{children}</div>

      {/* Invisible bridge fills the gap so hover doesn't break when moving mouse down */}
      {isOpen && <div className='absolute left-0 h-6 w-full' />}

      <div
        className={`absolute top-full z-50 min-w-[180px] rounded-md border border-border bg-background py-1 shadow-lg transition-all duration-150 ${placementClasses} ${
          isOpen
            ? 'pointer-events-auto translate-y-2 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        {/* Triangle caret pointing up */}
        <div
          className={`absolute -top-[7px] border-x-[7px] border-b-[7px] border-x-transparent border-b-border ${
            placement === 'bottomRight'
              ? 'right-4'
              : placement === 'bottomLeft'
                ? 'left-4'
                : 'left-1/2 -translate-x-1/2'
          }`}
        />
        {/* Inner caret (covers the border color so it looks clean) */}
        <div
          className={`absolute -top-[6px] border-x-[6px] border-b-[6px] border-x-transparent border-b-background ${
            placement === 'bottomRight'
              ? 'right-[5px]'
              : placement === 'bottomLeft'
                ? 'left-[5px]'
                : 'left-1/2 -translate-x-1/2'
          }`}
        />

        {items.map(item => (
          <div
            key={item.key}
            className='cursor-pointer px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted'
            onClick={() => handleItemClick(item.key)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
