'use client';

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Arrow({
  children,
  handleDisabled,
  handleOnClick,
}: {
  children: React.ReactNode;
  handleDisabled: boolean;
  handleOnClick: VoidFunction;
}) {
  return (
    <button
      disabled={handleDisabled}
      onClick={handleOnClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: handleDisabled ? '0' : '1',
        userSelect: 'none',
        pointerEvents: handleDisabled ? 'none' : 'auto',
      }}
    >
      {children}
    </button>
  );
}

export function LeftArrow({ isVisible, onClick }: { isVisible: boolean; onClick: VoidFunction }) {
  return (
    <section className='relative flex h-full shrink-0 items-center pl-10'>
      <Arrow handleDisabled={!isVisible} handleOnClick={onClick}>
        <FaArrowLeft className='absolute left-3 text-xl' />
      </Arrow>
    </section>
  );
}

export function RightArrow({ isVisible, onClick }: { isVisible: boolean; onClick: VoidFunction }) {
  return (
    <section className='relative flex h-full shrink-0 items-center pr-10'>
      <Arrow handleDisabled={!isVisible} handleOnClick={onClick}>
        <FaArrowRight className='absolute right-3 text-xl' />
      </Arrow>
    </section>
  );
}
